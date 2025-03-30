import axios from "axios";
import CryptoJS from "crypto-js";

async function handler(request, response) {
    // const decryptionKey = process.env.CRYPTO_SECRET_KEY;
    const domain = process.env.BACKEND_DOMAIN;

  try {
    const encryptedBody = await request.body.data;

    const token = request.headers.authorization;
    const propertyId = request.query.propertyId;
    const userid =request.query.userid;

    console.log(token,propertyId,userid);

    const userResponse = await axios.delete(`${domain}/Property/DeleteArchivePropertyByAppraiser`, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      params:{
        userid:userid,
        PropertyId:propertyId
      }
    });
    const user = userResponse.data;

    if (!user) {
      return response.status(404).json({ error: "User Not Found" });
    }
    return response
      .status(200)
      .json({ msg: "Successfully updated", userData: user });
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
