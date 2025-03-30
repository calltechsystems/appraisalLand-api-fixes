import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import axios from "axios";
import { encryptionData } from "../../utils/dataEncryption";
import Captcha from "../common/Captcha";
import { FaEye } from "react-icons/fa";

const Form = ({ setModalIsOpen, setisLoading }) => {
  const [captchaVerfied, setCaptchaVerified] = useState(false);
  const [reloadOption, setReloadOption] = useState(false);
  const [change, setChange] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [passwordRegister, setPasswordRegister] = useState(""); // State variable to store the password value
  const [passwordRegisterVerified, setPasswordRegisterVerified] =
    useState(false);
  const [checkRegisterConfrim, setCheckRegisterConfrim] = useState(false);
  const router = useRouter();
  const [show, setShow] = useState(false);
  const tokenRef = useRef("");
  const newPassword = useRef("");
  const newPasswordConfirm = useRef("");
  const emailRef = useRef("");
  const passwordRegisterRef = useRef("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible_01, setPasswordVisible_01] = useState(false);

  const onCloseHandler = () => {
    console.log("in");
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const togglePasswordVisibility_01 = () =>
    setPasswordVisible_01(!passwordVisible_01);

  const [isOtpSent, setIsOtpSent] = useState(false); // New state to disable button

  const onClickHandler = () => {
    const email = emailRef.current.value;
    if (email === "") {
      toast.error("Registered email is required !");
    } else {
      const formData = {
        email: email,
      };
      setisLoading(true);
      const payload = encryptionData(formData);
      toast.loading("Sending the otp to this email");
      axios
        .post("/api/sendResetToken", payload)
        .then((res) => {
          toast.dismiss();
          setShow(true);
          setisLoading(false);
          setIsOtpSent(true); // Disable button after OTP is sent
          // toast.success("Sent Successfully");
          setModalIsOpen(true);
        })
        .catch((err) => {
          toast.dismiss();
          // toast.success("Sent Successfully");
          setisLoading(false);
          setModalIsOpen(true);
          // toast.error("Try again");
        });
    }
  };

  const [isFocused, setIsFocused] = useState(false);
  const [is2Focused, setIs2Focused] = useState(false);

  const labelStyle = {
    position: "absolute",
    top: isFocused ? "-30px" : "-20px",
    left: "0",
    transition: "top 0.3s ease, font-size 0.3s ease",
    fontSize: isFocused ? "12px" : "10px",
    color: isFocused ? "green" : "inherit",
  };

  const onSubmitHandler = () => {
    setisLoading(true);
    const email = emailRef.current.value;
    const newPasswordValue = newPassword.current.value;
    const newPasswordConfirmValue = newPasswordConfirm.current.value;
    const token = tokenRef.current.value;

    if (!email) {
      toast.error("Registered email should be filled!");
      setisLoading(false);
      return;
    }
    if (!token) {
      toast.error("Please provide the OTP!");
      setisLoading(false);
      return;
    }
    if (!newPasswordValue) {
      toast.error("Password cannot be empty!");
      setisLoading(false);
      return;
    }
    if (!newPasswordConfirmValue) {
      toast.error("Confirm password cannot be empty!");
      setisLoading(false);
      return;
    }
    if (newPasswordValue !== newPasswordConfirmValue) {
      toast.error("Passwords do not match!");
      setisLoading(false);
      return;
    }

    const formData = {
      email,
      newPassword: newPasswordValue,
      token,
    };

    console.log("Submitting Form Data:", formData);

    const payload = encryptionData(formData);
    toast.loading("Resetting password...");

    axios
      .post("/api/resetForgotPassword", payload)
      .then((res) => {
        toast.dismiss();
        setShow(true);
        toast.success("Password set successfully!");
        router.push("/login");
      })
      .catch((err) => {
        toast.dismiss();
        setisLoading(false);
        const errorMessage =
          err?.response?.data?.error || "Something went wrong. Try again!";
        toast.error(errorMessage);
      });
  };

  // const onSubmitHnadler = () => {
  //   setisLoading(true);
  //   const email = emailRef.current.value;
  //   const newPasswordRef = newPassword.current.value;
  //   const newPasswordConfirmRef = newPasswordConfirm.current.value;
  //   const token = tokenRef.current.value;
  //   if (email === "") {
  //     toast.error("Registered email should be filled !");
  //   }
  //   if (token === "") {
  //     toast.error("Please provide the otp !");
  //   }
  //   if (newPasswordRef !== newPasswordConfirmRef) {
  //     toast.error("provide the same password");
  //   } else {
  //     const formData = {
  //       email: email,
  //       newPassword: newPasswordRef,
  //       token: token,
  //     };

  //     console.log(formData);

  //     const payload = encryptionData(formData);
  //     toast.loading("Reseting password ....");
  //     axios
  //       .post("/api/resetForgotPassword", payload)
  //       .then((res) => {
  //         toast.dismiss();
  //         setShow(true);
  //         toast.success("Password set Successfully");
  //         router.push("/login");
  //       })
  //       .catch((err) => {
  //         toast.dismiss();
  //         toast.error("Try again");
  //       });
  //   }
  // };

  const resentOTPHnadler = () => {
    const email = emailRef.current.value;
    if (email === "") {
      toast.error("Registered email should be filled !");
    } else {
      const formData = {
        email: email,
      };

      const payload = encryptionData(formData);
      toast.loading("Re sending the token to this email");
      axios
        .post("/api/sendResetToken", payload)
        .then((res) => {
          toast.dismiss();
          setShow(true);
          toast.success("Sent Successfully");
        })
        .catch((err) => {
          toast.dismiss();
          toast.error("Try again");
        });
    }
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

  return (
    <>
      <div className="row">
        <div className="col-lg-6">
          <Image
            width={157}
            height={300}
            className="img-fluid w100 h-90 cover"
            style={{ marginTop: "17%" }}
            src="/assets/images/home/forgot-password.avif"
            alt="login.jpg"
          />
        </div>

        <div className="col-lg-6 pt60 ">
          <div style={{ padding: "20px" }}>
            <div className="heading text-center">
              <h2>Reset your password</h2>
            </div>
            {/* End .heading */}

            <div className="input-group mb-2 mr-sm-2">
              <input
                type="email"
                className="form-control"
                ref={emailRef}
                required
                placeholder="Registered email address"
              />
              <div className="">
                <div className="button-class-close-forgot">
                  <button
                    onClick={onClickHandler}
                    className="btn btn-log w-100 btn-thm mb-0"
                    style={{ marginLeft: "5px" }}
                    disabled={isOtpSent} // Disable button after OTP is sent
                  >
                    Send OTP
                  </button>
                </div>
              </div>
            </div>
            {/* End .input-group */}

            {show && (
              <div className="input-group mb-2 mr-sm-2">
                <input
                  type="number"
                  ref={tokenRef}
                  className="form-control mb-2"
                  required
                  placeholder="Enter OTP"
                />
                <div className="input-group-prepend">
                  {/* <div className="input-group-text">
                  <i className="flaticon-user"></i>
                </div> */}
                </div>
              </div>
            )}
            {/* End .input-group */}

            {show && (
              <div className="input-group mb-2 mr-sm-2">
                <input
                  type={passwordVisible ? "text" : "password"} // Conditionally set the input type
                  ref={newPassword}
                  className="form-control mb-2"
                  required
                  placeholder="New password"
                  onChange={(e) => checkPasswordRegisterHandler(e)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  maxLength={15}
                  minLength={8}
                />
                <div
                  className="input-group-text m-1"
                  style={{
                    marginTop: "5px",
                    cursor: "pointer",
                    border: "1px solid black",
                    borderRadius: "5px",
                  }}
                  onClick={togglePasswordVisibility}
                >
                  <FaEye />
                </div>
              </div>
            )}

            {show && (
              <div className="input-group mb-2 mr-sm-2">
                <label
                  htmlFor="passwordInput"
                  style={labelStyle}
                  className="m-2"
                >
                  Password must have a A-Z,a-z,0-9,!@#$%^& a & 8 - 15 characters
                  long.
                </label>
                <input
                  type={passwordVisible_01 ? "text" : "password"} // Conditionally set the input type
                  ref={newPasswordConfirm}
                  onChange={(e) => checkConfirmHandler(e)}
                  onFocus={() => setIs2Focused(true)}
                  onBlur={() => setIs2Focused(false)}
                  maxLength={15}
                  minLength={8}
                  className="form-control mb-2 mt-2"
                  required
                  placeholder="Confirm password"
                />
                <div
                  className="input-group-text m-1"
                  style={{
                    right: "px",
                    marginTop: "5px",
                    cursor: "pointer",
                    border: "1px solid black",
                    borderRadius: "5px",
                  }}
                  onClick={togglePasswordVisibility_01}
                >
                  <FaEye />
                </div>
              </div>
            )}

            {show && (
              <div className="col-12">
                <div>
                  {/* {captchaVerfied ? (
                  ""
                ) : (
                  <label
                    className="form-check-label form-check-label"
                    htmlFor="remeberMe"
                    style={{ color: "red" }}
                  >
                    Captcha doesnt match
                  </label>
                )} */}
                  {/* <Captcha
                    verified={setCaptchaVerified}
                    reload={reloadOption}
                    change={change}
                    setChange={setChange}
                  /> */}
                </div>
              </div>
            )}

            {/* End .input-group */}

            {show && (
              <button
                type="submit"
                onClick={onSubmitHandler}
                className="btn btn-log w-100 btn-thm"
              >
                Submit
              </button>
            )}
            {/* login button */}
            <div
              className="heading text-center"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
                // paddingLeft: "30%",
              }}
            >
              <div>
                <p className="text-center" style={{ fontSize: "16px" }}>
                  {/* Already have an Account?{" "} */}
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
                  {/* Log In ! */}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
