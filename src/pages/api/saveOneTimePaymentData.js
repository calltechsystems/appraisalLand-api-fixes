// pages/api/postSubscriptionDetails.js
import axios from "axios";


export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

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
    } = req.body;

    if (!planId || !paymentId || !userId || !status) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const responseData = await axios.post(
      `${domain}/com.appraisalland.Payments/PostSubscriptionsDetailsAsync`,
      {
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
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Subscription details posted successfully",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Post Subscription Details Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to save subscription";

      return res.status(statusCode).json({
        success: false,
        message: errorMessage,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
