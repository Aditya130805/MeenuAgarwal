import { createHash } from 'node:crypto';
import { PACKAGE } from '../_lib/payment-config.js';
import { recordWebhookEvent } from '../_lib/database.js';
import {
  readRawBody,
  requireMethod,
  sendHandlerError,
  sendJson,
} from '../_lib/http.js';
import { verifyWebhookSignature } from '../_lib/razorpay.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const RELEVANT_EVENTS = new Set([
  'payment.captured',
  'payment.failed',
  'order.paid',
]);

const getHeader = (request, name) => {
  const value = request.headers[name];
  return Array.isArray(value) ? value[0] : value;
};

const invalidWebhook = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

export default async function handler(request, response) {
  if (!requireMethod(request, response, 'POST')) return;

  try {
    const rawBody = await readRawBody(request);
    const signature = getHeader(request, 'x-razorpay-signature');

    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      throw invalidWebhook('Webhook signature verification failed.');
    }

    let event;
    try {
      event = JSON.parse(rawBody.toString('utf8'));
    } catch {
      throw invalidWebhook('Webhook payload is not valid JSON.');
    }

    if (!RELEVANT_EVENTS.has(event.event)) {
      sendJson(response, 200, { received: true, ignored: true });
      return;
    }

    const payment = event.payload?.payment?.entity;
    const order = event.payload?.order?.entity;
    const orderId = payment?.order_id || order?.id;
    const paymentId = payment?.id || null;
    const amount = payment?.amount ?? order?.amount;
    const currency = payment?.currency ?? order?.currency;

    if (
      !orderId ||
      amount !== PACKAGE.amount ||
      currency !== PACKAGE.currency
    ) {
      throw invalidWebhook('Webhook payment details do not match the package.');
    }

    const providerEventId =
      getHeader(request, 'x-razorpay-event-id') ||
      createHash('sha256').update(rawBody).digest('hex');

    const result = await recordWebhookEvent({
      eventId: providerEventId.slice(0, 128),
      eventType: event.event,
      orderId,
      paymentId,
      status: event.event === 'payment.failed' ? 'failed' : 'paid',
    });

    sendJson(response, 200, {
      received: true,
      duplicate: result.duplicate,
    });
  } catch (error) {
    sendHandlerError(response, error);
  }
}
