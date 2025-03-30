import ReCAPTCHA from "react-google-recaptcha";
import Image from "next/image";

// function onChange(value) {
//   console.log("Captcha value:", value);
// }

const Form = ({ userData, chnageShowCardHandler }) => {
  const userData_01 = userData.userType; // Example data, replace with actual data

  const renderUserType = (userData_01) => {
    if (userData_01 === 2) {
      return "Mortgage Brokerage Company";
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

  return (
    <form className="contact_form" action="#" style={{ borderRadius: "5px" }}>
      <div className="row">
        <div className="col-lg-3 text-center">
          <div className="wrap-custom-file mt-3 mb-5">
            <img
              style={{ borderRadius: "50%" }}
              src={userData?.brokerage_Details?.profileImage}
              alt="Uploaded Image"
            />
          </div>
          {/* End .col */}
        </div>
        <div className="col-lg-9">
          <div className="row mb-2">
            <div className="col-lg-11">
              <span style={{ fontWeight: "bold" }}>
                <h3 className="text-center text-color">
                  {" "}
                  Mortgage Brokerage Details{" "}
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
                  </thead>{" "}
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
                        <span className="text-start">Name</span>
                      </td>
                      <td className="table-value">
                        {" "}
                        {userData?.brokerage_Details?.firstName}{" "}
                        {userData?.brokerage_Details?.middleName}{" "}
                        {userData?.brokerage_Details?.lastName}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start"> Brokerage Name </span>
                      </td>
                      <td className="table-value">
                        {userData?.brokerage_Details?.brokerageName}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start"> Email Address</span>
                      </td>
                      <td className="table-value">
                        {userData?.brokerage_Details?.emailId}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start"> Phone Number</span>
                      </td>
                      <td className="table-value">
                          {formatPhoneNumber(
                          userData?.brokerage_Details?.phoneNumber
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start"> Cell Number</span>
                      </td>
                      <td className="table-value">
                      {userData?.brokerage_Details?.cellnumber
                          ? formatPhoneNumber(
                              userData?.brokerage_Details?.cellnumber
                            )
                          : "N.A."}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">
                          {" "}
                          Mortgage Broker Licence No.
                        </span>
                      </td>
                      <td className="table-value">
                        {userData?.brokerage_Details?.mortageBrokerLicNo}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">
                          Mortgage Brokerage Licence No.
                        </span>
                      </td>
                      <td className="table-value">
                        {userData?.brokerage_Details?.mortageBrokerageLicNo}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">Address</span>
                      </td>
                      <td className="table-value">
                        {" "}
                        {userData?.brokerage_Details?.streetNumber}{" "}
                        {userData?.brokerage_Details?.streetName}{" "}
                        {userData?.brokerage_Details?.apartmentNo}{" "}
                        {userData?.brokerage_Details?.city}{" "}
                        {userData?.brokerage_Details?.province}{" "}
                        {userData?.brokerage_Details?.postalCode}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">Assistant#1 Name</span>
                      </td>
                      <td className="table-value">
                        {userData?.brokerage_Details?.assistantFirstName ||
                        userData?.brokerage_Details?.assistantLastName
                          ? `${
                              userData?.brokerage_Details?.assistantFirstName ||
                              ""
                            } ${
                              userData?.brokerage_Details?.assistantLastName ||
                              ""
                            }`.trim()
                          : "N.A."}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">Assistant#1 Email</span>
                      </td>
                      <td className="table-value">
                        {userData?.brokerage_Details?.assistantEmailAddress
                          ? userData?.brokerage_Details?.assistantEmailAddress
                          : "N.A."}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">Assistant#1 Phone</span>
                      </td>
                      <td className="table-value">
                      {userData?.brokerage_Details?.assistantPhoneNumber
                          ? formatPhoneNumber(
                              userData?.brokerage_Details?.assistantPhoneNumber
                            )
                          : "N.A."}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">Assistant#2 Name</span>
                      </td>
                      <td className="table-value">
                        {userData?.brokerage_Details?.assistantTwoFirstName ||
                        userData?.brokerage_Details?.assistantTwoLastName
                          ? `${
                              userData?.brokerage_Details
                                ?.assistantTwoFirstName || ""
                            } ${
                              userData?.brokerage_Details
                                ?.assistantTwoLastName || ""
                            }`.trim()
                          : "N.A."}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">Assistant#2 Email</span>
                      </td>
                      <td className="table-value">
                        {userData?.brokerage_Details?.assistantTwoEmailAddress
                          ? userData?.brokerage_Details
                              ?.assistantTwoEmailAddress
                          : "N.A."}{" "}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-header">
                        <span className="text-start">Assistant#2 Phone</span>
                      </td>
                      <td className="table-value">
                      {userData?.brokerage_Details?.assistantTwoPhoneNumber
                          ? formatPhoneNumber(
                              userData?.brokerage_Details?.assistantTwoPhoneNumber
                            )
                          : "N.A."}{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center mt-2">
                <button
                  className="btn btn-color"
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
