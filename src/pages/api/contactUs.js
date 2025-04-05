// pages/api/contactUs.js
import axios from "axios";
import CryptoJS from "crypto-js";


export default async function handler(req, res) {
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

    if (!decryptedBody) {
      return res.status(403).json({ success: false, message: "Invalid encrypted payload" });
    }

    const {
      firstName,
      lastName,
      emailAddress,
      userLoggedIn,
      phoneNumber,
      company,
      state,
      subject,
      description,
    } = decryptedBody;

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const formData = {
      firstName,
      lastName,
      emailAddress,
      userLoggedIn,
      phoneNumber,
      company,
      state,
      subject,
      description,
    };

    const contactResponse = await axios.post(
      `${domain}/com.appraisalland.Contactus/CreateContactUsAsync`,
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Contact form submitted successfully",
      data: contactResponse.data,
    });
  } catch (err) {
    console.error("Contact Us Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to submit contact form";

      return res.status(statusCode).json({ success: false, message: errorMessage });
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
