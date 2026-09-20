const MAX_BODY_BYTES = 32 * 1024;

export const sendJson = (response, status, body) => {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
};

export const requireMethod = (request, response, method) => {
  if (request.method === method) return true;
  response.setHeader('Allow', method);
  sendJson(response, 405, { error: `Method ${request.method} is not allowed.` });
  return false;
};

const readStream = async (request) => {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error('Request body is too large.');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(buffer);
  }

  return Buffer.concat(chunks);
};

export const readRawBody = async (request) => {
  if (Buffer.isBuffer(request.rawBody)) return request.rawBody;
  // Vercel exposes request.body through a lazy parser. For signed webhooks,
  // consume the IncomingMessage stream before ever touching that getter.
  if (typeof request[Symbol.asyncIterator] === 'function') {
    return readStream(request);
  }
  if (Buffer.isBuffer(request.body)) return request.body;
  if (typeof request.body === 'string') return Buffer.from(request.body);

  if (request.body && typeof request.body === 'object') {
    const error = new Error(
      'The webhook body was parsed before signature verification.',
    );
    error.statusCode = 400;
    throw error;
  }
  return Buffer.alloc(0);
};

export const readJsonBody = async (request) => {
  if (request.body && typeof request.body === 'object') return request.body;

  const rawBody = await readRawBody(request);
  if (rawBody.length === 0) return {};

  try {
    return JSON.parse(rawBody.toString('utf8'));
  } catch {
    const error = new Error('Request body must be valid JSON.');
    error.statusCode = 400;
    throw error;
  }
};

export const sendHandlerError = (response, error) => {
  const status = error.statusCode || 500;
  if (status >= 500) {
    console.error('Payment endpoint error:', error);
  }
  sendJson(response, status, {
    error:
      status >= 500
        ? 'The payment service is temporarily unavailable. Please try again.'
        : error.message,
  });
};
