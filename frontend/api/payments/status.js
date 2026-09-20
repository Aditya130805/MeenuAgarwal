import { PACKAGE } from '../_lib/payment-config.js';
import {
  getOrderRecord,
  updateOrderStatus,
} from '../_lib/database.js';
import {
  requireMethod,
  sendHandlerError,
  sendJson,
} from '../_lib/http.js';
import { fetchRazorpayOrder } from '../_lib/razorpay.js';
import { validateOrderId } from '../_lib/validation.js';

const getOrderId = (request) => {
  if (typeof request.query?.orderId === 'string') return request.query.orderId;
  const url = new URL(request.url, 'http://localhost');
  return url.searchParams.get('orderId');
};

export default async function handler(request, response) {
  if (!requireMethod(request, response, 'GET')) return;

  try {
    const orderId = validateOrderId(getOrderId(request));
    let order = await getOrderRecord(orderId);

    if (!order) {
      const error = new Error('Payment order was not found.');
      error.statusCode = 404;
      throw error;
    }

    if (order.status !== 'paid') {
      const providerOrder = await fetchRazorpayOrder(orderId);
      if (
        providerOrder.status === 'paid' &&
        providerOrder.amount === PACKAGE.amount &&
        providerOrder.currency === PACKAGE.currency
      ) {
        order = await updateOrderStatus({ orderId, status: 'paid' });
      }
    }

    sendJson(response, 200, {
      status: order.status,
      receipt: order.receipt,
    });
  } catch (error) {
    sendHandlerError(response, error);
  }
}
