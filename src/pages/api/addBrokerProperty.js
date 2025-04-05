// pages/api/addBrokerageproperty.js
import axios from "axios";


export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  try {
    const body = req.body;

    if (!body) {
      return res.status(400).json({ success: false, message: "Missing request body" });
    }

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      streetName,
      streetNumber,
      city,
      state,
      zipCode,
      area,
      community,
      typeOfBuilding,
      applicantFirstName,
      applicantLastName,
      applicantEmailAddress,
      applicantPhoneNumber,
      bidLowerRange,
      bidUpperRange,
      urgency,
      propertyStatus,
      estimatedValue,
      typeOfAppraisal,
      lenderInformation,
      purpose,
      remark,
      quoteRequiredDate,
      applicantAddress,
      attachment,
      image,
    } = body;

    const formData = {
      userId: user.userId, // pulled from session
      streetName,
      streetNumber,
      city,
      province: state,
      zipCode,
      area,
      community,
      typeOfBuilding,
      applicantFirstName,
      applicantLastName,
      applicantEmailAddress,
      applicantPhoneNumber,
      bidLowerRange,
      bidUpperRange,
      propertyStatus,
      urgency,
      estimatedValue,
      purpose,
      typeOfAppraisal,
      lenderInformation,
      applicantAddress,
      attachment,
      image,
      remark,
      quoteRequiredDate,
    };

    const responseData = await axios.post(
      `${domain}/com.appraisalland.Property/AddPropertyAsync`,
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
      message: "Property submitted successfully",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Add Property Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to submit property";

      return res.status(statusCode).json({ success: false, message: errorMessage });
    } else {
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
}
