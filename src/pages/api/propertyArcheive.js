// pages/api/archivePropertyByBroker.js
import axios from "axios";


export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const token = req.headers.authorization;
    const userId = request.query.userId;

    if (!token || !userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { status, orderId } = req.query;

    if (!orderId || typeof status === "undefined") {
      return res.status(400).json({ success: false, message: "Missing required query parameters" });
    }

    const payload = {
      userId: Number(userId),
      status: status === "true",
      orderId: Number(orderId),
    };

    const responseData = await axios.post(
      `${domain}/com.appraisalland.Property/ArchivePropertyByBrokerAsync`,
      payload,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Property archive status updated",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Archive Property Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to archive property";

      return res.status(statusCode).json({
        success: false,
        message: errorMessage,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
