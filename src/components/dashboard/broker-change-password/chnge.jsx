import axios from "axios";
import { useRef, useState } from "react";
import { FaEye } from "react-icons/fa";
import { encryptionData } from "../../../utils/dataEncryption";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const oldPasswordRef = useRef("");
  const newPasswordRef = useRef("");
  const confirmPasswordRef = useRef("");

  const [passwordVisibility, setPasswordVisibility] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [validationErrors, setValidationErrors] = useState({}); // State for validation errors

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const router = useRouter();

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateFields = () => {
    const errors = {};
    if (!oldPasswordRef.current.value)
      errors.oldPassword = "Old Password is required.";
    if (!newPasswordRef.current.value)
      errors.newPassword = "New Password is required.";
    if (!confirmPasswordRef.current.value)
      errors.confirmPassword = "Confirm Password is required.";
    if (
      newPasswordRef.current.value &&
      confirmPasswordRef.current.value &&
      newPasswordRef.current.value !== confirmPasswordRef.current.value
    ) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  const validatePasswords = () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }

    if (newPasswordRef.current.value.length < 8) {
      toast.error("Password should be at least 8 characters long.");
      return false;
    }

    return true;
  };

  const submitHandler = async () => {
    setValidationErrors({}); // Clear previous errors

    if (!validatePasswords()) return;

    const email = userData.userEmail;
    const oldPassword = oldPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;

    try {
      const payload = {
        email,
        oldPassword,
        newPassword,
        token: userData.token,
      };

      const encryptedData = encryptionData(payload);
      toast.loading("Changing the password");

      const response = await axios.post(
        "/api/change-broker-password",
        encryptedData
      );
      if (!response) {
        toast.dismiss();
        toast.error("Failed. Please try again.");
      } else {
        toast.dismiss();
        toast.success("Password updated successfully.");
        localStorage.removeItem("user");
        router.push("/login");
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.error || "An unexpected error occurred.");
    }
  };

  return (
    <div className="row">
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              <h4>Manage Password</h4>
            </button>
          </h2>
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
                      style={{ paddingBottom: "10px", color: "#1560bd" }}
                    >
                      Old Password
                    </label>
                    <input
                      type={passwordVisibility.old ? "text" : "password"}
                      className="form-control"
                      id="oldPassword"
                      ref={oldPasswordRef}
                      style={{ paddingRight: "40px" }}
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
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                  >
                    <FaEye />
                  </div>
                </div>

                <div className="col-lg-6 col-xl-3">
                  <div className="my_profile_setting_input form-group">
                    <label
                      htmlFor="newPassword"
                      style={{ paddingBottom: "10px", color: "#1560bd" }}
                    >
                      New Password
                    </label>
                    <input
                      type={passwordVisibility.new ? "text" : "password"}
                      className="form-control"
                      id="newPassword"
                      ref={newPasswordRef}
                      style={{ paddingRight: "40px" }}
                    />
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
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                  >
                    <FaEye />
                  </div>
                </div>

                <div className="col-lg-6 col-xl-3">
                  <div className="my_profile_setting_input form-group">
                    <label
                      htmlFor="confirmPassword"
                      style={{ paddingBottom: "10px", color: "#1560bd" }}
                    >
                      Confirm New Password
                    </label>
                    <input
                      type={passwordVisibility.confirm ? "text" : "password"}
                      className="form-control"
                      id="confirmPassword"
                      ref={confirmPasswordRef}
                      style={{ paddingRight: "40px" }}
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
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                  >
                    <FaEye />
                  </div>
                </div>

                <div className="col-xl-12">
                  <div className="float-end fn-520 mt-5">
                    <button
                      className="btn btn-color w-100"
                      onClick={submitHandler}
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
