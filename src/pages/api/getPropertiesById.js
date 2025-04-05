// pages/api/getPropertyByOrderId.js
import axios from "axios";


export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { item: orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Missing orderId in query" });
    }

    const responseData = await axios.get(
      `${domain}/com.appraisalland.Property/GetPropertyByOrderIdAsync`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          orderId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Property data fetched successfully",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Get Property by Order ID Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? err.response.data?.message || "Unknown error"
            : "Failed to fetch property data",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
