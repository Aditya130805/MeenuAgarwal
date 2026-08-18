import crypto from 'node:crypto';
import { Resend } from 'resend';

/**
 * Cal.com booking webhook -> email notification.
 *
 * This endpoint is a NOTIFIER, not a system of record. Cal.com has already
 * persisted the booking and already sent calendar invites to both the student
 * and Meenu by the time we run. Our only job is to put a copy in a mailbox we
 * control. That framing drives one important decision below: we return 200 even
 * when the email fails, because Cal.com retries non-2xx responses and a retry
 * storm would produce duplicate emails without ever fixing a broken API key.
 *
 * Uses Vercel's Web-standard function signature so `request.text()` gives us the
 * exact bytes Cal.com signed. The legacy (req, res) signature auto-parses the
 * body, and re-stringifying parsed JSON does not round-trip byte-for-byte
 * (key order, unicode escaping, whitespace), which silently breaks HMAC checks.
 */

const SIGNATURE_HEADER = 'x-cal-signature-256';
const TIME_ZONE = 'Asia/Kolkata';

// Booking-question keys Cal.com always sends. Everything else is a custom
// question Meenu configured, and gets rendered generically.
const BUILT_IN_RESPONSE_KEYS = new Set([
  'name',
  'email',
  'location',
  'title',
  'notes',
  'guests',
  'rescheduleReason',
  'smsReminderNumber',
]);

const EVENT_LABELS = {
  BOOKING_CREATED: { verb: 'New booking', tone: '#2E7D32' },
  BOOKING_RESCHEDULED: { verb: 'Booking rescheduled', tone: '#EF6C00' },
  BOOKING_CANCELLED: { verb: 'Booking cancelled', tone: '#C62828' },
};

/** Student-supplied text ends up in an HTML email, so it must be escaped. */
export const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Cal.com is inconsistent about the shape of a booking answer: plain strings,
 * `{ label, value }` wrappers, `{ value, optionValue }` for phone fields, and
 * arrays for guest lists all occur. Flattening them here is what stops the
 * email rendering "[object Object]".
 */
export const readAnswer = (raw) => {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'string') return raw.trim() || null;
  if (typeof raw === 'number' || typeof raw === 'boolean') return String(raw);
  if (Array.isArray(raw)) {
    const parts = raw.map(readAnswer).filter(Boolean);
    return parts.length ? parts.join(', ') : null;
  }
  if (typeof raw === 'object') {
    if ('value' in raw) return readAnswer(raw.value);
    if ('optionValue' in raw) return readAnswer(raw.optionValue);
    return null;
  }
  return null;
};

