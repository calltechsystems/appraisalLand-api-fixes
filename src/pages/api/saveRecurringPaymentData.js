import axios from "axios";
// import CryptoJS from "crypto-js";

export default async function handler(request, response) {
  const domain = process.env.BACKEND_DOMAIN;
  try {
    const {
      userId,
      newPlanId,
      customId,
      paymentId,
      startTime,
      paymentStatus,
      paymenttype,
      currencycode,
      subscriber,
      paymentSource,
      applicationContext,
      paymentRequestSent,
      paymentRequestReceived,
      paypalSubscriptionId
    } = request.body;

    const token = request.headers.authorization;

    const userResponse = await axios.post(
      `${domain}/com.appraisalland.Payments/postRecurringSubscriptionsDetails`,
      {
        userId,
        newPlanId,
        customId,
        paymentId,
        startTime,
        paymentStatus,
        paymenttype,
        currencycode,
        subscriber,
        paymentSource,
        applicationContext,
        paymentRequestSent,
        paymentRequestReceived,
        paypalSubscriptionId
      },
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


