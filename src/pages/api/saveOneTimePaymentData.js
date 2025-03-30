import axios from "axios";
// import CryptoJS from "crypto-js";

export default async function handler(request, response) {
  const domain = process.env.BACKEND_DOMAIN;
  try {
    const {
      updateTime,
      createTime,
      planId,
      planAmount,
      planName,
      userId,
      paymentId,
      topUpId,
      paymentRequestSent,
      paymentResponseReceived,
      status,
      currencyCode,
    } = request.body;

    const token = request.headers.authorization;

    const userResponse = await axios.post(
      `${domain}/com.appraisalland.Payments/postSubscriptionsDetails`,
      {
        updateTime,
        createTime,
        planAmount,
        planId,
        planName,
        userId,
        paymentId,
        topUpId,
        paymentRequestSent,
        paymentResponseReceived,
        status,
        currencyCode,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const user = userResponse.data;

    return response.status(200).json({ msg: "OK", userData: user });
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
