import axios from "axios";

export default async function handler(req, res) {
  const domain = process.env.BACKEND_DOMAIN2;
  
  const token = req.headers.authorization;
  console.log("Token", token);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { emailId, noOfProperties } = req.body;

  if (!emailId || !noOfProperties) {
    return res.status(400).json({ error: "Missing emailId or noOfProperties" });
  }

  try {
    const response = await axios.post(
      `${domain}/com.appraisalland.Admin/addTopUpByAdmin`,
      { emailId, noOfProperties }, // Pass data in the body
      {
        headers: {
          Authorization: token, // Add the token here
          "Content-Type": "application/json", // Ensure proper content type
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      error: "Failed to add top-up",
      details: error.response?.data || error.message,
    });
  }
}
