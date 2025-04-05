// pages/api/postRecurringSubscription.js
import axios from "axios";


export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

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
      paypalSubscriptionId,
    } = req.body;

    if (!userId || !newPlanId || !paymentId || !paypalSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const payload = {
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
      paypalSubscriptionId,
    };

    const responseData = await axios.post(
      `${domain}/com.appraisalland.Payments/PostRecurringSubscriptionsDetailAsync`,
      payload,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(201).json({
      success: true,
      message: "Recurring subscription details saved",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Post Recurring Subscription Error:", err);

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
