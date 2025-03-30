import Header from "../../common/header/dashboard/Header_02";
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

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [toggleId, setToggleId] = useState(-1);
  const [toggleWishlist, setToggleWishlist] = useState(0);
  const [typeView,setTypeView] = useState(0);
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
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const [wishlistedProperties,setWishlistedProperties] = useState([]);

  const [isStatusModal,setIsStatusModal] = useState(false);
  
  const handleStatusUpdateHandler = ()=>{

  }

  const closeStatusUpdateHandler = ()=>{
    setOpenDate(false);
    setIsStatusModal(false);
  }

  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [refresh, setRefresh] = useState(false);

  const [start,setStart]=useState(0);
  
  const [end,setEnd]=useState(4);

  const closeErrorModal = () => {
    setModalIsOpenError(false);
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

  const [openDate,setOpenDate] = useState(false);
  const [statusDate,setStatusDate]=useState("");

  

  const handleStatusSelect = (value)=>{
    if(String(value) === "Appraisal Visit Confirmed"){
      setOpenDate(true);
    }

  }

  const openModalBroker = (property,value) => {
    setBroker(property);
    setTypeView(value);
    setOpenBrokerModal(true);
  };
  const router = useRouter();
  const [lastActivityTimestamp, setLastActivityTimestamp] = useState(
    Date.now()
  );

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
        window.location.reload();
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

  console.log(broker);

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header userData={userData}/>

      {/* <!--  Mobile Menu --> */}
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
      {/* End sidebar_menu */}

      {/* <!-- Our Dashbord --> */}
      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div
          className="container-fluid ovh"
          style={{ marginLeft: "-10px", marginTop: "" }}
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

                <div className="col-lg-4 col-xl-4 ">
                  <div className="style2 mb30-991">
                    <h3 className="breadcrumb_title">Archieve Properties</h3>
                    {/* <p>We are glad to see you again!</p>                                                             */}
                  </div>
                </div>
                {/* End .col */}

               {/*<div className="row">
                <div className="col-lg-12 mt20">
                 <div className="mbp_pagination">
                   <Pagination
                     setStart={setStart}
                     setEnd={setEnd}
                     properties={properties}
                   />
                   </div>
                      </div> 
                    </div>*/ } 

                {/*<div className="col-lg-12 col-xl-12">
                  <div className="candidate_revew_select style2 mb30-991">
                    <ul className="mb0">
                      <li className="list-inline-item">
                        <Filtering setFilterQuery={setFilterQuery} />
                      </li>
                      <li className="list-inline-item">
                        <FilteringBy setFilterQuery={setSearchQuery} />
                      </li>
                      <li className="list-inline-item">
                        <div className="candidate_revew_search_box course fn-520">
                          <SearchBox setSearchInput={setSearchInput} />
                        </div>
                      </li>
                    </ul>
              </div>
                </div>*/}

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
                          setUpdatedCode={setUpdatedCode}
                          onWishlistHandler={onWishlistHandler}
                          participateHandler={participateHandler}
                          setWishlistedProperties={setWishlistedProperties}
                          setErrorMessage={setErrorMessage}
                          setModalIsOpenError={setModalIsOpenError}
                          setRefresh={setRefresh}
                          refresh={refresh}
                          setStart={start}
                          setEnd={end}
                          setFilterQuery={setFilterQuery}
                          setSearchInput={setSearchInput}
                          setStartLoading={setStartLoading}
                          openModalBroker={openModalBroker}
                          setIsStatusModal={setIsStatusModal}
                        />

                        {modalIsOpenError && (
                          <div className="modal">
                            <div
                              className="modal-content"
                              style={{ borderColor: "orangered", width: "20%" }}
                            >
                              <h3
                                className="text-center"
                                style={{ color: "orangered" }}
                              >
                                Error
                              </h3>
                              <div
                                style={{
                                  borderWidth: "2px",
                                  borderColor: "orangered",
                                }}
                              >
                                <br />
                              </div>
                              <h5 className="text-center">{errorMessage}</h5>
                              <div
                                className="text-center"
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <button
                                  className="btn w-35 btn-white"
                                  onClick={() => closeErrorModal()}
                                  style={{
                                    borderColor: "orangered",
                                    color: "orangered",
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                       {/* {openBrokerModal && (
                          <div className="modal">
                            <div className="modal-content">
                              <span>
                                <h4 className="text-center">Broker Details</h4>
                              </span>
                              <hr />
                              <div className=" col-lg-12">
                                <div className="row">
                                  <h5 className="col-lg-4 mt-1 text-end">
                                    <span className="">Broker Name :</span>{" "}
                                  </h5>
                                  <span className="col-lg-3">
                                    {broker.applicantFirstName}{" "}
                                    {broker.applicantLastName}
                                  </span>
                                </div>
                                <div className="row">
                                  <h5 className="col-lg-4 mt-1">
                                    <span className="">
                                      Broker Phone Number :
                                    </span>{" "}
                                  </h5>
                                  <span className="col-lg-3">
                                    {broker.applicantPhoneNumber}
                                  </span>
                                </div>
                                <div className="row">
                                  <h5 className="col-lg-4 mt-1 text-end">
                                    <span className="">Broker Email :</span>{" "}
                                  </h5>
                                  <span className="col-lg-3">
                                    {broker.applicantEmailAddress}
                                  </span>
                                </div>
                              </div>
                              <hr />
                              <div className="col-lg-12 text-center" style={{}}>
                                <button
                                  className="btn btn-color w-25 mt-2"
                                  onClick={closeBrokerModal}
                                >
                                  Ok
                                </button>
                              </div>
                            </div>
                          </div>
                        )}*/}
                      </div>
                      <div>
                      {(openBrokerModal && typeView === 1) && (
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
                                    {broker.streetNumber}{" "}
                                    {broker.streetName}{" "}
                                    {broker.city}{" "}
                                    {broker.province}{" "}
                                    {broker.zipCode}
                                  </td>
                                </tr>
                                {/* <tr>
                                  <td
                                    style={{
                                      border: "1px solid grey",
                                      color: "#2e008b",
                                    }}
                                  >
                                    <span className="text-start">
                                      Property Area
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid grey",
                                      width: "250px",
                                    }}
                                  >
                                    {currentProperty.area} sqft
                                  </td>
                                </tr> */}
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
                                {/* <tr>
                                  <td
                                    style={{
                                      border: "1px solid grey",
                                      color: "#2e008b",
                                    }}
                                  >
                                    <span className="text-start">
                                      Community
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid grey",
                                      width: "250px",
                                    }}
                                  >
                                    {" "}
                                    {currentProperty.community
                                      ? currentProperty.community
                                      : "NA"}
                                  </td>
                                </tr> */}
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
                                    {
                                      broker.applicantFirstName
                                    }{" "}
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
                                {/* <tr>
                                  <td
                                    style={{
                                      border: "1px solid grey",
                                      color: "#2e008b",
                                    }}
                                  >
                                    <span className="text-start">
                                      Address
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid grey",
                                      width: "250px",
                                    }}
                                  >
                                    {" "}
                                    {currentProperty.applicantAddress
                                      ? currentProperty.applicantAddress
                                      : "NA"}
                                  </td>
                                </tr> */}
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
                                    {broker.remark
                                      ? broker.remark
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

                      {(openBrokerModal && typeView === 2) && (
                        <div className="modal">
                          <div className="modal-content">
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

                      {/* End .table-responsive */}

                      {/* End .mbp_pagination */}
                    </div>
                    {/* End .property_table */}
                  </div>
                </div>
                {/* End .col */}
              </div>
              {isQuoteModalOpen && (
                <div className="modal">
                  <div className="modal-content">
                    <h3 className="text-center">Quote Confirmation</h3>
                    <h5 className="text-center">
                      Are you sure you want to quote this property over this
                      amount :{valueRef?.current?.value}?
                    </h5>
                    {/* <p>Are you sure you want to delete the property: {property.area}?</p> */}
                    <div className="text-center" style={{}}>
                      <button
                        className="btn w-35 btn-thm3 m-2"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                      <button
                        className="btn w-35 btn-white"
                        onClick={closeQuoteModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isStatusModal && (
                <div className="modal">
                  <div className="modal-content">
                    <h3 className="text-center">Quote Status Updation</h3>
                    
                    <select
                  required
                  className="form-select"
                  data-live-search="true"
                  data-width="100%"
                  onChange={(e)=>handleStatusSelect(e.target.value)}
                  // value={buildinRef}
                  // onChange={(e) => setBuildinRef(e.target.value)}
                  // onChange={(e) => setBuildinRef(e.target.value)}
                  // disabled={isDisable}
                  style={{
                          paddingTop: "15px",
                          paddingBottom: "15px",
                          backgroundColor: "#E8F0FE"
                        }}
                >
                  {AppraiserStatusOptions.map((item, index) => {
                    return (
                      <option key={item.id} value={item.value}>
                        {item.type}
                      </option>
                    );
                  })}
                </select>
                {openDate && <div className="col-lg-4">
                <input
                  required
                 
                  type="datetime-local"
                  className="form-control"
                  id="formGroupExampleInput3"
                  onChange={(e) => setStatusDate(e.target.value)}
                  value={statusDate}
                />
              </div>}
            
                    {/* <p>Are you sure you want to delete the property: {property.area}?</p> */}
                    <div className="text-center" style={{}}>
                    <button
                    className="btn w-35 btn-white"
                    onClick={closeStatusUpdateHandler}
                  >
                    Cancel
                  </button>
                      <button
                      className="btn btn-color w-10 mt-1"
                      style={{ marginLeft: "12px" }}
                        onClick={handleStatusUpdateHandler}
                      >
                        Submit
                      </button>        
                     
                    </div>
                  </div>
                </div>
              )}
              <div className="row">
                <Modal
                  modalOpen={modalOpen}
                  setModalOpen = {setModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  closeModal={closeModal}
                  lowRangeBid={lowRangeBid}
                  propertyId={propertyId}
                  openQuoteModal={openQuoteModal}
                  closeQuoteModal={closeQuoteModal}
                />
              </div>
              <div className="row">
                {/* <div className="col-lg-12 mt20">
                  <div className="mbp_pagination">
                    <Pagination
                      properties={properties}
                      setProperties={setProperties}
                    />
                  </div>
                </div> */}
                {/* End paginaion .col */}
              </div>
              {/* End .row */}
            </div>
            {/* End .row */}

            <div className="row">
                 <div className="col-lg-12 mt20">
                  <div className="mbp_pagination">
                    <Pagination
                      setStart={setStart}
                      setEnd={setEnd}
                      properties={wishlistedProperties}
                    />
                  </div>
                </div> 
              </div>

            <div className="row mt50">
              <div className="col-lg-12">
                <div className="copyright-widget text-center">
                  <p>© 2020 Find House. Made with love.</p>
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
