// pages/api/acceptBid.js
import axios from "axios";
import CryptoJS from "crypto-js";


export default async function handler(req, res) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

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

    const { bidId } = decryptedBody;

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userResponse = await axios.put(
      `${domain}/com.appraisalland.Broker/QuoteActionByBrokerAsync`,
      {},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          quoteId: bidId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Bid accepted successfully",
      data: userResponse.data, // send full response or a specific part if needed
    });
  } catch (err) {
    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to accept bid";

      return res.status(statusCode).json({ success: false, message: errorMessage });
    } else {
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
}
