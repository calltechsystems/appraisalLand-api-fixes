import axios from "axios";
import { getPRODUCTIONUrl } from "../../utils/productionVarFile";

async function handler(request, response) {
  const domain = getPRODUCTIONUrl(); 
  try {
    const token = request.headers.authorization;
    const userId = request.query.userId;

    const userResponse = await axios.get(
      `${domain}/com.appraisalland.Payments/getSubcription`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          userId: userId,
        },
      }
    );

    const users = userResponse.data;

    return response.status(200).json({ msg: "OK", data: users });
  } catch (err) {
    if (err.response) {
      const axiosError = err.response.data;
      const statusCode = err.response.status;
      console.error(statusCode, axiosError.message);

      return response.status(statusCode).json({ error: axiosError.message });
    } else {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default handler;
