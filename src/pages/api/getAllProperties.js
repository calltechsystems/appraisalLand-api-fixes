import axios from "axios";
import CryptoJS from "crypto-js";


 async function handler (request,response) {

    const decryptionKey = process.env.CRYPTO_SECRET_KEY;
    const domain = process.env.BACKEND_DOMAIN;

  try {
    const token = request.headers.authorization;
    const userId = request.query.userId;


    console.log(domain);
    const userResponse = await axios.get(`http://calltech-prod.us-east-1.elasticbeanstalk.com/api/Property/ByUserId/${userId}`,
    {
        headers: {
          Authorization:token,
          "Content-Type":"application/json"
        }
      });
    const users = userResponse.data;

    return response.status(200).json({msg:"OK",data : users});
  } catch (err) {
    console.log(err);
   return response.status(500).json({ error: "Internal Server Error" });
    

  }
}
 
export default handler;

