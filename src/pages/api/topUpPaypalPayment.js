// pages/api/getTopUpPlan.js
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
    const body = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    const { userId, planId, token } = body || {};

    if (!userId || !planId || !token) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, planId, or token",
      });
    }

    const responseData = await axios.post(
      `${domain}/com.appraisalland.Plan/getTopUpPlan`,
      null,
      {
        headers: {
          Authorization: token,
        },
        params: {
          planId: planId,
          userId: userId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Top-up plan fetched successfully",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Top-up Plan Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Failed to fetch plan"
          : "Unable to retrieve top-up plan";

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
