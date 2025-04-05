export const apiResponseHandling = (res, response) => {
  return res.status(response.status || 200).json({ response: response.data });
};
