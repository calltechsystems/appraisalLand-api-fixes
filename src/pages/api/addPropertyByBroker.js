// pages/api/UpdatePropertyByBroker.js
import axios from "axios";


export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  try {
    const body = req.body;

    if (!body) {
      return res.status(400).json({ success: false, message: "Missing request body" });
    }

    const orderId = req.query.orderId;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Missing orderId" });
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
      propertyId,
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
      applicantAddress,
      attachment,
      remark,
      quoteRequiredDate,
      image,
    } = body;

    const formData = {
      userId: user.userId,
      propertyId,
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

    const updateResponse = await axios.put(
      `${domain}/com.appraisalland.Property/UpdatePropertyAsync`,
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: { orderId },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updateResponse.data,
    });
  } catch (err) {
    console.error("Update Property Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to update property";

      return res.status(statusCode).json({ success: false, message: errorMessage });
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
