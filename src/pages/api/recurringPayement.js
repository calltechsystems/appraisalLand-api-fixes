// pages/api/subscribeRecurringPayment.js
import axios from "axios";
import CryptoJS from "crypto-js";


export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const encryptedBody = req.body.data;

    if (!encryptedBody) {
      return res.status(400).json({ success: false, message: "Missing encrypted data" });
    }

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const decryptedBody = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    if (!decryptedBody?.subscriptionId) {
      return res.status(400).json({ success: false, message: "Missing subscriptionId" });
    }

    const { subscriptionId } = decryptedBody;
    const token = req.headers.authorization;
    const userId = request.query.userId;
    if (!token || !userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userResponse = await axios.post(
      `${domain}/RecurringPayments/subscribe`,
      {},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          userId: userId,
          subscriptionId: subscriptionId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Subscription activated successfully",
      data: userResponse.data,
    });
  } catch (err) {
    console.error("Recurring Subscription Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Subscription failed";

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
