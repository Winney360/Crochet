const BASE_URLS = {
  sandbox: 'https://sandbox.safaricom.co.ke',
  production: 'https://api.safaricom.co.ke'
};

let cachedToken = null;
let tokenExpiry = 0;

function getBaseUrl() {
  return BASE_URLS[process.env.MPESA_ENV] || BASE_URLS.sandbox;
}

async function getAccessToken() {
  if (cachedToken && tokenExpiry > Date.now() + 60000) {
    return cachedToken;
  }

  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await fetch(
    `${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: 'GET',
      headers: { Authorization: `Basic ${auth}` }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch M-Pesa access token: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error(`M-Pesa token error: ${JSON.stringify(data)}`);
  }

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (parseInt(data.expires_in || 3599, 10) - 60) * 1000;
  return cachedToken;
}

function normalizePhone(phone) {
  let cleaned = String(phone || '').replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  } else if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1);
  }
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
}

function kenyaTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function getPassword(timestamp) {
  return Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64');
}

function getCallbackUrl() {
  return process.env.MPESA_CALLBACK_URL || 'https://example.com/api/mpesa/callback';
}

async function stkPush({ amount, phone, accountReference, transactionDesc }) {
  const token = await getAccessToken();
  const timestamp = kenyaTimestamp();
  const shortcode = process.env.MPESA_SHORTCODE;
  const phoneNumber = normalizePhone(phone);

  const response = await fetch(`${getBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: getPassword(timestamp),
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: getCallbackUrl(),
      AccountReference: accountReference,
      TransactionDesc: transactionDesc || 'Purchase'
    })
  });

  const data = await response.json();
  if (!response.ok || (data.ResponseCode && data.ResponseCode !== '0')) {
    throw new Error(`STK push failed: ${JSON.stringify(data)}`);
  }
  return data;
}

async function queryStatus(checkoutRequestID) {
  const token = await getAccessToken();
  const timestamp = kenyaTimestamp();
  const shortcode = process.env.MPESA_SHORTCODE;

  const response = await fetch(`${getBaseUrl()}/mpesa/stkpushquery/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: getPassword(timestamp),
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID
    })
  });

  const data = await response.json().catch(() => null);
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid status query response');
  }
  return data;
}

module.exports = { getAccessToken, stkPush, queryStatus, normalizePhone };