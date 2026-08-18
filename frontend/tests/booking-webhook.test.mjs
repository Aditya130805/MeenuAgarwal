import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';

const MOD = '../api/booking-webhook.js';
const SECRET = 'test-secret-abc123';

process.env.CAL_WEBHOOK_SECRET = SECRET;
delete process.env.RESEND_API_KEY; // force the "cannot email" path, no network
delete process.env.NOTIFY_EMAIL;

const { POST, GET, buildEmail, readAnswer, formatIst, describeLocation, verifySignature, escapeHtml } =
  await import(MOD);

const sign = (body) => crypto.createHmac('sha256', SECRET).update(body).digest('hex');

const req = (body, { signature, method = 'POST' } = {}) =>
  new Request('https://meenuagarwal.in/api/booking-webhook', {
    method,
    headers: {
      'content-type': 'application/json',
      ...(signature === null ? {} : { 'x-cal-signature-256': signature ?? sign(body) }),
    },
    body,
  });

// A realistic Cal.com BOOKING_CREATED payload, including the awkward shapes:
// object-wrapped answers, an array of guests, and a phone field with optionValue.
const bookingPayload = {
  triggerEvent: 'BOOKING_CREATED',
  createdAt: '2026-08-18T09:00:00.000Z',
  payload: {
    uid: 'abc123XYZ',
    bookingId: 4242,
    title: 'Counselling Session between Meenu Agarwal and Riya Sharma',
    type: 'counselling',
    // 2026-09-02T10:30:00Z == 4:00 pm IST
    startTime: '2026-09-02T10:30:00Z',
    endTime: '2026-09-02T11:15:00Z',
    location: 'integrations:google:meet',
    status: 'ACCEPTED',
    organizer: { name: 'Meenu Agarwal', email: 'meenu@meenuagarwal.in', timeZone: 'Asia/Kolkata' },
    attendees: [{ name: 'Riya Sharma', email: 'riya@example.com', timeZone: 'Europe/London' }],
    metadata: { videoCallUrl: 'https://meet.google.com/abc-defg-hij' },
    responses: {
      name: { label: 'your_name', value: 'Riya Sharma' },
      email: { label: 'email_address', value: 'riya@example.com' },
      phone: { label: 'phone_number', value: '+919876543210' },
      notes: { label: 'additional_notes', value: 'Looking at MSc Data Science.' },
      guests: { label: 'guests', value: [] },
      'course-field-of-interest': { label: 'Course / field of interest', value: 'Data Science' },
      'country-considering': { label: 'Country you are considering', value: 'Netherlands' },
    },
  },
};

test('valid signature is accepted and returns 200', async () => {
  const body = JSON.stringify(bookingPayload);
  const res = await POST(req(body));
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.ok, true);
  assert.equal(json.emailed, false); // no RESEND_API_KEY configured
});

test('tampered body is rejected with 401', async () => {
  const body = JSON.stringify(bookingPayload);
  const tampered = body.replace('Riya Sharma', 'Mallory Evil');
  const res = await POST(req(tampered, { signature: sign(body) }));
  assert.equal(res.status, 401);
});

test('missing signature header is rejected with 401', async () => {
  const res = await POST(req(JSON.stringify(bookingPayload), { signature: null }));
  assert.equal(res.status, 401);
});

test('wrong-length signature does not throw (timingSafeEqual guard)', async () => {
  const res = await POST(req(JSON.stringify(bookingPayload), { signature: 'short' }));
  assert.equal(res.status, 401);
});

test('malformed JSON with a valid signature returns 400', async () => {
  const body = '{not json';
  const res = await POST(req(body));
  assert.equal(res.status, 400);
});

test('unsubscribed trigger events are acknowledged, not retried', async () => {
  const body = JSON.stringify({ triggerEvent: 'MEETING_ENDED', payload: { uid: 'x' } });
  const res = await POST(req(body));
  assert.equal(res.status, 200);
  assert.equal((await res.json()).ignored, 'MEETING_ENDED');
});

