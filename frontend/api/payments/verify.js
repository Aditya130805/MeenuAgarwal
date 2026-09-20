import { PACKAGE } from '../_lib/payment-config.js';
import {
  getOrderRecord,
  updateOrderStatus,
} from '../_lib/database.js';
import {
  readJsonBody,
  requireMethod,
  sendHandlerError,
  sendJson,
} from '../_lib/http.js';
import {
  fetchRazorpayOrder,
  fetchRazorpayPayment,
  verifyPaymentSignature,
} from '../_lib/razorpay.js';
import { validateVerification } from '../_lib/validation.js';

const verificationError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export default async function handler(request, response) {
  if (!requireMethod(request, response, 'POST')) return;

  try {
    const references = validateVerification(await readJsonBody(request));
    if (!verifyPaymentSignature(references)) {
      throw verificationError('Payment signature verification failed.');
    }

    const storedOrder = await getOrderRecord(references.orderId);
    if (!storedOrder) {
      throw verificationError('Payment order was not found.', 404);
    }

    const [providerOrder, providerPayment] = await Promise.all([
      fetchRazorpayOrder(references.orderId),
      fetchRazorpayPayment(references.paymentId),
    ]);

    const detailsMatch =
      providerPayment.order_id === references.orderId &&
      providerPayment.id === references.paymentId &&
      providerPayment.amount === PACKAGE.amount &&
      providerPayment.currency === PACKAGE.currency &&
      providerOrder.amount === PACKAGE.amount &&
      providerOrder.currency === PACKAGE.currency &&
      storedOrder.amount === PACKAGE.amount &&
      storedOrder.currency === PACKAGE.currency;

    if (!detailsMatch) {
      throw verificationError(
        'Payment details did not match the counseling package.',
      );
    }

    const isPaid =
      providerPayment.status === 'captured' && providerOrder.status === 'paid';
    const status = isPaid ? 'paid' : 'pending';

    const updatedOrder = await updateOrderStatus({
      orderId: references.orderId,
      paymentId: references.paymentId,
      status,
    });

    sendJson(response, 200, {
      status: updatedOrder?.status === 'paid' ? 'paid' : 'pending',
      receipt: storedOrder.receipt,
    });
  } catch (error) {
    sendHandlerError(response, error);
  }
}
