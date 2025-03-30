"use client";

import { useEffect, useRef, useState } from "react";
import { uploadFile } from "./functions";
import { useRouter } from "next/router";
import { encryptionData } from "../../../utils/dataEncryption";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import toast from "react-hot-toast";
import { province } from "../create-listing/data";
import ReactInputMask from "react-input-mask";

const ProfileInfo = ({
  setProfileCount,
  setShowCard,
  setModalIsOpenError,
  setModalIsOpenError_01,
  setIsLoading,
}) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  let userData = JSON.parse(localStorage.getItem("user")) || {};
  const router = useRouter();

  const [SelectedImage, setSelectedImage] = useState(
    userData?.brokerage_Details?.profileImage ||
      "/assets/images/home/placeholder_01.jpg"
  );

  const [emailNotification, setEmailNotification] = useState(
    userData?.emailNotification !== null ? userData?.emailNotification : 1
  );

  const [smsNotification, setSmsNotification] = useState(
    userData?.smsNotification !== null ? userData?.smsNotification : 1
  );

  const hiddenStyle = { backgroundColor: "#E8F0FE", display: "none" };
  const viewStyle = { backgroundColor: "#E8F0FE", display: "block" };
  const [edit, setEdit] = useState(!userData.brokerage_Details?.firstName);
  const [SMSAlert, setSMSAlert] = useState(false);

  const [firstNameRef, setFirstNameRef] = useState(
    userData?.brokerage_Details?.firstName || ""
  );
  const [middleNameRef, setMiddleNameRef] = useState(
    userData?.brokerage_Details?.middleName || ""
  );
  const [lastNameRef, setLastNameRef] = useState(
    userData?.brokerage_Details?.lastName || ""
  );
  const [brokerageNameRef, setBrokerageNameRef] = useState(
    userData?.brokerage_Details?.brokerageName || ""
  );
  const [cellNumberRef, setCellNumberRef] = useState(
    userData?.brokerage_Details?.cellnumber || ""
  );

  const [mortageBrokrageLicNoRef, setMortageBrokerageLicNoRef] = useState(
    userData?.brokerage_Details?.mortageBrokerageLicNo || ""
  );
  const [mortageBrokerLicNoRef, setMortageBrokerLicNoRef] = useState(
    userData?.brokerage_Details?.mortageBrokerLicNo || ""
  );

  const [profile, setProfile] = useState(
    userData?.brokerage_Details?.profileImage || null
  );

  const [addressLineRef, setAddressLineRef] = useState(
    userData?.brokerage_Details?.adressLine1 || ""
  );
  const [addressLineTwoRef, setAddressLineTwoRef] = useState(
    userData?.brokerage_Details?.adressLine2 || ""
  );

  const [cityRef, setCityRef] = useState(
    userData?.brokerage_Details?.city || ""
  );
  const [stateRef, setStateRef] = useState(
    userData?.brokerage_Details?.province || ""
  );
  const [zipcodeRef, setZipcodeRef] = useState(
    userData?.brokerage_Details?.postalCode || ""
  );
  const [phoneNumberRef, setPhoneNumberRef] = useState(
    userData?.brokerage_Details?.phoneNumber || ""
  );

  const [assistantFirstName, setAssistantFirstName] = useState(
    userData?.brokerage_Details?.assistantFirstName || ""
  );
  const [assistantLastName, setAssistantLastName] = useState(
    userData?.brokerage_Details?.assistantLastName || ""
  );
  const [assistantPhoneNumber, setAssistantPhoneNumber] = useState(
    userData?.brokerage_Details?.assistantPhoneNumber || ""
  );
  const [assistantEmailAddress, setAssistantEmailAddress] = useState(
    userData?.brokerage_Details?.assistantEmailAddress || ""
  );

  const [assistantTwoFirstName, setAssistantTwoFirstName] = useState(
    userData?.brokerage_Details?.assistantTwoFirstName || ""
  );
  const [assistantTwoLastName, setAssistantTwoLastName] = useState(
    userData?.brokerage_Details?.assistantTwoLastName || ""
  );

  const [assistantTwoEmailAddress, setAssistantTwoEmailAddress] = useState(
    userData?.brokerage_Details?.assistantTwoEmailAddress || ""
  );

  const [assistantTwoPhoneNumber, setAssistantTwoPhoneNumber] = useState(
    userData?.brokerage_Details?.assistantTwoPhoneNumber || ""
  );

  const [emailId, setEmailId] = useState(
    userData?.brokerage_Details?.emailId || ""
  );

  const [streetName, setStreetName] = useState(
    userData?.brokerage_Details?.streetName || ""
  );
  const [streetNumber, setStreetNumber] = useState(
    userData.brokerage_Details?.streetNumber || ""
  );
  const [unit, setUnit] = useState(
    userData?.brokerage_Details?.apartmentNo || ""
  );

  const [apartmentNo, setApartmentNo] = useState(
    userData?.brokerage_Details?.apartmentNo || ""
  );

  const uploadProfile = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const dataUrl = event.target.result;

        setProfilePhoto(dataUrl);
      };

      reader.readAsDataURL(file);
    }

    console.log(typeof profilePhoto);
  };

  useEffect(() => {
    if (smsNotification === null || smsNotification === false) {
      setModalIsOpenError(true);
    } else if (emailNotification === null || emailNotification === false) {
      setModalIsOpenError_01(true);
    }
  }, [smsNotification, emailNotification]);

  // Validation fields

  // State for errors and validation
  const [firstNameError, setFirstNameError] = useState(false);
  const [brokerageError, setBrokerageError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [cellNumberError, setCellNumberError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [mortgageLicenceError, setMortgageLicenceError] = useState(false);
  const [mortgageLicenceTwoError, setMortgageLicenceTwoError] = useState(false);
  const [streetNumberError, setStreetNumberError] = useState(false);
  const [streetNameError, setStreetNameError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [zipCodeError, setZipCodeError] = useState(false);
  const [assistantFirstNameError, setAssistantFirstNameError] = useState(false);
  const [assistantLastNameError, setAssistantLastNameError] = useState(false);
  const [assistantTwotFirstNameError, setAssistantTwoFirstNameError] =
    useState(false);
  const [assistantTwoLastNameError, setAssistantTwoLastNameError] =
    useState(false);
  const [assistantPhoneNumberError, setAssistantPhoneNumberError] =
    useState(false);
  const [assistantTwoPhoneNumberError, setAssistantTwoPhoneNumberError] =
    useState(false);
  const [assistantEmailAddressError, setAssistantEmailAddressError] =
    useState(false);
  const [assistantTwoEmailAddressError, setAssistantTwoEmailAddressError] =
    useState(false);

  // State for dropdown
  const [selectedOption, setSelectedOption] = useState("");
  const [dropdownError, setDropdownError] = useState(false);

  // validate fields
  const [firstNameValid, setFirstNameValid] = useState(false);
  const [brokerageValid, setBrokerageValid] = useState(false);
  const [lastNameValid, setLastNameValid] = useState(false);
  const [phoneNumberValid, setPhoneNumberValid] = useState(false);
  const [cellNumberValid, setCellNumberValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [mortgageLicenceValid, setMortgageLicenceValid] = useState(false);
  const [mortgageLicenceTwoValid, setMortgageLicenceTwoValid] = useState(false);
  const [streetNumberValid, setStreetNumberValid] = useState(false);
  const [streetNameValid, setStreetNameValid] = useState(false);
  const [cityValid, setCityValid] = useState(false);
  const [zipCodeValid, setZipCodeValid] = useState(false);
  const [dropdownValid, setDropdownValid] = useState(false);
  const [assistantFirstNameValid, setAssistantFirstNameValid] = useState(false);
  const [assistantLastNameValid, setAssistantLastNameValid] = useState(false);
  const [assistantTwoFirstNameValid, setAssistantTwoFirstNameValid] =
    useState(false);
  const [assistantTwoLastNameValid, setAssistantTwoLastNameValid] =
    useState(false);
  const [assistantPhoneNumberValid, setAssistantPhoneNumberValid] =
    useState(false);
  const [assistantTwoPhoneNumberValid, setAssistantTwoPhoneNumberValid] =
    useState(false);
  const [assistantEmailAddressValid, setAssistantEmailAddressValid] =
    useState(false);
  const [assistantTwoEmailAddressValid, setAssistantTwoEmailAddressValid] =
    useState(false);

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

  const onUpdatHandler = () => {
    setIsLoading(true);
    const firstName =
      firstNameRef !== "" ? firstNameRef : userData.brokerage_Details.firstName;
    const lastName =
      lastNameRef !== "" ? lastNameRef : userData.brokerage_Details.lastName;
    const adressLine1 = addressLineRef;
    const city = cityRef !== "" ? cityRef : userData.brokerage_Details.city;
    const state = stateRef;
    const zipCode =
      zipcodeRef !== "" ? zipcodeRef : userData.brokerage_Details.zipCode;
    const phoneNumber =
      phoneNumberRef !== ""
        ? phoneNumberRef
        : userData.brokerage_Details.phoneNumber;
    const cellNumber =
      cellNumberRef !== ""
        ? cellNumberRef
        : userData.brokerage_Details.cellNumber;
    const adressLine2 = addressLineTwoRef;
    const middleName = middleNameRef;
    const brokerageName =
      brokerageNameRef !== ""
        ? brokerageNameRef
        : userData.brokerage_Details.brokerageName;
    const mortageBrokerLicNo =
      mortageBrokerLicNoRef !== ""
        ? mortageBrokerLicNoRef
        : userData.brokerage_Details.mortageBrokerLicNo;
    const mortageBrokrageLicNo =
      mortageBrokrageLicNoRef !== ""
        ? mortageBrokrageLicNoRef
        : userData.brokerage_Details.mortageBrokerageLicNo;
    const emailIdRef =
      emailId !== "" ? emailId : userData.brokerage_Details.emailId;
    const streetNameRef =
      streetName !== "" ? streetName : userData.brokerage_Details.streetName;

    const payload = {
      id: userData.userId,
      token: userData.token,
      firstName: firstNameRef,
      lastName: lastNameRef,
      brokerageName: brokerageNameRef,
      streetNumber: streetNumber,
      apartmentNo: apartmentNo,
      streetName: streetName,
      city: cityRef,
      province: stateRef,
      postalCode: zipCode,
      area: "",
      phoneNumber: phoneNumberRef,
      cellNumber: cellNumberRef,
      profileImage: SelectedImage,
      assistantEmailAddress: assistantEmailAddress,
      assistantFirstName: assistantFirstName,
      assistantLastName: assistantLastName,
      assistantPhoneNumber: assistantPhoneNumber,
      assistantTwoFirstName: assistantTwoFirstName,
      assistantTwoLastName: assistantTwoLastName,
      assistantTwoEmailAddress: assistantTwoEmailAddress,
      assistantTwoPhoneNumber: assistantTwoPhoneNumber,
      mortageBrokerLicNo: mortageBrokerLicNoRef,
      mortageBrokerageLicNo: mortageBrokrageLicNoRef,
      emailId: emailId,
      smsNotification: smsNotification,
      emailNotification: emailNotification,
    };
    // if (
    //   !payload.lastName ||
    //   !payload.firstName ||
    //   !payload.brokerageName ||
    //   !payload.phoneNumber ||
    //   !payload.emailId ||
    //   !payload.mortageBrokerLicNo ||
    //   !payload.mortageBrokerageLicNo ||
    //   !payload.streetName ||
    //   !payload.streetNumber ||
    //   !payload.city ||
    //   !payload.province ||
    //   !payload.postalCode
    // ) {
    //   toast.error("Please fill all the required fields!");
    // }
    const fields = [
      { key: "lastName", message: "Last Name is required!" },
      { key: "firstName", message: "First Name is required!" },
      {
        key: "brokerageName",
        message: "Brokerage Name is required!",
      },
      { key: "phoneNumber", message: "Phone Number is required!" },
      { key: "emailId", message: "Email ID is required!" },
      {
        key: "mortageBrokerLicNo",
        message: "Mortgage Broker License Number is required!",
      },
      {
        key: "mortageBrokerageLicNo",
        message: "Mortgage Brokerage License Number is required!",
      },
      // { key: "lenderListUrl", message: "Lender List URL is required!" },
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
      setIsLoading(false);
      return;
    } else if (missingFields.length > 1) {
      // Show generic error for multiple missing fields
      toast.error("Please fill all required fields!");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setIsLoading(false);
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
      setIsLoading(false);
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
      setIsLoading(false);
      return false;
    }
    // else if (
    //   brokerageName.trim().length < 1 ||
    //   brokerageName.trim().length > 30
    // ) {
    //   setBrokerageError(true);
    //   toast.error("Please enter a valid brokerage name");
    //   window.scrollTo({
    //     top: 0,
    //     behavior: "smooth",
    //   });
    //   setIsLoading(false);
    //   return false;
    // }
    else if (
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
      setIsLoading(false);
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
      setIsLoading(false);
      return false;
    } else if (
      (assistantFirstName.trim() !== "" &&
        (assistantFirstName.trim().length < 1 ||
          assistantFirstName.trim().length > 30 ||
          !nameRegex.test(assistantFirstName))) ||
      // Assistant Last Name
      (assistantLastName.trim() !== "" &&
        (assistantLastName.trim().length < 1 ||
          assistantLastName.trim().length > 30 ||
          !nameRegex.test(assistantLastName))) ||
      // Assistant Two First Name
      (assistantTwoFirstName.trim() !== "" &&
        (assistantTwoFirstName.trim().length < 1 ||
          assistantTwoFirstName.trim().length > 30 ||
          !nameRegex.test(assistantTwoFirstName))) ||
      // Assistant Two Last Name
      (assistantTwoLastName.trim() !== "" &&
        (assistantTwoLastName.trim().length < 1 ||
          assistantTwoLastName.trim().length > 30 ||
          !nameRegex.test(assistantTwoLastName)))
    ) {
      setIsLoading(false);
      toast.error("Please enter a valid assistant name");
    } else if (cellNumberRegex.test(phoneNumber) === false || !phoneNumber) {
      setPhoneNumberError(true);
      toast.error("Please enter a valid phone number");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setIsLoading(false);
      return false;
    } else if (
      cellNumber &&
      cellNumberRegex.test(cellNumber) === false &&
      cellNumber.trim() !== ""
    ) {
      toast.error("Please enter a valid cell number");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setIsLoading(false);
    } else if (
      cellNumberRegex.test(assistantPhoneNumber) === false &&
      assistantPhoneNumber.trim() !== ""
    ) {
      setIsLoading(false);
      toast.error("Please enter a valid assistant phone number");
    } else if (
      cellNumberRegex.test(assistantTwoPhoneNumber) === false &&
      assistantTwoPhoneNumber.trim() !== ""
    ) {
      setIsLoading(false);
      toast.error("Please enter a valid assistant phone number");
    } else if (emailRegex.test(emailIdRef) === false) {
      setEmailError(true);
      toast.error("Please enter a valid email address");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setIsLoading(false);
      return false;
    } else if (alphanumericWithSpacesRegex.test(zipCode) === false) {
      setZipCodeError(true);
      toast.error("Please enter a valid postal code");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setIsLoading(false);
      return false;
    } else if (
      emailRegex.test(assistantEmailAddress) === false &&
      assistantEmailAddress.trim() !== ""
    ) {
      setIsLoading(false);
      toast.error("Please enter a valid assistant email address");
    } else if (
      emailRegex.test(assistantTwoEmailAddress) === false &&
      assistantTwoEmailAddress.trim() !== ""
    ) {
      setIsLoading(false);
      toast.error("Please enter a valid assistant email address");
    } else if (
      (!firstName ||
        !lastName ||
        !streetName ||
        !streetNumber ||
        !city ||
        !state ||
        !zipCode ||
        !phoneNumber ||
        !cellNumber) &&
      !userData
    ) {
      toast.error("All required fields are not filled !!");
    } else {
      let count = 9;
      if (adressLine2) {
        count++;
      }
      if (middleName) {
        count++;
      }
      if (brokerageName) {
        count++;
      }
      if (profilePhoto) {
        count++;
      }
      if (adressLine2 === "") {
        count--;
      }
      if (middleName === "") {
        count--;
      }
      if (brokerageName === "") {
        count--;
      }
      if (profilePhoto) {
        count--;
      }

      if (SMSAlert && !phoneNumber) {
        toast.error(
          "As SMS Alert is selected but phone number is not provided so SMS Alert will not work properly!"
        );
      } else {
        toast.loading("Updating ...");
        const encryptedData = encryptionData(payload);
        axios
          .put("/api/UpdateBrokerageCompanyProfile", encryptedData)
          .then((res) => {
            toast.success("Successfully Updated !");

            let data = userData;
            data.brokerage_Details = res.data.userData.broker;
            data.smsNotification = res.data.userData.isSms;
            data.emailNotification = res.data.userData.isEmail;
            console.log("brokerageProfile", res.data.userData.broker);
            localStorage.removeItem("user");
            localStorage.setItem("user", JSON.stringify(data));
            router.push("/brokerage-dashboard");
            setShowCard(true);
          })
          .catch((err) => {
            toast.error(err.message);
            setIsLoading(false);
          })
          .finally(() => {});
        toast.dismiss();
      }
    }
    // Validate fields individually
    const isFirstNameValid = validateField(
      firstNameRef,
      setFirstNameError
      // firstNameInputRef
    );
    // const isBrokerageValid = validateField(brokerageNameRef, setBrokerageError);
    const isLastNameValid = validateField(
      lastNameRef,
      setLastNameError
      // lastNameInputRef
    );
    // const isPhoneNumberValid = validateFieldNumber(
    //   phoneNumberRef,
    //   setPhoneNumberError
    //   // phoneNumberInputRef
    // );
    const isEmailValid = validateEmailField(
      emailId,
      setEmailError
      // emailInputRef
    );
    const isMortgageLicenceValid = validateField(
      mortageBrokrageLicNoRef,
      setMortgageLicenceError
      // mortgageLicenceInputRef
    );
    const isMortgageLicenceTwoValid = validateField(
      mortageBrokerLicNoRef,
      setMortgageLicenceTwoError
      // mortgageLicenceTwoInputRef
    );
    const isStreetNumberValid = validateFieldStreetNumber(
      streetNumber,
      setStreetNumberError
      // streetNumberInputRef
    );
    const isStreetNameValid = validateFieldStreetNumber(
      streetName,
      setStreetNameError
      // streetNameInputRef
    );
    const isCityValid = validateFieldStreetNumber(
      cityRef,
      setCityError
      // cityInputRef
    );
    const isZipCodeValid = validateFieldStreetNumber(
      zipcodeRef,
      setZipCodeError
      // zipCodeInputRef
    );

    // Validate dropdown

    // if (selectedOption === "") {
    //   setDropdownError(true);
    //   dropdownRef.current.scrollIntoView({
    //     behavior: "smooth",
    //     block: "center",
    //   });
    //   dropdownRef.current.focus();
    // }
  };

  const validateField = (value, setError, inputRef) => {
    if (value.trim().length < 1 || value.trim().length > 30) {
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

  // const handleInputChange = (value, setRef, setValid, setError) => {
  //   console.log("setError function:", setError); // Debug log
  //   if (typeof setError !== "function") {
  //     console.error("setError is not a function!");
  //     return;
  //   }

  //   // Your validation logic
  //   const isValid = /^[2-9]\d{2} \d{3}-\d{4}$/.test(value);
  //   setRef(value); // Update value
  //   setValid(isValid); // Update validation state
  //   setError(!isValid); // Update error state
  // };

  // const handleInputChange = (value, setValue, setValid, setError) => {
  //   if (value.length <= 10) {
  //     setValue(value);

  //     // Validate: Check if length is between 3 and 10
  //     if (value.trim().length >= 10) {
  //       setValid(true);
  //       setError(false);
  //     } else {
  //       setValid(false);
  //       setError(true);
  //     }
  //   }
  // };

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

  // const validateFieldNumber = (value, setError, inputRef) => {
  //   if (value.trim().length < 10 || value.trim().length > 10) {
  //     setError(true); // Set error if field length is invalid
  //     // Ensure inputRef exists before calling scrollIntoView
  //     if (inputRef && inputRef.current) {
  //       inputRef.current.scrollIntoView({
  //         behavior: "smooth", // Smooth scroll to the field
  //         block: "center", // Align the field to the center
  //       });
  //       inputRef.current.focus(); // Focus on the field for the user
  //     }
  //     return false;
  //   }
  //   setError(false);
  //   return true;
  // };

  const validateFieldNumber = (value, setError, inputRef) => {
    // Check if value contains only digits
    const isNumeric = /^[0-9]*$/.test(value.trim());
    if (!isNumeric) {
      setError(true); // Set error for non-numeric input
      // Scroll to the top of the page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    }

    // Check if length is exactly 10
    if (value.trim().length !== 10) {
      setError(true); // Set error if field length is invalid
      // Scroll to the top of the page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    }

    setError(false); // Clear error if valid
    return true;
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

  const handleDropdownChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);

    // Validate: Ensure a valid option is selected
    if (value === "") {
      setDropdownError(true);
    } else {
      setDropdownError(false);
    }
  };

  const changeEditHandler = () => {
    setEdit(true);
  };
  const uploadInputRef = useRef(null);

  const openWidget = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click();
    }
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!allowedImageTypes.includes(file?.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF).");
      return;
    } else {
      const file = e.target.files[0];
      toast.loading("Uploading..");
      try {
        const generatedUrl = await uploadFile(file);
        toast.dismiss();
        toast.success("Uploaded Successfully");
        console.log("generatedUrl", generatedUrl);
        setSelectedImage(generatedUrl);
      } catch (err) {
        toast.dismiss();
        toast.error("Try Again!");
      }
    }
  };

  const handleUpload = (result) => {
    console.log("handleUpload called");
    if (result.info.secure_url) {
      setSelectedImage(result.info.secure_url);
      setProfilePhoto(result.info.secure_url);
    } else {
      console.error("Image upload failed");
    }
  };

  const handleZipCodeChange = async (val) => {
    setZipcodeRef(val);

    try {
      const response = await axios.get(
        `https://api.zippopotam.us/us/${zipcodeRef}`
      );
      const data = response.data;

      console.log(response);

      setStateRef(data.places[0]["state"]);
      setCityRef(data.places[0]["place name"]);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    const url = uploadImage(file);
    console.log(url);
  };

  // const handleInputChange = (e) => {
  //   const inputValue = e.target.value;
  //   const numericValue = inputValue.replace(/\D/g, "");
  //   const truncatedValue = numericValue.slice(0, 10);
  //   if (truncatedValue.length === 10) {
  //     setPhoneNumberRef(truncatedValue);
  //   }
  //   setPhoneNumberRef(truncatedValue);
  // };

  const handleInputChange_01 = (e) => {
    if (!e || !e.target) return; // Safeguard against undefined input
    const inputValue = e.target.value;

    // Remove all non-numeric characters
    const numericValue = inputValue.replace(/\D/g, "");

    // Truncate to 10 digits and update state
    setCellNumberRef(numericValue.slice(0, 10));
  };

  // const handleInputChange_01 = (e) => {
  //   const inputValue = e.target.value;
  //   const numericValue = inputValue.replace(/\D/g, "");
  //   const truncatedValue = numericValue.slice(0, 10);
  //   if (truncatedValue.length === 10) {
  //     setCellNumberRef(truncatedValue);
  //   }
  //   setCellNumberRef(truncatedValue);
  // };

  const handleInputChange_02 = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, "");
    const truncatedValue = numericValue.slice(0, 10);
    if (truncatedValue.length === 10) {
      setAssistantPhoneNumber(truncatedValue);
    }
    setAssistantPhoneNumber(truncatedValue);
  };

  const handleInputChange_03 = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, "");
    const truncatedValue = numericValue.slice(0, 10);
    if (truncatedValue.length === 10) {
      setAssistantTwoPhoneNumber(truncatedValue);
    }
    setAssistantTwoPhoneNumber(truncatedValue);
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12"></div>
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
                  {!edit && (
                    <div>
                      <input
                        type="file"
                        id="fileInput"
                        onChange={(e) => handleFileChange(e, 1)}
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
                        {SelectedImage !== "" &&
                          "Note -: JPG, PNG formats only"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-9">
                <div className="row mb-2">
                  <h3 className="heading-forms">
                    Mortgage Brokerage Information
                  </h3>
                  {/* <hr /> */}
                  <div className="col-lg-12 mb-3 mt-3">
                    <div className="row">
                      <div className="col-lg-5">
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
                      <div className="col-lg-5">
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
                              2: "Mortgage Brokerage Company",
                            }[userData.userType] || "Unknown User Type"
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-5">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
                        >
                          Brokerage Name <span class="req-btn">*</span>
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: brokerageError
                              ? "red"
                              : brokerageValid
                              ? ""
                              : "",
                          }}
                          id="formGroupExampleInput3"
                          value={brokerageNameRef}
                          onChange={(e) =>
                            handleInputChangeCompanyName(
                              e.target.value,
                              setBrokerageNameRef,
                              setBrokerageValid,
                              setBrokerageError
                            )
                          }
                        />
                        {brokerageError && (
                          <small className="text-danger">
                            Enter valid brokerage name.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-5">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
                        >
                          Principal Broker / Owner - First Name{" "}
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
                      <div className="col-lg-5">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
                        >
                          Principal Broker / Owner - Last Name{" "}
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
                      <div className="col-lg-5">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "5px" }}
                        >
                          Mortgage Brokerage Licence No.{" "}
                          <span class="req-btn">*</span>{" "}
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          required
                          className="form-control"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: mortgageLicenceError
                              ? "red"
                              : mortgageLicenceValid
                              ? ""
                              : "",
                          }}
                          id="formGroupExampleInput3"
                          value={mortageBrokrageLicNoRef}
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setMortageBrokerageLicNoRef,
                              setMortgageLicenceValid,
                              setMortgageLicenceError
                            )
                          }
                        />
                        {mortgageLicenceError && (
                          <small className="text-danger">
                            Enter valid mortgage brokerage licence number.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-5">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "5px" }}
                        >
                          Mortgage Broker Licence No.
                          <span class="req-btn">*</span>{" "}
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          required
                          className="form-control"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: mortgageLicenceTwoError
                              ? "red"
                              : mortgageLicenceTwoValid
                              ? ""
                              : "",
                          }}
                          id="formGroupExampleInput3"
                          value={mortageBrokerLicNoRef}
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setMortageBrokerLicNoRef,
                              setMortgageLicenceTwoValid,
                              setMortgageLicenceTwoError
                            )
                          }
                        />
                        {mortgageLicenceTwoError && (
                          <small className="text-danger">
                            Enter valid mortgage broker licence number.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-5">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
                        >
                          Phone Number (Primary) <span class="req-btn">*</span>
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
                          // onChange={handleInputChange}
                          onChange={(e) =>
                            handleInputChange(
                              e.target.value,
                              setPhoneNumberRef,
                              setPhoneNumberValid,
                              setPhoneNumberError
                            )
                          }
                        />
                        {phoneNumberError && (
                          <small className="text-danger">
                            Enter valid phone number.
                          </small>
                        )} */}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-5">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "10px" }}
                        >
                          Cell Number
                        </label>
                      </div>
                      <div className="col-lg-7">
                        {/* <input
                          type="text"
                          required
                          className="form-control"
                          id="formGroupExampleInput3"
                          style={{ backgroundColor: "#E8F0FE" }}
                          value={cellNumberRef}
                          // onChange={(e) => setCellNumberRef(e.target.value)}
                          onChange={handleInputChange_01}
                        /> */}
                        <ReactInputMask
                          mask="999 999-9999" // Canadian phone format
                          value={cellNumberRef}
                          onChange={(e) =>
                            handleInputChange(
                              e.target.value,
                              setCellNumberRef,
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
                      <div className="col-lg-5">
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
                  <hr />
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-5">
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
                      <div className="col-lg-5">
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
                          value={streetName}
                          onChange={(e) =>
                            handleInputChangeStreet(
                              e.target.value,
                              setStreetName,
                              setStreetNameValid,
                              setStreetNameError
                            )
                          }
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
                      <div className="col-lg-5">
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
                          maxLength={10}
                          // value={cityRef}
                          // onChange={(e) => setCityRef(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-5">
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
                            handleInputChangeStreet(
                              e.target.value,
                              setCityRef,
                              setCityValid,
                              setCityError
                            )
                          }
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
                      <div className="col-lg-5">
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
                          // onChange={(e) => setStateRef(e.target.value)}
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
                          // style={{
                          //   backgroundColor: "#E8F0FE",
                          // }}
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
                      <div className="col-lg-5">
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
                          onChange={(e) =>
                            handleInputChangeStreet(
                              e.target.value,
                              setZipcodeRef,
                              setZipCodeValid,
                              setZipCodeError
                            )
                          }
                          value={zipcodeRef}
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

                  <div className="mt-5">
                    <h3 className="heading-forms">Assistant#1 Information</h3>
                    <hr />
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-5">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "5px" }}
                        >
                          Assistant First Name{" "}
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: assistantFirstNameError
                              ? "red"
                              : assistantFirstNameValid
                              ? ""
                              : "",
                          }}
                          id="formGroupExampleInput3"
                          value={assistantFirstName}
                          // onChange={(e) =>
                          //   setAssistantFirstName(e.target.value)
                          // }
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setAssistantFirstName,
                              setAssistantFirstNameValid,
                              setAssistantFirstNameError
                            )
                          }
                          // disabled={!edit}
                        />
                        {assistantFirstNameError && (
                          <small className="text-danger">
                            Enter valid assistant first name.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-5 ">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "5px" }}
                        >
                          Assistant Last Name{" "}
                        </label>
                      </div>
                      <div className="col-lg-7 ">
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: assistantLastNameError
                              ? "red"
                              : assistantLastNameValid
                              ? ""
                              : "",
                          }}
                          id="formGroupExampleInput3"
                          value={assistantLastName}
                          // onChange={(e) => setAssistantLastName(e.target.value)}
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setAssistantLastName,
                              setAssistantLastNameValid,
                              setAssistantLastNameError
                            )
                          }
                          // disabled={!edit}
                        />
                        {assistantLastNameError && (
                          <small className="text-danger">
                            Enter valid assistant last name.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-5">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "5px" }}
                        >
                          Assistant Phone Number
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <ReactInputMask
                          mask="999 999-9999" // Canadian phone format
                          value={assistantPhoneNumber}
                          onChange={(e) =>
                            handleInputChange(
                              e.target.value,
                              setAssistantPhoneNumber,
                              setAssistantPhoneNumberValid,
                              setAssistantPhoneNumberError
                            )
                          }
                          className="form-control"
                          // disabled={!edit}
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: assistantPhoneNumberError
                              ? "red"
                              : assistantPhoneNumberValid
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
                              title="Please enter a valid cell number"
                              required
                              // disabled={!edit}
                            />
                          )}
                        </ReactInputMask>
                        {assistantPhoneNumberError && (
                          <small className="text-danger">
                            Enter valid phone number.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-5">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "5px" }}
                        >
                          Assistant Email Address
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="email"
                          className="form-control"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: assistantEmailAddressError
                              ? "red"
                              : assistantEmailAddressValid
                              ? ""
                              : "",
                          }}
                          required
                          id="formGroupExampleInput3"
                          value={assistantEmailAddress}
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setAssistantEmailAddress,
                              setAssistantEmailAddressValid,
                              setAssistantEmailAddressError
                            )
                          }
                          // disabled={!edit}
                        />
                        {assistantEmailAddressError && (
                          <small className="text-danger">
                            Enter valid email address.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h3 className="heading-forms">Assistant#2 Information</h3>
                    <hr />
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-5">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "5px" }}
                        >
                          Assistant First Name{" "}
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: assistantTwotFirstNameError
                              ? "red"
                              : assistantTwoFirstNameValid
                              ? ""
                              : "",
                          }}
                          id="formGroupExampleInput3"
                          value={assistantTwoFirstName}
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setAssistantTwoFirstName,
                              setAssistantTwoFirstNameValid,
                              setAssistantTwoFirstNameError
                            )
                          }
                          // disabled={!edit}
                        />
                        {assistantTwotFirstNameError && (
                          <small className="text-danger">
                            Enter valid assistant first name.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-5 ">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "5px" }}
                        >
                          Assistant Last Name{" "}
                        </label>
                      </div>
                      <div className="col-lg-7 ">
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: assistantTwoLastNameError
                              ? "red"
                              : assistantTwoLastNameValid
                              ? ""
                              : "",
                          }}
                          id="formGroupExampleInput3"
                          value={assistantTwoLastName}
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setAssistantTwoLastName,
                              setAssistantTwoLastNameValid,
                              setAssistantTwoLastNameError
                            )
                          }
                          // disabled={!edit}
                        />
                        {assistantTwoLastNameError && (
                          <small className="text-danger">
                            Enter valid assistant last name.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <div className="row">
                      <div className="col-lg-5">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "5px" }}
                        >
                          Assistant Phone Number
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <ReactInputMask
                          mask="999 999-9999" // Canadian phone format
                          value={assistantTwoPhoneNumber}
                          onChange={(e) =>
                            handleInputChange(
                              e.target.value,
                              setAssistantTwoPhoneNumber,
                              setAssistantTwoPhoneNumberValid,
                              setAssistantTwoPhoneNumberError
                            )
                          }
                          className="form-control"
                          // disabled={!edit}
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: assistantTwoPhoneNumberError
                              ? "red"
                              : assistantTwoPhoneNumberValid
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
                              title="Please enter a valid cell number"
                              required
                              // disabled={!edit}
                            />
                          )}
                        </ReactInputMask>
                        {assistantTwoPhoneNumberError && (
                          <small className="text-danger">
                            Enter valid phone number.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-5">
                        <label
                          className="text-color"
                          htmlFor=""
                          style={{ paddingTop: "5px" }}
                        >
                          Assistant Email Address
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="email"
                          className="form-control"
                          style={{
                            backgroundColor: "#E8F0FE",
                            borderColor: assistantTwoEmailAddressError
                              ? "red"
                              : assistantTwoEmailAddressValid
                              ? ""
                              : "",
                          }}
                          required
                          id="formGroupExampleInput3"
                          value={assistantTwoEmailAddress}
                          onChange={(e) =>
                            handleInputChangeName(
                              e.target.value,
                              setAssistantTwoEmailAddress,
                              setAssistantTwoEmailAddressValid,
                              setAssistantTwoEmailAddressError
                            )
                          }
                        />
                        {assistantTwoEmailAddressError && (
                          <small className="text-danger">
                            Enter valid email address.
                          </small>
                        )}
                      </div>
                    </div>
                  </div>

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
                          onClick={onUpdatHandler}
                        >
                          {userData?.brokerage_Details
                            ? "Update Profile"
                            : "Create Profile"}
                        </button>
                      </div>
                    </div>
                  </div>
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
