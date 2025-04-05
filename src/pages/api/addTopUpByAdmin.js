// pages/api/AddTopupByAdmin.js
import axios from "axios";


export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN2;

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { emailId, noOfProperties } = req.body;

  if (!emailId || !noOfProperties) {
    return res.status(400).json({ success: false, message: "Missing emailId or noOfProperties" });
  }

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const response = await axios.post(
      `${domain}/com.appraisalland.Admin/AddTopUpByAdminAsync`,
      { emailId, noOfProperties },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Top-up added successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Admin Top-up Error:", error);

    const statusCode = error.response?.status || 500;
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? error.response?.data?.message || error.message
        : "Failed to add top-up";

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
}
