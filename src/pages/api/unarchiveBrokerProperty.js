// pages/api/unarchiveProperty.js
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

    const { token, propertyId } = body || {};

    if (!token || !propertyId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: token or propertyId",
      });
    }

    const userResponse = await axios.put(
      `${domain}/Property/Unarchiveproperty`,
      {},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          propertyId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Property unarchived successfully",
      data: userResponse.data,
    });
  } catch (err) {
    console.error("Unarchive Property Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Failed to unarchive property"
          : "Unable to process the request";

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
