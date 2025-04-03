export const handleResponseData = (loginResponse) => {
  let redirectionUrl = "";
  console.log({loginResponse})
  localStorage.setItem("user", JSON.stringify(loginResponse));
  if (loginResponse.userType === 7) {
    redirectionUrl = "/appraiser-company-dashboard-admin";
  } else if (loginResponse.userType === 1 || loginResponse.userType === 6) {
    redirectionUrl = "/my-dashboard";
  } else if (loginResponse.userType === 4) {
    redirectionUrl = "/appraiser-company-dashboard";
  } else if (loginResponse.userType === 3 || loginResponse.userType === 5) {
    redirectionUrl = "/appraiser-dashboard";
  } else if (loginResponse.userType === 2) {
    redirectionUrl = "/brokerage-dashboard";
  }
  return redirectionUrl;
};
