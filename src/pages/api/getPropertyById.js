// pages/api/getPropertyById.js
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

    const { item: propertyId } = req.query;

    if (!propertyId) {
      return res.status(400).json({ success: false, message: "Missing property ID in query" });
    }

    const responseData = await axios.get(`${domain}/Property/${propertyId}`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Property fetched successfully",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Get Property By ID Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? err.response.data?.message || "Unknown error"
            : "Failed to fetch property",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
