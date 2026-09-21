import {
  CUSTOMER_LIMITS,
  ORDER_ID_PATTERN,
  PAYMENT_ID_PATTERN,
} from './payment-config.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9][0-9\s()-]{7,18}$/;
const SIGNATURE_PATTERN = /^[a-f0-9]{64}$/i;

const badRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const normalizeText = (value) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';

export const validateCustomer = (body) => {
  const name = normalizeText(body.name);
  const email = normalizeText(body.email).toLowerCase();
  const phone = normalizeText(body.phone);

  if (name.length < 2 || name.length > CUSTOMER_LIMITS.name) {
    throw badRequest('Please enter a valid full name.');
  }
  if (email.length > CUSTOMER_LIMITS.email || !EMAIL_PATTERN.test(email)) {
    throw badRequest('Please enter a valid email address.');
  }
  if (phone.length > CUSTOMER_LIMITS.phone || !PHONE_PATTERN.test(phone)) {
    throw badRequest('Please enter a valid mobile number.');
  }
  if (body.acceptedTerms !== true) {
    throw badRequest('You must accept the terms and refund policy.');
  }

  return { name, email, phone };
};

export const validateVerification = (body) => {
  const orderId = normalizeText(body.orderId);
  const paymentId = normalizeText(body.paymentId);
  const signature = normalizeText(body.signature);

  if (!ORDER_ID_PATTERN.test(orderId)) {
    throw badRequest('Invalid order reference.');
  }
  if (!PAYMENT_ID_PATTERN.test(paymentId)) {
    throw badRequest('Invalid payment reference.');
  }
  if (!SIGNATURE_PATTERN.test(signature)) {
    throw badRequest('Invalid payment signature.');
  }

  return { orderId, paymentId, signature };
};

export const validateOrderId = (orderId) => {
  if (!ORDER_ID_PATTERN.test(orderId || '')) {
    throw badRequest('Invalid order reference.');
  }
  return orderId;
};
