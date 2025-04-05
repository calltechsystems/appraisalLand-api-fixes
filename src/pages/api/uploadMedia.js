import axios from "axios";
import CryptoJS from "crypto-js";

async function handler(request, response) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  try {
    const encryptedBody = request.body?.data;

    if (!encryptedBody) {
      return response.status(400).json({ error: "Missing encrypted data" });
    }

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const body = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    if (!body || !body.email || !body.password) {
      return response.status(400).json({ error: "Missing required fields" });
    }

    const { email, password } = body;

    const userResponse = await axios.post(`${domain}/FileUpload/FileUploadAsync`, {
      email,
      password,
    });

    const user = userResponse.data;

    if (!user) {
      return response.status(404).json({ error: "User Not Found" });
    }

    return response.status(200).json({ msg: "OK", userData: user });
  } catch (err) {
    console.error("Upload error:", err);

    if (err.response) {
      const axiosError = err.response.data;
      const statusCode = err.response.status;
      return response.status(statusCode).json({ error: axiosError.message || "Request failed" });
    } else {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default handler;
