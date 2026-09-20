import { beforeEach, describe, expect, it, vi } from 'vitest';

const createOrderRecord = vi.fn();
const createRazorpayOrder = vi.fn();

vi.mock('../_lib/database.js', () => ({ createOrderRecord }));
vi.mock('../_lib/razorpay.js', () => ({
  createRazorpayOrder,
  getPublicKeyId: () => 'rzp_test_public',
}));

const { default: handler } = await import('./create-order.js');

const createResponse = () => ({
  headers: {},
  statusCode: 200,
  body: '',
  setHeader(name, value) {
    this.headers[name] = value;
  },
  end(body) {
    this.body = body;
  },
});

describe('create-order endpoint', () => {
  beforeEach(() => {
    process.env.PAYMENT_TEST_TOKEN = 'owner-verification-code';
    createOrderRecord.mockReset().mockResolvedValue({});
    createRazorpayOrder.mockReset().mockImplementation(async (input) => ({
      id: 'order_created123',
      amount: input.amount,
      currency: input.currency,
      receipt: input.receipt,
    }));
  });

  it('ignores a client-supplied amount and creates exactly INR 1', async () => {
    const request = {
      method: 'POST',
      body: {
        name: 'Test Customer',
        email: 'customer@example.com',
        phone: '9876543210',
        acceptedTerms: true,
        testToken: 'owner-verification-code',
        amount: 1,
        currency: 'USD',
      },
    };
    const response = createResponse();

    await handler(request, response);

    expect(response.statusCode).toBe(201);
    expect(createRazorpayOrder).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 100, currency: 'INR' }),
    );
    expect(JSON.parse(response.body)).toMatchObject({
      amount: 100,
      currency: 'INR',
    });
  });

  it('does not create an order without accepted terms', async () => {
    const request = {
      method: 'POST',
      body: {
        name: 'Test Customer',
        email: 'customer@example.com',
        phone: '9876543210',
        acceptedTerms: false,
        testToken: 'owner-verification-code',
      },
    };
    const response = createResponse();

    await handler(request, response);

    expect(response.statusCode).toBe(400);
    expect(createRazorpayOrder).not.toHaveBeenCalled();
  });

  it('rejects a public request without the owner verification code', async () => {
    const request = {
      method: 'POST',
      body: {
        name: 'Test Customer',
        email: 'customer@example.com',
        phone: '9876543210',
        acceptedTerms: true,
        testToken: 'wrong-code',
      },
    };
    const response = createResponse();

    await handler(request, response);

    expect(response.statusCode).toBe(403);
    expect(createRazorpayOrder).not.toHaveBeenCalled();
  });
});
