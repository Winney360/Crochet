const BASE_URL = 'https://api.paystack.co';

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error('PAYSTACK_SECRET_KEY is not configured');
  }
  return key;
}

function getCallbackUrl() {
  return process.env.PAYSTACK_CALLBACK_URL || 'https://example.com/order-success';
}

async function initializeTransaction({ email, amount, reference, callbackUrl, cancelUrl, metadata }) {
  const response = await fetch(`${BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100),
      currency: 'KES',
      reference,
      callback_url: callbackUrl || getCallbackUrl(),
      cancel_url: cancelUrl,
      metadata
    })
  });

  const data = await response.json();
  if (!response.ok || !data.status || !data.data || !data.data.authorization_url) {
    throw new Error(`Paystack initialize failed: ${data.message || response.status}`);
  }
  return data.data;
}

async function verifyTransaction(reference) {
  const response = await fetch(
    `${BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${getSecretKey()}` }
    }
  );

  const data = await response.json();
  if (!response.ok || !data.status) {
    throw new Error(`Paystack verify failed: ${data.message || response.status}`);
  }
  return data.data;
}

function mapStatus(paystackStatus) {
  if (paystackStatus === 'success') return 'completed';
  if (paystackStatus === 'failed' || paystackStatus === 'abandoned') return 'failed';
  return 'pending';
}

module.exports = { initializeTransaction, verifyTransaction, mapStatus };