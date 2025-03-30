import axios from "axios";
import CryptoJS from "crypto-js";


 async function handler (request,response) {

    const decryptionKey = process.env.CRYPTO_SECRET_KEY;
    const domain = process.env.BACKEND_DOMAIN2;

  try {
    const token = request.headers.authorization;


    const userResponse = await axios.get(`${domain}/com.appraisalland.Plan/GetAllPlans`,
    {
        headers: {
          Authorization:token,
          "Content-Type":"application/json"
        }
      });
    const users = userResponse.data;


    return response.status(200).json({msg:"OK",data : users});
  } catch (err) {
    
    if (err.response) {
      // If the error is from an axios request (e.g., HTTP 4xx or 5xx error)
      const axiosError = err.response.data;
      const statusCode = err.response.status;
      console.error(statusCode,axiosError.message); // Log the error for debugging

      return response.status(statusCode).json({ error: axiosError.message });
    } else {
      // Handle other types of errors
      return response.status(500).json({ error: "Internal Server Error" });
    }

  }
}
 
export default handler;

