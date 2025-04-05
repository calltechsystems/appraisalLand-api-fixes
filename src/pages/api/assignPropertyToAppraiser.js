// pages/api/AssignPropertyByAppraiserCompany.js
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

    const { companyId, appraiserId, propertyId } = decryptedBody;

    if (!companyId || !propertyId || !appraiserId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const payload = {
      companyId: Number(companyId),
      propertyId: Number(propertyId),
      appraiserId: Number(appraiserId),
    };

    const responseData = await axios.post(
      `${domain}/com.appraisalland.AppraiserCompany/AssignPropertyByAppraiserCompanyAsync`,
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
      message: "Property assigned successfully",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Assignment Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to assign property";

      return res.status(statusCode).json({ success: false, message: errorMessage });
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
