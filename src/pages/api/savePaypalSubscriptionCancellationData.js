import axios from "axios";
// import CryptoJS from "crypto-js";

export default async function handler(request, response) {
  const domain = process.env.BACKEND_DOMAIN;
  try {
    const {
      userId,
      planId,
      customId,
      paymentId,
      cancellationDateTime,
      paymentStatus,
      paymenttype,
      currencycode,
      subscriber,
      paymentSource,
      applicationContext,
      paymentRequestSent,
      paymentRequestReceived,
      paypalSubscriptionId,
      subscriptionStatus
    } = request.body;

    const token = request.headers.authorization;

    const payload = {
      userId,
      planId,
      customId,
      paymentId,
      cancellationDateTime,
      paymentStatus,
      paymenttype,
      currencycode,
      subscriber,
      paymentSource,
      applicationContext,
      paymentRequestSent,
      paymentRequestReceived,
      paypalSubscriptionId,
      subscriptionStatus
    };

    const userResponse = await axios.post(
      `${domain}/com.appraisalland.Payments/cancelRecurringSubscription`,
      payload,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    return response.status(201).json({ msg: "Successfully Saved!!" });
  } catch (err) {
    if (err.response) {
      // If the error is from an axios request (e.g., HTTP 4xx or 5xx error)
      console.log(err);
      const axiosError = err.response.data;
      const statusCode = err.response.status;
      console.error(statusCode, axiosError.message); // Log the error for debugging

      return response.status(statusCode).json({ error: axiosError.message });
    } else {
      // Handle other types of errors
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }
}


