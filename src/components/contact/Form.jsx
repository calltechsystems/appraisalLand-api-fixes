import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
import { encryptionData } from "../../utils/dataEncryption";
import axios from "axios";

const Form = () => {
  const [verified, setVerified] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const submitHnadler = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (
      !firstName ||
      !lastName ||
      !emailAddress ||
      !phoneNumber ||
      !subject ||
      !description ||
      !verified
    ) {
      toast.error("All required field must be filled!");
    } else {
      const payload = {
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        phoneNumber: phoneNumber,
        company: company,
        state: state,
        subject: subject,
        userLoggedIn: userData ? true : false,
        description: description,
        token: userData?.token,
      };

      const encryptedBody = encryptionData(payload);
      toast.loading("Submitting the response...");
      axios
        .post("/api/contactUs", encryptedBody, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          toast.dismiss();
          toast.success("Successfully submitted !! Thankyou for reaching us!!");
          window.location.reload();
        })
        .catch((err) => {
          toast.dismiss();
          toast.error(err.response.data.error);
        });
    }
  };

  function onChange(value) {
    console.log("Captcha value:", value);
    setVerified(true);
  }

  // const [phoneNumber, setPhoneNumber] = useState("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Allow only numeric input
    const numericValue = inputValue.replace(/\D/g, "");

    // Restrict to 10 digits
    const truncatedValue = numericValue.slice(0, 10);
    if (truncatedValue.length === 10) {
      setPhoneNumber(truncatedValue);
    }

    setPhoneNumber(truncatedValue);
  };

  return (
    <div className="contact_form">
      <div className="row">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-md-6">
              <div className="row form-group">
                <div className="col-lg-4">
                  <label
                    htmlFor="first-name"
                    className="mt-3 text-dark fw-bold"
                  >
                    First Name <span class="req-btn">*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    id="form_name"
                    name="form_name"
                    className="form-control"
                    required="required"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    maxLength={30}
                    style={{
                      // paddingTop: "15px",
                      // paddingBottom: "15px",
                      backgroundColor: "#E8F0FE",
                      // //color: "white",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row form-group">
                <div className="col-lg-4">
                  <label
                    htmlFor="first-name"
                    className="mt-3 text-dark fw-bold"
                  >
                    Last Name <span class="req-btn">*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    id="form_name"
                    name="form_name"
                    className="form-control"
                    required="required"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    maxLength={30}
                    style={{
                      // paddingTop: "15px",
                      // paddingBottom: "15px",
                      backgroundColor: "#E8F0FE",
                      // //color: "white",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="row">
            <div className="col-md-6">
              <div className="row form-group">
                <div className="col-lg-4">
                  <label
                    htmlFor="first-name"
                    className="mt-3 text-dark fw-bold"
                  >
                    Email Address<span class="req-btn">*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    id="form_email"
                    name="form_email"
                    className="form-control required email"
                    required="required"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    maxLength={30}
                    style={{
                      // paddingTop: "15px",
                      // paddingBottom: "15px",
                      backgroundColor: "#E8F0FE",
                      // //color: "white",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row form-group">
                <div className="col-lg-4">
                  <label
                    htmlFor="first-name"
                    className="mt-3 text-dark fw-bold"
                  >
                    Phone No. <span class="req-btn">*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    id="form_phone"
                    name="form_phone"
                    className="form-control"
                    required="required"
                    type="number"
                    value={phoneNumber}
                    onChange={handleInputChange}
                    pattern="\d{1,10}"
                    style={{
                      // paddingTop: "15px",
                      // paddingBottom: "15px",
                      backgroundColor: "#E8F0FE",
                      // //color: "white",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="row">
            <div className="col-md-6">
              <div className="row form-group">
                <div className="col-lg-4">
                  <label
                    htmlFor="first-name"
                    className="mt-3 text-dark fw-bold"
                  >
                    Company <span class="req-btn"></span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    id="form_subject"
                    name="form_subject"
                    className="form-control required"
                    type="text"
                    maxLength={30}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{
                      // paddingTop: "15px",
                      // paddingBottom: "15px",
                      backgroundColor: "#E8F0FE",
                      // //color: "white",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row form-group">
                <div className="col-lg-4">
                  <label
                    htmlFor="first-name"
                    className="mt-3 text-dark fw-bold"
                  >
                    Province <span class="req-btn"></span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <input
                    id="form_subject"
                    name="form_subject"
                    className="form-control required"
                    type="text"
                    maxLength={30}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={{
                      // paddingTop: "15px",
                      // paddingBottom: "15px",
                      backgroundColor: "#E8F0FE",
                      // //color: "white",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="row">
            <div className="col-md-12">
              <div className="row form-group">
                <div className="col-lg-2">
                  <label
                    htmlFor="first-name"
                    className="mt-2 text-dark fw-bold"
                  >
                    Subject <span class="req-btn">*</span>
                  </label>
                </div>
                <div className="col-lg-10">
                  <input
                    id="form_subject"
                    required
                    name="form_subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="form-control required"
                    type="text"
                    maxLength={30}
                    style={{
                      // paddingTop: "15px",
                      // paddingBottom: "15px",
                      backgroundColor: "#E8F0FE",
                      // //color: "white",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="first-name" className="mb-2 text-dark fw-bold">
              First Name <span class="req-btn">*</span>
            </label>
            <input
              id="form_name"
              name="form_name"
              className="form-control"
              required="required"
              type="text"
              style={{
                // paddingTop: "15px",
                // paddingBottom: "15px",
                backgroundColor: "#E8F0FE",
                // //color: "white",
              }}
            />
          </div>
        </div> */}
        {/* End .col */}

        {/* <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="first-name" className="mb-2 text-dark fw-bold">
              Last Name <span class="req-btn">*</span>
            </label>
            <input
              id="form_name"
              name="form_name"
              className="form-control"
              required="required"
              type="text"
              style={{
                // paddingTop: "15px",
                // paddingBottom: "15px",
                backgroundColor: "#E8F0FE",
                // //color: "white",
              }}
            />
          </div>
        </div> */}
        {/* End .col */}

        {/* <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="first-name" className="mb-2 text-dark fw-bold">
              Email Address <span class="req-btn">*</span>
            </label>
            <input
              id="form_email"
              name="form_email"
              className="form-control required email"
              required="required"
              type="email"
              style={{
                // paddingTop: "15px",
                // paddingBottom: "15px",
                backgroundColor: "#E8F0FE",
                // //color: "white",
              }}
            />
          </div>
        </div> */}
        {/* End .col */}

        {/* <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="first-name" className="mb-2 text-dark fw-bold">
              Phone Number <span class="req-btn">*</span>
            </label>
            <input
              id="form_phone"
              name="form_phone"
              className="form-control required phone"
              required="required"
              type="number"
              style={{
                // paddingTop: "15px",
                // paddingBottom: "15px",
                backgroundColor: "#E8F0FE",
                // //color: "white",
              }}
            />
          </div>
        </div> */}
        {/* End .col */}

        {/* <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="first-name" className="mb-2 text-dark fw-bold">
              Company <span class="req-btn"></span>
            </label>
            <input
              id="form_subject"
              name="form_subject"
              className="form-control required"
              type="text"
              style={{
                // paddingTop: "15px",
                // paddingBottom: "15px",
                backgroundColor: "#E8F0FE",
                // //color: "white",
              }}
            />
          </div>
        </div> */}
        {/* End .col */}

        {/* <div className="col-md-6">
          <div className="form-group">
            <input
              id="form_subject"
              name="form_subject"
              className="form-control required"
              required="required"
              type="text"
              placeholder="You are"
            />
          </div>
        </div> */}
        {/* End .col */}

        {/* <div className="col-md-6">
          <div className="form-group">
            <input
              id="form_subject"
              name="form_subject"
              className="form-control required"
              required="required"
              type="text"
              placeholder="Country"
            />
          </div>
        </div> */}
        {/* End .col */}

        {/* <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="first-name" className="mb-2 text-dark fw-bold">
              Province/State <span class="req-btn"></span>
            </label>
            <input
              id="form_subject"
              name="form_subject"
              className="form-control required"
              type="text"
              style={{
                // paddingTop: "15px",
                // paddingBottom: "15px",
                backgroundColor: "#E8F0FE",
                // //color: "white",
              }}
            />
          </div>
        </div> */}
        {/* End .col */}

        {/* <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="first-name" className="mb-2 text-dark fw-bold">
              Subject <span class="req-btn">*</span>
            </label>
            <input
              id="form_subject"
              required
              name="form_subject"
              className="form-control required"
              type="text"
              style={{
                // paddingTop: "15px",
                // paddingBottom: "15px",
                backgroundColor: "#E8F0FE",
                // //color: "white",
              }}
            />
          </div>
        </div> */}
        {/* End .col */}

        {/* <div className="col-md-12">
          <div className="form-group">
            <input
              id="form_subject"
              name="form_subject"
              className="form-control required"
              required="required"
              type="text"
              placeholder="How we can help you?"
            />
          </div>
        </div> */}
        {/* End .col */}

        <div className="col-lg-12">
          <div className="form-group">
            <label htmlFor="first-name" className="mb-2 text-dark fw-bold">
              Description <span class="req-btn">*</span>
            </label>
            <span style={{ fontSize: "12px" }}>(max. 300 words)</span>
            <textarea
              id="form_message"
              name="form_message"
              className="form-control required"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              style={{
                // paddingTop: "15px",
                // paddingBottom: "15px",
                backgroundColor: "#E8F0FE",
                // //color: "white",
              }}
            ></textarea>
          </div>
          {/* End .col */}
        </div>
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-6">
              <ReCAPTCHA
                sitekey="6LcyCiApAAAAAGqvFl6wWf8hqjDjO6ZyLuK4mmFe"
                onChange={onChange}
              />
            </div>
            <div
              className="col-lg-6 form-group my_profile_setting_input"
              style={{ textAlign: "end" }}
            >
              <button
                onClick={submitHnadler}
                className="btn btn-color"
                disabled={!verified}
              >
                Submit
              </button>
            </div>
          </div>

          {/* End button submit */}
        </div>
      </div>
    </div>
  );
};

export default Form;
