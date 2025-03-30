import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import Captcha from "../common/Captcha";
import { encryptionData } from "../../utils/dataEncryption";

const Form = ({
  setModalIsOpen,
  setModalIsOpenError,
  setErrorMessage,
  prefilledData,
}) => {
  const { email: prefilledEmail, userType: prefilledUserType } =
    prefilledData || {};

  const [change, setChange] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [passwordRegister, setPasswordRegister] = useState("");
  const [passwordRegisterVerified, setPasswordRegisterVerified] =
    useState(false);
  const [checkRegisterConfirm, setCheckRegisterConfirm] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible_01, setPasswordVisible_01] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const emailRegisterRef = useRef();
  const passwordRegisterRef = useRef();
  const userTypeRef = useRef();

  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibility_01 = () => {
    setPasswordVisible_01(!passwordVisible_01);
  };

  const checkPasswordRegisterHandler = (event) => {
    setPasswordRegister(event.target.value);
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    setPasswordRegisterVerified(passwordRegex.test(event.target.value));
  };

  const checkConfirmHandler = () => {
    const confirmPassword = passwordRegisterRef.current.value;
    setCheckRegisterConfirm(passwordRegister === confirmPassword);
  };

  const registerHandler = (event) => {
    event.preventDefault();

    if (!captchaVerified) {
      setChange(true);
      setErrorMessage("Please fill the Captcha!");
      setModalIsOpenError(true);
      return;
    }

    const data = {
      email: prefilledEmail,
      password: passwordRegister,
      userType: Number(prefilledUserType),
    };

    const encryptedData = encryptionData(data);
    setLoading(true);
    toast.loading("Registering user...");

    axios
      .post("/api/signUpUser", encryptedData)
      .then(() => {
        setModalIsOpen(true);
      })
      .catch((err) => {
        let statusText = err.response?.statusText || "Internal server error.";
        setErrorMessage(statusText);
        setModalIsOpenError(true);
      })
      .finally(() => {
        setLoading(false);
        toast.dismiss();
      });
  };

  return (
    <div className="row mt-4">
      <div className="col-lg-6 col-xl-6">
        <Image
          width={357}
          height={659}
          className="img-fluid w100 h-100 cover mb-5 mt-5"
          src="/assets/images/home/placeholder-concept-illustration_114360-4983.avif"
          alt="Register Illustration"
        />
      </div>
      <div className="col-lg-6">
        <form onSubmit={registerHandler}>
          <div className="heading text-center">
            <h3>Signup to your account</h3>
          </div>

          <div className="col-lg-12">
            <div className="form-group input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                ref={emailRegisterRef}
                defaultValue={prefilledEmail}
                readOnly
              />
            </div>
          </div>

          <div className="col-lg-12">
            <div className="form-group input-group ui_kit_select_search mb-3">
              <select
                className="form-select"
                ref={userTypeRef}
                defaultValue={prefilledUserType}
                disabled
              >
                <option value="">Choose User...</option>
                <option value={1}>Mortgage Broker</option>
                <option value={2}>Mortgage Brokerage</option>
                <option value={3}>Appraiser</option>
                <option value={4}>Appraiser Company</option>
              </select>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="form-group input-group">
              <input
                type={passwordVisible ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                value={passwordRegister}
                onChange={checkPasswordRegisterHandler}
              />
              <div className="input-group-prepend">
                <div
                  className="input-group-text m-1"
                  onClick={togglePasswordVisibility}
                >
                  <FaEye />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="form-group input-group">
              <input
                type={passwordVisible_01 ? "text" : "password"}
                className="form-control"
                placeholder="Re-enter Password"
                ref={passwordRegisterRef}
                onChange={checkConfirmHandler}
              />
              <div className="input-group-prepend">
                <div
                  className="input-group-text m-1"
                  onClick={togglePasswordVisibility_01}
                >
                  <FaEye />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <Captcha
              verified={setCaptchaVerified}
              change={change}
              setChange={setChange}
            />
          </div>

          <div className="form-group form-check custom-checkbox mb-3">
            <input type="checkbox" className="form-check-input" required />
            <label className="form-check-label">
              I have read and accept the{" "}
              <Link href="/terms-and-privacy" className="text-primary">
                Terms and Privacy Policy
              </Link>
              .
            </label>
          </div>

          <button type="submit" className="btn btn-log w-100 btn-thm">
            {isLoading ? "Registering..." : "Sign Up"}
          </button>

          <div className="text-center mt-3">
            Already have an Account?{" "}
            <Link href="/login" className="text-thm">
              Log In!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
