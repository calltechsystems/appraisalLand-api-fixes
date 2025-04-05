// pages/api/getBrokerArchivedProperties.js
import axios from "axios";


export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const token = req.headers.authorization;

    if (!token || !user.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const responseData = await axios.get(
      `${domain}/com.appraisalland.Property/GetBrokerArchivePropertyAsync`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          userId: user.userId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Archived properties fetched successfully",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Get Broker Archived Properties Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to fetch archived properties";

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
