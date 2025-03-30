import axios from "axios";
import CryptoJS from "crypto-js";

async function handler(request, response) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  try {
    const encryptedBody = await request.body.data;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const body = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    if (!body) {
      return response.status(403).json({ error: "Not a verified Data" });
    }

    const token = request.headers.authorization;
    const { companyid, appraiserid, propertyid } = body;

    const payload = {
      companyid: Number(companyid),
      propertyid: Number(propertyid),
      appraiserid: Number(appraiserid),
    };

    const userResponse = await axios.post(
      `${domain}/com.appraisalland.AppraiserCompany/assignPropopertyByAppCompany`,
      payload,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const user = userResponse.data;

    if (!user) {
      return response.status(404).json({ error: "User Not Found" });
    }
    console.log(user);
    return response.status(200).json({ msg: "OK", userData: user });
  } catch (err) {
    console.log(err);
    if (err.response) {
      // If the error is from an axios request (e.g., HTTP 4xx or 5xx error)
      const axiosError = err.response.data;
      const statusCode = err.response.status;
      console.log(axiosError);
      console.error(statusCode, axiosError.message); // Log the error for debugging

      return response.status(statusCode).json({ error: axiosError.message });
    } else {
      // Handle other types of errors
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default handler;
