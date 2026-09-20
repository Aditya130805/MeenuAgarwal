export const PACKAGE = Object.freeze({
  name: 'Payment Gateway Verification',
  amount: 100,
  currency: 'INR',
  testMode: true,
});

export const CUSTOMER_LIMITS = Object.freeze({
  name: 100,
  email: 254,
  phone: 15,
});

export const ORDER_ID_PATTERN = /^order_[A-Za-z0-9]+$/;
export const PAYMENT_ID_PATTERN = /^pay_[A-Za-z0-9]+$/;
