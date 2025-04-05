// pages/api/getSubscription.js
import axios from "axios";

import { getPRODUCTIONUrl } from "../../utils/productionVarFile";

export default async function handler(req, res) {
  const domain = getPRODUCTIONUrl();

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const token = req.headers.authorization;
    const userId = request.query.userId;
    if (!token || !userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const responseData = await axios.get(
      `${domain}/com.appraisalland.Payments/GetSubscriptionAsync`,
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

    return res.status(200).json({
      success: true,
      message: "Subscription details fetched successfully",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Get Subscription Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? err.response.data?.message || "Unknown error"
            : "Failed to fetch subscription details",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}