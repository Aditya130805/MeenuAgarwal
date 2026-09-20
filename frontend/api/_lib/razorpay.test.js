import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PACKAGE } from './payment-config.js';
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
} from './razorpay.js';

describe('Razorpay security helpers', () => {
  beforeEach(() => {
    process.env.RAZORPAY_KEY_ID = 'rzp_test_public';
    process.env.RAZORPAY_KEY_SECRET = 'test_key_secret';
    process.env.RAZORPAY_WEBHOOK_SECRET = 'independent_webhook_secret';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('accepts authentic payment signatures and rejects tampering', () => {
    const orderId = 'order_abc123';
    const paymentId = 'pay_xyz789';
    const signature = createHmac(
      'sha256',
      process.env.RAZORPAY_KEY_SECRET,
    )
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    expect(verifyPaymentSignature({ orderId, paymentId, signature })).toBe(true);
    expect(
      verifyPaymentSignature({
        orderId,
        paymentId: 'pay_tampered',
        signature,
      }),
    ).toBe(false);
  });

  it('verifies the exact raw webhook body', () => {
    const rawBody = Buffer.from('{"event":"order.paid","amount":3000000}');
    const signature = createHmac(
      'sha256',
      process.env.RAZORPAY_WEBHOOK_SECRET,
    )
      .update(rawBody)
      .digest('hex');

    expect(verifyWebhookSignature(rawBody, signature)).toBe(true);
    expect(
      verifyWebhookSignature(
        Buffer.from('{"event":"order.paid","amount":1}'),
        signature,
      ),
    ).toBe(false);
  });

  it('creates only the server-owned package amount', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'order_server_owned',
        amount: PACKAGE.amount,
        currency: PACKAGE.currency,
        receipt: 'MA-TEST',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await createRazorpayOrder({
      amount: PACKAGE.amount,
      currency: PACKAGE.currency,
      receipt: 'MA-TEST',
      notes: { package: PACKAGE.name },
    });

    const request = fetchMock.mock.calls[0][1];
    expect(JSON.parse(request.body)).toMatchObject({
      amount: 3_000_000,
      currency: 'INR',
      receipt: 'MA-TEST',
    });
  });
});
