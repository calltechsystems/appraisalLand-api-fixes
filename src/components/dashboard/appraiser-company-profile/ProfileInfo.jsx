"use client";
import { handleDownloadClick } from "./downloadFunction";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
// import { encryptionData } from "../../../utils/dataEncryption";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import toast from "react-hot-toast";
import { province } from "../create-listing/data";
import { designation } from "../create-listing/data";
import Link from "next/link";
import { uploadFile } from "./functions";
import ReactInputMask from "react-input-mask";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import CommonLoader from "../../common/CommonLoader/page";

const ProfileInfo = ({
  setProfileCount,
  setShowCard,
  setModalIsOpenError,
  setModalIsOpenError_01,
  setUploadingFiles,
  uploadingFiles,
}) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  let userData = JSON.parse(localStorage.getItem("user")) || {};
  const router = useRouter();

  useEffect(() => {
    let updatedList = { ...uploadingFiles };
    if (userData?.appraiserCompany_Datails?.profileImage) {
      const name =
        userData?.appraiserCompany_Datails?.profileImage
          .split("/")
          .pop()
          .split("?")[0] || "";
      const updatedDoc = {
        file: { name },
        previewUrl:
          name == ""
            ? "/assets/images/home/placeholder_01.jpg"
            : userData?.appraiserCompany_Datails?.profileImage,
        uploadedUrl: userData?.appraiserCompany_Datails?.profileImage || "",
        fieldType: "profileImage",
      };

      updatedList = {
        ...updatedList,
        ["profileImage"]: updatedDoc,
      };
    }
    if (userData?.appraiserCompany_Datails?.lenderListUrl) {
      const name = userData?.appraiserCompany_Datails?.lenderListUrl
        .split("/")
        .pop()
        .split("?")[0];
      const updatedDoc = {
        file: { name },
        previewUrl: name.includes("zip")
          ? "/assets/Attachments/zipIcon.png"
          : name.includes("pdf")
          ? "/assets/Attachments/pdfIcon.png"
          : userData?.appraiserCompany_Datails?.lenderListUrl,
        uploadedUrl: userData?.appraiserCompany_Datails?.lenderListUrl,
        fieldType: "LenderList",
      };
      updatedList = {
        ...updatedList,
        ["LenderList"]: updatedDoc,
      };
    }
    setUploadingFiles({ ...updatedList });
  }, []);

  const [selectedImage2, setSelectedImage2] = useState({
    name:
      userData?.appraiserCompany_Datails?.lenderListUrl !== null
        ? "uploaded_lenderlist"
        : "",
    url:
      userData?.appraiserCompany_Datails?.lenderListUrl !== null
        ? userData?.appraiserCompany_Datails?.lenderListUrl
        : "",
  });

  const [SelectedImage, setSelectedImage] = useState(
    userData?.appraiserCompany_Datails?.profileImage ||
      "/assets/images/home/placeholder_01.jpg"
  );

  const hiddenStyle = { backgroundColor: "#E8F0FE", display: "none" };
  const viewStyle = { backgroundColor: "#E8F0FE", display: "block" };
  const [edit, setEdit] = useState(true);

  const [firstNameRef, setFirstNameRef] = useState(
    userData?.appraiserCompany_Datails?.firstName || ""
  );

  const [emailNotification, setEmailNotification] = useState(
    userData?.emailNotification !== null ? userData?.emailNotification : true
  );

  const [smsNotification, setSmsNotification] = useState(
    userData?.smsNotification !== null ? userData?.smsNotification : true
  );

  const [SMSAlert, setSMSAlert] = useState(false);

  const [licenseNumber, setLicenseNumber] = useState(
    userData?.appraiserCompany_Datails?.licenseNumber || ""
  );

  const [emailId, setEmailId] = useState(
    userData?.appraiserCompany_Datails?.emailId || ""
  );

  const [cellNumber, setCellNumber] = useState(
    userData?.appraiserCompany_Datails?.cellNumber || ""
  );

  const [lastNameRef, setLastNameRef] = useState(
    userData?.appraiserCompany_Datails?.lastName || ""
  );
  const [companyNameRef, setCompanyNameRef] = useState(
    userData?.appraiserCompany_Datails?.appraiserCompanyName || ""
  );

  const [addressLineRef, setAddressLineRef] = useState(
    userData?.appraiserCompany_Datails?.addressLineOne || ""
  );
  const [addressLineTwoRef, setAddressLineTwoRef] = useState(
    userData?.appraiserCompany_Datails?.addressLineTwo || ""
  );

  const [cityRef, setCityRef] = useState(
    userData?.appraiserCompany_Datails?.city || ""
  );
  const [stateRef, setStateRef] = useState(
    userData?.appraiserCompany_Datails?.state || ""
  );
  const [zipcodeRef, setZipcodeRef] = useState(
    userData?.appraiserCompany_Datails?.postalCode || ""
  );
  const [phoneNumberRef, setPhoneNumberRef] = useState(
    userData?.appraiserCompany_Datails?.phoneNumber || ""
  );

  const [officeContactFirstName, setOfficeContactFirstName] = useState(
    userData.appraiserCompany_Datails?.officeContactFirstName || ""
  );

  const [officeContactLastName, setOfficeContactLastName] = useState(
    userData?.appraiserCompany_Datails?.officeContactLastName || ""
  );

  const [officeContactEmail, setOfficeContactEmail] = useState(
    userData?.appraiserCompany_Datails?.officeContactEmail || ""
  );

  const [officeContactPhone, setOfficeContactPhone] = useState(
    userData?.appraiserCompany_Datails?.officeContactPhone || ""
  );

  const [streetName, setStreetName] = useState(
    userData?.appraiserCompany_Datails?.streetName || ""
  );
  const [streetNumber, setStreetNumber] = useState(
    userData.appraiserCompany_Datails?.streetNumber || ""
  );
  const [apartmentNumber, setApartmentNumber] = useState(
    userData?.appraiserCompany_Datails?.apartmentNumber || ""
  );
  const [disable, setdisable] = useState(false);
  useEffect(() => {
    if (smsNotification === null || smsNotification === false) {
      setModalIsOpenError(true);
    } else if (emailNotification === null || emailNotification === false) {
      setModalIsOpenError_01(true);
    }
  }, [smsNotification, emailNotification]);

  const [isLoading, setIsLoading] = useState(false);

  // Validation for input fields

  // State for errors and validation
  const [firstNameError, setFirstNameError] = useState(false);
  const [companyNameError, setCompanyNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [cellNumberError, setCellNumberError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [LicenceError, setLicenceError] = useState(false);

  const [streetNumberError, setStreetNumberError] = useState(false);
  const [streetNameError, setStreetNameError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [zipCodeError, setZipCodeError] = useState(false);
  const [officeContactFirstNameError, setOfficeContactFirstNameError] =
    useState(false);
  const [officeContactLastNameError, setOfficeContactLastNameError] =
    useState(false);
  const [officeContactPhoneError, setOfficeContactPhoneError] = useState(false);
  const [officeContactEmailError, setOfficeContactEmailError] = useState(false);

  // State for dropdown
  const [selectedOption, setSelectedOption] = useState("");
  const [dropdownError, setDropdownError] = useState(false);

  // validate fields
  const [firstNameValid, setFirstNameValid] = useState(false);
  const [companyNameValid, setCompanyNameValid] = useState(false);
  const [lastNameValid, setLastNameValid] = useState(false);
  const [phoneNumberValid, setPhoneNumberValid] = useState(false);
  const [cellNumberValid, setCellNumberValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [LicenceValid, setLicenceValid] = useState(false);

  const [streetNumberValid, setStreetNumberValid] = useState(false);
  const [streetNameValid, setStreetNameValid] = useState(false);
  const [cityValid, setCityValid] = useState(false);
  const [zipCodeValid, setZipCodeValid] = useState(false);
  const [dropdownValid, setDropdownValid] = useState(false);
  const [officeContactFirstNameValid, setOfficeContactFirstNameValid] =
    useState(false);
  const [officeContactLastNameValid, setOfficeContactLastNameValid] =
    useState(false);
  const [officeContactPhoneValid, setOfficeContactPhoneValid] = useState(false);
  const [officeContactEmailValid, setOfficeContactEmailValid] = useState(false);

  const [TimesTrigerredSubmission, setTimesTrigerredSubmission] = useState(0);
  const [isSubmitInProgress, setIsSubmitInProgress] = useState(false);

  useEffect(() => {
    if (
      TimesTrigerredSubmission <= 2 &&
      TimesTrigerredSubmission >= 1 &&
      isSubmitInProgress == true
    ) {
      submissionHandler();
    }
  }, [TimesTrigerredSubmission, isSubmitInProgress]);

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

  const handleInputChangeCompanyName = (value, setValue, setValid, setError) => {
    if (value.length <= 100) {
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

  const getPreviewUrl = (file) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    } else if (file.type === "application/pdf") {
      return "/assets/Attachments/pdfIcon.png";
    } else if (
      file.type === "application/zip" ||
      file.type === "application/x-zip-compressed"
    ) {
      return "/assets/Attachments/zipIcon.png";
    } else {
      return "/assets/Attachments/fileIcon.png";
    }
  };

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];

    // Check file type and size
    if (type === "LenderList") {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed for Lender List.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB.");
        return;
      }
    }

    if (type === "profileImage") {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed for Profile Image.");
        return;
      }
    }

    const updatedFiles = {
      ...uploadingFiles,
      [type]: {
        file,
        type: file.type,
        fieldType: type,
        previewUrl: getPreviewUrl(file),
        uploadedUrl: "",
      },
    };
    setUploadingFiles(updatedFiles);
  };

  const initiateTheSubmit = () => {
    setIsSubmitInProgress(true);
    setTimesTrigerredSubmission(1);
  };

  const submissionHandler = async () => {
    try {
      toast.loading("Updating the profile");
      setIsLoading(true);

      // Create an array of promises only for files that need uploading
      const uploadPromises = Object.values(uploadingFiles).map(async (file) => {
        if (file.uploadedUrl === "" && file.file instanceof File) {
          const generatedURL = await uploadFile(file.file);
          return {
            ...file,
            uploadedUrl: generatedURL,
          };
        } else {
          return file;
        }
      });

      // Wait for all the necessary uploads to complete
      const updatedAttachments = await Promise.all(uploadPromises);

      const updatedList = {};
      updatedAttachments.map((file) => {
        updatedList[file.fieldType] = {
          ...file,
        };
      });

      setUploadingFiles({ ...updatedList });
      // Finally call the main function
      setIsLoading(false);
      toast.dismiss();
      onUpdatHandler(updatedList);
    } catch (err) {
      if (TimesTrigerredSubmission == 2) {
        setIsSubmitInProgress(false);
        setTimesTrigerredSubmission(0);
        setIsLoading(false);
        toast.dismiss()
        toast.error("Got error while saving, trying again.", err);
        console.error({ profileError: err });
      } else {
        setTimesTrigerredSubmission(TimesTrigerredSubmission + 1);
      }
    }
  };

  //resetting the feilds
  const resetTriggeredValues = () => {
    setIsSubmitInProgress(false);
    setTimesTrigerredSubmission(0);
    setdisable(false);
    setIsLoading(false);
  };

  const onUpdatHandler = (updatedList) => {
    const firstName =
      firstNameRef !== ""
        ? firstNameRef
        : userData.appraiserCompany_Datails.firstName;
    const lastName =
      lastNameRef !== ""
        ? lastNameRef
        : userData.appraiserCompany_Datails.lastName;
    const city =
      cityRef !== "" ? cityRef : userData.appraiserCompany_Datails.city;
    const state = stateRef;
    const zipCode =
      zipcodeRef !== ""
        ? zipcodeRef
        : userData.appraiserCompany_Datails.zipCode;
    const phoneNumber =
      phoneNumberRef !== ""
        ? phoneNumberRef
        : userData.appraiserCompany_Datails.phoneNumber;
    // const cellNumber =
    //   cellNumber!== "" ? cellNumber : userData.appraiserCompany_Datails.cellNumber;
    const adressLine2 = addressLineTwoRef;
    const companyName =
      companyNameRef !== ""
        ? companyNameRef
        : userData.appraiserCompany_Datails.companyName;
    // const licenseNumber =
    //   licenseNumberRef !== ""
    //     ? licenseNumberRef
    //     : userData.appraiserCompany_Datails.licenseNumber;
    const emailIdRef =
      emailId !== "" ? emailId : userData.appraiserCompany_Datails.emailId;
    const streetNameRef =
      streetName !== ""
        ? streetName
        : userData.appraiserCompany_Datails.streetName;

    const payload = {
      id: userData.userId,
      token: userData.token,
      firstName: firstNameRef,
      lastName: lastNameRef,
      appraiserCompanyName: companyNameRef,
      licenseNumber: licenseNumber,
      addressLineOne: addressLineRef,
      addressLineTwo: addressLineTwoRef,
      officeContactFirstName: officeContactFirstName,
      officeContactLastName: officeContactLastName,
      officeContactEmail: officeContactEmail,
      city: cityRef,
      state: stateRef,
      lenderListUrl: updatedList["LenderList"]?.uploadedUrl,
      postalCode: zipcodeRef,
      phoneNumber: phoneNumberRef,
      officeContactPhone: officeContactPhone,
      cellNumber: cellNumber,
      emailId: emailId,
      streetNumber: streetNumber,
      streetName: streetName,
      apartmentNumber: apartmentNumber,
      profileImage: updatedList["profileImage"]?.uploadedUrl,
      emailNotification: emailNotification,
      smsNotification: smsNotification,
    };

    const fields = [
      { key: "lastName", message: "Last Name is required!" },
      { key: "firstName", message: "First Name is required!" },
      { key: "licenseNumber", message: "License Number is required!" },
      { key: "appraiserCompanyName", message: "Company Name is required!" },
      { key: "phoneNumber", message: "Phone Number is required!" },
      { key: "emailId", message: "Email ID is required!" },
      { key: "streetName", message: "Street Name is required!" },
      { key: "streetNumber", message: "Street Number is required!" },
      { key: "city", message: "City is required!" },
      { key: "state", message: "State is required!" },
      { key: "postalCode", message: "Postal Code is required!" },
    ];

    const missingFields = fields.filter(({ key }) => !payload[key]);

    if (missingFields.length === 1) {
      // Show specific error for a single missing field
      toast.error(missingFields[0].message);
      resetTriggeredValues();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    } else if (missingFields.length > 1) {
      // Show generic error for multiple missing fields
      toast.error("Please fill all required fields!");
      resetTriggeredValues();
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
      resetTriggeredValues();
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
      resetTriggeredValues();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    }
    // else if (
    //   companyName.trim().length < 1 ||
    //   companyName.trim().length > 30
    // ) {
    //   setCompanyNameError(true);
    //   toast.error("Please enter a valid appraiser company name");
    //   resetTriggeredValues()
    //   window.scrollTo({
    //     top: 0,
    //     behavior: "smooth",
    //   });
    //   return false;
    // }
    else if (cellNumberRegex.test(phoneNumber) === false || !phoneNumber) {
      setPhoneNumberError(true);
      toast.error("Please enter a valid phone number");
      resetTriggeredValues();
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
      resetTriggeredValues();
    } else if (emailRegex.test(emailIdRef) === false) {
      setEmailError(true);
      toast.error("Please enter a valid email address");
      resetTriggeredValues();
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
      resetTriggeredValues();
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
      resetTriggeredValues();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    } else if (alphanumericWithSpacesRegex.test(zipCode) === false) {
      setZipCodeError(true);
      toast.error("Please enter a valid postal code");
      resetTriggeredValues();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    } else if (
      officeContactFirstName.trim() !== "" &&
      (officeContactFirstName.trim().length < 1 ||
        officeContactFirstName.trim().length > 30 ||
        !nameRegex.test(officeContactFirstName))
    ) {
      setOfficeContactFirstNameError(true);
      toast.error("Please enter a valid office first name");
      resetTriggeredValues();
    } else if (
      // Assistant Last Name
      officeContactLastName.trim() !== "" &&
      (officeContactLastName.trim().length < 1 ||
        officeContactLastName.trim().length > 30 ||
        !nameRegex.test(officeContactLastName))
    ) {
      setOfficeContactLastNameError(true);
      toast.error("Please enter a valid office last name");
      resetTriggeredValues();
    } else if (
      emailRegex.test(officeContactEmail) === false &&
      officeContactEmail.trim() !== ""
    ) {
      setOfficeContactEmailError(true);
      toast.error("Please enter a valid office email address");
      resetTriggeredValues();
    } else if (
      cellNumberRegex.test(officeContactPhone) === false &&
      officeContactPhone.trim() !== ""
    ) {
      setOfficeContactPhoneError(true);
      toast.error("Please enter a valid office phone number");
      resetTriggeredValues();
    } else if (
      (!firstNameRef ||
        !lastNameRef ||
        !companyNameRef ||
        !phoneNumberRef ||
        !licenseNumber ||
        !stateRef ||
        !zipcodeRef ||
        !selectedImage2.url ||
        !addressLineRef ||
        !emailId ||
        !cityRef) &&
      !userData
    ) {
      toast.error("All marked field's are not filled !!");
      resetTriggeredValues();
    } else {
      let count = 9;

      if (SMSAlert && !phoneNumberRef) {
        toast.error(
          "As SMS Alert is selected but phone number is not provided so SMS Alert will not work properly!"
        );
        resetTriggeredValues();
      } else {
        toast.loading("Updating Profile");
        setIsLoading(true);

        axios
          .put("/api/updateAppraiserCompanyProfile", payload)
          .then((res) => {
            toast.success("Successfully Updated !");
            console.log("user is", res.data.userData);
            let data = userData;
            data.smsNotification = res.data.userData.isSms;
            data.emailNotification = res.data.userData.isEmail;
            data.appraiserCompany_Datails = res.data.userData.appraiserCompany;
            localStorage.removeItem("user");
            localStorage.setItem("user", JSON.stringify(data));
            setShowCard(true);
            router.push("/appraiser-company-dashboard");
            setIsSubmitInProgress(false);
          })
          .catch((err) => {
            if (TimesTrigerredSubmission < 2) {
              setTimesTrigerredSubmission(TimesTrigerredSubmission + 1);
            } else {
              toast.error(err.message || 'Got error while saving the profile data to db ');
              setIsSubmitInProgress(false);
              setTimesTrigerredSubmission(0);
              setIsLoading(false);
              toast.dismiss()
            }
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
    const isMortgageLicenceValid = validateField(
      licenseNumber,
      setLicenceError
    );

    const isStreetNumberValid = validateFieldStreetNumber(
      streetNumber,
      setStreetNumberError
    );
    const isStreetNameValid = validateField(streetName, setStreetNameError);
    const isCityValid = validateField(cityRef, setCityError);
    const isZipCodeValid = validateField(zipcodeRef, setZipCodeError);
  };

  const validateField = (value, setError, inputRef) => {
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

  const validateFieldStreetNumber = (value, setError, inputRef) => {
    if (value.trim().length < 1 || value.trim().length > 10) {
      setError(true); // Set error if field length is invalid
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

  const downloadAllAttachments = async (fileItem) => {
    if (fileItem?.uploadedUrl) {
      const response = await fetch(fileItem.uploadedUrl);
      const blob = await response.blob();
      const fileName = fileItem?.file?.name || "LenderList.pdf";

      saveAs(blob, fileName);
    } else if (fileItem?.file) {
      const fileName = fileItem?.file?.name || "LenderList.pdf";
      saveAs(fileItem.file, fileName);
    }
  };

  const deleteFile = (type) => {
    setUploadingFiles({
      ...uploadingFiles,
      [type]: {},
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12"></div>

        {isLoading && <CommonLoader />}
        <div className="col-lg-12 col-xl-12 mt-2">
          <div className="my_profile_setting_input form-group">
            <div className="row">
              <div className="col-lg-3 text-center mb-5">
                <div className="wrap-custom-file">
                  <img
                    style={{ borderRadius: "50%" }}
                    src={uploadingFiles["profileImage"]?.previewUrl}
                    alt="Uploaded Image"
                  />
                  {edit && (
                    <div className="col-lg-12">
                      <div>
                        <input
                          type="file"
                          accept=".jpeg, .png, .jpg"
                          id="fileInput"
                          onChange={(e) => handleUpload(e, "profileImage")}
                          style={{ display: "none" }}
                        />
                        <button
                          className="btn btn-color mt-2"
                          onClick={() =>
                            document.getElementById("fileInput").click()
                          }
                        >
                          Browse
                        </button>
                        <p className="mt-2">
                          {SelectedImage !== "" && "Note - Image Only"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-9">
                <div className="row mb-2">
                  <h3 className="heading-forms">
                    Appraiser Company Information
                  </h3>
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
                          style={{ backgroundColor: "#" }}
                          id="formGroupExampleInput3"
                          value={
                            {
                              4: "Appraiser Company",
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
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
                        >
                          Appraiser Company Name <span class="req-btn">*</span>
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: companyNameError
                              ? "red"
                              : companyNameValid
                              ? ""
                              : "",
                          }}
                          id="formGroupExampleInput3"
                          value={companyNameRef}
                          onChange={(e) =>
                            handleInputChangeCompanyName(
                              e.target.value,
                              setCompanyNameRef,
                              setCompanyNameValid,
                              setCompanyNameError
                            )
                          }
                          disabled={!edit}
                        />
                        {companyNameError && (
                          <small className="text-danger">
                            Enter valid company name.
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
                          style={{ paddingTop: "10px" }}
                        >
                          Primary Contact First Name{" "}
                          <span class="req-btn">*</span>
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
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
                        >
                          Primary Contact Last Name{" "}
                          <span class="req-btn">*</span>
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
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
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
                        {/* <input
                          type="text"
                          required
                          className="form-control"
                          id="formGroupExampleInput3"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: phoneNumberError
                              ? "red"
                              : phoneNumberValid
                              ? ""
                              : "",
                          }}
                          value={phoneNumberRef}
                          onChange={(e) =>
                            handleInputChange(
                              e.target.value,
                              setPhoneNumberRef,
                              setPhoneNumberValid,
                              setPhoneNumberError
                            )
                          }
                          disabled={!edit}
                        /> */}
                        {/* {phoneNumberError && (
                          <small className="text-danger">
                            Enter valid phone number.
                          </small>
                        )} */}
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
                          Cell Number{" "}
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <ReactInputMask
                          mask="999 999-9999" // Canadian phone format
                          value={cellNumber}
                          onChange={(e) =>
                            handleInputChange(
                              e.target.value,
                              setCellNumber,
                              setCellNumberValid,
                              setCellNumberError
                            )
                          }
                          className="form-control"
                          // disabled={!edit}
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: cellNumberError
                              ? "red"
                              : cellNumberValid
                              ? ""
                              : "",
                          }}
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
                        {cellNumberError && (
                          <small className="text-danger">
                            Enter valid cell number.
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
                          style={{ paddingTop: "10px" }}
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
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
                        >
                          Licence No <span class="req-btn">*</span>
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
                            borderColor: LicenceError
                              ? "red"
                              : LicenceValid
                              ? ""
                              : "",
                          }}
                          value={licenseNumber}
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setLicenseNumber,
                              setLicenceValid,
                              setLicenceError
                            )
                          }
                          disabled={!edit}
                        />
                        {LicenceError && (
                          <small className="text-danger">
                            Enter valid licence number.
                          </small>
                        )}
                      </div>
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
                    <div className="col-lg-2">
                      <div>
                        <input
                          type="file"
                          accept=".pdf"
                          id="fileInput_01"
                          onChange={(e) => handleUpload(e, "LenderList")}
                          style={{ display: "none" }} // Hide the actual input element
                        />
                        <button
                          className="btn btn-color"
                          style={{ marginLeft: "10px" }}
                          onClick={() =>
                            document.getElementById("fileInput_01").click()
                          }
                        >
                          Upload File
                        </button>
                        <p className="mt-2" style={{ marginLeft: "10px" }}>
                          {uploadingFiles["LenderList"]?.file?.name !== "" &&
                            "Note:Upload pdf only."}
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      {uploadingFiles["LenderList"]?.file ? (
                        <div key={1} className="position-relative">
                          {/* <img
                            src={uploadingFiles["LenderList"]?.previewUrl}
                            alt="preview"
                            className="img-thumbnail"
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "cover",
                            }}
                          /> */}

                          {uploadingFiles["LenderList"] && (
                            <button
                              type="button"
                              className="btn btn-success btn-sm m-1"
                              onClick={() =>
                                downloadAllAttachments(
                                  uploadingFiles["LenderList"]
                                )
                              }
                            >
                              {uploadingFiles["LenderList"]?.file?.name}
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteFile("LenderList")}
                          >
                            &times;
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                      {/* <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          selectedImage2.url !== null ||
                          selectedImage2.url !== "undefined"
                            ? selectedImage2.url
                            : ""
                        }
                        onClick={(event) =>
                          handleDownloadClick(
                            event,
                            selectedImage2.url,
                            `${firstNameRef}_lenderlist.pdf`
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        {selectedImage2.name}
                      </Link> */}
                    </div>{" "}
                  </div>

                  <div className="col-lg-12 mb-3 mt-2">
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
                    </div>
                  </div>
                  <h3 className="heading-forms mt-4">Address</h3>
                  {/* <hr /> */}

                  <div className="col-lg-12 mb-3 mt-2">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
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
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
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
                          required
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
                          Unit / Apartment No.
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          value={apartmentNumber}
                          onChange={(e) => setApartmentNumber(e.target.value)}
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
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
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
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
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
                          value={stateRef}
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
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
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
                          // onChange={(e) => handleZipCodeChange(e.target.value)}
                          onChange={(e) =>
                            handleInputChangeName(
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

                  <h3 className="mt-4">Other Details</h3>
                  <hr />

                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-4">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
                        >
                          Office Contact First Name
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput3"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: officeContactFirstNameError
                              ? "red"
                              : officeContactFirstNameValid
                              ? ""
                              : "",
                          }}
                          required
                          value={officeContactFirstName}
                          // onChange={(e) =>
                          //   setOfficeContactFirstName(e.target.value)
                          // }
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setOfficeContactFirstName,
                              setOfficeContactFirstNameValid,
                              setOfficeContactFirstNameError
                            )
                          }
                          disabled={!edit}
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
                          Office Contact Last Name
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput3"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: officeContactLastNameError
                              ? "red"
                              : officeContactLastNameValid
                              ? ""
                              : "",
                          }}
                          required
                          value={officeContactLastName}
                          // onChange={(e) =>
                          //   setOfficeContactLastName(e.target.value)
                          // }
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setOfficeContactLastName,
                              setOfficeContactLastNameValid,
                              setOfficeContactLastNameError
                            )
                          }
                          disabled={!edit}
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
                          Office Contact Email
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput3"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: officeContactEmailError
                              ? "red"
                              : officeContactEmailValid
                              ? ""
                              : "",
                          }}
                          required
                          value={officeContactEmail}
                          // onChange={(e) =>
                          //   setOfficeContactEmail(e.target.value)
                          // }
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setOfficeContactEmail,
                              setOfficeContactEmailValid,
                              setOfficeContactEmailError
                            )
                          }
                          disabled={!edit}
                        />
                        {officeContactEmailError && (
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
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
                        >
                          Office Contact Phone
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <ReactInputMask
                          mask="999 999-9999" // Canadian phone format
                          value={officeContactPhone}
                          onChange={(e) =>
                            handleInputChange(
                              e.target.value,
                              setOfficeContactPhone,
                              setOfficeContactPhoneValid,
                              setOfficeContactPhoneError
                            )
                          }
                          className="form-control"
                          // disabled={!edit}
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: officeContactPhoneError
                              ? "red"
                              : officeContactPhoneValid
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
                              title="Please enter a valid office phone number"
                              required
                              // disabled={!edit}
                            />
                          )}
                        </ReactInputMask>
                        {officeContactPhoneError && (
                          <small className="text-danger">
                            Enter valid phone number.
                          </small>
                        )}
                        {/* <input
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput3"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: officeContactPhoneError
                              ? "red"
                              : officeContactPhoneValid
                              ? ""
                              : "",
                          }}
                          required
                          value={officeContactPhone}
                          onChange={(e) =>
                            handleInputChange(
                              e.target.value,
                              setOfficeContactPhone,
                              setOfficeContactPhoneValid,
                              setOfficeContactPhoneError
                            )
                          }
                          disabled={!edit}
                        /> */}
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
                            onClick={() => setShowCard(true)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn2 btn-dark"
                            onClick={initiateTheSubmit}
                          >
                            {userData?.appraiserCompany_Datails
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
