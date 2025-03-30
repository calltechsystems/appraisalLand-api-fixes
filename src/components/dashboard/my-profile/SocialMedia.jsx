import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileForm = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    assistantFirstName: "",
    assistantLastName: "",
    assistantPhoneNumber: "",
    assistantEmail: "",
  });

  // State for errors
  const [errors, setErrors] = useState({});

  // Refs for scrolling to invalid inputs
  const inputRefs = {
    firstName: useRef(null),
    lastName: useRef(null),
    phoneNumber: useRef(null),
    email: useRef(null),
    assistantFirstName: useRef(null),
    assistantLastName: useRef(null),
    assistantPhoneNumber: useRef(null),
    assistantEmail: useRef(null),
  };

  // Validation rules
  const validationRules = {
    name: /^[A-Za-z]{3,10}$/, // Letters only, 3-10 characters
    phone: /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };

  // Generic validation function
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
      case "assistantFirstName":
      case "assistantLastName":
        return validationRules.name.test(value);
      case "phoneNumber":
      case "assistantPhoneNumber":
        return validationRules.phone.test(value);
      case "email":
      case "assistantEmail":
        return validationRules.email.test(value);
      default:
        return value.trim() !== "";
    }
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      if (!validateField(field, formData[field])) {
        newErrors[field] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);
    if (!isValid) {
      const firstInvalidField = Object.keys(newErrors)[0];
      if (inputRefs[firstInvalidField]?.current) {
        inputRefs[firstInvalidField].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        inputRefs[firstInvalidField].current.focus();
      }
    }

    return isValid;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateAllFields()) {
      toast.error("Please fix the highlighted errors!");
      return;
    }

    const payload = { ...formData };
    console.log("Submitting data:", payload);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="profile-form">
      <h2>Profile Form</h2>
      <form>
        {Object.keys(formData).map((field) => (
          <div key={field} className="form-group">
            <label htmlFor={field}>
              {field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
            <input
              type={field.includes("Email") ? "email" : "text"}
              id={field}
              name={field}
              ref={inputRefs[field]}
              value={formData[field]}
              onChange={handleInputChange}
              className={errors[field] ? "input-error" : ""}
            />
            {errors[field] && (
              <small className="error-text">
                Invalid {field.replace(/([A-Z])/g, " $1").toLowerCase()}.
              </small>
            )}
          </div>
        ))}
        <button type="button" onClick={handleSubmit} className="submit-btn">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
