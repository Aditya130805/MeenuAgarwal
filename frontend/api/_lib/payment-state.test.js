import { describe, expect, it } from 'vitest';
import {
  assertPaymentStatus,
  mergePaymentStatus,
} from './payment-state.js';

describe('payment state transitions', () => {
  it('never downgrades a paid order when delayed events arrive', () => {
    expect(mergePaymentStatus('paid', 'failed')).toBe('paid');
    expect(mergePaymentStatus('paid', 'pending')).toBe('paid');
    expect(mergePaymentStatus('failed', 'paid')).toBe('paid');
  });

  it('allows a later successful retry after a failed attempt', () => {
    expect(mergePaymentStatus('failed', 'pending')).toBe('pending');
    expect(mergePaymentStatus('failed', 'paid')).toBe('paid');
  });

  it('rejects unknown statuses', () => {
    expect(() => assertPaymentStatus('refunded-by-attacker')).toThrow(
      'Unsupported payment status',
    );
  });
});
