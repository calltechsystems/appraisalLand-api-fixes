import { useState, useRef } from "react";
import { encryptionData } from "../../utils/dataEncryption";
import { useRouter } from "next/router";
import { FaEnvelope, FaEye } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const Form = ({
  setModalIsOpen,
  setModalIsOpenError,
  setErrorMessage,
  closeRegisterModal,
  setCloseRegisterModal,
}) => {
  const [showhide, setShowhide] = useState("");

  const [change, setChange] = useState(false);
  const [showRegister, setRegister] = useState(true);
  const [showLabel, setShowLabel] = useState(false);
  const [captchaVerfied, setCaptchaVerified] = useState(false);

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorContent, setErrorContent] = useState("");

  const [successContent, setSuccessContent] = useState("");

  const [firstClick, setFirstClick] = useState(true);

  const handleErrorModalCancel = () => {
    setError(false);
  };

  const handleSuccessModalCancel = () => {
    setSuccess(false);
  };

  const router = useRouter();

  const [checkRegisterConfrim, setCheckRegisterConfrim] = useState(false);

  const [passwordRegisterVerified, setPasswordRegisterVerified] =
    useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false); // State variable to toggle password visibility
  const [passwordVisible_01, setPasswordVisible_01] = useState(false); // State variable to toggle password visibility
  const [passwordRegister, setPasswordRegister] = useState(""); // State variable to store the password value

  const emailRegisterRef = useRef();
  const passwordRegisterRef = useRef("");
  const userTypeRef = useRef(1);
  const checkRef = useRef("");
  const [disable, setDisable] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const [isFocused, setIsFocused] = useState(false);
  const [is2Focused, setIs2Focused] = useState(false);

  const inputStyle = {
    position: "relative",
    // width: "100%",
    // padding: "8px",
    // border: "1px solid #ccc",
    // borderRadius: "4px",
  };

  const labelStyle = {
    position: "absolute",
    top: isFocused ? "-30px" : "-20px",
    left: "0",
    transition: "top 0.3s ease, font-size 0.3s ease",
    fontSize: isFocused ? "12px" : "10px",
    color: isFocused ? "green" : "inherit",
  };

  const handleshowhide = (event) => {
    const getuser = event.target.value;
    setShowhide(getuser);
    // setUserinput(false);
  };

  // Toggle password visibility hnadler
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibility_01 = () => {
    setPasswordVisible_01(!passwordVisible_01);
  };

  const registerHandler = (event) => {
    event.preventDefault();

    setRegister(false);
    setDisable(true);

    const email = emailRegisterRef.current.value;
    const password = passwordRegister;
    const reEnterPassword = passwordRegisterRef.current.value;
    const user = userTypeRef.current.value;

    if (password !== reEnterPassword) {
      setChange(true);
      setErrorMessage("Password are meant to be same ");
      setModalIsOpenError(true);
    } else if (user === "") {
      setChange(true);
      setErrorMessage("User Type must be selected for registration!!");
      setModalIsOpenError(true);
    } else if (!email) {
      setChange(true);
      setErrorMessage("Email cant be empty or non valid.");
      setModalIsOpenError(true);
    } else {
      const userData = JSON.parse(localStorage.getItem("user"));

      const data = {
        email: email,
        password: password,
        brokerageId: userData.brokerage_Details.id,
      };

      console.log(data);

      const encryptedData = encryptionData(data);
      setLoading(true);
      toast.loading("Registering user...");
      axios
        .post("/api/registerBrokerByBrokerageCompany", encryptedData)
        .then((res) => {
          toast.dismiss();
          toast.success("Successfully added!!");
          window.location.reload();
        })
        .catch((err) => {
          const status = err.response.request.status;
          if (String(status) === String(409)) {
            toast.dismiss();
            toast.error("Email is already registered!");
          } else {
            toast.dismiss();
            toast.error(err.message);
            window.location.reload();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
    setDisable(false);
  };

  const checkPasswordRegisterHandler = (event) => {
    setFirstClick(false);
    setPasswordRegister(event.target.value);
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (passwordRegex.test(event.target.value)) {
      setPasswordRegisterVerified(true);
    } else {
      setPasswordRegisterVerified(false);
    }
  };

  const checkConfirmHandler = (event) => {
    const password = passwordRegister;
    const confirmPassword = passwordRegisterRef.current.value;

    if (password === confirmPassword) {
      setCheckRegisterConfrim(true);
    } else {
      setCheckRegisterConfrim(false);
    }
  };

  const [cancel, setCancel] = useState(false);

  return (
    <>
      {
        <div className="row mt-4">
          <div className="col-lg-12">
            <div
              onSubmit={
                cancel ? () => setCloseRegisterModal(true) : registerHandler
              }
            >
              {error && (
                <div
                  style={{
                    backgroundColor: "orangered",
                    opacity: "80%",
                    borderColor: "red",
                    borderWidth: "20px",
                    borderRadius: "4px",
                    padding: "1%",
                    justifyContent: "space-between",
                    display: "flex",
                    flexDirection: "row",
                    width: "80%",
                    marginLeft: "10%",
                  }}
                >
                  <h4 style={{ color: "white" }}>Invalid credentials</h4>
                  <div
                    className="input-group-text m-1"
                    style={{ border: "1px solid white" }}
                    onClick={handleErrorModalCancel}
                  >
                    <img
                      src="https://th.bing.com/th/id/OIP.VirRE_r48DkDvZVNoo6_agHaHZ?w=209&h=208&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                      width={"20px"}
                      height={"20px"}
                    />
                  </div>
                </div>
              )}
              {success && (
                <div
                  style={{
                    backgroundColor: "green",
                    opacity: "80%",
                    borderColor: "green",
                    borderWidth: "20px",
                    borderRadius: "4px",
                    padding: "1%",
                    justifyContent: "space-between",
                    display: "flex",
                    flexDirection: "row",
                    width: "80%",
                    marginLeft: "10%",
                  }}
                >
                  <h4 style={{ color: "white" }}>Successfully logged in</h4>
                  <div
                    className="input-group-text m-1"
                    style={{ border: "1px solid white" }}
                    onClick={handleSuccessModalCancel}
                  >
                    <h4 style={{ color: "white", marginTop: "20%" }}>OK</h4>
                  </div>
                </div>
              )}

              <div className="heading text-center"></div>
              {/* End .heading */}

              {/*  <div className="col-lg-12">
            <div className="form-group input-group ui_kit_select_search mb-3">
              <select
                required
                className="form-select"
                data-live-search="true"
                data-width="100%"
                ref={userTypeRef}
                style={{ paddingTop: "15px", paddingBottom: "15px" }}
              >
                <option value="">Choose User...</option>
                <option data-tokens="SelectRole" value={1}>
                  Mortgage Broker
                </option>
                <option data-tokens="Agent/Agency" value={3}>
                  Mortgage Brokerage
                </option>
                <option data-tokens="SingleUser" value={2}>
                  Appraiser
                </option>
                <option data-tokens="SingleUser" value={4}>
                  Appraiser Company
                </option>
              </select>
            </div>
          </div>*/}
              {/* End from-group */}

              <div className="col-lg-12">
                <div className="form-group input-group  ">
                  <input
                    type="email"
                    className="form-control"
                    required
                    placeholder="Username / Email"
                    ref={emailRegisterRef}
                  />
                  <div className="input-group-prepend">
                    <div
                      className="input-group-text m-1"
                      style={{ border: "1px solid #2e008b" }}
                    >
                      <i className="fa fa-envelope-o"></i>
                    </div>
                  </div>
                </div>
                {/* End .form-group */}
              </div>

              <div className="col-lg-12" style={{ marginTop: "10px" }}>
                <div
                  className="form-group input-group  "
                  style={{ position: "relative" }}
                >
                  {/* <label htmlFor="passwordInput" style={labelStyle}>
                Password must have a A-Z,a-z,0-9,!@#$%^& a & 8 - 15 characters
                long.
              </label> */}
                  <input
                    type={passwordVisible ? "text" : "password"} // Conditionally set the input type
                    className="form-control"
                    placeholder="Password"
                    id="passwordInput"
                    style={inputStyle}
                    required
                    value={passwordRegister}
                    onChange={(e) => checkPasswordRegisterHandler(e)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    maxLength={15}
                    minLength={8}
                  />
                  <div className="input-group-prepend">
                    <div
                      className="input-group-text m-1"
                      style={{ border: "1px solid #2e008b", cursor: "pointer" }}
                      onClick={togglePasswordVisibility}
                      // onMouseLeave={togglePasswordVisibility}
                    >
                      <FaEye />
                    </div>
                  </div>
                </div>
                {/* End .form-group */}
              </div>
              <div style={{ marginTop: "10px" }}>
                {isFocused ? (
                  passwordRegisterVerified ? (
                    <span style={{ color: "green" }}>
                      Strong Password &#10004;
                    </span>
                  ) : !firstClick ? (
                    <span style={{ color: "red" }}>
                      {" "}
                      Weak Password &#10008;
                    </span>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </div>

              <div className="col-lg-12 mb-5">
                <div
                  className="form-group input-group  "
                  style={{ position: "" }}
                >
                  <input
                    type={passwordVisible_01 ? "text" : "password"} // Conditionally set the input type
                    className="form-control"
                    placeholder="Re enter Password"
                    required
                    onChange={(e) => checkConfirmHandler(e)}
                    onFocus={() => setIs2Focused(true)}
                    onBlur={() => setIs2Focused(false)}
                    ref={passwordRegisterRef}
                    style={{ paddingRight: "40px" }} // Add right padding to accommodate the button
                  />
                  <div className="input-group-prepend">
                    <div
                      className="input-group-text m-1"
                      style={{ border: "1px solid #2e008b", cursor: "pointer" }}
                      onClick={togglePasswordVisibility_01}
                      // onMouseLeave={togglePasswordVisibility}
                    >
                      <FaEye />
                    </div>
                  </div>
                </div>
                {/* End .form-group */}
              </div>
              {is2Focused ? (
                checkRegisterConfrim ? (
                  ""
                ) : (
                  <div style={{ marginTop: "-2%" }}>
                    <span style={{ color: "red" }}>
                      {" "}
                      Both password arent same &#10008;
                    </span>{" "}
                    <label htmlFor="passwordInput" style={labelStyle}>
                      Password must have a A-Z,a-z,0-9,!@#$%^& a & 8 - 15
                      characters long.
                    </label>
                  </div>
                )
              ) : (
                ""
              )}

              <div className="col-lg-12">
                {/*{captchaVerfied ? (
              ""
            ) : (
              <label
                className="form-check-label form-check-label"
                htmlFor="remeberMe"
                style={{ color: "red" }}
              >
                Captcha doesnt match
              </label>
            )}*/}
              </div>
              <div
                className="mb-2"
                style={{ border: "2px solid #97d700" }}
              ></div>
              <div className="col-lg-12 text-center">
                <button
                  onClick={() => setCloseRegisterModal(false)}
                  className="btn btn-color w-25 m-1"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => registerHandler(e)}
                  className="btn btn-color w-25"
                >
                  Add
                </button>
              </div>
              {/*<div
            className="heading text-center"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              // paddingLeft: "30%",
            }}
          >
            <div>
              <p className="text-center" style={{ fontSize: "16px" }}>
                Already have Account?{" "}
              </p>
            </div>
            <div
              style={{
                // textDecoration: "underline",
                fontWeight: "bold",
                lineHeight: "1.5",
                marginLeft: "5px",
              }}
            >
              <Link href="/login" className="text-thm">
                Log In!
              </Link>
            </div>
          </div>*/}
              {/* login button */}

              {/* <div className="divide">
        <span className="lf_divider">Or</span>
        <hr />
      </div> */}
              {/* devider */}
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Form;
