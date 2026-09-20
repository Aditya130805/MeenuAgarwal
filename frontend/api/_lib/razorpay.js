import { createHmac, timingSafeEqual } from 'node:crypto';

const API_BASE = 'https://api.razorpay.com/v1';

const getCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    const error = new Error('Razorpay credentials are not configured.');
    error.statusCode = 503;
    throw error;
  }

  return { keyId, keySecret };
};

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(left || '', 'utf8');
  const rightBuffer = Buffer.from(right || '', 'utf8');
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
};

const requestRazorpay = async (path, options = {}) => {
  const { keyId, keySecret } = getCredentials();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      payload.error?.description || 'Razorpay rejected the request.',
    );
    error.statusCode = response.status >= 500 ? 502 : 400;
    throw error;
  }

  return payload;
};

export const createRazorpayOrder = async ({
  amount,
  currency,
  receipt,
  notes,
}) =>
  requestRazorpay('/orders', {
    method: 'POST',
    body: JSON.stringify({
      amount,
      currency,
      receipt,
      notes,
    }),
  });

export const fetchRazorpayOrder = (orderId) =>
  requestRazorpay(`/orders/${encodeURIComponent(orderId)}`);

export const fetchRazorpayPayment = (paymentId) =>
  requestRazorpay(`/payments/${encodeURIComponent(paymentId)}`);

export const getPublicKeyId = () => getCredentials().keyId;

export const verifyPaymentSignature = ({
  orderId,
  paymentId,
  signature,
}) => {
  const { keySecret } = getCredentials();
  const expected = createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return safeEqual(expected, signature);
};

export const verifyWebhookSignature = (rawBody, signature) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    const error = new Error('Razorpay webhook secret is not configured.');
    error.statusCode = 503;
    throw error;
  }

  const expected = createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');
  return safeEqual(expected, signature);
};
