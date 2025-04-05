// pages/api/updateOrderCancelOnHold.js
import axios from "axios";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;

  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const encryptedBody = req.body.data;

    if (!encryptedBody) {
      return res.status(400).json({ success: false, message: "Missing encrypted data" });
    }

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const body = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    const { token, orderId, status, value } = body || {};

    if (!token || !orderId || typeof status !== "boolean" || typeof value !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid required fields",
      });
    }

    const payload = {
      orderId,
      status,
      value,
    };

    const responseData = await axios.put(
      `${domain}/com.appraisalland.Property/UpdateOrderCancelOnHoldAsync`,
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
      message: "Order cancel/on-hold status updated successfully",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Update Cancel/Hold Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to update cancel/on-hold status";

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
