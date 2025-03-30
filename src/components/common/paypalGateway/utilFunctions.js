import axios from "axios";

export const PayPalApi = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET,
  baseUrl:
    // process.env.NODE_ENV === "production"
    //   ? "https://api-m.paypal.com"
    //   :
    "https://api-m.sandbox.paypal.com", 
};

export const getPayPalAccessToken = async () => {

  const credentials = `${PayPalApi.clientId}:${PayPalApi.clientSecret}`;
  const encodedCredentials = btoa(credentials); 

  try {
    const response = await axios.post(
      `${PayPalApi.baseUrl}/v1/oauth2/token`,
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Failed to fetch PayPal access token:", error);
    throw new Error("Unable to fetch PayPal access token.");
  }
};
