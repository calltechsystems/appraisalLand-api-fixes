import { handleDownloadClick } from "./downloadFunction";

const Form = ({ userData, chnageShowCardHandler }) => {
  const userData_01 = userData.userType; // Example data, replace with actual data

  const renderUserType = (userData_01) => {
    if (userData_01 === 4) {
      return "Appraiser Company";
    } else {
      return "Unknown User Type"; // Default value if userType is not 1 or 6
    }
  };

  const formatPhoneNumber = (number) => {
    if (!number) return ""; // Handle empty input

    // Remove non-numeric characters
    const digits = number.replace(/\D/g, "");

    // Format the number as "416 123-4567"
    if (digits.length <= 3) {
      return digits; // e.g., "416"
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`; // e.g., "416 123"
    } else {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`; // e.g., "416 123-4567"
    }
  };

  const getFileNameFromS3Url = (url) => {
    if (!url) return null;

    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1].split("?")[0];

    return fileName;
  };
  
  return (
    <form className="contact_form" action="#" style={{ borderRadius: "5px" }}>
      <div className="row">
        <div className="col-lg-3 text-center">
          <div className="wrap-custom-file mt-5 mb-5">
            <img
              style={{ borderRadius: "50%" }}
              src={userData?.appraiserCompanyDetail?.profileImage || '/assets/images/home/placeholder_01.jpg'}
              alt="Uploaded Image"
            />
          </div>
          {/* End .col */}
        </div>
        <div className="col-lg-9">
          <div className="row mb-2">
            <div className="col-lg-9">
              <span style={{ fontWeight: "bold" }}>
                <h3 className="text-center text-color">
                  {" "}
                  Appraiser Company Details{" "}
                </h3>
              </span>
              {/* <hr /> */}
              <div
                className="d-flex justify-content-center"
                id="property-info-container"
              >
                <table id="table-broker-info">
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">User ID</span>
                      </td>
                      <td className="table-value"> {userData.userEmail}</td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start"> User Type</span>
                      </td>
                      <td className="table-value">
                        {renderUserType(userData_01)}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">Primary Contact Name</span>
                      </td>
                      <td className="table-value">
                        {" "}
                        {userData?.appraiserCompanyDetail?.firstName}{" "}
                        {userData?.appraiserCompanyDetail?.middleName}{" "}
                        {userData?.appraiserCompanyDetail?.lastName}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">
                          {" "}
                          Appraiser Company Name{" "}
                        </span>
                      </td>
                      <td className="table-value">
                        {
                          userData?.appraiserCompanyDetail
                            ?.appraiserCompanyName
                        }
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start"> Email Address</span>
                      </td>
                      <td className="table-value">
                        {userData?.appraiserCompanyDetail?.emailId}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start"> Phone Number</span>
                      </td>
                      <td className="table-value">
                        {formatPhoneNumber(
                          userData?.appraiserCompanyDetail?.phoneNumber
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start"> Cell Number</span>
                      </td>
                      <td className="table-value">
                        {userData?.appraiserCompanyDetail?.cellNumber
                          ? formatPhoneNumber(
                              userData?.appraiserCompanyDetail?.cellNumber
                            )
                          : "N.A."}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start"> Licence Number</span>
                      </td>
                      <td className="table-value">
                        {userData?.appraiserCompanyDetail?.licenseNumber}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start"> Lender List</span>
                      </td>
                      <td className="table-value">
                        <span className="text-start">
                          <span
                            className="text-decoration-underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) =>
                              userData?.appraiserCompanyDetail
                                ?.lenderListUrl &&
                              handleDownloadClick(
                                event,
                                userData?.appraiserCompanyDetail
                                  .lenderListUrl,
                                getFileNameFromS3Url(
                                  userData?.appraiserCompanyDetail
                                    .lenderListUrl
                                )
                              )
                            }
                            style={{
                              cursor: userData?.appraiserCompanyDetail
                                ?.lenderListUrl
                                ? "pointer"
                                : "default",
                              textDecoration: "underline",
                              color: userData?.appraiserCompanyDetail
                                ?.lenderListUrl
                                ? "blue"
                                : "black",
                              pointerEvents: userData?.appraiserCompanyDetail
                                ?.lenderListUrl
                                ? "auto"
                                : "none",
                            }}
                          >
                            {userData?.appraiserCompanyDetail?.lenderListUrl
                              ? getFileNameFromS3Url(
                                  userData?.appraiserCompanyDetail
                                    .lenderListUrl
                                )
                              : "N.A."}
                          </span>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">Address</span>
                      </td>
                      <td className="table-value">
                        {" "}
                        {userData?.appraiserCompanyDetail?.streetNumber}{" "}
                        {userData?.appraiserCompanyDetail?.streetName}{" "}
                        {userData?.appraiserCompanyDetail?.apartmentNumber}{" "}
                        {userData?.appraiserCompanyDetail?.city},{" "}
                        {userData?.appraiserCompanyDetail?.province},{" "}
                        {userData?.appraiserCompanyDetail?.postalCode}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">Office Contact Name</span>
                      </td>
                      <td className="table-value">
                        {userData?.appraiserCompanyDetail
                          ?.officeContactFirstName ||
                        userData?.appraiserCompanyDetail
                          ?.officeContactLastName
                          ? `${
                              userData?.appraiserCompanyDetail
                                ?.officeContactFirstName || ""
                            } ${
                              userData?.appraiserCompanyDetail
                                ?.officeContactLastName || ""
                            }`.trim()
                          : "N.A."}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">Office Contact Email</span>
                      </td>
                      <td className="table-value">
                        {" "}
                        {userData?.appraiserCompanyDetail?.officeContactEmail
                          ? userData?.appraiserCompanyDetail
                              ?.officeContactEmail
                          : "N.A."}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">Office Contact Phone</span>
                      </td>
                      <td className="table-value">
                        {" "}
                        {/* {userData?.appraiserCompanyDetail?.officeContactPhone} */}
                        {userData?.appraiserCompanyDetail?.officeContactPhone
                          ? formatPhoneNumber(
                              userData?.appraiserCompanyDetail
                                ?.officeContactPhone
                            )
                          : "N.A."}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center mt-2">
                <button
                  className="btn btn2 btn-color profile_edit_button_01"
                  onClick={() => chnageShowCardHandler(false)}
                >
                  <span
                    // className="flaticon-edit"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Edit Profile"
                  >
                    {" "}
                    Edit Profile
                  </span>
                </button>
              </div>
            </div>
            {/* End .col */}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;
