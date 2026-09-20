import { describe, expect, it } from 'vitest';
import {
  validateCustomer,
  validateOrderId,
  validateVerification,
} from './validation.js';

describe('payment input validation', () => {
  it('normalizes a valid customer and requires explicit policy acceptance', () => {
    expect(
      validateCustomer({
        name: '  Meenu   Agarwal ',
        email: 'MEENU@example.com ',
        phone: '+91 97129 24902',
        acceptedTerms: true,
        amount: 1,
      }),
    ).toEqual({
      name: 'Meenu Agarwal',
      email: 'meenu@example.com',
      phone: '+91 97129 24902',
    });

    expect(() =>
      validateCustomer({
        name: 'Meenu Agarwal',
        email: 'meenu@example.com',
        phone: '9712924902',
        acceptedTerms: false,
      }),
    ).toThrow('accept');
  });

  it('rejects malformed provider references', () => {
    expect(() => validateOrderId('../order_fake')).toThrow(
      'Invalid order reference',
    );
    expect(() =>
      validateVerification({
        orderId: 'order_valid123',
        paymentId: 'pay_valid123',
        signature: 'not-a-signature',
      }),
    ).toThrow('Invalid payment signature');
  });
});
