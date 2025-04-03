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

    const { email, password } = body;
    const loginResponse = await axios.post(
      `${domain}/com.appraisalland.Login/LoginAsync`,
      {
        email: email,
        password: password,
      }
    );
    return response.status(200).json({ response: loginResponse.data });
  } catch (err) {
    if (err.response) {
      const axiosError = err.response.data;
      const statusCode = err.response.status;
      console.error(statusCode, axiosError.message);

      return response.status(statusCode).json({ error: axiosError.message });
    } else {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default handler;
