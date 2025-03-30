import Header from "../../common/header/dashboard/HeaderAdmin";
import SidebarMenu from "../../common/header/dashboard/SidebarMenuAdmin";
import MobileMenu from "../../common/header/MobileMenu_02";
import TableData from "./TableData";
import Filtering from "./Filtering";
import FilteringBy from "./FilteringBy";
import Pagination from "./Pagination";
import SearchBox from "./SearchBox";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";
import Exemple from "./Exemple";
import { encryptionData } from "../../../utils/dataEncryption";
import Link from "next/link";
import Image from "next/image";
import millify from "millify";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [property, setProperty] = useState("");
  const [allArchive, setAllArchive] = useState([]);
  const [filterProperty, setFilterProperty] = useState("");
  const [filterQuery, setFilterQuery] = useState("All");
  const [properties, setProperties] = useState([]);
  const [disable, setdisable] = useState(false);
  // const user = JSON.parse(localStorage.getItem("user"));
  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalIsPopupOpen, setModalIsPopupOpen] = useState(false);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState("");
  const [propertyId, setPropertyId] = useState(null);
  const [isCancelProperty, setIsCancelProperty] = useState(0);
  const [isHoldProperty, setIsHoldProperty] = useState(0);
  const [lastActivityTimestamp, setLastActivityTimestamp] = useState(
    Date.now()
  );

  const [start, setStart] = useState(0);

  const [end, setEnd] = useState(4);

  useEffect(() => {
    // setRefresh(true);
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
    console.log("inside");
    setProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeCancelHoldHandler = () => {
    setIsCancelProperty(false);
    setIsHoldProperty(false);
    setModalOpen(false);
  };

  useEffect(() => {
    setRefresh(true);
    const filterProperties = (propertys, searchInput) => {
      if (searchInput === "") {
        return propertys;
      }
      const filteredProperties = propertys.filter((property) => {
        // Convert the search input to lowercase for a case-insensitive search
        const searchTerm = searchInput.toLowerCase();

        console.log("propertyy", property);
        if (String(property.orderId) === String(searchTerm)) {
          return true;
        }
        // Check if any of the fields contain the search term
        else
          return (
            String(property.property?.orderId)
              .toLowerCase()
              .includes(searchTerm) ||
            property.property?.zipCode?.toLowerCase().includes(searchTerm) ||
            property.property?.area?.toLowerCase().includes(searchTerm) ||
            property.property?.city?.toLowerCase().includes(searchTerm) ||
            property.property?.province?.toLowerCase().includes(searchTerm) ||
            property.property?.streetName?.toLowerCase().includes(searchTerm) ||
            property.property?.streetNumber
              ?.toLowerCase()
              .includes(searchTerm) ||
            property.property?.typeOfBuilding
              ?.toLowerCase()
              .includes(searchTerm)
          );
      });

      return filteredProperties;
    };
    const filteredData = filterProperties(properties, searchInput);
    setFilterProperty(filteredData);
  }, [searchInput]);

  const calculate = (searchDate, diff) => {
    const newDateObj = new Date(searchDate.property.addedDatetime);
    const currentObj = new Date();

    const getMonthsFDiff = currentObj.getMonth() - newDateObj.getMonth();
    const gettingDiff = currentObj.getDate() - newDateObj.getDate();
    const gettingYearDiff = currentObj.getFullYear() - newDateObj.getFullYear();

    const estimatedDiff =
      gettingDiff + getMonthsFDiff * 30 + gettingYearDiff * 365;

    console.log("dayss", diff, newDateObj.getDate(), currentObj.getDate());
    return estimatedDiff <= diff;
  };

  const filterData = (tempData) => {
   
    const currentDate = new Date();
    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    switch (filterQuery) {
      case "Last 7 days":
        const sevenDaysAgo = new Date(currentDate);
        sevenDaysAgo.setDate(currentDate.getDate() - 7);
        return tempData.filter((item) => calculate(item, 7));
      case "Last 30 Days":
        const thirtyDaysAgo = new Date(currentDate);
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        return tempData.filter((item) => calculate(item, 30));
      case "Last 3 Month":
        const threeMonthsAgo = new Date(currentDate);
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
        return tempData.filter((item) => calculate(item, 90));

      default:
        return tempData; // Return all data if no valid timeFrame is specified
    }
  };

  useEffect(() => {
    // setRefresh(true);

    const tmpData = filterData(properties);
    console.log("filterQuery", filterQuery, tmpData, tmpData.length);
    setFilterProperty(tmpData);
  }, [filterQuery]);
  const [propValue, setPropValue] = useState({});

  const onHoldHandler = () => {
    setdisable(true);
    setModalOpen(false);

    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: data.token,
      orderId: propertyId,
      status: "HOLD",
      value: Boolean(propValue),
    };

    const encryptedBody = encryptionData(payload);

    toast.loading("Turning the property status.....");
    axios
      .put("/api/setPropertyOnHold", encryptedBody)
      .then((res) => {
        toast.dismiss();
        setIsHoldProperty(false);
        toast.success("Successfully Changed the Order Status !");
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err);
      });
    // closeModal();
    setPropValue({});

    setPropertyId(-1);
  };

  const onCancelHandler = () => {
    setdisable(true);
    setModalOpen(false);

    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: data.token,
      orderId: propertyId,
      status: "CANCEL",
      value: Boolean(propValue),
    };

    const encryptedBody = encryptionData(payload);

    toast.loading("Turning the property status...");
    axios
      .put("/api/setPropertyOnHold", encryptedBody)
      .then((res) => {
        toast.dismiss();
        toast.success("Successfully Changed the Order Status !");
        setIsCancelProperty(false);
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err);
      });
    // closeModal();
    setPropValue(0);
    setPropertyId(-1);
  };



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

  const [userData, setUserData] = useState({});

  // useEffect(() => {
  //   const data = JSON.parse(localStorage.getItem("user"));
  //   if (!data) {
  //     router.push("/login");
  //   } else if (!data?.broker_Details?.firstName) {
  //     router.push("/my-profile");
  //   }
  //   if (!data) {
  //     router.push("/login");
  //   }
  //   const fetchData = () => {
  //     if (data) {
  //       setUserData(data);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header />

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
      <section className="our-dashbord dashbord bgc-f7 pb50 dashboard-height">
        <div
          className="container-fluid ovh table-padding container-padding"
          style={{}}
        >
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">
                {/* Start Dashboard Navigation */}
                <div className="col-lg-12">
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
                </div>
                {/* End Dashboard Navigation */}

                {/*<div className="col-lg-4 col-xl-4">
                  <div className="style2 mb30-991">
                    <h3 className="breadcrumb_title">Archive Properties</h3>
                    <p>We are glad to see you again!</p>                                                             
                  </div>
              </div>*/}

                {/* End .col */}

                <div className="col-lg-12 col-xl-12">
                  {/*<div className="candidate_revew_select style2 mb30-991">
                    <ul className="mb0">
                      <li className="list-inline-item">
                        <Filtering setFilterQuery={setFilterQuery} />
                      </li>
                      <li className="list-inline-item">
                        <FilteringBy setFilterQuery={setFilterQuery} />
                      </li>
                      <li className="list-inline-item">
                        <div className="candidate_revew_search_box course fn-520">
                          <SearchBox setSearchInput={setSearchInput} />
                        </div>
                      </li>
                      
                    </ul>
              </div>*/}
                </div>
                {/* End .col */}

                <div className="col-lg-12">
                  <div className="">
                    <div className="property_table">
                      <div className="mt0">
                        <TableData
                          userData={userData}
                          open={openModal}
                          close={closeModal}
                          setProperties={setProperties}
                          start={start}
                          end={end}
                          properties={
                            searchInput === "" && filterQuery === "All"
                              ? properties
                              : filterProperty
                          }
                          setAllArchive={setAllArchive}
                          searchInput = {searchInput}
                          filterQuery = {filterQuery}
                          setModalIsOpenError={setModalIsOpenError}
                          setErrorMessage={setErrorMessage}
                          setRefresh={setRefresh}
                          refresh={refresh}
                          setFilterQuery={setFilterQuery}
                          setSearchInput={setSearchInput}
                          setModalIsPopupOpen={setModalIsPopupOpen}
                          setPropValue={setPropValue}
                          setPropertyId={setPropertyId}
                          setCurrentProperty={setCurrentProperty}
                          setIsCancelProperty={setIsCancelProperty}
                          setIsHoldProperty={setIsHoldProperty}
                          setModalOpen={setModalOpen}
                        />

                        {modalIsPopupOpen && (
                          <div className="modal">
                            <div className="modal-content">
                              <div className="col-lg-12">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <Link href="/" className="">
                                      <Image
                                        width={60}
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
                                      Property Details
                                    </h1>
                                  </div>
                                </div>
                                <div
                                  className="mt-2 mb-3"
                                  style={{ border: "2px solid #97d700" }}
                                ></div>
                              </div>
                              {/* <p className="text-center mb-3">
                                  All of the details on the assessed property
                                  are here.
                                </p> */}
                              <div
                                className="d-flex justify-content-center"
                                id="property-info-container"
                              >
                                <table
                                  style={{
                                    width: "700px",
                                    textAlign: "start",
                                    borderRadius: "5px",
                                    fontSize: "17px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  <thead>
                                    <tr>
                                      <th
                                        style={{
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          color: "#2e008b",
                                          // padding: "5px",
                                          textAlign: "center",
                                        }}
                                      >
                                        Headers
                                      </th>
                                      <th
                                        style={{
                                          border: "1px solid #2e008b",
                                          // width: "470px",
                                          color: "#2e008b",
                                          // padding: "5px",
                                          textAlign: "center",
                                        }}
                                      >
                                        Value
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding: "5px",
                                        }}
                                      >
                                        <span className="text-start">
                                          Property Address
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "465px",
                                          color: "black",
                                          padding: "5px",
                                        }}
                                      >
                                        {" "}
                                        {currentProperty.streetNumber}{" "}
                                        {currentProperty.streetName}{" "}
                                        {currentProperty.city}{" "}
                                        {currentProperty.province}{" "}
                                        {currentProperty.zipCode}
                                      </td>
                                    </tr>
                                    {/* <tr>
                                      <td
                                         style={{
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding:"5px"
                                        }}
                                      >
                                        <span className="text-start">
                                          Property Area
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "250px",
                                        }}
                                      >
                                        {currentProperty.area} sqft
                                      </td>
                                    </tr> */}
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding: "5px",
                                        }}
                                      >
                                        <span className="text-start">
                                          {" "}
                                          Type of Building{" "}
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "250px",
                                          color: "black",
                                          padding: "5px",
                                        }}
                                      >
                                        {currentProperty.typeOfBuilding}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding: "5px",
                                        }}
                                      >
                                        <span className="text-start">
                                          {" "}
                                          Type of Appraisal
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "250px",
                                          color: "black",
                                          padding: "5px",
                                        }}
                                      >
                                        {currentProperty.typeOfAppraisal}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding: "5px",
                                        }}
                                      >
                                        <span className="text-start">
                                          {" "}
                                          Purpose
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "250px",
                                          color: "black",
                                          padding: "5px",
                                        }}
                                      >
                                        {currentProperty.purpose}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding: "5px",
                                        }}
                                      >
                                        <span className="text-start">
                                          {" "}
                                          Lender Information
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "250px",
                                          color: "black",
                                          padding: "5px",
                                        }}
                                      >
                                        {currentProperty.lenderInformation
                                          ? currentProperty.lenderInformation
                                          : "N.A."}
                                      </td>
                                    </tr>
                                    {/* <tr>
                                      <td
                                         style={{
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding:"5px"
                                        }}
                                      >
                                        <span className="text-start">
                                          Community
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
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
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding: "5px",
                                        }}
                                      >
                                        <span className="text-start">
                                          Estimated Value
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "250px",
                                          color: "black",
                                          padding: "5px",
                                        }}
                                      >
                                        ${" "}
                                        {millify(
                                          currentProperty.estimatedValue
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding: "5px",
                                        }}
                                      >
                                        <span className="text-start">
                                          Urgency
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "250px",
                                          color: "black",
                                          padding: "5px",
                                        }}
                                      >
                                        {" "}
                                        {currentProperty.urgency === 0
                                          ? "Rush"
                                          : currentProperty.urgency === 1
                                          ? "Regular"
                                          : "N.A."}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding: "5px",
                                        }}
                                      >
                                        <span className="text-start">
                                          Appraisal Report Req. By
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "250px",
                                          color: "black",
                                          padding: "5px",
                                        }}
                                      >
                                        {currentProperty.quoteRequiredDate}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding: "5px",
                                        }}
                                      >
                                        <span className="text-start">
                                          Applicant Name
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "250px",
                                          color: "black",
                                          padding: "5px",
                                        }}
                                      >
                                        {" "}
                                        {
                                          currentProperty.applicantFirstName
                                        }{" "}
                                        {currentProperty.applicantLastName}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding: "5px",
                                        }}
                                      >
                                        <span className="text-start">
                                          Email Address
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "250px",
                                          color: "black",
                                          padding: "5px",
                                        }}
                                      >
                                        {" "}
                                        {currentProperty.applicantEmailAddress}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding: "5px",
                                        }}
                                      >
                                        <span className="text-start">
                                          Phone Number
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "250px",
                                          color: "black",
                                          padding: "5px",
                                        }}
                                      >
                                        {" "}
                                        {currentProperty.applicantPhoneNumber}
                                      </td>
                                    </tr>
                                    {/* <tr>
                                      <td
                                         style={{
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding:"5px"
                                        }}
                                      >
                                        <span className="text-start">
                                          Address
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
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
                                          border: "1px solid #2e008b",
                                          color: "#2e008b",
                                          padding: "5px",
                                        }}
                                      >
                                        <span className="text-start">
                                          Remark / Summary
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "250px",
                                          color: "black",
                                          padding: "5px",
                                        }}
                                      >
                                        {" "}
                                        {currentProperty.remark
                                          ? currentProperty.remark
                                          : "N.A."}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="row text-center mt-3">
                                <div className="col-lg-12">
                                  <div
                                    className="btn btn-color w-25 m-1"
                                    onClick={() =>
                                      PropertyInfoHandler(
                                        currentProperty.orderId
                                      )
                                    }
                                    title="Download Pdf"
                                  >
                                    Download
                                  </div>
                                  <button
                                    className="btn btn-color w-25 text-center"
                                    onClick={() => setModalIsPopupOpen(false)}
                                  >
                                    Ok
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
                      {modalOpen && (
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
                            <h2
                              className="text-center mt-3"
                              style={{ color: "#2e008b" }}
                            >
                              {isHoldProperty
                                ? `${
                                    propValue
                                      ? "Order Confirmation"
                                      : "Order Confirmation"
                                  }`
                                : `${
                                    propValue
                                      ? "Order Confirmation"
                                      : "Order Confirmation"
                                  }`}
                            </h2>
                            <div
                              className="mb-2"
                              style={{ border: "2px solid #97d700" }}
                            ></div>
                            <p className="fs-5 text-center text-dark mt-4">
                              Are you sure for the order to be{" "}
                              <span
                                style={{ color: "red", fontWeight: "bold" }}
                              >
                                {" "}
                                {isHoldProperty
                                  ? `${
                                      propValue ? "On Hold" : "Remove On Hold"
                                    }`
                                  : `${
                                      propValue ? "On Cancel" : "Remove On Hold"
                                    }`}{" "}
                              </span>
                              ?{" "}
                            </p>

                            <div
                              className="mb-3 mt-4"
                              style={{ border: "2px solid #97d700" }}
                            ></div>
                            <div className="col-lg-12 text-center">
                              <button
                                disabled={disable}
                                className="btn w-25 btn-color m-1"
                                onClick={closeCancelHoldHandler}
                              >
                                Cancel
                              </button>
                              <button
                                disabled={disable}
                                className="btn w-25 btn-color"
                                onClick={
                                  isHoldProperty
                                    ? onHoldHandler
                                    : onCancelHandler
                                }
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

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
                                onClick={() => closeModal()}
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
                    </div>
                    {/* End .table-responsive */}

                    {/* End .mbp_pagination */}
                  </div>
                  {/* End .property_table */}
                </div>
              </div>

              {/* End .col */}
            </div>

            <div className="row">
              {/* <div className="row">
                <div className="col-lg-12 mt0">
                  <div className="mbp_pagination">
                    <Pagination
                      setStart={setStart}
                      setEnd={setEnd}
                      properties={allArchive}
                    />
                  </div>
                </div>
              </div> */}
              {/* End paginaion .col */}
            </div>
            {/* End .row */}
          </div>
          {/* End .row */}
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
            </div>*/}

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
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h3 className="text-center">Delete Confirmation</h3>
                <h5 className="text-center">
                  Are you sure you want to delete the property : {property.area}{" "}
                  ?
                </h5>
                {/* <p>Are you sure you want to delete the property: {property.area}?</p> */}
                <div className="text-center" style={{}}>
                  <button
                    className="btn w-35 btn-thm3 m-2"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button className="btn w-35 btn-white" onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Index;
