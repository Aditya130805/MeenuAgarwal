/**
 * Booking configuration — single source of truth for the /book flow.
 *
 * Everything a non-developer might reasonably want to change lives here, so
 * nobody has to go hunting through JSX. These values are all public (they end
 * up in the client bundle), so nothing secret belongs in this file — the
 * webhook secrets live in Vercel environment variables instead.
 */

// Cal.com identity. CAL_LINK is what the embed loads; CAL_DIRECT_URL is the
// escape hatch we show if the embed itself fails to load (ad-blockers, CSP,
// flaky networks) so a student is never left staring at a blank box.
export const CAL_USERNAME = 'meenu-agarwal';
export const CAL_EVENT_SLUG = 'counseling';
export const CAL_LINK = `${CAL_USERNAME}/${CAL_EVENT_SLUG}`;
export const CAL_DIRECT_URL = `https://cal.com/${CAL_LINK}`;

/**
 * DISPLAY ONLY. The authoritative session length is the duration configured on
 * the Cal.com event type — changing this constant does not change how long a
 * slot actually is. If you change one, change the other.
 */
export const SESSION_DURATION_MINUTES = 30;

// Copy
export const BOOKING_HEADING = 'Book a Counseling Session';
export const BOOKING_SUBHEADING =
  'A focused one-on-one conversation about your goals, your options, and the ' +
  'realistic next step — with no obligation and nothing to pay.';

export const BOOKING_HIGHLIGHTS = [
  {
    title: `${SESSION_DURATION_MINUTES} minutes, one-on-one`,
    body: 'Directly with Meenu — not a sales call, not a form reply.',
  },
  {
    title: 'Completely free',
    body: 'No card, no deposit. Book a slot and turn up.',
  },
  {
    title: 'Video or phone',
    body: 'Meet over Google Meet, or simply take the call on your phone.',
  },
];

// Matches --coral-color in src/index.css. Cal.com's embed needs a hex value,
// so it cannot read the CSS custom property directly.
export const BRAND_COLOR = '#FF7043';

// Fallback phone number, kept identical to ContactButton.jsx.
export const FALLBACK_PHONE_DISPLAY = '97129 24902';
export const FALLBACK_PHONE_HREF = 'tel:9712924902';

// How long to wait for the Cal.com embed to signal readiness before offering
// the direct link alongside it.
export const EMBED_TIMEOUT_MS = 6000;

// Hard deadline. When an ad-blocker blocks cal.com outright, getCalApi() neither
// resolves nor rejects and no linkFailed event ever arrives, so nothing else
// would move us off the skeleton. Past this point we treat it as a failure and
// show the fallback card rather than leaving a skeleton up forever.
export const EMBED_FAILURE_MS = 15000;
