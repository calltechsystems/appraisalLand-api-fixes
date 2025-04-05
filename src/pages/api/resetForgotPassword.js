// pages/api/verifyResetPassword.js
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

    const { email, newPassword, token } = body || {};

    if (!email || !newPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: email, newPassword, or token",
      });
    }

    const userResponse = await axios.post(
      `${domain}/com.appraisalland.ForgotPassword/VerifyResetPasswordAsync`,
      { email, newPassword, token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
      data: userResponse.data,
    });
  } catch (err) {
    console.error("Verify Reset Password Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Password reset failed";

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
