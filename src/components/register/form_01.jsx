import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Captcha from "../common/Captcha";
import { encryptionData } from "../../utils/dataEncryption";
import { useRouter } from "next/router";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const Form = ({ setModalIsOpen, setModalIsOpenError, setErrorMessage }) => {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");

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

  useEffect(() => {
    // Extract query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const emailId = urlParams.get("emailId"); // Extract emailId
    const userType = urlParams.get("UserType"); // Extract UserType

    if (emailId) {
      setEmail(emailId); // Set email state
      console.log;
    }
    if (userType) {
      setUserType(userType); // Set userType state
    }
  }, []);

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

    const email = emailRegisterRef.current.value;
    const password = passwordRegister;
    const reEnterPassword = passwordRegisterRef.current.value;
    const user = userTypeRef.current.value;

    if (password !== reEnterPassword) {
      setChange(true);
      setErrorMessage("Password are meant to be same ");
      setModalIsOpenError(true);
    }
    // else if (user === "") {
    //   setChange(true);
    //   setErrorMessage("User Type must be selected for registration!!");
    //   setModalIsOpenError(true);
    // }
    // else if (!email) {
    //   setChange(true);
    //   setErrorMessage("Email cant be empty or non valid.");
    //   setModalIsOpenError(true);
    // }
    else if (!captchaVerfied) {
      setErrorMessage("Please fill the Captcha !");
      setModalIsOpenError(true);
      setChange(true);
      return;
    } else {
      const data = {
        email: email,
        password: password,
        userType: Number(user),
      };

      const encryptedData = encryptionData(data);
      setLoading(true);
      toast.loading("Registering user...");
      axios
        .post("/api/signUpUser", encryptedData)
        .then((res) => {
          console.log(res);
          const isAdding = JSON.parse(localStorage.getItem("addAppraiser"));
          toast.dismiss();
          if (isAdding) {
            const userData = isAdding.user;
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.removeItem("addAppraiser");
            router.push("/all-appraisers");
          } else {
            setModalIsOpen(true);
            // router.push("/login");
          }
        })
        .catch((err) => {
          // console.log(err);
          // return ;
          let statusText = err.response;
          if (String(err.response.request.status) === "409") {
            statusText = "The used email is already being registered!";
          }
          if (String(err.response.request.status) === "500") {
            statusText = "Server issues ,Please Try again !!";
          }
          if (String(err.response.request.status) === "403") {
            statusText = "You are being forbidden to access this !";
          }
          if (String(err.response.request.status) === "304") {
            statusText = "Not found!";
          }

          toast.dismiss();
          setErrorMessage(statusText);
          setModalIsOpenError(true);
          // toast.error(
          //   err.response.data.error
          //     ? err.response.data.error
          //     : "Internal server error.",
          //   {
          //     autoClose: 30000,
          //   }
          // );
          // router.reload();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const checkPasswordRegisterHandler = (event) => {
    setFirstClick(false);
    setPasswordRegister(event.target.value);
    const passwordRegex = /^(?=.[A-Z])(?=.[a-z])(?=.\d)(?=.[\W_]).{8,}$/;
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

  return (
    <div className="row mt-4">
      <div className="col-lg-6 col-xl-6">
        <div className="regstr_thumb">
          <Image
            width={357}
            height={659}
            className="img-fluid w100 h-100 cover mb-5 mt-5"
            src="/assets/images/home/placeholder-concept-illustration_114360-4983.avif"
            alt="regstr.jpg"
          />
        </div>
      </div>
      <div className="col-lg-6">
        <form onSubmit={registerHandler}>
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

          <div className="heading text-center">
            <h3>Signup to your account</h3>
          </div>
          {/* End .heading */}

          <div className="col-lg-12">
            <div className="form-group input-group ui_kit_select_search mb-3">
              <select
                className="form-select"
                data-live-search="true"
                data-width="100%"
                // ref={userTypeRef}
                value={userType}
                disabled // Disables the dropdown
                style={{ paddingTop: "15px", paddingBottom: "15px" }}
              >
                <option value="">Select User Type</option>
                <option value="1">Mortgage Broker</option>
                <option value="2">Mortgage Brokerage</option>
                <option value="3">Appraiser</option>
                <option value="4">Appraiser Company</option>
              </select>
            </div>
          </div>
          {/* End from-group */}

          <div className="col-lg-12">
            <div className="form-group input-group  ">
              <input
                type="email"
                className="form-control"
                // ref={emailRegisterRef}
                value={email}
                disabled // Disables the input
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
              style={{ position: "relative", marginBottom: "6px" }}
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
                  style={{ border: "1px solid #2e008b" }}
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
                <span style={{ color: "green" }}>Strong Password &#10004;</span>
              ) : !firstClick ? (
                <span style={{ color: "red" }}> Weak Password &#10008;</span>
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </div>

          <div className="col-lg-12">
            <div
              className="form-group input-group  "
              style={{ position: "", marginTop: "-10px", marginBottom: "15px" }}
            >
              <label htmlFor="passwordInput" style={labelStyle}>
                Password must have a A-Z,a-z,0-9,!@#$%^& a & 8 - 15 characters
                long.
              </label>
              <input
                type={passwordVisible_01 ? "text" : "password"} // Conditionally set the input type
                className="form-control mt-3"
                placeholder="Re enter Password"
                required
                onChange={(e) => checkConfirmHandler(e)}
                onFocus={() => setIs2Focused(true)}
                onBlur={() => setIs2Focused(false)}
                ref={passwordRegisterRef}
                style={{ paddingRight: "40px" }} // Add right padding to accommodate the button
              />
              <div className="input-group-prepend mt-3">
                <div
                  className="input-group-text m-1"
                  style={{ border: "1px solid #2e008b" }}
                  onClick={togglePasswordVisibility_01}
                  // onMouseLeave={togglePasswordVisibility_01}
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
              </div>
            )
          ) : (
            ""
          )}

          <div className="col-lg-12">
            <div>
              <Captcha
                verified={setCaptchaVerified}
                change={change}
                setChange={setChange}
              />
            </div>
          </div>
          {/* <div className="form-group form-check custom-checkbox mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              required
              id="terms"
              style={{ border: "1px solid black" }}
            />
            <label
              className="form-check-label form-check-label"
              htmlFor="terms"
            >
              I have read and accept the
              <Link
                href="assets/images/Terms & Conditions.pdf"
                target="_blank"
                className="form-check-label text-primary"
              >
                Terms and Privacy Policy
              </Link>
              ?
            </label>
          </div> */}
          {/* End .form-group */}

          <button type="submit" className="btn btn-log w-100 btn-thm">
            Sign Up
          </button>
          <div
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
                Already have an Account?{" "}
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
          </div>
          {/* login button */}
        </form>
      </div>
    </div>
  );
};

export default Form;
