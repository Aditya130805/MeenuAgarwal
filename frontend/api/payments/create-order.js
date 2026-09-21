import { randomBytes } from 'node:crypto';
import { PACKAGE } from '../_lib/payment-config.js';
import { createOrderRecord } from '../_lib/database.js';
import {
  readJsonBody,
  requireMethod,
  sendHandlerError,
  sendJson,
} from '../_lib/http.js';
import {
  createRazorpayOrder,
  getPublicKeyId,
} from '../_lib/razorpay.js';
import { validateCustomer } from '../_lib/validation.js';

const createReceipt = () =>
  `MA-${Date.now().toString(36)}-${randomBytes(4).toString('hex')}`.toUpperCase();

export default async function handler(request, response) {
  if (!requireMethod(request, response, 'POST')) return;

  try {
    const body = await readJsonBody(request);
    const customer = validateCustomer(body);
    const receipt = createReceipt();
    const order = await createRazorpayOrder({
      amount: PACKAGE.amount,
      currency: PACKAGE.currency,
      receipt,
      notes: {
        package: PACKAGE.name,
        customer_email: customer.email,
      },
    });

    if (
      order.amount !== PACKAGE.amount ||
      order.currency !== PACKAGE.currency ||
      order.receipt !== receipt
    ) {
      const error = new Error('The payment provider returned an invalid order.');
      error.statusCode = 502;
      throw error;
    }

    await createOrderRecord({
      receipt,
      orderId: order.id,
      amount: PACKAGE.amount,
      currency: PACKAGE.currency,
      customer,
    });

    sendJson(response, 201, {
      orderId: order.id,
      receipt,
      amount: PACKAGE.amount,
      currency: PACKAGE.currency,
      keyId: getPublicKeyId(),
    });
  } catch (error) {
    sendHandlerError(response, error);
  }
}
