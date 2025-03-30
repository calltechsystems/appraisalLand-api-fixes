import paypal from "@paypal/checkout-server-sdk";

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { subscriptionId, payload } = req.body;

  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/revise`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to revise subscription");
    }

    return res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error("PayPal Subscription Revision Error:", error);
    return res
      .status(500)
      .json({ error: "Failed to revise subscription", details: error.message });
  }
}

// Helper function to get PayPal Access Token
async function getPayPalAccessToken() {
  const auth = `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`;
  const base64Auth = Buffer.from(auth).toString("base64");

  const response = await fetch(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64Auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch PayPal access token");
  }

  return data.access_token;
}
