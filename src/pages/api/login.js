import axios from "axios";
import CryptoJS from "crypto-js";
import { apiResponseHandling } from "../../utils/apiResponseHandler";

async function handler(req, res) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {

    const encryptedBody = req.body.data;

    if (!encryptedBody) {
      return res.status(400).json({ success: false, message: "Missing encrypted data" });
    }

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const decryptedBody = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    const { email, password } = decryptedBody;

    const loginResponse = await axios.post(
      `${domain}/com.appraisalland.Login/LoginAsync`,
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.status(loginResponse.status).json(loginResponse.data)
  } catch (err) {
    const status = err?.response?.status;
    const message = err?.response?.data?.message || err.message || "Unknown error";


    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
}

export default handler;
