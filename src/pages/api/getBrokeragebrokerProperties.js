import axios from "axios";

async function handler(request, response) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  try {
    const token = request.headers.authorization;
    const userId = request.query.userId;

    const userResponse = await axios.get(
      `${domain}/com.appraisalland.Brokerage/getPropertiesByBrokerage`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params:{
          brokerageId:userId
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
