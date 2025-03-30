import axios from "axios";
import CryptoJS from "crypto-js";

async function handler(request, response) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  try {
    const token = request.headers.authorization;

    const userId = request.query.userId;
    // console.log(email)

    console.log(userId);
    // http://calltech-prod.us-east-1.elasticbeanstalk.com/api?OrderId=1440------getQuotesByOrderID
    const userResponse = await axios.get(
      `${domain}/com.appraisalland.Brokerage/getPropertiesByBrokerage`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          brokerageId: userId,
        },
      }
    );
    const users = userResponse.data;

    return response.status(200).json({ msg: "OK", data: users });
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
