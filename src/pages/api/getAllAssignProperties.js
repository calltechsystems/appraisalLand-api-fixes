// pages/api/getAssignedPropertiesByCompany.js
import axios from "axios";


export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN2;

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const token = req.headers.authorization;
    const userId = request.query.userId;

    if (!token || !user.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const responseData = await axios.get(
      `${domain}/com.appraisalland.AppraiserCompany/GetAssignedPropertiesbyAppraiserCompanyAsync`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          companyid: user.userId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Assigned properties fetched successfully",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Get Assigned Properties by Company Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to fetch assigned properties";

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
