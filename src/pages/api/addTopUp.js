// pages/api/AddTopupPlan.js
import axios from "axios";
import CryptoJS from "crypto-js";


export default async function handler(req, res) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN2;

  try {
    const encryptedBody = req.body.data;

    if (!encryptedBody) {
      return res.status(400).json({ success: false, message: "Missing encrypted data" });
    }

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const decryptedBody = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    if (!decryptedBody) {
      return res.status(403).json({ success: false, message: "Invalid encrypted payload" });
    }

    const token = req.headers.authorization;

    if (!token || !user.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const responseData = await axios.post(
      `${domain}/com.appraisalland.TopUpPayments/CreateTopUpPlanAsync`,
      {},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          userId: user.userId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Top-up plan created successfully",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Top-up Plan Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to create top-up plan";

      return res.status(statusCode).json({ success: false, message: errorMessage });
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
