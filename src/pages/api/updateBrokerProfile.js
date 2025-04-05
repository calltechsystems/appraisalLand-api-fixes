import axios from "axios";
import CryptoJS from "crypto-js";

export default async function handler(request, response) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  if (request.method !== "PUT") {
    return response.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const encryptedBody = request.body?.data;

    if (!encryptedBody) {
      return response.status(400).json({ success: false, message: "Missing encrypted data" });
    }

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const body = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    if (!body || !body.id || !body.token) {
      return response.status(400).json({ success: false, message: "Missing required fields" });
    }

    const {
      id,
      token,
      firstName,
      lastName,
      middleName,
      companyName,
      mortageBrokerLicNo,
      mortgageBrokerageLicNo,
      city,
      state,
      postalCode,
      streetName,
      streetNumber,
      phoneNumber,
      apartmentNo,
      assistantFirstName,
      assistantLastName,
      assistantTwoFirstName,
      assistantTwoLastName,
      assistantPhoneNumber,
      assistantEmailAddress,
      assistantTwoEmailAddress,
      assistantTwoPhoneNumber,
      emailId,
      cellNumber,
      profileImage,
      smsNotification,
      emailNotification
    } = body;

    const payload = {
      firstName,
      middleName,
      lastName,
      companyName,
      emailId,
      assistantTwoPhoneNumber,
      assistantTwoEmailAddress,
      licenseNo: "",
      brokerageName: "",
      streetName,
      streetNumber,
      city,
      province: state,
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
      mortageBrokerageLicNo: mortgageBrokerageLicNo,
      mortageBrokerLicNo,
      profileImage,
      getSms: smsNotification ? 1 : 0,
      getEmail: emailNotification ? 1 : 0
    };

    const apiResponse = await axios.put(
      `${domain}/com.appraisalland.Broker/UpdateBrokerProfileAsync`,
      payload,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: { brokerId: id }
      }
    );

    return response.status(200).json({
      success: true,
      message: "Broker profile updated successfully",
      data: apiResponse.data
    });
  } catch (err) {
    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Update failed"
          : "Unable to update broker profile";

      return response.status(statusCode).json({ success: false, message: errorMessage });
    }

    return response.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
