// pages/api/generatePaymentUrl.js
import axios from "axios";
import CryptoJS from "crypto-js";


export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN2;
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const encryptedBody = req.body.data;

    if (!encryptedBody) {
      return res.status(400).json({ success: false, message: "Missing encrypted payload" });
    }

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const decryptedBody = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    const { userId, planName } = decryptedBody;
    const token = req.headers.authorization;

    if (!token || !userId || !planName) {
      return res.status(400).json({ success: false, message: "Missing required parameters" });
    }

    const paymentUrlResponse = await axios.post(
      `${domain}/com.appraisalland.Payments/paymenturl`,
      {},
      {
        headers: {
          Authorization: token,
        },
        params: {
          planName,
          userId: userId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Payment URL generated successfully",
      data: paymentUrlResponse.data,
    });
  } catch (err) {
    console.error("Payment URL Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? err.response.data?.message || "Unknown error"
            : "Failed to generate payment URL",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
