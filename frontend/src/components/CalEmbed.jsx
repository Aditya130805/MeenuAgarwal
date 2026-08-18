import { useEffect, useState } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faPhone,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import {
  BRAND_COLOR,
  CAL_DIRECT_URL,
  CAL_LINK,
  EMBED_TIMEOUT_MS,
  FALLBACK_PHONE_DISPLAY,
  FALLBACK_PHONE_HREF,
} from '../config/booking';

// Isolates this embed's config and event listeners from any other Cal embed we
// might add later, so calling cal("ui", ...) here can never affect another one.
const NAMESPACE = 'counselling';

/**
 * A direct link out to the Cal.com booking page, used whenever the inline embed
 * cannot be trusted to get the student where they need to go.
 */
const DirectLinkButtons = () => (
  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
    <a
      href={CAL_DIRECT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center h-[50px] px-7 rounded-full bg-[var(--coral-color)] text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      Open the booking page
      <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="ml-2 text-sm" />
    </a>
    <a
      href={FALLBACK_PHONE_HREF}
      className="inline-flex items-center justify-center h-[50px] px-7 rounded-full border-2 border-[var(--dark-blue-color)] text-[var(--dark-blue-color)] font-semibold hover:bg-[var(--dark-blue-color)] hover:text-white transition-all duration-300"
    >
      <FontAwesomeIcon icon={faPhone} className="mr-2 text-sm" />
      {FALLBACK_PHONE_DISPLAY}
    </a>
  </div>
);

/**
 * Inline Cal.com booking widget.
 *
 * The embed is an iframe loaded from cal.com, which means it can fail for
 * reasons entirely outside our control — ad-blockers, tracker-blocking DNS,
 * corporate firewalls, a bad network. A silently blank rectangle is the worst
 * possible outcome for a booking page, so this component treats "the calendar
 * did not appear" as a first-class state and always leaves the student a way
 * through:
 *
 *   loading  -> skeleton at the embed's full height (no layout shift)
 *   slow     -> skeleton + a banner offering the direct link, embed still live
 *   failed   -> the embed is replaced by direct link + phone number
 *   ready    -> the embed, nothing else
 */
const CalEmbed = () => {
  // 'loading' | 'ready' | 'failed'
  const [status, setStatus] = useState('loading');
  // Tracked separately from `status` on purpose: a slow load is not a failure.
  // We surface an escape hatch but keep the embed mounted, so a late-arriving
  // calendar still renders rather than being thrown away.
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let calApi;

    const handleReady = () => {
      if (isMounted) setStatus('ready');
    };

    const handleFailed = () => {
      if (isMounted) setStatus('failed');
    };

    const slowTimer = setTimeout(() => {
      if (isMounted) setIsSlow(true);
    }, EMBED_TIMEOUT_MS);

    (async () => {
      try {
        calApi = await getCalApi({ namespace: NAMESPACE });
        if (!isMounted) return;

        calApi('ui', {
          hideEventTypeDetails: false,
          layout: 'month_view',
          // The embed needs literal hex values; it cannot read our CSS custom
          // properties from across the iframe boundary.
          cssVarsPerTheme: {
            light: { 'cal-brand': BRAND_COLOR },
            dark: { 'cal-brand': BRAND_COLOR },
          },
        });

        calApi('on', { action: 'linkReady', callback: handleReady });
        calApi('on', { action: 'linkFailed', callback: handleFailed });
      } catch {
        // getCalApi throws if the embed script itself never loads, which is
        // exactly the ad-blocker case.
        if (isMounted) setStatus('failed');
      }
    })();

    // Cleanup matters here: React Router unmounts this page on navigation, so
    // without removing the listeners a /book -> /contact -> /book round trip
    // would leave stale callbacks firing against an unmounted component.
    return () => {
      isMounted = false;
      clearTimeout(slowTimer);
      if (calApi) {
        calApi('off', { action: 'linkReady', callback: handleReady });
        calApi('off', { action: 'linkFailed', callback: handleFailed });
      }
    };
  }, []);

  if (status === 'failed') {
    return (
      <div className="w-full min-h-[400px] flex flex-col justify-center items-center text-center px-6 py-14">
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className="text-[var(--coral-color)] text-4xl mb-5"
        />
        <h3 className="text-2xl font-extrabold text-[rgb(85,85,85)] mb-3">
          The calendar could not load here
        </h3>
        <p className="text-base text-[rgb(120,120,120)] max-w-md mb-7">
          This is usually a browser extension or network blocking the booking
          widget. You can still book your session directly — or just call.
        </p>
        <DirectLinkButtons />
      </div>
    );
  }

  return (
    <div className="w-full">
      {isSlow && status !== 'ready' && (
        <div className="w-full px-6 py-5 mb-2 text-center border-b border-black/10">
          <p className="text-base text-[rgb(120,120,120)] mb-4">
            The calendar is taking longer than usual to load.
          </p>
          <DirectLinkButtons />
        </div>
      )}

      <div className="relative w-full min-h-[640px] md:min-h-[720px]">
        {status !== 'ready' && (
          <div
            className="absolute inset-0 z-10 flex flex-col gap-4 p-6 md:p-10 bg-white"
            aria-hidden="true"
          >
            <div className="h-8 w-2/5 rounded-lg bg-black/10 animate-pulse motion-reduce:animate-none" />
            <div className="h-4 w-1/4 rounded-lg bg-black/10 animate-pulse motion-reduce:animate-none" />
            <div className="flex-1 mt-4 rounded-2xl bg-black/5 animate-pulse motion-reduce:animate-none" />
          </div>
        )}

        {/* Keyed on the link so a config change forces a clean remount rather
            than trying to mutate a live iframe. */}
        <Cal
          key={CAL_LINK}
          namespace={NAMESPACE}
          calLink={CAL_LINK}
          style={{ width: '100%', height: '100%', overflow: 'scroll' }}
          config={{ layout: 'month_view' }}
        />
      </div>
    </div>
  );
};

export default CalEmbed;
