import Header from "../../common/header/dashboard/HeaderAppraiserCompany";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu_002";
import MobileMenu from "../../common/header/MobileMenu_01";
import TableData from "./TableData";
import Filtering from "./Filtering";
import FilteringBy from "./FilteringBy";
import Pagination from "./Pagination";
import SearchBox from "./SearchBox";
import { useEffect, useRef } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";
import Modal from "./Modal";
import { encryptionData } from "../../../utils/dataEncryption";
import Loader from "./Loader";
import { AppraiserStatusOptions } from "../create-listing/data";
import Form from "../../appraiser-register/Form";
import Link from "next/link";
import { FaCopy } from "react-icons/fa";
import Image from "next/image";
import CommonLoader from "../../common/CommonLoader/page";

const Index = () => {
  const [assignModal, setAssignModal] = useState(false);
  const [assignAppraiserId, setAssignAppraiserId] = useState(-1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [toggleId, setToggleId] = useState(-1);
  const [allListedAssignAppraiser, setallListedAssignAppraiser] = useState([]);

  const [openEditModal, setOpenEditModal] = useState(false);

  const [closeRegisterModal, setCloseRegisterModal] = useState(false);
  const [toggleWishlist, setToggleWishlist] = useState(0);
  const [searchResult, setSearchResult] = useState([]);
  const [property, setProperty] = useState("");
  const [startLoading, setStartLoading] = useState(false);
  const [filterProperty, setFilterProperty] = useState("");
  const [filterQuery, setFilterQuery] = useState("Last 30 Days");
  const [searchQuery, setSearchQuery] = useState("city");
  const [properties, setProperties] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [lowRangeBid, setLowRangeBid] = useState("");
  const [propertyId, setPropertyId] = useState(null);
  const [updatedCode, setUpdatedCode] = useState(false);

  const [appraiser, setAppraiser] = useState({});
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const [firstName, setFirstName] = useState(
    appraiser?.firstName ? appraiser?.firstName : ""
  );
  const [lastName, setLastName] = useState(
    appraiser?.lastName ? appraiser?.lastName : ""
  );
  const [companyName, setCompanyName] = useState(
    appraiser?.companyName ? appraiser?.companyName : ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    appraiser?.phoneNumber ? appraiser?.phoneNumber : ""
  );

  const [streetName, setStreetName] = useState(
    appraiser?.streetName ? appraiser?.streetName : ""
  );
  const [streetNumber, setStreetNumber] = useState(
    appraiser?.streetNumber ? appraiser?.streetNumber : ""
  );
  const [postalCode, setPostalCode] = useState(
    appraiser?.postalCode ? appraiser?.postalCode : ""
  );
  const [city, setCity] = useState(appraiser?.city ? appraiser?.city : "");

  const [start, setStart] = useState(0);

  const [end, setEnd] = useState(5);

  const [currentViewAppraiser, setCurrentViewAppraiser] = useState({});
  const [openViewModal, setOpenViewModal] = useState(false);
  const [appraiserCompanyInfo, setAppraiserCompanyInfo] = useState({});

  const [isStatusModal, setIsStatusModal] = useState(false);

  const [selectedAppraiser, setSelectedAppraiser] = useState(-1);

  const [isActive, setIsActive] = useState(0);
  // const [userInfo, setUserInfo] = useState("");
  const [disable, setDisable] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentViewAppraiser.userInfo);
      // alert("Copied to clipboard!");
      toast.dismiss();
      toast.success("Copied To Clipboard");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const closeAssignModal = () => {
    setAssignModal(false);
    setSelectedAppraiser({});
    setAssignAppraiserId(-1);
  };

  const getIfAssignedProperties = (id) => {
    let ifPresent = 0;
    allListedAssignAppraiser.map((assign, index) => {
      if (String(assign.appraiserid) === String(id)) {
        ifPresent += 1;
      }
    });
    // return ifPresent > 0 ? true : false;
  };

  const handleStatusUpdateHandler = () => {
    if (
      getIfAssignedProperties(selectedAppraiser.id) &&
      selectedAppraiser.isActive
    ) {
      setModalIsOpenError_01(true);
      setOpenEditModal(true);
      // toast.error(
      //   "This appraiser individual cannot be turned inactive as they currently have ongoing properties allotted to them. Please reassign those properties to another appraisal individual.",
      //   { autoClose: 10000 }
      // );
    } else {
      const userData = JSON.parse(localStorage.getItem("user"));
      setDisable(true);
      const payload = {
        id: selectedAppraiser.userId,
        IsActive: !selectedAppraiser.isActive,
      };

      const encryptedData = encryptionData(payload);
      setIsLoading(true);
      toast.loading("Updating the status");
      axios
        .put("/api/updateIsActiveAppraiser", encryptedData, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          toast.dismiss();
          setIsLoading(false);
          toast.success("Successfully Updated!!");
          window.location.reload();
        })
        .catch((err) => {
          toast.dismiss();
          setIsLoading(false);
          toast.error(err);
        });

      setSelectedAppraiser(-1);
    }
  };

  const closeStatusUpdateHandler = () => {
    setSelectedAppraiser(-1);
    setOpenEditModal(false);
  };

  const [modalIsOpenError_01, setModalIsOpenError_01] = useState(false);
  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [paginatedRow, setPaginatedRow] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const closeErrorModal = () => {
    setModalIsOpenError(false);
    setModalIsOpenError_01(false);
  };

  const [openBrokerModal, setOpenBrokerModal] = useState(false);
  const [broker, setBroker] = useState({});

  const closeBrokerModal = () => {
    setOpenBrokerModal(false);
  };

  const closeQuoteModal = () => {
    setIsModalOpen(false);
  };

  const openQuoteModal = () => {
    setIsModalOpen(false);
    setIsQuoteModalOpen(true);
  };

  const openModalBroker = (property) => {
    setBroker(property);
    setOpenBrokerModal(true);
  };
  const router = useRouter();
  const [lastActivityTimestamp, setLastActivityTimestamp] = useState(
    Date.now()
  );

  console.log(closeRegisterModal);

  const submitEditHandler = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const payload = {
      firstName: firstName,
      middleName: "",
      lastName: lastName,
      companyName: companyName,
      city: city,
      province: "",
      postalCode: postalCode,
      area: "",
      apartmentNo: "",
      streetName: streetName,
      streetNumber: streetNumber,
      phoneNumber: phoneNumber,
      commissionRate: Number(0),
      maxNumberOfAssignedOrders: Number(0),
      designation: "",
      profileImage: "",
      token: userData.token,
      id: appraiser.userId,
    };

    toast.loading("Updating the profile!!");

    const encryptedBody = encryptionData(payload);

    axios
      .put("/api/updateAppraiserProfile", encryptedBody)
      .then((res) => {
        toast.dismiss();
        toast.success("Successfully updated!!");
        location.reload(true);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Try Again!");
        setAppraiser({});
        setOpenEditModal(false);
      });
  };
  useEffect(() => {
    const activityHandler = () => {
      setLastActivityTimestamp(Date.now());
    };

    // Attach event listeners for user activity
    window.addEventListener("mousemove", activityHandler);
    window.addEventListener("keydown", activityHandler);
    window.addEventListener("click", activityHandler);

    // Cleanup event listeners when the component is unmounted
    return () => {
      window.removeEventListener("mousemove", activityHandler);
      window.removeEventListener("keydown", activityHandler);
      window.removeEventListener("click", activityHandler);
    };
  }, []);

  useEffect(() => {
    // Check for inactivity every minute
    const inactivityCheckInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivityTimestamp;

      // Check if there has been no activity in the last 10 minutes (600,000 milliseconds)
      if (timeSinceLastActivity > 600000) {
        localStorage.removeItem("user");
        router.push("/login");
      }
    }, 60000); // Check every minute

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(inactivityCheckInterval);
  }, [lastActivityTimestamp]);

  const openModal = (property) => {
    setProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const filterProperties = (propertys, searchInput) => {
      if (searchInput === "") {
        return propertys;
      }
      const filteredProperties = propertys.filter((property) => {
        // Convert the search input to lowercase for a case-insensitive search
        const searchTerm = searchInput.toLowerCase();

        // Check if any of the fields contain the search term
        return (
          //implment search over this only
          String(property.orderId).toLowerCase().includes(searchTerm) ||
          property.zipCode.toLowerCase().includes(searchTerm) ||
          property.city.toLowerCase().includes(searchTerm) ||
          property.province.toLowerCase().includes(searchTerm)
        );
      });

      return filteredProperties;
    };
    const filteredData = filterProperties(properties, searchInput);
    setFilterProperty(filteredData);
  }, [searchInput]);

  const filterData = (tempData) => {
    const currentDate = new Date();
    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    switch (filterQuery) {
      case "Last 30 Days":
        const thirtyDaysAgo = new Date(currentDate);
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        return tempData.filter(
          (item) => new Date(item.addedDatetime) >= thirtyDaysAgo
        );
      case "Last 1 month":
        const oneMonthAgo = new Date(currentDate);
        oneMonthAgo.setMonth(currentDate.getMonth() - 1);
        return tempData.filter(
          (item) => new Date(item.addedDatetime) >= oneMonthAgo
        );
      case "Last 6 months":
        const sixMonthsAgo = new Date(currentDate);
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
        return tempData.filter(
          (item) => new Date(item.addedDatetime) >= sixMonthsAgo
        );
      case "Last 1 year":
        return tempData.filter(
          (item) => new Date(item.addedDatetime) >= oneYearAgo
        );
      default:
        return tempData; // Return all data if no valid timeFrame is specified
    }
  };

  useEffect(() => {
    const tmpData = filterData(properties);
    setProperties(tmpData);
  }, [filterQuery]);

  const handleDelete = () => {
    const data = JSON.parse(localStorage.getItem("user"));

    toast.loading("deleting this property");
    axios
      .delete("/api/deleteBrokerPropertyById", {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        params: {
          propertyId: property.propertyId,
        },
      })
      .then((res) => {
        setRerender(true);
      })
      .catch((err) => {
        toast.error(err);
      });
    toast.dismiss();
    closeModal();
  };

  useEffect(() => {
    setIsLoading(false);
  }, [updatedCode]);

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data) {
      router.push("/login");
    }
    // else if (!data?.brokerage_Details.firstName) {
    //   router.push("/appraiser-profile");
    // }
    if (!data) {
      router.push("/login");
    }
    const fetchData = () => {
      if (data) {
        setUserData(data);
      }
    };
    fetchData();
  }, []);

  const closeViewModal = () => {
    setOpenViewModal(false);
    setCurrentViewAppraiser({});
  };

  const participateHandler = (val, id) => {
    setLowRangeBid(val);
    setPropertyId(id);
    setModalOpen(true);
  };

  const onWishlistHandler = (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));

    const formData = {
      userId: userData.userId,
      propertyId: id,
      token: userData.token,
    };

    const payload = encryptionData(formData);

    toast.loading("Setting this property into your wishlist");
    axios
      .post("/api/addToWishlist", payload)
      .then((res) => {
        toast.dismiss();
        toast.success("Successfully added !!! ");
        location.reload(true);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response?.data?.error);
      });
  };

  useEffect(() => {
    console.log(searchQuery);
    const tempData = properties;
    if (searchInput === "") {
      return;
    } else if (searchQuery === "city") {
      const newProperties = tempData.filter((item) => {
        if (item.city.toLowerCase() === searchInput.toLowerCase()) {
          return true;
        } else {
          return false;
        }
      });
      setSearchResult(newProperties);
    } else if (searchQuery === "state") {
      const newProperties = tempData.filter((item) => {
        if (item.state.toLowerCase() === searchInput.toLowerCase()) {
          return true;
        } else {
          return false;
        }
      });
      setSearchResult(newProperties);
    } else {
      const newProperties = tempData.filter((item) => {
        if (item.zipCode.toLowerCase() === searchInput.toLowerCase()) {
          return true;
        } else {
          return false;
        }
      });
      setSearchResult(newProperties);
    }
  }, [searchInput]);

  return (
    <>
      <Header userData={userData} />
      {isLoading && <CommonLoader />}

      <MobileMenu />

      <div className="dashboard_sidebar_menu">
        <div
          className="offcanvas offcanvas-dashboard offcanvas-start"
          tabIndex="-1"
          id="DashboardOffcanvasMenu"
          data-bs-scroll="true"
        >
          <SidebarMenu userData={userData} />
        </div>
      </div>
      <section className="our-dashbord dashbord bgc-f7 pb50 dashboard-height">
        <div
          className="container-fluid ovh table-padding container-padding"
          style={{}}
        >
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">
                <div className="col-lg-12 col-xl-12"></div>
                {/* End .col */}

                <div className="col-lg-12">
                  <div className="">
                    <div className="property_table">
                      <div className="mt0">
                        <TableData
                          userData={userData}
                          setModalOpen={openModal}
                          close={closeModal}
                          setProperties={setProperties}
                          properties={
                            searchInput === "" ? properties : filterProperty
                          }
                          setAppraiser={setAppraiser}
                          setUpdatedCode={setUpdatedCode}
                          onWishlistHandler={onWishlistHandler}
                          participateHandler={participateHandler}
                          setErrorMessage={setErrorMessage}
                          setModalIsOpenError={setModalIsOpenError}
                          setRefresh={setRefresh}
                          refresh={refresh}
                          setallListedAssignAppraiser={
                            setallListedAssignAppraiser
                          }
                          setAssignAppraiserId={setAssignAppraiserId}
                          setCurrentViewAppraiser={setCurrentViewAppraiser}
                          setOpenViewModal={setOpenViewModal}
                          setAppraiserCompanyInfo={setAppraiserCompanyInfo}
                          setStartLoading={setStartLoading}
                          openModalBroker={openModalBroker}
                          setIsStatusModal={setIsStatusModal}
                          setSearchInput={setSearchInput}
                          setFilterQuery={setFilterQuery}
                          setOpenEditModal={setOpenEditModal}
                          setCloseRegisterModal={setCloseRegisterModal}
                          start={start}
                          setSelectedAppraiser={setSelectedAppraiser}
                          end={end}
                        />

                        {modalIsOpenError && (
                          <div className="modal">
                            <div
                              className="modal-content"
                              style={{ borderColor: "#2e008b", width: "20%" }}
                            >
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
                              <h3
                                className="text-center"
                                style={{ color: "#2e008b" }}
                              >
                                Error
                              </h3>
                              <div
                                className="mb-2"
                                style={{ border: "2px solid #97d700" }}
                              ></div>
                              <p className="text-center fs-5 fw-bold">
                                {errorMessage}
                              </p>
                              <div
                                className="mb-2"
                                style={{ border: "2px solid #97d700" }}
                              ></div>
                              <div
                                className="col-lg-12 text-center"
                                style={{ marginRight: "4%" }}
                              >
                                <button
                                  className="btn btn-color w-25"
                                  onClick={() => closeErrorModal()}
                                >
                                  Ok
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        {openBrokerModal && (
                          <div className="modal">
                            <div className="modal-content">
                              <h3 className="text-center">Property Details</h3>

                              <div className="d-flex justify-content-center">
                                <table
                                  style={{
                                    width: "550px",
                                    textAlign: "center",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        Property Address
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {" "}
                                      {broker.streetNumber} {broker.streetName}{" "}
                                      {broker.city} {broker.province}{" "}
                                      {broker.zipCode}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        {" "}
                                        Type of Building{" "}
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {broker.typeOfBuilding}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        {" "}
                                        Type of Appraisal
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {broker.typeOfAppraisal}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        {" "}
                                        Purpose
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {broker.purpose}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        {" "}
                                        Lender Information
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {broker.lenderInformation
                                        ? broker.lenderInformation
                                        : "NA"}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        Estimated Value / Purchased Price
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      ${broker.estimatedValue}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        Urgency
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {" "}
                                      {broker.urgency === 0
                                        ? "Rush"
                                        : broker.urgency === 1
                                        ? "Regular"
                                        : "NA"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        Appraisal Report Required By
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {broker.quoteRequiredDate}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        Applicant Name
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {" "}
                                      {broker.applicantFirstName}{" "}
                                      {broker.applicantLastName}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        Email Address
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {" "}
                                      {broker.applicantEmailAddress}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        Phone Number
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {" "}
                                      {broker.applicantPhoneNumber}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        Remark / Summary
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {" "}
                                      {broker.remark ? broker.remark : "NA"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        Applicant Name
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {" "}
                                      {broker.applicantFirstName}{" "}
                                      {broker.applicantLastName}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        {" "}
                                        Applicant Email Address{" "}
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {broker.applicantEmailAddress}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        Applicant Number
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {" "}
                                      {broker.applicantPhoneNumber}
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <h3>{"   "}</h3>

                              <h3 className="text-center">Broker Details</h3>

                              <div className="d-flex justify-content-center">
                                <table
                                  style={{
                                    width: "550px",
                                    textAlign: "center",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        Broker Name
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {" "}
                                      {broker.applicantFirstName}{" "}
                                      {broker.applicantLastName}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        {" "}
                                        Email Address{" "}
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {broker.applicantEmailAddress}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        color: "#2e008b",
                                      }}
                                    >
                                      <span className="text-start">
                                        Phone Number
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid grey",
                                        width: "250px",
                                      }}
                                    >
                                      {" "}
                                      {broker.applicantPhoneNumber}
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <div className="row text-center mt-3">
                                <div className="col-lg-12">
                                  <button
                                    className="btn btn-color w-25 text-center"
                                    onClick={closeBrokerModal}
                                  >
                                    Ok
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* End .col */}
              </div>

              {closeRegisterModal && (
                <div className="modal">
                  <div className="modal-content" style={{ width: "30%" }}>
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
                        <h2 className=" text-color mt-1">Add Appraiser </h2>
                      </div>
                    </div>
                    <div
                      className="mb-2"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <Form
                      setCloseRegisterModal={setCloseRegisterModal}
                      setIsLoading={setIsLoading}
                    />
                  </div>
                </div>
              )}

              {openViewModal && (
                <div className="modal">
                  <div className="modal-content">
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
                    <h3 className="text-center">View Credentials</h3>
                    <div
                      className="mb-2"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="row mb-2 mt-2 text-center">
                          <div className="row mb-2 mt-2">
                            <div className="col-lg-3 mb-2">
                              <label
                                htmlFor=""
                                style={{
                                  paddingTop: "15px",
                                  fontWeight: "lighter",
                                }}
                              >
                                Email / Username <span class="req-btn">*</span>{" "}
                                :
                              </label>
                            </div>
                            <div
                              className="col-lg-7"
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <input
                                type="text"
                                value={currentViewAppraiser.userInfo}
                                // value={userInfo}
                                onChange={(e) => setUserInfo(e.target.value)}
                                className="form-control"
                                id="formGroupExampleInput3"
                              />
                              <button
                                onClick={handleCopy}
                                // onClick={() =>
                                //   copyToClipboard(currentViewAppraiser.email)
                                // }
                                className="btn btn-color w-10 mt-1"
                                title="Copy Username"
                                style={{ marginLeft: "12px" }}
                              >
                                <Link href="#">
                                  <span className="text-light">
                                    <FaCopy />
                                  </span>
                                </Link>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div
                          className="mb-2"
                          style={{ border: "2px solid #97d700" }}
                        ></div>
                        {/* End .col */}
                      </div>
                    </div>
                    <div
                      className="col-lg-12 text-center"
                      style={{ marginRight: "4%" }}
                    >
                      <button
                        className="btn btn-color w-25"
                        onClick={() => closeViewModal()}
                      >
                        Ok
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {openEditModal && (
                <div className="modal">
                  <div className="modal-content" style={{ width: "30%" }}>
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
                    <h3 className="text-center text-color mt-2">
                      Activity Status Updation
                    </h3>
                    <div
                      className="mb-3"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <div className="d-flex justify-content-center">
                      <select
                        required
                        className="form-select"
                        data-live-search="true"
                        data-width="100%"
                        onChange={(e) => setIsActive(e.target.value)}
                        style={{
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          backgroundColor: "#E8F0FE",
                          width: "300px",
                        }}
                      >
                        <option
                          key={0}
                          value={0}
                          disabled={selectedAppraiser?.isActive ? false : true}
                        >
                          In-active
                        </option>
                        <option
                          key={1}
                          value={1}
                          disabled={selectedAppraiser?.isActive ? true : false}
                        >
                          Active
                        </option>
                      </select>
                    </div>
                    {/* <p>Are you sure you want to delete the property: {property.area}?</p> */}
                    <div
                      className="mb-2 mt-3"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <div className="d-flex justify-content-center gap-2 mt-2">
                      <button
                        disabled={disable}
                        className="btn btn-color w-25"
                        onClick={closeStatusUpdateHandler}
                      >
                        Cancel
                      </button>
                      <button
                        disabled={disable}
                        className="btn btn-color w-25 "
                        onClick={handleStatusUpdateHandler}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {assignModal && (
                <div className="modal">
                  <div className="modal-content">
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
                        <h1 className=" text-color mt-1">
                          Re-Asssign Appraiser
                        </h1>
                      </div>
                    </div>
                    <div
                      className="mt-2 mb-3"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <select
                      required
                      className="form-select"
                      data-live-search="true"
                      data-width="100%"
                      onChange={(e) => setSelectedAppraiser(e.target.value)}
                      style={{
                        padding: "15px",
                        backgroundColor: "#E8F0FE",
                      }}
                    >
                      {properties.map((item, index) => {
                        <option value={0}>....</option>;
                        return item.item.isActive &&
                          item.item.id !== assignAppraiserId ? (
                          <option key={item.item.id} value={item.item.id}>
                            {item.item.firstName} {item.item.lastName}
                          </option>
                        ) : null;
                      })}
                    </select>
                    <div
                      className="mt-4 mb-3"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <div className="text-center" style={{}}>
                      <button
                        className="btn btn-color m-1 w-25"
                        onClick={() => closeAssignModal()}
                      >
                        Cancel
                      </button>
                      <button className="btn btn-color w-25" onClick={""}>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {modalIsOpenError_01 && (
                <div className="modal">
                  <div
                    className="modal-content"
                    style={{ borderColor: "#2e008b", width: "40%" }}
                  >
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
                    <h2 className="text-center" style={{ color: "orangered" }}>
                      Alert
                    </h2>
                    <div
                      className="mb-3 mt-2"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <span className="text-center text-dark fs-4">
                      This appraiser individual cannot be turned inactive as
                      they currently have ongoing properties allotted to them.
                      Please reassign those properties to another appraisal
                      individual.
                    </span>
                    <div
                      className="mb-3 mt-2"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <div className="text-center">
                      <button
                        className="btn btn-color w-25"
                        onClick={() => closeErrorModal()}
                      >
                        Ok
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="row">
                <Modal
                  modalOpen={modalOpen}
                  setModalOpen={setModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  closeModal={closeModal}
                  lowRangeBid={lowRangeBid}
                  propertyId={propertyId}
                  openQuoteModal={openQuoteModal}
                  closeQuoteModal={closeQuoteModal}
                />
              </div>
            </div>

            <div className="row mt50">
              <div className="col-lg-12">
                <div className="copyright-widget-dashboard text-center">
                  <p>
                    &copy; {new Date().getFullYear()} Appraisal Land. All Rights
                    Reserved.
                  </p>
                </div>
              </div>
            </div>
            {/* End .col */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
