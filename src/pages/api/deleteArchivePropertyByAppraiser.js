// pages/api/deleteArchivedProperty.js
import axios from "axios";


export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { propertyId } = req.query;

    if (!propertyId) {
      return res.status(400).json({ success: false, message: "Missing propertyId in query" });
    }

    const token = req.headers.authorization;

    if (!token || !user.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const responseData = await axios.delete(
      `${domain}/Property/DeleteArchivePropertyByAppraiser`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          userid: user.userId,
          PropertyId: propertyId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Archived property deleted successfully",
      data: responseData.data,
    });
  } catch (err) {
    console.error("Delete Archive Property Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to delete archived property";

      return res.status(statusCode).json({ success: false, message: errorMessage });
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
