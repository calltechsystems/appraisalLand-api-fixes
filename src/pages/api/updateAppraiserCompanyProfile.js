// pages/api/updateAppraiserCompanyProfile.js
import axios from "axios";

export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const body = req.body;

    if (!body) {
      return res.status(400).json({ success: false, message: "Missing request body" });
    }

    const {
      id,
      token,
      firstName,
      addressLineOne,
      lastName,
      cellNumber,
      lenderListUrl,
      addressLineTwo,
      city,
      licenseNumber,
      state,
      postalCode,
      phoneNumber,
      officeContactEmail,
      officeContactLastName,
      officeContactFirstName,
      officeContactPhone,
      appraiserCompanyName,
      emailId,
      apartmentNumber,
      streetName,
      streetNumber,
      profileImage,
      smsNotification,
      emailNotification
    } = body;

    if (!id || !token) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: id or token",
      });
    }

    const payload = {
      firstName,
      licenseNumber,
      lastName,
      AppraiserCompanyName: appraiserCompanyName,
      city,
      state,
      postalCode,
      cellNumber,
      addressLineOne,
      addressLineTwo,
      officeContactFirstName,
      officeContactLastName,
      phoneNumber,
      officeContactEmail,
      lenderListUrl,
      officeContactPhone,
      emailId,
      apartmentNumber,
      streetName,
      streetNumber,
      profileImage,
      getSms: smsNotification ? 1 : 0,
      getEmail: emailNotification ? 1 : 0,
    };

    const userResponse = await axios.put(
      `${domain}/com.appraisalland.AppraiserCompany/UpdateAppraiserCompanyProfileAsync`,
      payload,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          appraiserCompanyId: id,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Appraiser company profile updated successfully",
      data: userResponse.data,
    });
  } catch (err) {
    console.error("Update Appraiser Company Error:", err);

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