test('missing CAL_WEBHOOK_SECRET returns 500 so it surfaces in Cal.com logs', async () => {
  const saved = process.env.CAL_WEBHOOK_SECRET;
  delete process.env.CAL_WEBHOOK_SECRET;
  const res = await POST(req(JSON.stringify(bookingPayload)));
  assert.equal(res.status, 500);
  process.env.CAL_WEBHOOK_SECRET = saved;
});

test('GET health check works', async () => {
  const res = await GET();
  assert.equal((await res.json()).ok, true);
});

// ---- Pure helpers ----

test('times render in IST regardless of the runtime timezone', () => {
  // 10:30 UTC == 16:00 IST
  const out = formatIst('2026-09-02T10:30:00Z');
  assert.match(out, /4:00\s*pm/i, `expected 4:00 pm IST, got: ${out}`);
  assert.match(out, /Sep/);
  assert.match(out, /2026/);
});

test('readAnswer flattens every shape Cal.com sends', () => {
  assert.equal(readAnswer('plain'), 'plain');
  assert.equal(readAnswer({ label: 'l', value: 'wrapped' }), 'wrapped');
  assert.equal(readAnswer({ value: '+91999', optionValue: '' }), '+91999');
  assert.equal(readAnswer(['a@x.com', 'b@x.com']), 'a@x.com, b@x.com');
  assert.equal(readAnswer([]), null);
  assert.equal(readAnswer(''), null);
  assert.equal(readAnswer(null), null);
  assert.equal(readAnswer(undefined), null);
  // The bug this guards against: rendering "[object Object]" in the email.
  assert.equal(readAnswer({ weird: 'shape' }), null);
});

test('location tokens are humanised and include the Meet link', () => {
  assert.match(
    describeLocation(bookingPayload.payload),
    /Google Meet — https:\/\/meet\.google\.com\/abc-defg-hij/
  );
  assert.equal(describeLocation({ location: 'inPerson' }), 'In person — Ahmedabad office');
  assert.match(describeLocation({ location: 'phone', responses: { location: '+919876543210' } }), /\+919876543210/);
  assert.equal(describeLocation({}), 'Not specified');
});

test('email includes student details, custom questions and IST time', () => {
  const { subject, text, html } = buildEmail('BOOKING_CREATED', bookingPayload.payload);
  assert.match(subject, /New booking — Riya Sharma/);
  assert.match(subject, /4:00\s*pm IST/i);
  for (const expected of ['Riya Sharma', 'riya@example.com', '+919876543210', 'Data Science', 'Netherlands', 'abc123XYZ']) {
    assert.ok(text.includes(expected), `text missing ${expected}`);
    assert.ok(html.includes(expected), `html missing ${expected}`);
  }
  assert.ok(!text.includes('[object Object]'), 'text leaked [object Object]');
  assert.ok(!html.includes('[object Object]'), 'html leaked [object Object]');
  assert.match(text, /Country you are considering: Netherlands/);
});

test('student-supplied HTML cannot be injected into the email', () => {
  const evil = structuredClone(bookingPayload.payload);
  evil.responses.name = { label: 'your_name', value: '<img src=x onerror=alert(1)>Bad' };
  const { html } = buildEmail('BOOKING_CREATED', evil);
  assert.ok(!html.includes('<img src=x'), 'raw HTML leaked into the email');
  assert.ok(html.includes('&lt;img src=x'), 'expected escaped output');
  assert.equal(escapeHtml('a&b<c>"d"'), 'a&amp;b&lt;c&gt;&quot;d&quot;');
});

test('cancellation and reschedule reasons are surfaced', () => {
  const cancelled = { ...bookingPayload.payload, cancellationReason: 'Exam clash' };
  const { subject, text } = buildEmail('BOOKING_CANCELLED', cancelled);
  assert.match(subject, /Booking cancelled/);
  assert.match(text, /Cancellation reason: Exam clash/);
});

test('signature verification is correct in isolation', () => {
  const body = '{"a":1}';
  assert.equal(verifySignature(body, sign(body), SECRET), true);
  assert.equal(verifySignature(body, sign(body), 'other-secret'), false);
  assert.equal(verifySignature(body, undefined, SECRET), false);
  assert.equal(verifySignature(body, '', SECRET), false);
});
