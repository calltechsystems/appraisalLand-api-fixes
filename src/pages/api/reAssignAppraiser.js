// pages/api/brokerRequoteAction.js
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
    const decryptedBody = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    if (!decryptedBody?.QuoteId) {
      return res.status(400).json({ success: false, message: "Missing QuoteId" });
    }

    const { quoteId } = decryptedBody;
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userResponse = await axios.put(
      `${domain}/com.appraisalland.Broker/QuoteReActionByBrokerAsync`,
      {},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          quoteId: quoteId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Quote re-action completed",
      data: userResponse.data,
    });
  } catch (err) {
    console.error("Broker Re-Action Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? err.response.data?.message || "Unknown error"
            : "Broker quote re-action failed",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
