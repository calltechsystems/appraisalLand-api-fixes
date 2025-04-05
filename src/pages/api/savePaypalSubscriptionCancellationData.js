// pages/api/cancelRecurringSubscription.js
import axios from "axios";


export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

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
      subscriptionStatus,
    } = req.body;

    // Basic field validation
    if (!userId || !paypalSubscriptionId || !paymentStatus) {
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
      subscriptionStatus,
    };

    const responseData = await axios.post(
      `${domain}/com.appraisalland.Payments/CancelRecurringSubscriptionAsync`,
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
      message: "Recurring subscription cancellation saved",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Cancel Recurring Subscription Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Cancellation failed";

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
