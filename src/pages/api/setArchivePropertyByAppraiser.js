// pages/api/archivePropertyByAppraiser.js
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

    const { token, orderId, status, userId } = body || {};

    if (!token || !orderId || typeof status !== "boolean" || !userId) {
      return res.status(400).json({ success: false, message: "Missing or invalid required fields" });
    }

    const payload = {
      orderId,
      userId: userId,
      status,
    };

    const userResponse = await axios.post(
      `${domain}/com.appraisalland.Property/ArchivePropertyByAppraiserAsync`,
      payload,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Property archived successfully",
      data: userResponse.data,
    });
  } catch (err) {
    console.error("Archive Property Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "API Error"
          : "Failed to archive property";

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
