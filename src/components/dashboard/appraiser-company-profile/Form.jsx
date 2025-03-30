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
              src={userData?.appraiserCompany_Datails?.profileImage || '/assets/images/home/placeholder_01.jpg'}
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
                        {userData?.appraiserCompany_Datails?.firstName}{" "}
                        {userData?.appraiserCompany_Datails?.middleName}{" "}
                        {userData?.appraiserCompany_Datails?.lastName}
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
                          userData?.appraiserCompany_Datails
                            ?.appraiserCompanyName
                        }
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start"> Email Address</span>
                      </td>
                      <td className="table-value">
                        {userData?.appraiserCompany_Datails?.emailId}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start"> Phone Number</span>
                      </td>
                      <td className="table-value">
                        {formatPhoneNumber(
                          userData?.appraiserCompany_Datails?.phoneNumber
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start"> Cell Number</span>
                      </td>
                      <td className="table-value">
                        {userData?.appraiserCompany_Datails?.cellNumber
                          ? formatPhoneNumber(
                              userData?.appraiserCompany_Datails?.cellNumber
                            )
                          : "N.A."}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start"> Licence Number</span>
                      </td>
                      <td className="table-value">
                        {userData?.appraiserCompany_Datails?.licenseNumber}
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
                              userData?.appraiserCompany_Datails
                                ?.lenderListUrl &&
                              handleDownloadClick(
                                event,
                                userData?.appraiserCompany_Datails
                                  .lenderListUrl,
                                getFileNameFromS3Url(
                                  userData?.appraiserCompany_Datails
                                    .lenderListUrl
                                )
                              )
                            }
                            style={{
                              cursor: userData?.appraiserCompany_Datails
                                ?.lenderListUrl
                                ? "pointer"
                                : "default",
                              textDecoration: "underline",
                              color: userData?.appraiserCompany_Datails
                                ?.lenderListUrl
                                ? "blue"
                                : "black",
                              pointerEvents: userData?.appraiserCompany_Datails
                                ?.lenderListUrl
                                ? "auto"
                                : "none",
                            }}
                          >
                            {userData?.appraiserCompany_Datails?.lenderListUrl
                              ? getFileNameFromS3Url(
                                  userData?.appraiserCompany_Datails
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
                        {userData?.appraiserCompany_Datails?.streetNumber}{" "}
                        {userData?.appraiserCompany_Datails?.streetName}{" "}
                        {userData?.appraiserCompany_Datails?.apartmentNumber}{" "}
                        {userData?.appraiserCompany_Datails?.city},{" "}
                        {userData?.appraiserCompany_Datails?.province},{" "}
                        {userData?.appraiserCompany_Datails?.postalCode}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">Office Contact Name</span>
                      </td>
                      <td className="table-value">
                        {userData?.appraiserCompany_Datails
                          ?.officeContactFirstName ||
                        userData?.appraiserCompany_Datails
                          ?.officeContactLastName
                          ? `${
                              userData?.appraiserCompany_Datails
                                ?.officeContactFirstName || ""
                            } ${
                              userData?.appraiserCompany_Datails
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
                        {userData?.appraiserCompany_Datails?.officeContactEmail
                          ? userData?.appraiserCompany_Datails
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
                        {/* {userData?.appraiserCompany_Datails?.officeContactPhone} */}
                        {userData?.appraiserCompany_Datails?.officeContactPhone
                          ? formatPhoneNumber(
                              userData?.appraiserCompany_Datails
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
