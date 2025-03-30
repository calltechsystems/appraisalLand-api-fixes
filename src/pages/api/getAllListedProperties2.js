import axios from "axios";
import CryptoJS from "crypto-js";

async function handler(request, response) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  try {
    const token = request.headers.authorization;
    const UserID = request.query.UserID;

    const userResponse = await axios.get(
      `${domain}/com.appraisalland.Property/getPropertyByUserId`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params:{
          UserID : UserID
        }
      }
    );

    return response.status(200).json({ msg: "OK", data: userResponse.data });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;
