const PAYPAL_API_BASE =
  process.env.PAYPAL_API_BASE ||
  "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const PAYPAL_CLIENT_SECRET =
  process.env.PAYPAL_CLIENT_SECRET;

async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("Missing PayPal credentials.");
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(
    `${PAYPAL_API_BASE}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to get PayPal access token."
    );
  }

  const data = await response.json();

  return data.access_token as string;
}

export async function paypalRequest(
  path: string,
  options: RequestInit = {}
) {
  const accessToken =
    await getPayPalAccessToken();

  return fetch(
    `${PAYPAL_API_BASE}${path}`,
    {
      ...options,

      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },

      cache: "no-store",
    }
  );
}