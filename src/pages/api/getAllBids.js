// pages/api/getAppraiserQuotes.js
import axios from "axios";
import withSession from "../../utils/session/session";
import { apiResponseHandling } from "../../utils/apiResponseHandler";

export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { email } = req.query;
    const token = req.headers.authorization;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Missing email in query" });
    }

    if (!token) {
      console.log("Token not found ", token);
      return res.status(401).json({ success: false, message: "Unauthorized" });
    } else {
      console.log("Token found GetAllBids.js GetAllQutoesByAppraiserAsync");
    }

    const bidsResponse = await axios.get(
      `${domain}/com.appraisalland.Bid/GetAllQuotesByAppraiserAsync`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(bidsResponse.status).json(bidsResponse.data)

  } catch (err) {
    console.error("Get Appraiser Quotes Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to fetch quotes";

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
