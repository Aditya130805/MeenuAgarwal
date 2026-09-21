import { beforeEach, describe, expect, it, vi } from 'vitest';

const recordWebhookEvent = vi.fn();
const verifyWebhookSignature = vi.fn();

vi.mock('../_lib/database.js', () => ({ recordWebhookEvent }));
vi.mock('../_lib/razorpay.js', () => ({ verifyWebhookSignature }));

const { default: handler } = await import('./webhook.js');

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

const validEvent = Buffer.from(
  JSON.stringify({
    event: 'order.paid',
    payload: {
      order: {
        entity: {
          id: 'order_valid123',
          amount: 3_000_000,
          currency: 'INR',
        },
      },
    },
  }),
);

describe('payment webhook endpoint', () => {
  beforeEach(() => {
    verifyWebhookSignature.mockReset().mockReturnValue(true);
    recordWebhookEvent.mockReset().mockResolvedValue({
      duplicate: false,
      order: { status: 'paid' },
    });
  });

  it('rejects unsigned or forged events before processing', async () => {
    verifyWebhookSignature.mockReturnValue(false);
    const response = createResponse();

    await handler(
      {
        method: 'POST',
        body: validEvent,
        headers: { 'x-razorpay-signature': 'forged' },
      },
      response,
    );

    expect(response.statusCode).toBe(400);
    expect(recordWebhookEvent).not.toHaveBeenCalled();
  });

  it('reports provider retries as duplicate without failing the webhook', async () => {
    recordWebhookEvent.mockResolvedValue({ duplicate: true, order: null });
    const response = createResponse();

    await handler(
      {
        method: 'POST',
        body: validEvent,
        headers: {
          'x-razorpay-signature': 'valid',
          'x-razorpay-event-id': 'event_replayed123',
        },
      },
      response,
    );

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      received: true,
      duplicate: true,
    });
    expect(recordWebhookEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'event_replayed123',
        status: 'paid',
      }),
    );
  });
});
