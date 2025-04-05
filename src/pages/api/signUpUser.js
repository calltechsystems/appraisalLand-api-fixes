// pages/api/signupUser.js
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

    const { email, password, userType } = body || {};

    if (!email || !password || !userType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: email, password, userType",
      });
    }

    const payload = {
      email,
      password,
      userType,
    };

    const responseData = await axios.post(
      `${domain}/com.appraisalland.Registration/SignUpUserAsync`,
      payload
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Signup Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Signup failed"
          : "Unable to register user";

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
