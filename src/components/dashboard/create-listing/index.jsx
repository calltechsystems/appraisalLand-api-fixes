"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../common/header/dashboard/Header";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu";
import MobileMenu from "../../common/header/MobileMenu_02";
import CreateList from "./CreateList";
import DetailedInfo from "./DetailedInfo";
import LocationField from "./LocationField";
import axios from "axios";
import toast from "react-hot-toast";
import { typeOfBuilding } from "./data";
import Link from "next/link";
import Image from "next/image";
import { useModal } from "../../../context/ModalContext";
import { uploadFile } from "./functions";
import LoadingSpinner from "../../common/LoadingSpinner";
import CommonLoader from "../../common/CommonLoader/page";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
// import { useLocation } from "react-router-dom";

const Index = ({ isView, propertyData }) => {
  const router = useRouter();
  const { isModalOpen, setIsModalOpen } = useModal();
  const [userData, setUserData] = useState({});
  // const userData = JSON.parse(localStorage.getItem("user"));
  const data = JSON.parse(localStorage.getItem("user"));
  // const location = useLocation();
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [updateView, setUpdateView] = useState(propertyData);
  const [isDisable, setDisable] = useState(updateView);

  const [appraisalQuoteDate, setAppraisalQuoteDate] = useState(
    propertyData ? propertyData.quoteRequiredDate : ""
  );
  const [successModal, setSuccessModal] = useState(false);
  // const [propertyId, setPropertyId] = useState(null);
  const [generatedPropertyId, setGeneratedPropertyId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [modalIsOpenError_01, setModalIsOpenError_01] = useState(false);

  const changeStringUrlHandler = (inputString) => {
    // const resultArray = inputString?.split(",");
    // return resultArray;
    return [];
  };
  const [errorMessage, setErrorMessage] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [disable, setdisable] = useState(false);
  // let userData = {};
  const [updatedProperty, setUpdatedProperty] = useState([]);

  const [remark, setRemark] = useState(propertyData?.remark || "");

  const [streetNameRef, setStreetNameRef] = useState(
    propertyData?.streetName ? propertyData?.streetName : ""
  );
  const [streetNumberRef, setStreetNumberRef] = useState(
    propertyData?.streetNumber || ""
  );
  const [apartmentNumberRef, setApartmentNumberRef] = useState(
    propertyData?.apartmentNumber || ""
  );
  const [cityRef, setCityRef] = useState(propertyData?.city || "");
  const [stateRef, setStateRef] = useState(propertyData?.province || "");
  const [zipCodeRef, setZipCodeRef] = useState(propertyData?.zipCode || null);
  const [errorLabel, setErrorLabel] = useState([]);
  const [urgencyType, setUrgencyType] = useState("");
  // const [areaRef, setAreaRef] = useState(propertyData?.area || 0);
  const [communityRef, setCommunityRef] = useState(
    propertyData?.community || ""
  );
  const [buildinRef, setBuildinRef] = useState(
    propertyData?.typeOfBuilding || null
  );
  const [urgencyRef, setUrgencyRef] = useState(
    propertyData?.urgency === 0
      ? "Rush"
      : propertyData?.urgency === 1
      ? "Regular"
      : ""
  );
  const [bidLowerRangeRef, setBidLowerRangeRef] = useState(
    propertyData?.bidLowerRange || null
  );

  const [applicantFirstName, setApplicantFirstName] = useState(
    propertyData?.applicantFirstName || null
  );
  const [applicantLatsName, setApplicantLastName] = useState(
    propertyData?.applicantLastName || null
  );
  const [applicantNumber, setApplicantNumber] = useState(
    propertyData?.applicantPhoneNumber || null
  );
  const [applicantEmail, setApplicantEmail] = useState(
    propertyData?.applicantEmailAddress || ""
  );

  const [estimatedValue, setEstimatedValue] = useState(
    propertyData?.estimatedValue || ""
  );
  const [typeOfAppraisal, setTypeOfAppraisal] = useState(
    propertyData?.typeOfAppraisal || ""
  );
  const [lenderInformation, setLenderInformation] = useState(
    propertyData?.lenderInformation || ""
  );
  const [applicantAddress, setApplicantAddress] = useState(
    propertyData?.applicantAddress || ""
  );
  const [attachment, setAttachment] = useState([]);
  const [filesUrl, setFilesUrl] = useState([]);
  const [purpose, setPurpose] = useState(propertyData?.purpose || "");

  const [otherTypeOfBuilding, setOtherTypeOfBuilding] = useState(false);
  const [otherPurpose, setOtherPurpose] = useState(false);

  const [otherTypeOfAppraisalValue, setOtherTypeOfAppraisalValue] =
    useState(false);

  const [otherUrgencyValue, setOtherUrgencyValue] = useState(false);

  const [otherTypeOfBuildingValue, setOtherTypeOfBuildingValue] =
    useState(false);
  const [otherPurposeValue, setOtherPurposeValue] = useState(false);

  const [otherTypeOfAppraisal, setOtherTypeOfAppraisal] = useState(false);

  const [otherUrgency, setOtherUrgency] = useState(false);

  const [image, setImage] = useState(propertyData?.image || []);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [TimesTrigerredSubmission, setTimesTrigerredSubmission] = useState(0);
  const [isSubmitInProgress, setIsSubmitInProgress] = useState(false);

  const [isLoading, setisLoading] = useState(false);

  const isEditMode = /\/create-listing\/\w+/.test(location.pathname);

  // Handle input changes to mark form as dirty
  const handleInputChangeNew = (e, setter) => {
    setter(e.target.value);
    setIsFormDirty(true);
  };

  // Intercept route changes
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (!isEditMode && isFormDirty) {
        setShowModal(true);
        router.events.emit("routeChangeError");
        throw "Navigation blocked";
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [isFormDirty, isEditMode, router]);

  // Warn user before refreshing/closing the tab
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isFormDirty) {
        event.preventDefault();
        event.returnValue =
          "The property data entered will be lost if you navigate from the page.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormDirty]);

  // Confirm Navigation
  const confirmNavigation = () => {
    setShowModal(false);
    setIsFormDirty(false);
    router.push(router.asPath);
  };

  useEffect(() => {
    if (
      TimesTrigerredSubmission <= 2 &&
      TimesTrigerredSubmission >= 1 &&
      isSubmitInProgress
    ) {
      submissionHandler();
    }
  }, [TimesTrigerredSubmission, isSubmitInProgress]);

  const onChangeHandler = (value, field, otherField) => {
    if (String(value) === "Other") {
      otherField(true);
    } else {
      field(value);
    }
  };

  const formatPhoneNumber = (number) => {
    if (!number) return ""; // Handle empty input

    // Remove non-numeric characters
    const digits = number.replace(/\D/g, "");

    // Format the number as "416 123-4567"
    if (digits.length <= 3) {
      return digits; // e.g., "416"
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`; // e.g., "416 123"
    } else {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`; // e.g., "416 123-4567"
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: true, // Set to false for 24-hour format
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const closeErrorModal = () => {
    setModalIsOpenError(false);
    setModalIsOpenError_01(false);
  };

  useEffect(() => {
    if (propertyData?.attachment) {
      const array = propertyData?.attachment
        ?.split(",")
        .filter((item) => item.trim() !== "");
      let updatedList = [];
      array.forEach((url) => {
        const name = url.split("/").pop().split("?")[0];
        updatedList.push({
          file: { name },
          previewUrl: name.includes("zip")
            ? "/assets/Attachments/zipIcon.png"
            : name.includes("pdf")
            ? "/assets/Attachments/pdfIcon.png"
            : url,
          uploadedUrl: url,
        });
      });

      setAttachment(updatedList);
    }
  }, [propertyData]);

  useEffect(() => {
    if (streetNameRef !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "streetName") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
  }, [streetNameRef]);

  useEffect(() => {
    if (streetNumberRef !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "streetNumber") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
  }, [streetNumberRef]);

  useEffect(() => {
    if (cityRef !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "city") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
  }, [cityRef]);

  useEffect(() => {
    if (stateRef !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "state") return false;
        else return true;
      });
      console.log("stateRef", stateRef, updatedError);
      setErrorLabel(updatedError);
    }
  }, [stateRef]);

  useEffect(() => {
    if (zipCodeRef !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "zipCode") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
  }, [zipCodeRef]);

  useEffect(() => {
    if (buildinRef !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "typeOfBuilding") return false;
        else return true;
      });
      console.log("building", buildinRef, updatedError);
      setErrorLabel(updatedError);
    }
  }, [buildinRef]);

  useEffect(() => {
    if (purpose !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "purpose") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
  }, [purpose]);

  useEffect(() => {
    if (urgencyRef !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "urgency") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
  }, [urgencyRef]);

  useEffect(() => {
    if (estimatedValue !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "estimatedValue") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
  }, [estimatedValue]);

  useEffect(() => {
    if (typeOfAppraisal !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "typeOfAppraisal") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
  }, [typeOfAppraisal]);

  useEffect(() => {
    if (applicantFirstName !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "applicantFirstName") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
  }, [applicantFirstName]);

  useEffect(() => {
    if (applicantLatsName !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "applicantLastName") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
  }, [applicantLatsName]);

  const [phoneNumber, setPhoneNumber] = useState("");
  useEffect(() => {
    if (phoneNumber !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "applicantPhoneNumber") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (applicantEmail !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "applicantEmail") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
  }, [applicantEmail]);

  useEffect(() => {
    if (appraisalQuoteDate !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "quoteRequiredDate") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
  }, [appraisalQuoteDate]);

  useEffect(() => {
    if (buildinRef !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "buildinRef") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
    if (String(buildinRef) === "Other") {
      setOtherTypeOfBuilding(true);
    } else {
      setOtherTypeOfBuilding(false);
    }
  }, [buildinRef]);

  useEffect(() => {
    if (typeOfAppraisal !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "typeOfAppraisal") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
    if (String(typeOfAppraisal) === "Other") {
      setOtherTypeOfAppraisal(true);
    } else {
      setOtherTypeOfAppraisal(false);
    }
  }, [typeOfAppraisal]);

  useEffect(() => {
    if (purpose !== "") {
      let updatedError = errorLabel.filter((err) => {
        if (String(err) === "purpose") return false;
        else return true;
      });
      setErrorLabel(updatedError);
    }
    if (String(purpose) === "Other") {
      setOtherPurpose(true);
    } else {
      setOtherPurpose(false);
    }
  }, [purpose]);

  const updateHandler = (attachmentList) => {
    setdisable(true);
    setModalIsOpen(false);
    toast.loading("Updating the data");
    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const userInfo = JSON.parse(localStorage.getItem("user"));

    const phoneNumberRegex = /^\d{10}$/;

    if (
      (!nameRegex.test(applicantFirstName) && applicantFirstName) ||
      (!nameRegex.test(applicantLatsName) && applicantLatsName)
    ) {
      toast.error("Please provide a valid applicant name");
    } else if (!emailRegex.test(applicantEmail) && applicantEmail) {
      toast.error("Please provide a valid email address");
    } else if (!phoneNumberRegex.test(applicantNumber) && applicantNumber) {
      toast.error("Please provide a valid phone number");
    } else if (
      (String(purpose) === "Purchase" || String(purpose) === "Refinance") &&
      lenderInformation === ""
    ) {
      toast.error("Please fill in Lender Information for this order");
    } else {
      const payload = {
        userId: userInfo.userId,
        streetName: streetNameRef,
        streetNumber: streetNumberRef,
        apartmentNumber: apartmentNumberRef,
        city: cityRef,
        state: stateRef,
        zipCode: zipCodeRef,
        area: "",
        community: communityRef,
        propertyId: propertyData.propertyId,
        applicantFirstName: applicantFirstName,
        applicantLastName: applicantLatsName,
        applicantPhoneNumber: applicantNumber,
        applicantEmailAddress: applicantEmail,
        bidLowerRange: Number(bidLowerRangeRef),
        bidUpperRange: Number(bidLowerRangeRef),
        propertyStatus: true,
        estimatedValue: Number(estimatedValue),
        lenderInformation: lenderInformation,
        applicantAddress: applicantAddress,
        typeOfBuilding:
          String(buildinRef) === "Other"
            ? otherTypeOfBuildingValue
            : buildinRef,
        urgency: String(urgencyRef) === "Rush" ? 0 : 1,
        typeOfAppraisal:
          String(typeOfAppraisal) === "Other"
            ? otherTypeOfAppraisalValue
            : typeOfAppraisal,
        purpose: String(purpose) === "Other" ? otherPurposeValue : purpose,

        attachment: attachmentList,
        image: "",
        quoteRequiredDate: appraisalQuoteDate,
        remark: remark ? remark : "",
        token: userInfo.token,
      };

      if (
        !payload.streetName ||
        !payload.streetNumber ||
        !payload.city ||
        !payload.state ||
        !payload.zipCode ||
        !payload.typeOfBuilding ||
        !payload.typeOfAppraisal ||
        !payload.purpose ||
        !payload.estimatedValue ||
        !payload.quoteRequiredDate
      ) {
        let tempError = errorLabel;

        if (!payload.streetName) {
          tempError.push("streetName");
        }
        if (!payload.streetNumber) {
          tempError.push("streetNumber");
        }
        if (!payload.city) {
          tempError.push("city");
        }
        if (!payload.state) {
          tempError.push("state");
        }
        if (!payload.zipCode) {
          tempError.push("zipCode");
        }
        if (!payload.typeOfBuilding) {
          tempError.push("typeOfBuilding");
        }
        if (!payload.estimatedValue) {
          tempError.push("estimatedValue");
        }
        if (!payload.purpose) {
          tempError.push("purpose");
        }
        if (!payload.typeOfAppraisal) {
          tempError.push("typeOfAppraisal");
        }
        if (!payload.applicantLastName) {
          tempError.push("applicantLastName");
        }
        if (!payload.applicantFirstName) {
          tempError.push("applicantFirstName");
        }
        if (!payload.applicantPhoneNumber) {
          tempError.push("applicantPhoneNumber");
        }
        if (!payload.applicantEmail) {
          tempError.push("applicantEmailAddress");
        }
        if (!payload.quoteRequiredDate) {
          tempError.push("quoteRequiredDate");
        }
        setErrorLabel(tempError);
      } else {
        // const encryptedData = encryptionData(payload);

        const url = window.location.pathname;

        const propertyOrderId = url.split("/create-listing/")[1];

        toast.loading("Updating the property..");
        axios
          .put("/api/addPropertyByBroker", payload, {
            headers: {
              Authorization: `Bearer ${userData.token}`,
              "Content-Type": "application/json",
            },
            params: {
              orderId: propertyOrderId,
            },
          })
          .then((res) => {
            toast.dismiss();
            toast.success("Successfully updated the property!");
            setIsFormDirty(false);
            // setSuccessModal(true);
            setModalIsOpen(false);
            router.push("/my-properties");
            setIsSubmitInProgress(false);
            setTimesTrigerredSubmission(0);
            setisLoading(false);
          })
          .catch((err) => {
            if (TimesTrigerredSubmission >= 2) {
              setdisable(false);
              setisLoading(false);
              toast.dismiss();
              toast.error(
                err.response.data.error ||
                  "Got error while updating the Property details."
              );
              setIsSubmitInProgress(false);
              setTimesTrigerredSubmission(0);
              setIsModalOpen(false)
            } else {
              setTimesTrigerredSubmission(TimesTrigerredSubmission + 1);
            }
          });
      }
    }

    toast.dismiss();
  };

  const onCancelHandler = () => {
    setModalIsOpen(false);
    // window.location.reload();
  };

  const submitHandler = () => {
    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneNumberRegex = /^\d{10}$/;
    const userInfo = JSON.parse(localStorage.getItem("user"));

    const payload = {
      streetName: streetNameRef,
      streetNumber: streetNumberRef,
      apartmentNumber: apartmentNumberRef,
      city: cityRef,
      state: stateRef,
      zipCode: zipCodeRef,
      community: communityRef,
      applicantFirstName: applicantFirstName,
      applicantLastName: applicantLatsName,
      applicantPhoneNumber: applicantNumber,
      applicantEmailAddress: applicantEmail,
      bidLowerRange: Number(bidLowerRangeRef),
      bidUpperRange: Number(bidLowerRangeRef),
      typeOfBuilding:
        String(buildinRef) === "Other" ? otherTypeOfBuildingValue : buildinRef,
      urgency: urgencyRef,
      typeOfAppraisal:
        String(typeOfAppraisal) === "Other"
          ? otherTypeOfAppraisalValue
          : typeOfAppraisal,
      purpose: String(purpose) === "Other" ? otherPurposeValue : purpose,
      propertyStatus: true,
      estimatedValue: Number(estimatedValue),
      lenderInformation: lenderInformation,
      applicantAddress: "",
      attachment,
      image: "",
      quoteRequiredDate: appraisalQuoteDate,
      remark: remark ? remark : "",
    };

    // Check for missing fields
    const missingFields = [];
    if (!payload.streetName) missingFields.push("Street Name");
    if (!payload.streetNumber) missingFields.push("Street Number");
    if (!payload.city) missingFields.push("City");
    if (!payload.state) missingFields.push("State");
    if (!payload.zipCode) missingFields.push("Zip Code");
    if (!payload.typeOfBuilding) missingFields.push("Type of Building");
    if (!payload.typeOfAppraisal) missingFields.push("Type of Appraisal");
    if (!payload.purpose) missingFields.push("Purpose");
    if (!payload.estimatedValue) missingFields.push("Estimated Value");
    if (!payload.quoteRequiredDate) missingFields.push("Quote Required Date");
    if (!payload.urgency) missingFields.push("Urgency");
    if (!payload.applicantFirstName) missingFields.push("Applicant First Name");
    if (!payload.applicantLastName) missingFields.push("Applicant Last Name");
    if (!payload.applicantPhoneNumber)
      missingFields.push("Applicant Phone Number");
    if (!payload.applicantEmailAddress)
      missingFields.push("Applicant Email Address");

    // Handle missing fields
    if (missingFields.length === 1) {
      toast.error(`${missingFields[0]} is required`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    } else if (missingFields.length > 1) {
      toast.error("Please fill all required fields");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Validate specific fields
    if (!nameRegex.test(applicantFirstName)) {
      toast.error("Please provide a valid Applicant First Name");
      return;
    }
    if (!nameRegex.test(applicantLatsName)) {
      toast.error("Please provide a valid Applicant Last Name");
      return;
    }
    if (!emailRegex.test(applicantEmail)) {
      toast.error("Please provide a valid Email Address");
      return;
    }
    if (!phoneNumberRegex.test(applicantNumber)) {
      toast.error("Please provide a valid Phone Number");
      return;
    }
    if (
      (String(purpose) === "Purchase" || String(purpose) === "Refinance") &&
      lenderInformation === ""
    ) {
      toast.error("Please fill in Lender Information for this order");
      return;
    }

    // All validations passed, proceed with submission
    setModalIsOpen(true);
    setButtonDisabled(true);
  };

  const initiateTheSubmit = () => {
    
    setModalIsOpen(false);
    setTimesTrigerredSubmission(TimesTrigerredSubmission + 1);
    setIsSubmitInProgress(true);
  };

  const submissionHandler = async () => {
    try {
      setisLoading(true);
      let uploadedUrlList = "";
      toast.loading(`${updateView ? "Updating the data" : "Saving the data"}`);

      // Create an array of promises only for files that need uploading
      const uploadPromises = attachment.map(async (file) => {
        if (file.uploadedUrl === "") {
          const generatedURL = await uploadFile(file.file);
          uploadedUrlList += generatedURL + ",";
          return {
            ...file,
            uploadedUrl: generatedURL,
          };
        } else {
          uploadedUrlList += file.uploadedUrl + ",";
          return file;
        }
      });

      // Wait for all the necessary uploads to complete
      const updatedAttachments = await Promise.all(uploadPromises);
      // Finally call the main function
      if (updateView) {
        updateHandler(uploadedUrlList);
      } else {
        finalSubmitHandler(uploadedUrlList);
      }
    } catch (err) {
      if (TimesTrigerredSubmission >= 2) {
        toast.error("Got error while saving, trying again.");
        console.error(err);

        setIsSubmitInProgress(false);
        setDisable(false);
        setisLoading(false);
        setTimesTrigerredSubmission(0);
      } else {
        setTimesTrigerredSubmission(TimesTrigerredSubmission + 1);
      }
    } finally {
      toast.dismiss();
    }
  };

  const finalSubmitHandler = (attachmentList) => {
    toast.loading("Saving the data");
    setdisable(true);
    setModalIsOpen(false);
    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const phoneNumberRegex = /^\d{10}$/;

    if (
      (!nameRegex.test(applicantFirstName) && applicantFirstName) ||
      (!nameRegex.test(applicantLatsName) && applicantLatsName)
    ) {
      toast.error("Please provide a valid applicant name");
    } else if (!emailRegex.test(applicantEmail) && applicantEmail) {
      toast.error("Please provide a valid email address");
    } else if (!phoneNumberRegex.test(applicantNumber) && applicantNumber) {
      toast.error("Please provide a valid phone number");
    } else if (
      (String(purpose) === "Purchase" || String(purpose) === "Refinance") &&
      lenderInformation === ""
    ) {
      toast.error("Please fill in Lender Information for this order");
    } else {
      const payload = {
        userId: userInfo.userId,
        streetName: streetNameRef,
        streetNumber: streetNumberRef,
        apartmentNumber: apartmentNumberRef,
        city: cityRef,
        state: stateRef,
        zipCode: zipCodeRef,
        area: "",
        community: communityRef,
        applicantFirstName: applicantFirstName,
        applicantLastName: applicantLatsName,
        applicantPhoneNumber: applicantNumber,
        applicantEmailAddress: applicantEmail || userData.userEmail,
        bidLowerRange: Number(bidLowerRangeRef),
        bidUpperRange: Number(bidLowerRangeRef),
        propertyStatus: true,
        estimatedValue: Number(estimatedValue),
        lenderInformation: lenderInformation,
        applicantAddress: applicantAddress,
        typeOfBuilding:
          String(buildinRef) === "Other"
            ? otherTypeOfBuildingValue
            : buildinRef,
        urgency: String(urgencyRef) === "Rush" ? 0 : 1,
        typeOfAppraisal:
          String(typeOfAppraisal) === "Other"
            ? otherTypeOfAppraisalValue
            : typeOfAppraisal,
        purpose: String(purpose) === "Other" ? otherPurposeValue : purpose,
        attachment: attachmentList,
        image: "",
        token: userInfo.token,
        quoteRequiredDate: appraisalQuoteDate,
        remark: remark ? remark : "",
      };

      if (
        !payload.streetName ||
        !payload.streetNumber ||
        !payload.city ||
        !payload.state ||
        !payload.zipCode ||
        !payload.typeOfBuilding ||
        !payload.typeOfAppraisal ||
        !payload.purpose ||
        !payload.estimatedValue
      ) {
        let tempError = errorLabel;

        if (!payload.streetName) {
          tempError.push("streetName");
        }
        if (!payload.streetNumber) {
          tempError.push("streetNumber");
        }
        if (!payload.city) {
          tempError.push("city");
        }
        if (!payload.state) {
          tempError.push("state");
        }
        if (!payload.zipCode) {
          tempError.push("zipCode");
        }
        if (!payload.typeOfBuilding) {
          tempError.push("typeOfBuilding");
        }
        if (!payload.estimatedValue) {
          tempError.push("estimatedValue");
        }
        if (!payload.purpose) {
          tempError.push("purpose");
        }
        if (!payload.typeOfAppraisal) {
          tempError.push("typeOfAppraisal");
        }
        if (!payload.applicantLastName) {
          tempError.push("applicantLastName");
        }
        if (!payload.applicantFirstName) {
          tempError.push("applicantFirstName");
        }
        if (!payload.applicantPhoneNumber) {
          tempError.push("applicantPhoneNumber");
        }
        if (!payload.applicantEmail) {
          tempError.push("applicantEmailAddress");
        }
        setErrorLabel(tempError);
      } else {
        toast.loading("Adding the property for appraisal ..");
        axios
          .post("/api/addBrokerProperty", payload, {
            headers: {
              Authorization: `Bearer ${userData.token}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            toast.dismiss();

            let defaultUserData =
              JSON.parse(localStorage.getItem("user")) || {};
            //set the planLimit , totalNoOfProperties
            // usedProperties count updted

            defaultUserData = {
              ...defaultUserData,
              ["planLimitExceed"]: res?.data?.userData?.planLimitExceed,
              ["usedProperties"]: res?.data?.userData?.usedProperties,
              ["totalNoOfProperties"]: res?.data?.userData?.totalNoOfProperties,
            };
            //open the Successful Modal
            const propertyId = res.data?.userData?.propertyId;

            localStorage.setItem("user", JSON.stringify(defaultUserData));
            setGeneratedPropertyId(propertyId);
            setSuccessModal(true);
            setisLoading(false);
            setIsSubmitInProgress(false);
            setTimesTrigerredSubmission(2);
            setIsFormDirty(false);
          })
          .catch((err) => {
            if (TimesTrigerredSubmission >= 2) {
              const status = err.response?.status;
              toast.dismiss();
              setdisable(false);
              setisLoading(false);

              if (status == 403) {
                setModalIsOpenError(true);
              } else if (status == 404) {
                setErrorMessage(err.response?.data?.error || "Not Found");
                setModalIsOpenError_01(true);
              } else if (status >= 500) {
                toast.error("Server error occurred. Try Again!");
              } else {
                setErrorMessage(
                  err.response?.data?.error || "An unexpected error occurred"
                );
                setModalIsOpenError_01(true);
              }

              setIsSubmitInProgress(false);
              setTimesTrigerredSubmission(0);
              setIsModalOpen(false)
            } else {
              setTimesTrigerredSubmission(TimesTrigerredSubmission + 1);
            }
          });
      }
    }
    toast.dismiss();
  };

  const handleZipCodeChange = async (e) => {
    setZipCodeRef(e.target.value);
    try {
      const response = await axios.get(
        `https://api.zippopotam.us/us/${zipCodeRef}`
      );
      const data = response.data;

      setStateRef(data.places[0]["state"]);
      setCityRef(data.places[0]["place name"]);
    } catch (error) {
      // Handle API error or invalid zip code
      console.error("Error fetching location data:", error);
    }
    setIsFormDirty(true);
  };

  const handleOkClick = () => {
    setSuccessModal(false);
    router.push("/my-properties");
  };

  useEffect(() => {
    if (isDisable) {
      setDisable(false);
    }
  }, [isDisable]);

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header userData={data} />

      {isLoading && <CommonLoader />}

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      <div className="dashboard_sidebar_menu">
        <div
          className="offcanvas offcanvas-dashboard offcanvas-start"
          tabIndex="-1"
          id="DashboardOffcanvasMenu"
          data-bs-scroll="true"
        >
          <SidebarMenu />
        </div>
      </div>
      {/* End sidebar_menu */}

      {/* <!-- Our Dashbord --> */}
      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div
          className="container-fluid ovh"
          style={{ marginLeft: "-10px", marginTop: "-40px" }}
        >
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">
                {/* Start Dashboard Navigation */}
                {/* <div className="col-lg-12">
                  <div className="dashboard_navigationbar dn db-1024">
                    <div className="dropdown">
                      <button
                        className="dropbtn"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#DashboardOffcanvasMenu"
                        aria-controls="DashboardOffcanvasMenu"
                      >
                        <i className="fa fa-bars pr10"></i> Dashboard Navigation
                      </button>
                    </div>
                  </div>
                </div> */}
                {/* End Dashboard Navigation */}

                <div className="col-lg-12 ">
                  <div className="breadcrumb_content style2">
                    {/* <h2 className="breadcrumb_title text-center">{isView?  "View the selected  property": "Add New Property"}</h2> */}
                    {/* <p>We are glad to see you again!</p> */}
                  </div>
                </div>
                {/* End .col */}
                {/* {isDisable && (
                  <div className="col-lg-12 text-end_01">
                    <button
                      className="btn btn-color mb-2 text-end"
                      onClick={() => setDisable(false)}
                    >
                      Edit Property
                    </button>
                  </div>
                )} */}
                <div className="col-lg-12">
                  <div className="my_dashboard_review">
                    <div className="row">
                      <div
                        className="col-lg-12 bg-head text-center mb-4"
                        style={{
                          borderRadius: "5px",
                          backgroundColor: "#97d700",
                        }}
                      >
                        <h4
                          className=""
                          style={{
                            paddingTop: "10px",
                            color: "#2e008b",
                            backgroundColor: "#97d700",
                            fontSize: "25px",
                          }}
                        >
                          Property Details
                          {propertyData?.orderId && (
                            <>
                              {" "}
                              - Property Id{" "}
                              <span style={{ color: "#000" }}>
                                #{propertyData.orderId}
                              </span>
                            </>
                          )}
                        </h4>
                      </div>

                      <LocationField
                        isDisable={isDisable}
                        streetNameRef={streetNameRef}
                        setStreetNameRef={setStreetNameRef}
                        streetNumberRef={streetNumberRef}
                        apartmentNumberRef={apartmentNumberRef}
                        setApartmentNumberRef={setApartmentNumberRef}
                        setStreetNumberRef={setStreetNumberRef}
                        cityRef={cityRef}
                        setCityRef={setCityRef}
                        stateRef={stateRef}
                        setStateRef={setStateRef}
                        handleZipCodeChange={handleZipCodeChange}
                        zipCodeRef={zipCodeRef}
                        errorLabel={errorLabel}
                        setZipCodeRef={setZipCodeRef}
                        propertyData={propertyData}
                        setDisable={setDisable}
                        buildinRef={buildinRef}
                        setBuildinRef={setBuildinRef}
                        communityRef={communityRef}
                        setCommunityRef={setCommunityRef}
                        urgencyRef={urgencyRef}
                        setUrgencyRef={setUrgencyRef}
                        bidLowerRangeRef={bidLowerRangeRef}
                        setBidLowerRangeRef={setBidLowerRangeRef}
                        handleInputChangeNew={handleInputChangeNew}
                        setIsFormDirty={setIsFormDirty}
                      />
                    </div>
                  </div>
                  <div className="my_dashboard_review mt10">
                    <div
                      className="col-lg-12 bg-head text-center mb-4"
                      style={{ borderRadius: "5px" }}
                    >
                      <h4
                        className="p-2"
                        style={{
                          color: "#2e008b",
                          backgroundColor: "#97d700",
                          fontSize: "25px",
                          borderRadius: "5px",
                        }}
                      >
                        Additional Property Information
                      </h4>
                    </div>
                    {/* <hr style={{ color: "#2e008b" }} /> */}
                    <CreateList
                      isDisable={isDisable}
                      errorLabel={errorLabel}
                      // areaRef={areaRef}
                      // setAreaRef={setAreaRef}
                      communityRef={communityRef}
                      setCommunityRef={setCommunityRef}
                      buildinRef={buildinRef}
                      setBuildinRef={setBuildinRef}
                      urgencyRef={urgencyRef}
                      appraisalQuoteDate={appraisalQuoteDate}
                      setAppraisalQuoteDate={setAppraisalQuoteDate}
                      setUrgencyRef={setUrgencyRef}
                      propertyData={propertyData}
                      bidLowerRangeRef={bidLowerRangeRef}
                      setBidLowerRangeRef={setBidLowerRangeRef}
                      setEstimatedValue={setEstimatedValue}
                      setPurpose={setPurpose}
                      estimatedValue={estimatedValue}
                      purpose={purpose}
                      urgencyType={urgencyType}
                      setUrgencyType={setUrgencyType}
                      lenderInformation={lenderInformation}
                      typeOffAppraisal={typeOfAppraisal}
                      setLenderInformation={setLenderInformation}
                      setTypeOfAppraisal={setTypeOfAppraisal}
                      otherPurpose={otherPurpose}
                      setOtherTypeOfBuilding={setOtherTypeOfBuilding}
                      otherTypeOfAppraisal={otherTypeOfAppraisal}
                      otherUrgency={otherUrgency}
                      otherTypeOfBuilding={otherTypeOfBuilding}
                      onChangeHandler={onChangeHandler}
                      setDisable={setDisable}
                      setOtherPurposeValue={setOtherPurposeValue}
                      setOtherTypeOfAppraisalValue={
                        setOtherTypeOfAppraisalValue
                      }
                      otherUrgencyValue={otherUrgencyValue}
                      setOtherTypeOfBuildingValue={setOtherTypeOfBuildingValue}
                      setOtherUrgencyValue={setOtherUrgencyValue}
                      handleInputChangeNew={handleInputChangeNew}
                      setIsFormDirty={setIsFormDirty}
                    />
                  </div>

                  <div className="my_dashboard_review mt10">
                    <div className="row">
                      <div
                        className="col-lg-12 bg-head text-center mb-4"
                        style={{
                          borderRadius: "5px",
                          backgroundColor: "#97d700",
                        }}
                      >
                        <h4
                          className=""
                          style={{
                            paddingTop: "10px",
                            color: "#2e008b",
                            backgroundColor: "#97d700",
                            fontSize: "25px",
                            borderRadius: "5px",
                          }}
                        >
                          Applicant / Owner Information
                          {/* <hr style={{ color: "#2e008b" }} /> */}
                        </h4>
                      </div>
                      {/* <hr style={{ color: "#2e008b" }} /> */}

                      <DetailedInfo
                        setButtonDisabled={setButtonDisabled}
                        buttonDisabled={buttonDisabled}
                        isDisable={isDisable}
                        applicantFirstName={applicantFirstName}
                        setApplicantFirstName={setApplicantFirstName}
                        setApplicantAddress={setApplicantAddress}
                        applicantAddress={applicantAddress}
                        setFilesUrl={setFilesUrl}
                        changeStringUrlHandler={changeStringUrlHandler}
                        filesUrl={filesUrl}
                        image={image}
                        disable={disable}
                        setImage={setImage}
                        setAttachment={setAttachment}
                        errorLabel={errorLabel}
                        setRemark={setRemark}
                        remark={remark}
                        attachment={attachment}
                        applicantLatsName={applicantLatsName}
                        setApplicantLastName={setApplicantLastName}
                        applicantNumber={applicantNumber}
                        setApplicantNumber={setApplicantNumber}
                        applicantEmail={applicantEmail}
                        setApplicantEmail={setApplicantEmail}
                        updateHandler={updateHandler}
                        submitHandler={submitHandler}
                        propertyData={propertyData}
                        setDisable={setDisable}
                        onCancelHandler={onCancelHandler}
                        handleInputChangeNew={handleInputChangeNew}
                        setIsFormDirty={setIsFormDirty}
                      />
                    </div>
                  </div>
                  {/* <div className="my_dashboard_review mt30">
                    <div className="col-lg-12">
                      <h3 className="mb30">Property media</h3>
                    </div>
                    <PropertyMediaUploader />
                  </div> */}
                  {/* <div className="my_dashboard_review mt30">
                    <div className="col-lg-12">
                      <h3 className="mb30">Property Information</h3>
                    
                    </div>
                    <FloorPlans />
                </div>*/}
                </div>
                {/* End .col */}
              </div>
              {/* End .row */}
              <div>
                {modalIsOpen && (
                  <div className="modal">
                    <div className="modal-content">
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="col-lg-12">
                            <Link href="/" className="">
                              <Image
                                width={50}
                                height={45}
                                className="logo1 img-fluid"
                                style={{ marginTop: "-20px" }}
                                src="/assets/images/Appraisal_Land_Logo.png"
                                alt="header-logo2.png"
                              />
                              <span
                                style={{
                                  color: "#2e008b",
                                  fontWeight: "bold",
                                  fontSize: "24px",
                                  // marginTop: "20px",
                                }}
                              >
                                Appraisal
                              </span>
                              <span
                                style={{
                                  color: "#97d700",
                                  fontWeight: "bold",
                                  fontSize: "24px",
                                  // marginTop: "20px",
                                }}
                              >
                                {" "}
                                Land
                              </span>
                            </Link>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-12 text-center">
                            <h1 className="text-color mt-1">
                              Property Details
                              {propertyData?.orderId && (
                                <>
                                  {" "}
                                  - Property Id{" "}
                                  <span style={{ color: "#97d700" }}>
                                    #{propertyData.orderId}
                                  </span>
                                </>
                              )}
                            </h1>
                          </div>
                        </div>
                        <div
                          className="mt-2 mb-3"
                          style={{ border: "2px solid #97d700" }}
                        ></div>
                      </div>

                      <div
                        className="d-flex justify-content-center mt-2"
                        id="property-info-container"
                      >
                        <table id="table-broker-info">
                          <thead>
                            <tr>
                              <th></th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="table-header">
                                <span className="text-start">
                                  Property Address
                                </span>
                              </td>
                              <td className="table-value">
                                {streetNumberRef} {streetNameRef} {cityRef}{" "}
                                {stateRef} {zipCodeRef}
                              </td>
                            </tr>

                            <tr>
                              <td className="table-header">
                                <span className="text-start">
                                  {" "}
                                  Property Type
                                </span>
                              </td>
                              <td className="table-value">
                                {String(buildinRef) === "Other"
                                  ? otherTypeOfBuildingValue
                                  : buildinRef}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-header">
                                <span className="text-start">
                                  {" "}
                                  Type of Appraisal
                                </span>
                              </td>
                              <td className="table-value">
                                {String(typeOfAppraisal) === "Other"
                                  ? otherTypeOfAppraisalValue
                                  : typeOfAppraisal}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-header">
                                <span className="text-start"> Purpose</span>
                              </td>
                              <td className="table-value">
                                {String(purpose) === "Other"
                                  ? otherPurposeValue
                                  : purpose}
                              </td>
                            </tr>
                            {lenderInformation && (
                              <tr>
                                <td className="table-header">
                                  <span className="text-start">
                                    {" "}
                                    Lender Information
                                  </span>
                                </td>
                                <td className="table-value">
                                  {lenderInformation}
                                </td>
                              </tr>
                            )}

                            {communityRef && (
                              <tr>
                                <td className="table-header">
                                  <span className="text-start">Community</span>
                                </td>
                                <td className="table-value">{communityRef}</td>
                              </tr>
                            )}
                            <tr>
                              <td className="table-header">
                                <span className="text-start">
                                  Estimated Value / Purchased Price
                                </span>
                              </td>
                              <td className="table-value">
                                {" "}
                                ${addCommasToNumber(estimatedValue)}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-header">
                                <span className="text-start">Urgency</span>
                              </td>
                              <td className="table-value">
                                {" "}
                                {String(urgencyRef) === "Other"
                                  ? otherUrgencyValue
                                  : urgencyRef}
                              </td>
                            </tr>

                            <tr>
                              <td className="table-header">
                                <span className="text-start">
                                  Quote Required Date
                                </span>
                              </td>
                              <td className="table-value">
                                {" "}
                                {formatDate(appraisalQuoteDate)}
                              </td>
                            </tr>

                            <tr>
                              <td className="table-header">
                                <span className="text-start">
                                  Applicant Name
                                </span>
                              </td>
                              <td className="table-value">
                                {" "}
                                {applicantFirstName} {applicantLatsName}
                              </td>
                            </tr>
                            <tr>
                              <td className="table-header">
                                <span className="text-start">
                                  Email Address
                                </span>
                              </td>
                              <td className="table-value"> {applicantEmail}</td>
                            </tr>
                            <tr>
                              <td className="table-header">
                                <span className="text-start">Phone Number</span>
                              </td>
                              <td className="table-value">
                                {" "}
                                {formatPhoneNumber(applicantNumber)}
                              </td>
                            </tr>
                            {/* {applicantAddress && (
                            <tr>
                              <td
                                className="table-value"
                              >
                                <span className="text-start">Address</span>
                              </td>
                              <td
                                className="table-value"
                              >
                                {" "}
                                {bidLowerRangeRef}
                              </td>
                            </tr>
                          )} */}
                            {false && (
                              <tr>
                                <td className="table-value">
                                  <span className="text-start">
                                    Remark / Summary
                                  </span>
                                </td>
                                <td className="table-value">
                                  {" "}
                                  {bidLowerRangeRef}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="row text-center mt-3">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-color"
                            onClick={onCancelHandler}
                            style={{ width: "130px" }}
                            disabled={disable}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-color"
                            onClick={initiateTheSubmit}
                            disabled={disable}
                            style={{ width: "130px" }}
                          >
                            Submit
                          </button>
                        </div>
                      </div>

                      {/* <div
                        className="text-center"
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label>Property Value : ${bidLowerRangeRef}</label>
                        <label>community Type : {communityRef}</label>
                        <label>Property type : {buildinRef}</label>
                        <label>
                          {streetNameRef} {streetNumberRef} {cityRef}
                        </label>
                        <label>zipCode : {zipCodeRef}</label>
                        <label>
                          Property By : {applicantFirstName} {applicantLatsName}
                        </label>
                        <label>
                          {applicantEmail} - {applicantNumber}
                        </label>

                        <button
                          className="btn w-35 btn-white"
                          onClick={() => finalSubmitHandler()}
                        >
                          OK
                        </button>
                      </div> */}
                    </div>
                  </div>
                )}
              </div>

              {modalIsOpenError_01 && (
                <div className="modal">
                  <div
                    className="modal-content"
                    style={{ borderColor: "red", width: "40%" }}
                  >
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-12">
                          <Link href="/" className="">
                            <Image
                              width={50}
                              height={45}
                              className="logo1 img-fluid"
                              style={{ marginTop: "-20px" }}
                              src="/assets/images/Appraisal_Land_Logo.png"
                              alt="header-logo2.png"
                            />
                            <span
                              style={{
                                color: "#2e008b",
                                fontWeight: "bold",
                                fontSize: "24px",
                                // marginTop: "20px",
                              }}
                            >
                              Appraisal
                            </span>
                            <span
                              style={{
                                color: "#97d700",
                                fontWeight: "bold",
                                fontSize: "24px",
                                // marginTop: "20px",
                              }}
                            >
                              {" "}
                              Land
                            </span>
                          </Link>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12 text-center">
                          <h3 className=" text-danger mt-1">Error</h3>
                        </div>
                      </div>
                      <div
                        className="mt-2 mb-3"
                        style={{ border: "2px solid #97d700" }}
                      ></div>
                    </div>
                    <span
                      className="text-center mb-2 text-dark fw-bold"
                      style={{ fontSize: "18px" }}
                    >
                      {errorMessage}
                    </span>
                    <div
                      className="mt-2 mb-3"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <div
                      className="col-lg-12 text-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <button
                        className="btn btn-color w-50"
                        onClick={() => closeErrorModal()}
                        style={{}}
                      >
                        Ok
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {successModal && (
                <div className="modal">
                  <div
                    className="modal-content"
                    style={{ borderColor: "#97d700", width: "35%" }}
                  >
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-12">
                          <Link href="/" className="">
                            <Image
                              width={50}
                              height={45}
                              className="logo1 img-fluid"
                              style={{ marginTop: "-20px" }}
                              src="/assets/images/Appraisal_Land_Logo.png"
                              alt="header-logo2.png"
                            />
                            <span
                              style={{
                                color: "#2e008b",
                                fontWeight: "bold",
                                fontSize: "24px",
                                // marginTop: "20px",
                              }}
                            >
                              Appraisal
                            </span>
                            <span
                              style={{
                                color: "#97d700",
                                fontWeight: "bold",
                                fontSize: "24px",
                                // marginTop: "20px",
                              }}
                            >
                              {" "}
                              Land
                            </span>
                          </Link>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12 text-center">
                          <h3 className=" text-color mt-1">Success</h3>
                        </div>
                      </div>
                      <div
                        className="mt-2 mb-3"
                        style={{ border: "2px solid #97d700" }}
                      ></div>
                    </div>
                    <span
                      className="text-center mb-2 text-dark fw-bold"
                      style={{ fontSize: "18px" }}
                    >
                      <h3 className="text-dark mb-2">
                        Property Added Successfully!
                      </h3>
                      <p className="text-dark fs-5">
                        Your Property ID is :{" "}
                        <span className="text-color fw-bold fs-4 mt-2">
                          {generatedPropertyId}
                        </span>
                      </p>
                    </span>
                    <div
                      className="mt-2 mb-3"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <div
                      className="col-lg-12 text-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <button
                        className="btn btn-color w-25"
                        onClick={() => handleOkClick()}
                        style={{}}
                      >
                        Ok
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {modalIsOpenError && (
                <div className="modal">
                  <div
                    className="modal-content"
                    style={{ borderColor: "red", width: "40%" }}
                  >
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-12">
                          <Link href="/" className="">
                            <Image
                              width={50}
                              height={45}
                              className="logo1 img-fluid"
                              style={{ marginTop: "-20px" }}
                              src="/assets/images/Appraisal_Land_Logo.png"
                              alt="header-logo2.png"
                            />
                            <span
                              style={{
                                color: "#2e008b",
                                fontWeight: "bold",
                                fontSize: "24px",
                                // marginTop: "20px",
                              }}
                            >
                              Appraisal
                            </span>
                            <span
                              style={{
                                color: "#97d700",
                                fontWeight: "bold",
                                fontSize: "24px",
                                // marginTop: "20px",
                              }}
                            >
                              {" "}
                              Land
                            </span>
                          </Link>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12 text-center">
                          <h3 className=" text-danger mt-1">Error</h3>
                        </div>
                      </div>
                      <div
                        className="mt-2 mb-3"
                        style={{ border: "2px solid #97d700" }}
                      ></div>
                    </div>
                    <span
                      className="text-center mb-2 text-dark fw-bold"
                      style={{ fontSize: "18px" }}
                    >
                      {/* Can't appraise the property. All properties are being
                      used!! */}
                      Your All Properties have been Used, so you cannot add more
                      properties.If you want to add more properties, you will
                      have to add Top-up.
                    </span>
                    <div
                      className="mt-2 mb-3"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <div
                      className="col-lg-12 text-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <button
                        className="btn btn-color w-50"
                        onClick={() => closeErrorModal()}
                        style={{}}
                      >
                        Ok
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isModalOpen && (
                <div className="modal">
                  <div className="modal-content" style={{ width: "25%" }}>
                    <div className="row">
                      <div className="col-lg-12">
                        <Link href="/" className="">
                          <Image
                            width={50}
                            height={45}
                            className="logo1 img-fluid"
                            style={{ marginTop: "-20px" }}
                            src="/assets/images/logo.png"
                            alt="header-logo2.png"
                          />
                          <span
                            style={{
                              color: "#2e008b",
                              fontWeight: "bold",
                              fontSize: "24px",
                              // marginTop: "20px",
                            }}
                          >
                            Appraisal
                          </span>
                          <span
                            style={{
                              color: "#97d700",
                              fontWeight: "bold",
                              fontSize: "24px",
                              // marginTop: "20px",
                            }}
                          >
                            {" "}
                            Land
                          </span>
                        </Link>
                      </div>
                    </div>
                    <h3
                      className="text-center mt-3"
                      style={{ color: "#2e008b" }}
                    >
                      Information <span style={{ color: "#97d700" }}></span>
                    </h3>
                    <div
                      className="mb-2"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <p className="fs-5 text-center text-dark mt-4">
                      You&apos;ve hit your subscription limit.
                      <br />
                      Kindly Top Up.{" "}
                      {/* <span className="text-danger fw-bold">Top Up</span>{" "} */}
                    </p>
                    <div
                      className="mb-3 mt-4"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <div className="col-lg-12 d-flex justify-content-center gap-2">
                      <button
                        // disabled={disable}
                        className="btn btn-color w-25"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Ok
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal for Unsaved Changes Warning */}
              {showModal && !isEditMode && (
                <div className="modal">
                  <div className="modal-content" style={{ width: "25%" }}>
                    <div className="row">
                      <div className="col-lg-12">
                        <Link href="/" className="">
                          <Image
                            width={50}
                            height={45}
                            className="logo1 img-fluid"
                            style={{ marginTop: "-20px" }}
                            src="/assets/images/logo.png"
                            alt="header-logo2.png"
                          />
                          <span
                            style={{
                              color: "#2e008b",
                              fontWeight: "bold",
                              fontSize: "24px",
                              // marginTop: "20px",
                            }}
                          >
                            Appraisal
                          </span>
                          <span
                            style={{
                              color: "#97d700",
                              fontWeight: "bold",
                              fontSize: "24px",
                              // marginTop: "20px",
                            }}
                          >
                            {" "}
                            Land
                          </span>
                        </Link>
                      </div>
                    </div>
                    <h3
                      className="text-center mt-3"
                      style={{ color: "#2e008b" }}
                    >
                      Information <span style={{ color: "#97d700" }}></span>
                    </h3>
                    <div
                      className="mb-2"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <p className="fs-5 text-center text-dark mt-4">
                      The property data entered will be lost if you navigate
                      from the page.
                      {/* <br />
                      Kindly Top Up.{" "} */}
                      {/* <span className="text-danger fw-bold">Top Up</span>{" "} */}
                    </p>
                    <div
                      className="mb-3 mt-4"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <div className="col-lg-12 d-flex justify-content-center gap-2">
                      <button
                        // disabled={disable}
                        className="btn btn-color w-25"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        // disabled={disable}
                        className="btn btn-color w-25"
                        onClick={confirmNavigation}
                      >
                        Ok
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Body>
                  <p>
                    The property data entered will be lost if you navigate from
                    the page.
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={confirmNavigation}>
                    OK
                  </Button>
                </Modal.Footer>
              </Modal> */}

              <div className="row mt50">
                <div className="col-lg-12">
                  <div className="copyright-widget-dashboard text-center">
                    <p>
                      &copy; {new Date().getFullYear()} Appraisal Land. All
                      Rights Reserved.
                    </p>
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End .col */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
