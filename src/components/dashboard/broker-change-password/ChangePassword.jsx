import { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { encryptionData } from "../../../utils/dataEncryption";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const ChangePassword = ({ setIsLoading }) => {
  const oldPasswordRef = useRef("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [showCriteria, setShowCriteria] = useState(false); // New state
  const [validationErrors, setValidationErrors] = useState({});
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const router = useRouter();

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const checkPasswordStrength = (password) => {
    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const specialChar = /[!@#$%^&*]/.test(password);

    setPasswordCriteria({ length, uppercase, lowercase, number, specialChar });

    if (length && uppercase && lowercase && number && specialChar)
      return "Strong";
    if (length && (uppercase || lowercase) && (number || specialChar))
      return "Moderate";
    return "Weak";
  };

  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordStrength(checkPasswordStrength(password));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== newPassword) {
      setValidationErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
    } else {
      setValidationErrors((prev) => {
        const { confirmPassword, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateFields = () => {
    const errors = {};
    if (!oldPasswordRef.current.value)
      errors.oldPassword = "Old Password is required.";
    if (!newPassword) errors.newPassword = "New Password is required.";
    if (!confirmPassword)
      errors.confirmPassword = "Confirm Password is required.";
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  const submitHandler = async () => {
    setValidationErrors({});
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const email = userData.userEmail;
    const oldPassword = oldPasswordRef.current.value;

    try {
      const payload = {
        email,
        oldPassword,
        newPassword,
        token: userData.token,
      };
      const encryptedData = encryptionData(payload);
      setIsLoading(true);
      toast.loading("Changing the password");

      const res = await axios.post("/api/changePassword", encryptedData);
      toast.dismiss();
      const { success, message } = res.data?.response;
      if (success) {
        toast.success(message);
        localStorage.removeItem("user");
        router.push("/login");
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.dismiss();
      if (err.response?.status === 401) {
        toast.error("Invalid old password. Please try again.");
      } else {
        toast.error(
          err.response?.data?.error || "An unexpected error occurred."
        );
      }
      setIsLoading(false);
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="row">
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <div
            id="collapseThree"
            className="accordion-collapse collapse show"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div className="row">
                <div className="col-lg-6 col-xl-3">
                  <div className="my_profile_setting_input form-group">
                    <label
                      htmlFor="oldPassword"
                      style={{ paddingBottom: "10px", color: "#2e008b" }}
                    >
                      Old Password
                    </label>
                    <input
                      type={passwordVisibility.old ? "text" : "password"}
                      className="form-control"
                      id="oldPassword"
                      ref={oldPasswordRef}
                    />
                    {validationErrors.oldPassword && (
                      <small className="text-danger">
                        {validationErrors.oldPassword}
                      </small>
                    )}
                  </div>
                </div>
                <div
                  className="col-lg-1"
                  style={{
                    width: "fit-content",
                    marginTop: "37px",
                    marginLeft: "-15px",
                  }}
                  onClick={() => togglePasswordVisibility("old")}
                >
                  <div
                    className={`input-group-text ${passwordVisibility.old ? "eye-active" : "eye-inactive"
                      }`}
                    style={{
                      cursor: "pointer",
                      transition: "color 0.3s, transform 0.3s",
                    }}
                  >
                    {passwordVisibility.old ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>

                <div className="col-lg-6 col-xl-3">
                  <div className="my_profile_setting_input form-group">
                    <label
                      htmlFor="newPassword"
                      style={{ paddingBottom: "10px", color: "#2e008b" }}
                    >
                      New Password
                    </label>
                    <input
                      type={passwordVisibility.new ? "text" : "password"}
                      className="form-control"
                      id="newPassword"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      onFocus={() => setShowCriteria(true)} // Show criteria on focus
                      onBlur={() => setShowCriteria(false)} // Hide criteria on blur
                    />
                    {passwordStrength && (
                      <small
                        className={`fw-bold text-${passwordStrength === "Weak" ? "danger" : "success"
                          }`}
                      >
                        Strength: {passwordStrength}
                      </small>
                    )}
                    {showCriteria && ( // Show criteria only when focused
                      <ul className="password-suggestions">
                        <li
                          className={
                            passwordCriteria.length
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          At least 8 characters
                        </li>
                        <li
                          className={
                            passwordCriteria.uppercase
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          At least 1 uppercase letter
                        </li>
                        <li
                          className={
                            passwordCriteria.lowercase
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          At least 1 lowercase letter
                        </li>
                        <li
                          className={
                            passwordCriteria.number
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          At least 1 number
                        </li>
                        <li
                          className={
                            passwordCriteria.specialChar
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          At least 1 special character (!@#$%^&*)
                        </li>
                      </ul>
                    )}
                    {validationErrors.newPassword && (
                      <small className="text-danger">
                        {validationErrors.newPassword}
                      </small>
                    )}
                  </div>
                </div>

                <div
                  className="col-lg-1"
                  style={{
                    width: "fit-content",
                    marginTop: "37px",
                    marginLeft: "-15px",
                  }}
                  onClick={() => togglePasswordVisibility("new")}
                >
                  <div
                    className={`input-group-text ${passwordVisibility.new ? "eye-active" : "eye-inactive"
                      }`}
                    style={{
                      cursor: "pointer",
                      transition: "color 0.3s, transform 0.3s",
                    }}
                  >
                    {passwordVisibility.new ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>

                <div className="col-lg-6 col-xl-3">
                  <div className="my_profile_setting_input form-group">
                    <label
                      htmlFor="confirmPassword"
                      style={{ paddingBottom: "10px", color: "#2e008b" }}
                    >
                      Confirm New Password
                    </label>
                    <input
                      type={passwordVisibility.confirm ? "text" : "password"}
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                    {validationErrors.confirmPassword && (
                      <small className="text-danger">
                        {validationErrors.confirmPassword}
                      </small>
                    )}
                  </div>
                </div>
                <div
                  className="col-lg-1"
                  style={{
                    width: "fit-content",
                    marginTop: "37px",
                    marginLeft: "-15px",
                  }}
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  <div
                    className={`input-group-text ${passwordVisibility.confirm ? "eye-active" : "eye-inactive"
                      }`}
                    style={{
                      cursor: "pointer",
                      transition: "color 0.3s, transform 0.3s",
                    }}
                  >
                    {passwordVisibility.confirm ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <div className="mt-5">
                    <button
                      className="btn btn-color"
                      onClick={submitHandler}
                      style={{ width: "120px" }}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
