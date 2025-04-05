// pages/api/sendResetToken.js
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

    const { email } = body || {};
    if (!email) {
      return res.status(400).json({ success: false, message: "Missing email" });
    }

    const userResponse = await axios.post(
      `${domain}/com.appraisalland.ForgotPassword/SendResetTokenAsync`,
      {},
      {
        params: { Email: email },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Reset token sent successfully",
      data: userResponse.data,
    });
  } catch (err) {
    console.error("Send Reset Token Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to send reset token";

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
