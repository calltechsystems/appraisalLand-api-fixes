import axios from "axios";
// import CryptoJS from "crypto-js";

async function handler(request, response) {
  // const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  try {
    // const encryptedBody = await request.body.data;

    // const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const body = request?.body;

    if (!body) {
      return response.status(403).json({ error: "Not a verified Data" });
    }

    const orderId = request.query.orderId;

    const {
      userId,
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
      token,
    } = body;

    const formData = {
      userId: userId,
      propertyId: propertyId,
      streetName: streetName,
      streetNumber: streetNumber,
      city: city,
      province: state,
      zipCode: zipCode,
      area: area,
      community: community,
      typeOfBuilding: typeOfBuilding,
      applicantFirstName: applicantFirstName,
      applicantLastName: applicantLastName,
      applicantEmailAddress: applicantEmailAddress,
      applicantPhoneNumber: applicantPhoneNumber,
      bidLowerRange: bidLowerRange,
      bidUpperRange: bidUpperRange,
      propertyStatus: propertyStatus,
      urgency: urgency,
      estimatedValue: estimatedValue,
      purpose: purpose,
      typeOfAppraisal: typeOfAppraisal,
      lenderInformation: lenderInformation,
      applicantAddress: applicantAddress,
      attachment: attachment,
      image: image,
      remark: remark,
      quoteRequiredDate: quoteRequiredDate,
    };

    const userResponse = await axios.put(
      `${domain}/com.appraisalland.Property/updateProperty`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          OrderId: orderId,
        },
      }
    );
    const user = userResponse.data;

    if (!user) {
      return response.status(404).json({ error: "User Not Found" });
    }
    return response.status(200).json({ msg: "OK", userData: user });
  } catch (err) {
    console.log(err);
    if (err.response) {
      // If the error is from an axios request (e.g., HTTP 4xx or 5xx error)
      const axiosError = err.response.data;
      const statusCode = err.response.status;
      console.error(statusCode, axiosError.message); // Log the error for debugging

      return response.status(statusCode).json({ error: axiosError.message });
    } else {
      // Handle other types of errors
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default handler;
