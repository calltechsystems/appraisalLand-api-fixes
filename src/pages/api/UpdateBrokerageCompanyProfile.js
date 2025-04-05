// pages/api/updateBrokerageProfile.js
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

    if (!body) {
      return res.status(400).json({ success: false, message: "Invalid encrypted payload" });
    }

    const {
      id,
      token,
      firstName,
      lastName,
      middleName,
      companyName,
      mortageBrokerLicNo,
      mortageBrokerageLicNo,
      city,
      province,
      postalCode,
      streetName,
      streetNumber,
      phoneNumber,
      cellNumber,
      brokerageName,
      apartmentNo,
      assistantFirstName,
      assistantLastName,
      assistantPhoneNumber,
      assistantEmailAddress,
      assistantTwoFirstName,
      assistantTwoLastName,
      assistantTwoEmailAddress,
      assistantTwoPhoneNumber,
      emailId,
      profileImage,
      smsNotification,
      emailNotification
    } = body;

    if (!id || !token) {
      return res.status(400).json({ success: false, message: "Missing required fields: id or token" });
    }

    const payload = {
      firstName,
      middleName,
      lastName,
      companyName,
      emailId,
      licenseNo: "",
      brokerageName,
      streetName,
      streetNumber,
      city,
      province,
      apartmentNo,
      postalCode,
      area: "",
      phoneNumber,
      cellNumber,
      faxNumber: "",
      description: "",
      assistantEmailAddress,
      assistantFirstName,
      assistantLastName,
      assistantPhoneNumber,
      assistantTwoFirstName,
      assistantTwoLastName,
      assistantTwoEmailAddress,
      assistantTwoPhoneNumber,
      mortageBrokerageLicNo,
      mortageBrokerLicNo,
      profileImage,
      getSms: smsNotification ? 1 : 0,
      getEmail: emailNotification ? 1 : 0,
    };

    const responseData = await axios.put(
      `${domain}/com.appraisalland.Brokerage/UpdateBrokerageProfileAsync`,
      payload,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          BrokerageId: id,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Brokerage profile updated successfully",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Update Brokerage Profile Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Update failed"
          : "Unable to update profile";

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
