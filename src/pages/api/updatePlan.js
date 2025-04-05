import axios from "axios";
import CryptoJS from "crypto-js";

async function handler(request, response) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  if (request.method !== "PUT") {
    return response.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const encryptedBody = request.body?.data;

    if (!encryptedBody) {
      return response.status(400).json({ success: false, message: "Missing encrypted data" });
    }

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const body = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    const { token, planId } = body;

    if (!planId) {
      return response.status(400).json({ success: false, message: "Missing planId" });
    }

    const apiResponse = await axios.put(
      `${domain}/Plan/planId`,
      {},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          planId: planId,
        },
      }
    );

    return response.status(200).json({
      success: true,
      message: "Plan status updated successfully",
      data: apiResponse.data,
    });
  } catch (err) {
    console.error("Error updating plan:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const message =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Update failed"
          : "Something went wrong while updating the plan.";

      return response.status(statusCode).json({ success: false, message });
    }

    return response.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export default handler;
