export const handleResponseData = (loginResponse) => {
  let redirectionUrl = "";
  localStorage.setItem("user", JSON.stringify(loginResponse));
  if (loginResponse.userType === 1) {
    redirectionUrl = "/my-dashboard";
  } else if (loginResponse.userType === 2) {
    redirectionUrl = "/appraiser-dashboard";
  }

  return redirectionUrl;
};
