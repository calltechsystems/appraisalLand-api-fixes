export const extractTextContent = (cellValue) => {
  if (typeof cellValue === "number") {
    return cellValue;
  } else if (typeof cellValue === "object" && cellValue.$$typeof) {
    return extractTextContent(cellValue.props.children);
  } else {
    return String(cellValue);
  }
};

export const extractTextContentFromDate = (value) => {
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return null;
  }
  return date;
};

export const extractNumericValue = (str) => {
  const numericStr = str.replace(/[^0-9]/g, "");
  const numericValue = parseInt(numericStr, 10);

  return numericValue;
};
