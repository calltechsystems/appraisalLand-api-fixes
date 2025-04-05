// pages/api/getPropertyByUserId.js
import axios from "axios";
import { apiResponseHandling } from "../../utils/apiResponseHandler";

export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const token = req.headers.authorization;
    const userId = request.query.userId;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const propertiesResponse = await axios.get(
      `${domain}/com.appraisalland.Property/GetPropertyByUserIdAsync`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          userId: userId,
        },
      }
    );

    return res.status(propertiesResponse.status).json(propertiesResponse.data)

  } catch (err) {
    console.error("Get Property By UserId Error:", err);

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
