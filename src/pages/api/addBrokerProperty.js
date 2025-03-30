import axios from "axios";
async function handler(request, response) {
  const domain = process.env.BACKEND_DOMAIN;

  try {
    const body = request.body;

    if (!body) {
      return response.status(403).json({ error: "Not a verified Data" });
    }

    const {
      userId,
      propertyId,
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
      token,
    } = body;

    const formData = {
      userId: userId,
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
      remark : remark,
      quoteRequiredDate:quoteRequiredDate
    };
   
    const userResponse = await axios.post(
      `${domain}/com.appraisalland.Property/addProperty`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
      return response.status(statusCode).json({ error: axiosError.message });
    } else {
      // Handle other types of errors
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default handler;
