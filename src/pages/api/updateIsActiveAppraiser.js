import axios from "axios";
import CryptoJS from "crypto-js";

export default async function handler(request, response) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;
  try {
    const encryptedBody = await request.body.data;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const body = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    if (!body) {
      return response.status(403).json({ error: "Not a verified Data" });
    }

    const { id,IsActive } = body;

    const token = request.headers.authorization;

  
    const userResponse = await axios.put(
      `${domain}/com.appraisalland.AppraiserIndividual/updateApprasierStatus`,
      {},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params:{
            Userid:id,
            IsActive:IsActive
        }
      }
    );
    const user = userResponse.data;

    return response.status(201).json({ msg: "Successfully Created !!" });
  } catch (err) {
    if (err.response) {
      // If the error is from an axios request (e.g., HTTP 4xx or 5xx error)
      console.log(err);
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
