"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { encryptionData } from "../../../utils/dataEncryption";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import toast from "react-hot-toast";
import { province } from "../create-listing/data";
import { designations } from "../create-listing/data";
import Link from "next/link";
import { handleDownloadClick } from "./downloadFunction";
import ReactInputMask from "react-input-mask";
import CommonLoader from "../../common/CommonLoader/page";
import { uploadFileToS3 } from "../../../utils/uploadToS3";

const ProfileInfo = ({
  setProfileCount,
  setShowCard,
  setModalIsOpenError,
  setModalIsOpenError_01,
}) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  let userData = JSON.parse(localStorage.getItem("user")) || {};
  const router = useRouter();

  const [SelectedImage, setSelectedImage] = useState(
    userData?.appraiserDetail?.profileImage ||
      "/assets/images/home/placeholder_01.jpg"
  );

  const hiddenStyle = { backgroundColor: "#E8F0FE", display: "none" };
  const viewStyle = { backgroundColor: "#E8F0FE", display: "block" };
  const [edit, setEdit] = useState(true);

  const [emailNotification, setEmailNotification] = useState(
    userData?.emailNotification !== null ? userData?.emailNotification : true
  );

  const [smsNotification, setSmsNotification] = useState(
    userData?.smsNotification !== null ? userData?.smsNotification : true
  );

  const [firstNameRef, setFirstNameRef] = useState(
    userData?.appraiserDetail?.firstName || ""
  );

  const [designation, setDesignation] = useState(
    userData?.appraiserDetail?.designation || ""
  );
  const [middleNameRef, setMiddleNameRef] = useState(
    userData?.appraiserDetail?.middleName || ""
  );

  const [SMSAlert, setSMSAlert] = useState(false);

  const [cellNumber, setCellNumber] = useState(
    userData?.appraiserDetail?.cellNumber || ""
  );
  const [lastNameRef, setLastNameRef] = useState(
    userData?.appraiserDetail?.lastName || ""
  );
  const [companyNameRef, setCompanyNameRef] = useState(
    userData?.appraiserDetail?.companyName || ""
  );

  const [profile, setProfile] = useState(
    userData?.appraiserDetail?.profileImage || null
  );

  const [addressLineRef, setAddressLineRef] = useState(
    userData?.appraiserDetail?.adressLine1 || ""
  );
  const [addressLineTwoRef, setAddressLineTwoRef] = useState(
    userData?.appraiserDetail?.adressLine2 || ""
  );

  const [cityRef, setCityRef] = useState(
    userData?.appraiserDetail?.city || ""
  );
  const [stateRef, setStateRef] = useState(
    userData?.appraiserDetail?.province || ""
  );
  const [zipcodeRef, setZipcodeRef] = useState(
    userData?.appraiserDetail?.postalCode || ""
  );
  const [phoneNumberRef, setPhoneNumberRef] = useState(
    userData?.appraiserDetail?.phoneNumber || ""
  );

  const [commissionRate, setCommissionRate] = useState(
    userData.appraiserDetail?.commissionRate || ""
  );

  const [emailId, setEmailId] = useState(
    userData?.appraiserDetail?.emailId || ""
  );

  const [maxNumberOfAssignedOrders, setMaxNumberOfAssignedOrders] = useState(
    userData?.appraiserDetail?.maxNumberOfAssignedOrders || ""
  );

  const [otherDesignation, setOtherDesignation] = useState("");
  // const [setODesignation, setSetODesignation] = useState(false);
  const [oDesignation, setODesignation] = useState(false); // Toggle for "Other" input

  const [selectedImage2, setSelectedImage2] = useState({
    name: userData?.appraiserDetail?.lenderListUrl ? "" : "",
    url: userData?.appraiserDetail?.lenderListUrl || "",
  });

  useEffect(() => {
    if (smsNotification === null || smsNotification === false) {
      setModalIsOpenError(true);
    } else if (emailNotification === null || emailNotification === false) {
      setModalIsOpenError_01(true);
    }
  }, [smsNotification, emailNotification]);

  const handleInputCellChange = (value) => {
    const numericValue = value.replace(/\D/g, "");

    const truncatedValue = numericValue.slice(0, 10);

    setCellNumber(truncatedValue);
  };

  const [streetName, setStreetName] = useState(
    userData?.appraiserDetail?.streetName || ""
  );
  const [streetNumber, setStreetNumber] = useState(
    userData.appraiserDetail?.streetNumber || ""
  );
  const [apartmentNo, setApartmentNo] = useState(
    userData?.appraiserDetail?.apartmentNo || ""
  );

  const handleDesignationChange = (e) => {
    const value = e.target.value;
    setDesignation(value);

    if (value === "") {
      setDesignationError(true);
      setODesignation(false); // Hide "Other" input field
    } else if (value === "Other") {
      setDesignationError(false);
      setDesignationValid(true);
      setODesignation(true); // Show "Other" input field
    } else {
      setDesignationError(false);
      setDesignationValid(true);
      setODesignation(false); // Hide "Other" input field
      setOtherDesignation(""); // Clear "Other Designation" value
    }
  };


  // Validation for input fields

  // State for errors and validation
  const [firstNameError, setFirstNameError] = useState(false);
  const [companyNameError, setCompanyNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [streetNumberError, setStreetNumberError] = useState(false);
  const [streetNameError, setStreetNameError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [zipCodeError, setZipCodeError] = useState(false);
  const [designationError, setDesignationError] = useState(false);

  // State for dropdown
  const [selectedOption, setSelectedOption] = useState("");
  const [dropdownError, setDropdownError] = useState(false);

  // validate fields
  const [firstNameValid, setFirstNameValid] = useState(false);
  const [companyNameValid, setCompanyNameValid] = useState(false);
  const [lastNameValid, setLastNameValid] = useState(false);
  const [phoneNumberValid, setPhoneNumberValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const [streetNumberValid, setStreetNumberValid] = useState(false);
  const [streetNameValid, setStreetNameValid] = useState(false);
  const [cityValid, setCityValid] = useState(false);
  const [zipCodeValid, setZipCodeValid] = useState(false);
  const [dropdownValid, setDropdownValid] = useState(false);
  const [designationValid, setDesignationValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChangeName = (value, setValue, setValid, setError) => {
    if (value.length <= 30) {
      setValue(value);

      // Validate: Check if length is between 3 and 10
      if (value.trim().length >= 1) {
        setValid(true);
        setError(false);
      } else {
        setValid(false);
        setError(true);
      }
    }
  };

  const handleInputChangeEmail = (value, setValue, setValid, setError) => {
    if (value.length <= 100) {
      setValue(value);

      // Validate: Check if length is between 3 and 10
      if (value.trim().length >= 10) {
        setValid(true);
        setError(false);
      } else {
        setValid(false);
        setError(true);
      }
    }
  };

  let finalDesignation = designation;

  const onUpdatHandler = () => {
    if (designation === "Other" && otherDesignation.trim()) {
      finalDesignation = otherDesignation; // Use "Other Designation" value
    }
    const firstName =
      firstNameRef !== "" ? firstNameRef : userData.appraiserDetail.firstName;
    const lastName =
      lastNameRef !== "" ? lastNameRef : userData.appraiserDetail.lastName;
    const city = cityRef !== "" ? cityRef : userData.appraiserDetail.city;
    const state = stateRef;
    const zipCode =
      zipcodeRef !== "" ? zipcodeRef : userData.appraiserDetail.zipCode;
    const phoneNumber =
      phoneNumberRef !== ""
        ? phoneNumberRef
        : userData.appraiserDetail.phoneNumber;
    const adressLine2 = addressLineTwoRef;
    const middleName =
      middleNameRef !== ""
        ? middleNameRef
        : userData?.appraiserDetail?.middleName;
    const emailIdRef =
      emailId !== "" ? emailId : userData.appraiserDetail.emailId;
    const streetNameRef =
      streetName !== "" ? streetName : userData.appraiserDetail.streetName;
    const companyName = companyNameRef;

    const payload = {
      id: userData.userId,
      token: userData.token,
      firstName: firstNameRef,
      middleName: middleNameRef,
      lastName: lastNameRef,
      companyName: companyName,
      lenderListUrl: selectedImage2.url,
      streetNumber: streetNumber,
      apartmentNo: apartmentNo,
      cellNumber: cellNumber,
      streetName: streetName,
      commissionRate: commissionRate,
      maxNumberOfAssignedOrders: maxNumberOfAssignedOrders,
      designation: finalDesignation,
      city: cityRef,
      province: stateRef,
      postalCode: zipCode,
      area: "",
      phoneNumber: phoneNumberRef,
      profileImage: SelectedImage,
      emailId: emailId,
      emailNotification: emailNotification,
      smsNotification: smsNotification,
    };

    const fields = [
      { key: "lastName", message: "Last Name is required!" },
      { key: "firstName", message: "First Name is required!" },
      { key: "designation", message: "Designation is required!" },
      { key: "phoneNumber", message: "Phone Number is required!" },
      { key: "emailId", message: "Email ID is required!" },
      { key: "streetName", message: "Street Name is required!" },
      { key: "streetNumber", message: "Street Number is required!" },
      { key: "city", message: "City is required!" },
      { key: "province", message: "State is required!" },
      { key: "postalCode", message: "Postal Code is required!" },
    ];

    const missingFields = fields.filter(({ key }) => !payload[key]);

    if (missingFields.length === 1) {
      // Show specific error for a single missing field
      toast.error(missingFields[0].message);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    } else if (missingFields.length > 1) {
      // Show generic error for multiple missing fields
      toast.error("Please fill all required fields!");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const phoneNumberRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    const cellNumberRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    const nameRegex = /^[A-Za-z ]+$/;
    const nameCityRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    const alphanumericWithSpacesRegex = /^[a-zA-Z0-9 ]+$/;

    if (
      firstName.trim().length < 1 ||
      firstName.trim().length > 30 ||
      !nameRegex.test(firstName)
    ) {
      setFirstNameError(true);
      toast.error("Please enter a valid first name");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    } else if (
      typeof middleName === "string" &&
      middleName.trim() !== "" &&
      (middleName.trim().length < 1 ||
        middleName.trim().length > 30 ||
        !nameRegex.test(middleName.trim()))
    ) {
      toast.error(
        "Please enter a valid middle name (3-30 characters, letters and spaces only)."
      );
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    } else if (
      lastName.trim().length < 1 ||
      lastName.trim().length > 30 ||
      !nameRegex.test(lastName)
    ) {
      setLastNameError(true);
      toast.error("Please enter a valid last name");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    } else if (
      streetNameRef.trim().length < 1 ||
      streetNameRef.trim().length > 30 ||
      !nameCityRegex.test(streetNameRef)
    ) {
      setStreetNameError(true); // Set error state to true
      toast.error("Please enter a valid street name");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    } else if (
      city.trim().length < 1 ||
      city.trim().length > 30 ||
      !nameCityRegex.test(city)
    ) {
      setCityError(true); // Set error state to true
      toast.error("Please enter a valid city name");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    } else if (cellNumberRegex.test(phoneNumber) === false || !phoneNumber) {
      setPhoneNumberError(true);
      toast.error("Please enter a valid phone number");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    } else if (
      cellNumberRegex.test(cellNumber) === false &&
      cellNumber.trim() !== ""
    ) {
      toast.error("Please enter a valid cell number");
    } else if (emailRegex.test(emailIdRef) === false) {
      setEmailError(true);
      toast.error("Please enter a valid email address");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    } else if (alphanumericWithSpacesRegex.test(zipCode) === false) {
      setZipCodeError(true);
      toast.error("Please enter a valid postal code");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    } else if (
      (!firstName ||
        !lastName ||
        !streetName ||
        !streetNumber ||
        !city ||
        !state ||
        !zipCode ||
        !province ||
        !streetName ||
        !streetName ||
        !selectedImage2.name ||
        !emailId ||
        !phoneNumber) &&
      !userData
    ) {
      toast.error("All required fields are not filled !!");
    } else {
      if (SMSAlert && !phoneNumber) {
        toast.error(
          "As SMS Alert is selected but phone number is not provided so SMS Alert will not work properly!"
        );
      } else {
        toast.loading("Updating ...");
        const encryptedData = encryptionData(payload);
        axios
          .put("/api/updateAppraiserProfile", encryptedData)
          .then((res) => {
            const { success, data: profileResponse, message } = res.data;
            console.log({profileResponse})
          if (success) {
            toast.success(message);
            let data = userData;
            data.smsNotification = profileResponse.userData.isSms;
            data.emailNotification = profileResponse.userData.isEmail;
            data.appraiserDetail = profileResponse.userData.appraiser;
            localStorage.removeItem("user");
            localStorage.setItem("user", JSON.stringify(data));
            setShowCard(true);
            // router.push("/appraiser-dashboard");
          } else {
            toast.error(message);
          }
          })
          .catch((err) => {
            toast.error(err.message);
          })
          .finally(() => {});
        toast.dismiss();
      }
    }
    // Validate fields individually

    const isFirstNameValid = validateField(firstNameRef, setFirstNameError);
    // const isCompanyeNameValid = validateField(
    //   companyNameRef,
    //   setCompanyNameError
    // );
    const isLastNameValid = validateField(lastNameRef, setLastNameError);
    // const isPhoneNumberValid = validateFieldNumber(
    //   phoneNumberRef,
    //   setPhoneNumberError
    // );
    const isEmailValid = validateEmailField(emailId, setEmailError);

    const isStreetNumberValid = validateFieldStreetNumber(
      streetNumber,
      setStreetNumberError
    );
    const isStreetNameValid = validateField(streetName, setStreetNameError);
    const isCityValid = validateField(cityRef, setCityError);
    const isZipCodeValid = validateField(zipcodeRef, setZipCodeError);

  };

  // for names
  const validateField = (value, setError, inputRef) => {
  
    // Check the length constraints
    if (value.trim().length < 1 || value.trim().length > 30) {
      setError(true); // Set error if field length is invalid
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    }

    setError(false);
    return true;
  };

  const handleInputChange = (value, setValue, setValid, setError) => {
    // Remove all non-numeric characters
    const cleanedValue = value.replace(/\D/g, "");

    // Validate phone number (example: length check for 10 digits)
    const isValid = cleanedValue.length === 10;

    // Update state
    setValue(cleanedValue); // Store cleaned value
    setValid(isValid);
    setError(!isValid);
  };

  const handleInputChangeStreet = (value, setValue, setValid, setError) => {
    if (value.length <= 30) {
      setValue(value);

      // Validate: Check if length is between 3 and 10
      if (value.trim().length >= 1) {
        setValid(true);
        setError(false);
      } else {
        setValid(false);
        setError(true);
      }
    }
  };


  // for valid mail
  const validateEmailField = (value, setError, inputRef) => {
    // Define a basic email regex pattern for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value.trim())) {
      setError(true); // Set error if the email format is invalid
      // Scroll to the top of the page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    }
    setError(false);
    return true;
  };

  // this is for 10 digit input
  const validateFieldStreetNumber = (value, setError, inputRef) => {
    if (value.trim().length < 1 || value.trim().length > 10) {
      setError(true);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    }
    setError(false);
    return true;
  };

  const changeEditHandler = () => {
    setEdit(true);
  };
  const uploadInputRef = useRef(null);

  const openWidget = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click(); // Trigger the hidden file input
    }
  };

  const handleUpload = (result) => {
    // Handle the image upload result here
    console.log("handleUpload called");
    if (result.info.secure_url) {
      setSelectedImage(result.info.secure_url);
      setProfilePhoto(result.info.secure_url);
      // You can also save the URL to your state or do other operations here
    } else {
      // Handle the case when the upload failed
      console.error("Image upload failed");
    }
  };

  const handleFileChange = async (e, type) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const allowedPdfTypes = ["application/pdf"];
    const file = e.target.files[0];

    if (String(type) === "1") {
      const fileTemp = e.target.files[0];
      if (!allowedImageTypes.includes(fileTemp?.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, GIF).");
        return;
      }
      const file = e.target.files[0];
      toast.loading("Uploading..");
      try {
        const generatedUrl = await uploadFileToS3(file);
        toast.dismiss();
        toast.success("Uploaded Successfully");
        console.log("generatedUrl", generatedUrl);

        setSelectedImage(generatedUrl);
      } catch (err) {
        toast.dismiss();
        toast.error("Try Again!");
      }
    } else if (String(type) === "2") {
      if (!allowedPdfTypes.includes(file?.type)) {
        toast.error("Please select a valid PDF file.");
        return;
      }

      toast.loading("Uploading..");
      try {
        const generatedUrl = await uploadFileToS3(file);
        toast.dismiss();
        toast.success("Uploaded Successfully");
        console.log("generatedUrl", generatedUrl);
        setSelectedImage2({
          name: file.name,
          url: generatedUrl,
        });
      } catch (err) {
        toast.dismiss();
        toast.error("Try Again!");
      }
    }
  };

  return (
    <>
      <div className="row">
        {/* <h4 className="mb-3">Personal Information</h4> */}
        <div className="col-lg-12"></div>
        {isLoading && <CommonLoader />}

        {!edit && (
          <div>
            <button
              className="btn btn2 btn-color profile_edit_button"
              onClick={changeEditHandler}
            >
              <span
                className="flaticon-edit"
                data-toggle="tooltip"
                data-placement="top"
                title="Edit Profile"
              ></span>
            </button>
          </div>
        )}
        <div className="col-lg-12 col-xl-12 mt-2">
          <div className="my_profile_setting_input form-group">
            <div className="row">
              <div className="col-lg-3 mb-5 text-center">
                <div className="wrap-custom-file">
                  <img
                    style={{ borderRadius: "50%" }}
                    src={SelectedImage}
                    alt="Uploaded Image"
                  />
                  {edit && (
                    <div className="col-lg-12">
                      <div>
                        <input
                          type="file"
                          id="fileInput"
                          onChange={(e) => handleFileChange(e, 1)}
                          style={{ display: "none" }} // Hide the actual input element
                        />
                        {/* You can add a button or any other element to trigger file selection */}
                        <button
                          className="btn btn-color mt-2"
                          onClick={() =>
                            document.getElementById("fileInput").click()
                          }
                        >
                          Browse
                        </button>
                        <p className="mt-2">
                          {SelectedImage !== "" &&
                            "Note -: JPG, PNG formats only"}
                        </p>
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>
              <div className="col-lg-9">
                <div className="row mb-2">
                  <h3 className="heading-forms">Appraiser Information</h3>
                  {/* <hr /> */}
                  <div className="col-lg-12 mb-3 mt-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
                        >
                          User ID{" "}
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          readOnly
                          className="form-control"
                          style={{ backgroundColor: "" }}
                          id="formGroupExampleInput3"
                          value={userData.userEmail}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
                        >
                          User Type{" "}
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          readOnly
                          className="form-control"
                          style={{ backgroundColor: "" }}
                          id="formGroupExampleInput3"
                          value={
                            {
                              3: "Appraiser",
                              5: "Appraiser",
                            }[userData.userType] || "Unknown User Type"
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "10px", color: "#2e008b" }}
                        >
                          First Name <span class="req-btn">*</span>
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput3"
                          required
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: firstNameError
                              ? "red"
                              : firstNameValid
                              ? ""
                              : "",
                          }}
                          value={firstNameRef}
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setFirstNameRef,
                              setFirstNameValid,
                              setFirstNameError
                            )
                          }
                          disabled={!edit}
                        />
                        {firstNameError && (
                          <small className="text-danger">
                            Enter valid first name.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "10px", color: "#2e008b" }}
                        >
                          Middle Name
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          required
                          className="form-control"
                          id="formGroupExampleInput3"
                          style={{ backgroundColor: "#E8F0FE" }}
                          disabled={!edit}
                          value={middleNameRef}
                          onChange={(e) => setMiddleNameRef(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "10px", color: "#2e008b" }}
                        >
                          Last Name <span class="req-btn">*</span>
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          required
                          className="form-control"
                          id="formGroupExampleInput3"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: lastNameError
                              ? "red"
                              : lastNameValid
                              ? ""
                              : "",
                          }}
                          value={lastNameRef}
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setLastNameRef,
                              setLastNameValid,
                              setLastNameError
                            )
                          }
                          disabled={!edit}
                        />
                        {lastNameError && (
                          <small className="text-danger">
                            Enter valid last name.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "10px", color: "#2e008b" }}
                        >
                          Company Name{" "}
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          className="form-control"
                          style={{ backgroundColor: "#E8F0FE" }}
                          id="formGroupExampleInput3"
                          value={companyNameRef}
                          onChange={(e) => setCompanyNameRef(e.target.value)}
                          disabled={!edit}
                          maxLength={100}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "10px", color: "#2e008b" }}
                        >
                          Phone Number(Primary) <span class="req-btn">*</span>
                        </label>
                        <div className="hover-text-01">
                          <div
                            className="tooltip-text-01"
                            style={{
                              marginTop: "-60px",
                              marginLeft: "-100px",
                            }}
                          >
                            <ul>
                              <li style={{ fontSize: "15px" }}>
                                Please enter phone number without country code.
                              </li>
                              {/* <li>
                                  Regular Request : Timeline for the appraisal
                                  report is 3 – 4 days.
                                </li> */}
                            </ul>
                          </div>
                          <i class="fa fa-info-circle" aria-hidden="true"></i>
                        </div>
                      </div>
                      <div className="col-lg-7">
                        <ReactInputMask
                          mask="999 999-9999" // Canadian phone format
                          value={phoneNumberRef}
                          onChange={(e) =>
                            handleInputChange(
                              e.target.value,
                              setPhoneNumberRef,
                              setPhoneNumberValid,
                              setPhoneNumberError
                            )
                          }
                          className="form-control"
                          // disabled={!edit}
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: phoneNumberError
                              ? "red"
                              : phoneNumberValid
                              ? ""
                              : "",
                          }}
                        >
                          {(inputProps) => (
                            <input
                              {...inputProps}
                              type="text"
                              id="phoneNumber"
                              name="phoneNumber"
                              title="Please enter a valid phone number"
                              required
                              // disabled={!edit}
                            />
                          )}
                        </ReactInputMask>
                        {phoneNumberError && (
                          <small className="text-danger">
                            Enter valid phone number.
                          </small>
                        )}
                       
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "10px", color: "#2e008b" }}
                        >
                          Cell Number
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <ReactInputMask
                          mask="999 999-9999" // Canadian phone format
                          value={cellNumber}
                          onChange={(e) =>
                            handleInputCellChange(e.target.value)
                          }
                          className="form-control"
                          // disabled={!edit}
                          style={{ backgroundColor: "#E8F0FE" }}
                        >
                          {(inputProps) => (
                            <input
                              {...inputProps}
                              type="text"
                              id="cellNumber"
                              name="cellNumber"
                              title="Please enter a valid cell number"
                              // required
                              // disabled={!edit}
                            />
                          )}
                        </ReactInputMask>

                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "10px", color: "#2e008b" }}
                        >
                          Email Address <span class="req-btn">*</span>
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="email"
                          className="form-control"
                          required
                          id="formGroupExampleInput3"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: emailError
                              ? "red"
                              : emailValid
                              ? ""
                              : "",
                          }}
                          value={emailId}
                          onChange={(e) =>
                            handleInputChangeEmail(
                              e.target.value,
                              setEmailId,
                              setEmailValid,
                              setEmailError
                            )
                          }
                          disabled={!edit}
                          maxLength={100}
                        />
                        {emailError && (
                          <small className="text-danger">
                            Enter valid email address.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "10px", color: "#2e008b" }}
                        >
                          Designation <span class="req-btn">*</span>
                        </label>
                      </div>
                      <div className="col-lg-4">
                        <select
                          required
                          className="form-select"
                          data-live-search="true"
                          data-width="100%"
                          value={designation}
                          onChange={handleDesignationChange}
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: designationError
                              ? "red"
                              : designationValid
                              ? ""
                              : "", // Add red border for error
                          }}
                        >
                          {designations.map((item, index) => {
                            return (
                              <option key={item.id} value={item.value}>
                                {item.type}
                              </option>
                            );
                          })}
                        </select>
                        {designationError && (
                          <small className="text-danger">
                            Please select a valid option.
                          </small>
                        )}
                      </div>
                      {/* Other Designation Input */}
                      {oDesignation && (
                        <div className="col-lg-3" id="other-div">
                          <input
                            required
                            value={otherDesignation}
                            onChange={(e) =>
                              setOtherDesignation(e.target.value)
                            }
                            type="text"
                            className="form-control"
                            id="formGroupExampleInput3"
                            style={{ backgroundColor: "#E8F0FE" }}
                            maxLength={30}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mt-1">
                    <div className="col-lg-4">
                      <label
                        htmlFor=""
                        style={{
                          paddingTop: "10px",
                          fontWeight: "bold",
                          color: "#2e008b",
                        }}
                      >
                        Add Lender List
                      </label>
                    </div>
                    <div className="col-lg-3">
                      <div>
                        <input
                          type="file"
                          id="fileInput_01"
                          onChange={(e) => handleFileChange(e, 2)}
                          style={{ display: "none" }} // Hide the actual input element
                        />
                        {/* You can add a button or any other element to trigger file selection */}
                        <button
                          className="btn btn-color"
                          style={{ marginLeft: "10px" }}
                          onClick={() =>
                            document.getElementById("fileInput_01").click()
                          }
                        >
                          Browse
                        </button>
                        <p className="mt-2" style={{ marginLeft: "10px" }}>
                          {selectedImage2.name !== "" && "Upload pdf only"}
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-5 mt-1 text-start">
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "underline" }}
                        onClick={(event) =>
                          handleDownloadClick(
                            event,
                            selectedImage2.url,
                            `${firstNameRef}_lenderlist.pdf`
                          )
                        }
                        href={selectedImage2.url}
                      >
                        {selectedImage2.name}
                      </Link>
                    </div>{" "}
                  </div>
                  <div className="col-lg-12 mb-2 mt-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="form-group form-check custom-checkbox">
                          <input
                            className="form-check-input mt-3"
                            type="checkbox"
                            checked={emailNotification}
                            onChange={(e) =>
                              setEmailNotification(!emailNotification)
                            }
                            id="terms"
                            style={{ border: "1px solid black" }}
                          />
                          <label
                            className="form-check-label form-check-label"
                            htmlFor="terms"
                            style={{
                              color: "#2e008b",
                              fontWeight: "bold",
                              fontSize: "",
                            }}
                          >
                            Email Alerts
                          </label>
                          <div className="hover-text-01">
                            <div
                              className="tooltip-text-01"
                              style={{
                                marginTop: "-60px",
                                marginLeft: "-100px",
                              }}
                            >
                              <ul>
                                <li style={{ fontSize: "15px" }}>
                                  Alerts will be sent to the registered email
                                  address.
                                </li>
                                {/* <li>
                                  Regular Request : Timeline for the appraisal
                                  report is 3 – 4 days.
                                </li> */}
                              </ul>
                            </div>
                            <i class="fa fa-info-circle" aria-hidden="true"></i>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="form-group form-check custom-checkbox">
                          <input
                            className="form-check-input mt-3"
                            type="checkbox"
                            checked={smsNotification}
                            id="terms"
                            style={{ border: "1px solid black" }}
                            onChange={(e) =>
                              setSmsNotification(!smsNotification)
                            }
                          />
                          <label
                            className="form-check-label form-check-label"
                            htmlFor="terms"
                            style={{
                              color: "#2e008b",
                              fontWeight: "bold",
                            }}
                          >
                            SMS Alerts
                          </label>
                          <div className="hover-text-01">
                            <div
                              className="tooltip-text-01"
                              style={{
                                marginTop: "-60px",
                                marginLeft: "-100px",
                              }}
                            >
                              <ul>
                                <li style={{ fontSize: "15px" }}>
                                  Alerts will be sent to the registered phone
                                  number.
                                </li>
                                
                              </ul>
                            </div>
                            <i class="fa fa-info-circle" aria-hidden="true"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="heading-forms mt-4">Address</h3>
                  {/* <hr /> */}
                  <div className="col-lg-12 mb-3 mt-2">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "10px", color: "#2e008b" }}
                        >
                          Street Number <span class="req-btn">*</span>
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput3"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: streetNumberError
                              ? "red"
                              : streetNumberValid
                              ? ""
                              : "",
                          }}
                          required
                          value={streetNumber}
                          onChange={(e) =>
                            handleInputChangeStreet(
                              e.target.value,
                              setStreetNumber,
                              setStreetNumberValid,
                              setStreetNumberError
                            )
                          }
                          disabled={!edit}
                        />
                        {streetNumberError && (
                          <small className="text-danger">
                            Enter valid street number.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "10px", color: "#2e008b" }}
                        >
                          Street Name <span class="req-btn">*</span>
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput3"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: streetNameError
                              ? "red"
                              : streetNameValid
                              ? ""
                              : "",
                          }}
                          value={streetName}
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setStreetName,
                              setStreetNameValid,
                              setStreetNameError
                            )
                          }
                          disabled={!edit}
                        />
                        {streetNameError && (
                          <small className="text-danger">
                            Enter valid street name.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "5px" }}
                        >
                          Unit / Apt. No.
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          value={apartmentNo}
                          onChange={(e) => setApartmentNo(e.target.value)}
                          className="form-control"
                          style={{ backgroundColor: "#E8F0FE" }}
                          id="formGroupExampleInput3"
                          required
                          // value={cityRef}
                          // onChange={(e) => setCityRef(e.target.value)}
                          disabled={!edit}
                          maxLength={10}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "10px", color: "#2e008b" }}
                        >
                          City <span class="req-btn">*</span>
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput3"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: cityError
                              ? "red"
                              : cityValid
                              ? ""
                              : "",
                          }}
                          required
                          value={cityRef}
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setCityRef,
                              setCityValid,
                              setCityError
                            )
                          }
                          disabled={!edit}
                        />
                        {cityError && (
                          <small className="text-danger">
                            Enter valid city name.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "10px", color: "#2e008b" }}
                        >
                          Province <span class="req-btn">*</span>
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <select
                          required
                          className="form-select"
                          data-live-search="true"
                          data-width="100%"
                          onChange={(e) => {
                            const value = e.target.value;
                            setStateRef(value); // Update state
                            if (value === "") {
                              setDropdownError(true);
                            } else {
                              setDropdownError(false);
                              setDropdownValid(true);
                            }
                          }}
                          value={stateRef}
                          disabled={!edit}
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: dropdownError
                              ? "red"
                              : dropdownValid
                              ? ""
                              : "", // Add red border for error
                          }}
                        >
                          {province.map((item, index) => {
                            return (
                              <option key={item.id} value={item.value}>
                                {item.type}
                              </option>
                            );
                          })}
                        </select>
                        {dropdownError && (
                          <small className="text-danger">
                            Please select a valid option.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "10px", color: "#2e008b" }}
                        >
                          Postal Code <span class="req-btn">*</span>
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          className="form-control"
                          required
                          id="formGroupExampleInput3"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: zipCodeError
                              ? "red"
                              : zipCodeValid
                              ? ""
                              : "",
                          }}
                          onChange={(e) =>
                            handleInputChangeStreet(
                              e.target.value,
                              setZipcodeRef,
                              setZipCodeValid,
                              setZipCodeError
                            )
                          }
                          value={zipcodeRef}
                          disabled={!edit}
                          maxLength={10}
                        />
                        {zipCodeError && (
                          <small className="text-danger">
                            Enter valid postal code.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>

                  {edit && (
                    <div className="row mt-4">
                      <div className="col-xl-12">
                        <div
                          className="my_profile_setting_input"
                          style={{ textAlign: "center" }}
                        >
                          <button
                            className="btn btn5 m-1"
                            // onClick={cancelHandler}
                            onClick={() => setShowCard(true)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn2 btn-dark"
                            onClick={onUpdatHandler}
                          >
                            {userData?.appraiserDetail
                              ? "Update Profile"
                              : "Create Profile"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