const readLabel = (key, raw) => {
  if (raw && typeof raw === 'object' && !Array.isArray(raw) && raw.label) {
    return String(raw.label);
  }
  // "country-considering" -> "Country considering"
  const spaced = key.replace(/[-_]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

/**
 * Always render in IST. The function runs in whichever region Vercel picks, so
 * relying on the runtime's local time would produce times that look plausible
 * but are silently wrong.
 */
export const formatIst = (iso) => {
  if (!iso) return 'Unknown time';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

const formatIstShort = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

/** Turns Cal.com's internal location tokens into something readable. */
export const describeLocation = (payload) => {
  const raw = payload.location || readAnswer(payload.responses?.location) || '';
  const videoUrl = payload.metadata?.videoCallUrl || payload.videoCallData?.url;

  if (/google.*meet/i.test(raw)) {
    return videoUrl ? `Google Meet — ${videoUrl}` : 'Google Meet';
  }
  if (/daily|cal\.?video/i.test(raw)) {
    return videoUrl ? `Cal Video — ${videoUrl}` : 'Cal Video';
  }
  if (/^attendeeInPerson$/i.test(raw)) return 'In person (student’s address)';
  if (/^inPerson$/i.test(raw)) return 'In person — Ahmedabad office';
  if (/phone/i.test(raw)) {
    const phone = readAnswer(payload.responses?.location) || payload.attendees?.[0]?.phoneNumber;
    return phone && !/phone/i.test(phone) ? `Phone call — ${phone}` : 'Phone call';
  }
  if (raw) return videoUrl ? `${raw} — ${videoUrl}` : raw;
  return videoUrl || 'Not specified';
};

export const verifySignature = (rawBody, signature, secret) => {
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const received = Buffer.from(signature, 'utf8');
  const computed = Buffer.from(expected, 'utf8');
  // timingSafeEqual throws on length mismatch, so check that first.
  if (received.length !== computed.length) return false;
  return crypto.timingSafeEqual(received, computed);
};

export const buildEmail = (triggerEvent, payload) => {
  const meta = EVENT_LABELS[triggerEvent] ?? { verb: triggerEvent, tone: '#1C546D' };
  const attendee = payload.attendees?.[0] ?? {};
  const studentName = readAnswer(payload.responses?.name) || attendee.name || 'Unknown';
  const studentEmail = readAnswer(payload.responses?.email) || attendee.email || 'Unknown';

  const rows = [
    ['Student', studentName],
    ['Email', studentEmail],
    ['Phone', readAnswer(payload.responses?.phone) || attendee.phoneNumber || 'Not given'],
    ['When (IST)', formatIst(payload.startTime)],
    ['Ends (IST)', formatIst(payload.endTime)],
    ['Student timezone', attendee.timeZone || 'Unknown'],
    ['Where', describeLocation(payload)],
    ['Event type', payload.title || payload.type || 'Counseling Session'],
  ];

  // Whatever custom booking questions Meenu has configured, without this file
  // needing to know their names in advance.
  const responses = payload.responses ?? {};
  for (const [key, value] of Object.entries(responses)) {
    if (BUILT_IN_RESPONSE_KEYS.has(key) || key === 'phone') continue;
    const answer = readAnswer(value);
    if (answer) rows.push([readLabel(key, value), answer]);
  }

  const notes = readAnswer(payload.responses?.notes) || readAnswer(payload.additionalNotes);
  if (notes) rows.push(['Notes from student', notes]);
  if (payload.cancellationReason) rows.push(['Cancellation reason', payload.cancellationReason]);
  if (payload.rescheduleReason) rows.push(['Reschedule reason', payload.rescheduleReason]);
  if (payload.uid) rows.push(['Booking reference', payload.uid]);

  const subject = `${meta.verb} — ${studentName}, ${formatIstShort(payload.startTime)} IST`;

  const text = [`${meta.verb}`, '']
    .concat(rows.map(([label, value]) => `${label}: ${value}`))
    .concat(payload.uid ? ['', `Manage: https://cal.com/booking/${payload.uid}`] : [])
    .join('\n');

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #eee;color:#666;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #eee;color:#1e1e1e;font-size:14px;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join('');

  const manageLink = payload.uid
    ? `<p style="margin:24px 0 0;"><a href="https://cal.com/booking/${encodeURIComponent(payload.uid)}" style="display:inline-block;background:#FF7043;color:#fff;text-decoration:none;padding:12px 24px;border-radius:24px;font-weight:600;font-size:14px;">View booking</a></p>`
    : '';

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f6f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
    <div style="background:${meta.tone};padding:20px 24px;">
      <h1 style="margin:0;color:#fff;font-size:18px;font-weight:700;">${escapeHtml(meta.verb)}</h1>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">meenuagarwal.in</p>
    </div>
    <table style="width:100%;border-collapse:collapse;">${tableRows}</table>
    <div style="padding:0 16px 24px;">${manageLink}</div>
  </div>
</body></html>`;

  return { subject, text, html };
};

/** Lightweight health check — confirms the function actually deployed. */
export function GET() {
  return Response.json({ ok: true, endpoint: 'booking-webhook' });
}

export async function POST(request) {
  // Read the raw body FIRST and never touch a parsed version before verifying.
  const rawBody = await request.text();

  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    // Deliberately a 5xx: this is a deployment misconfiguration that a human
    // must fix, and it should show up as failing in the Cal.com webhook log
    // rather than being silently swallowed.
    console.error('[booking-webhook] CAL_WEBHOOK_SECRET is not set — refusing to process.');
    return Response.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const signature = request.headers.get(SIGNATURE_HEADER);
  if (!verifySignature(rawBody, signature, secret)) {
    console.warn('[booking-webhook] Rejected request with invalid signature.');
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    console.error('[booking-webhook] Signature valid but body was not JSON.');
    return Response.json({ error: 'Malformed payload' }, { status: 400 });
  }

  const triggerEvent = body.triggerEvent;
  // MEETING_STARTED / MEETING_ENDED are flat rather than wrapped in `payload`.
  const payload = body.payload ?? body;

  // Logged on every invocation so retry-driven duplicates are identifiable.
  console.log(
    `[booking-webhook] ${triggerEvent} uid=${payload?.uid ?? 'unknown'} start=${payload?.startTime ?? 'unknown'}`
  );

  if (!EVENT_LABELS[triggerEvent]) {
    // Subscribed to something we do not email about. Acknowledge so Cal.com
    // does not retry it forever.
    return Response.json({ ok: true, ignored: triggerEvent });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  // NOTE: the default sender `onboarding@resend.dev` can ONLY deliver to the
  // address that owns the Resend account. To notify anyone else, verify a
  // domain in Resend and set FROM_EMAIL to e.g. bookings@meenuagarwal.in —
  // no code change required.
  const from = process.env.FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey || !to) {
    console.error('[booking-webhook] RESEND_API_KEY or NOTIFY_EMAIL missing — booking not emailed.');
    return Response.json({ ok: true, emailed: false });
  }

  try {
    const { subject, text, html } = buildEmail(triggerEvent, payload);
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to, subject, text, html });
    if (error) {
      console.error('[booking-webhook] Resend rejected the email:', error);
      return Response.json({ ok: true, emailed: false });
    }
    console.log(`[booking-webhook] Emailed ${to} for uid=${payload?.uid ?? 'unknown'}`);
  } catch (err) {
    // Swallow deliberately — see the file header. The booking is already safe.
    console.error('[booking-webhook] Failed to send notification email:', err);
    return Response.json({ ok: true, emailed: false });
  }

  return Response.json({ ok: true, emailed: true });
}
