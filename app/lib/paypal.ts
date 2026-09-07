const PAYPAL_API_BASE =
  process.env.PAYPAL_API_BASE?.trim() ||
  "https://api-m.paypal.com";

const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();

const PAYPAL_CLIENT_SECRET =
  process.env.PAYPAL_CLIENT_SECRET?.trim();

async function getPayPalAccessToken() {
  if (
    !PAYPAL_CLIENT_ID ||
    !PAYPAL_CLIENT_SECRET
  ) {
    throw new Error(
      "Missing PayPal credentials."
    );
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
        Accept:
          "application/json",
      },

      body:
        "grant_type=client_credentials",

      cache: "no-store",
    }
  );

  const text =
    await response.text();

  let data: any = null;

  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) {
    console.error(
      "PayPal OAuth error:",
      {
        status:
          response.status,
        statusText:
          response.statusText,
        data,
        apiBase:
          PAYPAL_API_BASE,
      }
    );

    throw new Error(
      `PayPal OAuth failed (${response.status}): ${
        typeof data === "string"
          ? data
          : JSON.stringify(data)
      }`
    );
  }

  if (
    !data?.access_token
  ) {
    console.error(
      "PayPal OAuth response missing access token:",
      data
    );

    throw new Error(
      "PayPal did not return an access token."
    );
  }

  return data.access_token as string;
}

export async function paypalRequest(
  path: string,
  options: RequestInit = {}
) {
  const accessToken =
    await getPayPalAccessToken();

  const response =
    await fetch(
      `${PAYPAL_API_BASE}${path}`,
      {
        ...options,

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",

          Accept:
            "application/json",

          ...options.headers,
        },

        cache: "no-store",
      }
    );

  return response;
}