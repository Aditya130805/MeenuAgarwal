const VALID_STATUSES = new Set(['created', 'pending', 'failed', 'paid']);

export const assertPaymentStatus = (status) => {
  if (!VALID_STATUSES.has(status)) {
    throw new Error(`Unsupported payment status: ${status}`);
  }
  return status;
};

export const mergePaymentStatus = (current, incoming) => {
  assertPaymentStatus(current);
  assertPaymentStatus(incoming);
  if (current === 'paid' || incoming === 'paid') return 'paid';
  return incoming;
};
