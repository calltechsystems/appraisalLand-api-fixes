// pages/api/removeFromWishlist.js
import axios from "axios";


export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN;

  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { wishlistId } = req.query;

    if (!wishlistId) {
      return res.status(400).json({ success: false, message: "Missing wishlist ID" });
    }

    const userResponse = await axios.delete(
      `${domain}/com.appraisalland.Wishlist/RemoveFromWishlistAsync`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          wishlistId: wishlistId, 
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Item removed from wishlist",
      data: userResponse.data,
    });
  } catch (err) {
    console.error("Remove From Wishlist Error:", err);

    if (err.response) {
      const statusCode = err.response.status;
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? err.response.data?.message || "Unknown error"
          : "Failed to remove from wishlist";

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
