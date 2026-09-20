import { neon } from '@neondatabase/serverless';
import { assertPaymentStatus } from './payment-state.js';

let sqlClient;
let schemaPromise;

const getSql = () => {
  if (!process.env.DATABASE_URL) {
    const error = new Error('Payment database is not configured.');
    error.statusCode = 503;
    throw error;
  }
  if (!sqlClient) sqlClient = neon(process.env.DATABASE_URL);
  return sqlClient;
};

export const ensureSchema = async () => {
  if (!schemaPromise) {
    const sql = getSql();
    schemaPromise = Promise.all([
      sql`
        CREATE TABLE IF NOT EXISTS payment_orders (
          id BIGSERIAL PRIMARY KEY,
          receipt VARCHAR(40) NOT NULL UNIQUE,
          razorpay_order_id VARCHAR(100) NOT NULL UNIQUE,
          razorpay_payment_id VARCHAR(100) UNIQUE,
          amount INTEGER NOT NULL,
          currency VARCHAR(3) NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'created',
          customer_name VARCHAR(100) NOT NULL,
          customer_email VARCHAR(254) NOT NULL,
          customer_phone VARCHAR(20) NOT NULL,
          terms_accepted_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `,
      sql`
        CREATE TABLE IF NOT EXISTS payment_events (
          id BIGSERIAL PRIMARY KEY,
          provider_event_id VARCHAR(128) NOT NULL UNIQUE,
          event_type VARCHAR(80) NOT NULL,
          razorpay_order_id VARCHAR(100),
          received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `,
    ]).catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }
  return schemaPromise;
};

export const createOrderRecord = async ({
  receipt,
  orderId,
  amount,
  currency,
  customer,
}) => {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    INSERT INTO payment_orders (
      receipt,
      razorpay_order_id,
      amount,
      currency,
      customer_name,
      customer_email,
      customer_phone,
      terms_accepted_at
    )
    VALUES (
      ${receipt},
      ${orderId},
      ${amount},
      ${currency},
      ${customer.name},
      ${customer.email},
      ${customer.phone},
      NOW()
    )
    RETURNING receipt, razorpay_order_id, amount, currency, status
  `;
  return rows[0];
};

export const getOrderRecord = async (orderId) => {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT
      receipt,
      razorpay_order_id,
      razorpay_payment_id,
      amount,
      currency,
      status,
      created_at,
      updated_at
    FROM payment_orders
    WHERE razorpay_order_id = ${orderId}
    LIMIT 1
  `;
  return rows[0] || null;
};

export const updateOrderStatus = async ({
  orderId,
  paymentId = null,
  status,
}) => {
  assertPaymentStatus(status);
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    UPDATE payment_orders
    SET
      status = CASE
        WHEN status = 'paid' THEN 'paid'
        WHEN ${status} = 'paid' THEN 'paid'
        ELSE ${status}
      END,
      razorpay_payment_id = COALESCE(${paymentId}, razorpay_payment_id),
      updated_at = NOW()
    WHERE razorpay_order_id = ${orderId}
    RETURNING receipt, razorpay_order_id, razorpay_payment_id, amount, currency, status
  `;
  return rows[0] || null;
};

export const recordWebhookEvent = async ({
  eventId,
  eventType,
  orderId,
  paymentId,
  status,
}) => {
  assertPaymentStatus(status);
  await ensureSchema();
  const sql = getSql();

  const results = await sql.transaction([
    sql`
      INSERT INTO payment_events (
        provider_event_id,
        event_type,
        razorpay_order_id
      )
      VALUES (${eventId}, ${eventType}, ${orderId})
      ON CONFLICT (provider_event_id) DO NOTHING
      RETURNING provider_event_id
    `,
    sql`
      UPDATE payment_orders
      SET
        status = CASE
          WHEN status = 'paid' THEN 'paid'
          WHEN ${status} = 'paid' THEN 'paid'
          ELSE ${status}
        END,
        razorpay_payment_id = COALESCE(${paymentId}, razorpay_payment_id),
        updated_at = NOW()
      WHERE razorpay_order_id = ${orderId}
      RETURNING receipt, status
    `,
  ]);

  return {
    duplicate: results[0].length === 0,
    order: results[1][0] || null,
  };
};
