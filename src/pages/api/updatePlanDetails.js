import axios from "axios";
import CryptoJS from "crypto-js";

async function handler(request, response) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN2;

  try {
    const encryptedBody = request.body?.data;

    if (!encryptedBody) {
      return response.status(400).json({ error: "Missing encrypted data" });
    }

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const body = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    if (!body) {
      return response.status(403).json({ error: "Invalid decrypted data" });
    }

    const { token, planId, numberOfProperty, amount } = body;

    if (!planId || !numberOfProperty || !amount) {
      return response.status(400).json({ error: "Missing required fields" });
    }

    const apiResponse = await axios.put(
      `${domain}/com.appraisalland.Admin/UpdatePlanAsync`,
      {},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          planId: Number(planId),
          numberOfProperty: Number(numberOfProperty),
          amount: Number(amount),
        },
      }
    );

    return response.status(200).json({ msg: "Plan updated successfully", data: apiResponse.data });
  } catch (err) {
    console.error("UpdatePlanAsync error:", err);
    if (err.response) {
      const { status, data } = err.response;
      return response.status(status).json({ error: data?.message || "Update failed" });
    }
    return response.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;
