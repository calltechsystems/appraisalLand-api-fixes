import Header from "../../common/header/dashboard/Header";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu";
import MobileMenu from "../../common/header/MobileMenu_02";
import TableData from "./TableData";
import Pagination from "./Pagination";
import { useEffect, useRef } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import millify from "millify";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Modal from "./Modal";
import { encryptionData } from "../../../utils/dataEncryption";
import Loader from "./Loader";
import { AppraiserStatusOptions } from "../create-listing/data";
import { FaDownload } from "react-icons/fa";
import { useModal } from "../../../context/ModalContext";
import CommonLoader from "../../common/CommonLoader/page";

const Index = () => {
  const [disable, setDisable] = useState(false);
  const { isModalOpen, setIsModalOpen } = useModal();
  const [searchInput, setSearchInput] = useState("");
  const [isStatusModal, setIsStatusModal] = useState(false);
  const [toggleId, setToggleId] = useState(-1);
  const [toggleWishlist, setToggleWishlist] = useState(0);
  const [searchResult, setSearchResult] = useState([]);
  const [property, setProperty] = useState("");
  const [typeView, setTypeView] = useState(0);
  const [startLoading, setStartLoading] = useState(false);
  const [currentProperty, setCurrentProperty] = useState("");
  const [filterProperty, setFilterProperty] = useState("");
  const [showPropDetails, setShowPropDetails] = useState(false);
  const [filterQuery, setFilterQuery] = useState("All");
  const [searchQuery, setSearchQuery] = useState("city");
  const [properties, setProperties] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [lowRangeBid, setLowRangeBid] = useState("");
  const [propertyId, setPropertyId] = useState(null);

  const [wishlistedProperties, setWishlistedProperties] = useState([]);
  const [updatedCode, setUpdatedCode] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [refresh, setRefresh] = useState(false);

  const [start, setStart] = useState(0);
  const [isHoldProperty, setIsHoldProperty] = useState(0);
  const [isCancelProperty, setIsCancelProperty] = useState(0);

  const [end, setEnd] = useState(4);

  const closeErrorModal = () => {
    setModalIsOpenError(false);
  };

  const handleStatusUpdateHandler = () => {};

  const closeStatusUpdateHandler = () => {
    setOpenDate(false);
    setIsStatusModal(false);
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
      // hour: "numeric",
      // minute: "numeric",
      // second: "numeric",
      hour12: true, // Set to false for 24-hour format
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const [openBrokerModal, setOpenBrokerModal] = useState(false);
  const [modalIsPopupOpen, setModalIsPopupOpen] = useState(false);

  const [broker, setBroker] = useState({});

  const closeBrokerModal = () => {
    setOpenBrokerModal(false);
  };

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  const openQuoteModal = () => {
    // setIsModalOpen(false);
    setIsQuoteModalOpen(true);
  };

  const [openDate, setOpenDate] = useState(false);
  const [statusDate, setStatusDate] = useState("");

  const handleStatusSelect = (value) => {
    if (String(value) === "Appraisal Visit Confirmed") {
      setOpenDate(true);
    }
  };

  const openModalBroker = (property, value) => {
    setBroker(property);
    setShowPropDetails(status);
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

  const openModal = (property, status) => {
    setProperty(property);
    if (status === 1) {
      setShowPropDetails(true);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setShowPropDetails(false);
    // setArchiveModal(false);
  };

  const archievePropertyHandler = (id) => {
    setIsLoading(true);
    const data = JSON.parse(localStorage.getItem("user"));

    toast.loading("Archiving the property.....");
    axios
      .get("/api/propertyArcheive", {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        params: {
          orderId: id,
          status: true,
          userId: data.userId,
        },
      })
      .then((res) => {
        toast.dismiss();
        setIsLoading(false);
        toast.success("Successfully Added to Archived Properties!!");
        location.reload();
        // router.push("/my-properties");
        // setRefresh(true);
      })
      .catch((err) => {
        toast.error(err);
        setIsLoading(false);
      });
    // closeModal();
  };

  // const [propertyId, setPropertyId] = useState(-1);
  const [propValue, setPropValue] = useState({});

  const onHoldHandler = () => {
    setDisable(true);
    setIsLoading(true);
    setModalOpen(false);
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: data.token,
      orderId: propertyId,
      status: "HOLD",
      value: Boolean(propValue),
    };

    const encryptedBody = encryptionData(payload);

    toast.loading("Turning the Property Status.....");
    axios
      .put("/api/setPropertyOnHold", encryptedBody)
      .then((res) => {
        toast.dismiss();
        setIsHoldProperty(false);
        setIsLoading(false);
        toast.success("Successfully Changed the Order Status !");
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err);
        setIsLoading(false);
      });
    // closeModal();
    setPropValue({});

    setPropertyId(-1);
  };

  const onCancelHandler = () => {
    setDisable(true);
    setIsLoading(true);
    setModalOpen(false);
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: data.token,
      orderId: propertyId,
      status: "CANCEL",
      value: Boolean(propValue),
    };

    const encryptedBody = encryptionData(payload);

    toast.loading("Turning the Property Status.....");
    axios
      .put("/api/setPropertyOnHold", encryptedBody)
      .then((res) => {
        toast.dismiss();
        setIsLoading(false);
        toast.success("Successfully Changed the Order Status !");
        setIsCancelProperty(false);
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err);
        setIsLoading(false);
      });
    // closeModal();
    setPropValue(0);
    setPropertyId(-1);
  };

  const closeCancelHoldHandler = () => {
    setIsCancelProperty(false);
    setIsHoldProperty(false);
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

        if (String(property.orderId) === String(searchTerm)) {
          return true;
        }
        // Check if any of the fields contain the search term
        else
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

  const calculate = (searchDate, diff) => {
    const newDateObj = new Date(searchDate.addedDatetime);
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
    const tmpData = filterData(properties);
    console.log("filterQuery", filterQuery, tmpData, tmpData.length);
    setFilterProperty(tmpData);
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

  const brokerInfoHandler = (orderId) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Broker Information</title></head><body>"
    );
    printWindow.document.write(
      "<h1>" + `Broker info of order ${orderId}` + "</h1>"
    );
    printWindow.document.write(
      '<button style="display:none;" onclick="window.print()">Print</button>'
    );

    // Clone the table-container and remove the action column
    const tableContainer = document.getElementById("broker-info-container");
    const table = tableContainer.querySelector("table");
    const clonedTable = table.cloneNode(true);
    const rows = clonedTable.querySelectorAll("tr");
    rows.forEach((row) => {
      const lastCell = row.querySelector("td:last-child");
    });

    // Remove the action heading from the table
    const tableHead = clonedTable.querySelector("thead");
    const tableHeadRows = tableHead.querySelectorAll("tr");
    tableHeadRows.forEach((row) => {
      const lastCell = row.querySelector("th:last-child");
    });

    // Make the table responsive for all fields
    const tableRows = clonedTable.querySelectorAll("tr");
    tableRows.forEach((row) => {
      const firstCell = row.querySelector("td:first-child");
      if (firstCell) {
        const columnHeading = tableHeadRows[0].querySelector(
          "th:nth-child(" + (firstCell.cellIndex + 1) + ")"
        ).innerText;
        firstCell.setAttribute("data-th", columnHeading);
      }
    });

    printWindow.document.write(clonedTable.outerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
      toast.success("Saved the data");
    };
  };

  const PropertyInfoHandler = (orderId) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Appraiser Land</title></head><body>"
    );
    printWindow.document.write(
      ' <img width="60" height="45" class="logo1 img-fluid" style="" src="/assets/images/Appraisal_Land_Logo.png" alt="header-logo2.png"/> <span style="color: #2e008b font-weight: bold; font-size: 24px;">Appraisal</span><span style="color: #97d700; font-weight: bold; font-size: 24px;">Land</span>'
    );
    printWindow.document.write(
      "<h3>" +
        `Properties Information of Order ID ${orderId}` +
        "</h3>" +
        "<style>" +
        "h3{text-align:center;}" +
        "</style>"
    );
    // printWindow.document.write(
    //   "<h1>" + `Property info of order ${orderId}` + "</h1>"
    // );

    printWindow.document.write(
      '<button style="display:none;" onclick="window.print()">Print</button>'
    );

    // Clone the table-container and remove the action column
    const tableContainer = document.getElementById("property-info-container");
    const table = tableContainer.querySelector("table");
    const clonedTable = table.cloneNode(true);
    const rows = clonedTable.querySelectorAll("tr");
    rows.forEach((row) => {
      const lastCell = row.querySelector("td:last-child");
    });

    // Remove the action heading from the table
    const tableHead = clonedTable.querySelector("thead");
    const tableHeadRows = tableHead.querySelectorAll("tr");
    tableHeadRows.forEach((row) => {
      const lastCell = row.querySelector("th:last-child");
    });

    // Make the table responsive for all fields
    const tableRows = clonedTable.querySelectorAll("tr");
    tableRows.forEach((row) => {
      const firstCell = row.querySelector("td:first-child");
      if (firstCell) {
        const columnHeading = tableHeadRows[0].querySelector(
          "th:nth-child(" + (firstCell.cellIndex + 1) + ")"
        ).innerText;
        firstCell.setAttribute("data-th", columnHeading);
      }
    });

    printWindow.document.write(clonedTable.outerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
      toast.success("Saved the data");
    };
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

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header userData={userData} />

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
      <section className="our-dashbord dashbord bgc-f7 pb50 dashboard-height">
        <div className="container-fluid ovh table-padding container-padding">
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

                <div className="col-lg-4 col-xl-4 mb10">
                  <div className="style2 mb30-991">
                    {/* <h3 className="breadcrumb_title">Appraising Properties</h3> */}
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
              </div>*/}

                <div className="col-lg-12 col-xl-12">
                  {/* <div className="candidate_revew_select style2 mb30-991">
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
                  </div> */}
                </div>
                {/* End .col */}

                <div className="col-lg-12">
                  <div className="">
                    <div className="property_table">
                      <div className="mt0">
                        <TableData
                          userData={userData}
                          setModalOpen={setModalOpen}
                          setHoldModalOpen={setHoldModalOpen}
                          setIsStatusModal={setIsStatusModal}
                          close={closeModal}
                          setPropertyId={setPropertyId}
                          setPropValue={setPropValue}
                          setProperties={setProperties}
                          start={start}
                          end={end}
                          properties={
                            searchInput === "" && filterQuery === "All"
                              ? properties
                              : filterProperty
                          }
                          setUpdatedCode={setUpdatedCode}
                          onWishlistHandler={onWishlistHandler}
                          participateHandler={participateHandler}
                          setErrorMessage={setErrorMessage}
                          setModalIsOpenError={setModalIsOpenError}
                          setRefresh={setRefresh}
                          setModalIsPopupOpen={setModalIsPopupOpen}
                          filterQuery={filterQuery}
                          setFilterQuery={setFilterQuery}
                          searchInput={searchInput}
                          setSearchInput={setSearchInput}
                          refresh={refresh}
                          setWishlistedProperties={setWishlistedProperties}
                          setStartLoading={setStartLoading}
                          openModalBroker={openModalBroker}
                          setCurrentProperty={setCurrentProperty}
                          archievePropertyHandler={archievePropertyHandler}
                          setIsCancelProperty={setIsCancelProperty}
                          setIsHoldProperty={setIsHoldProperty}
                        />

                        <div>
                          {modalIsPopupOpen && (
                            <div className="modal">
                              <div className="modal-content">
                                <div className="col-lg-12">
                                  <div className="row">
                                    <div className="col-lg-12 d-flex justify-content-between">
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
                                      <h2 className=" text-color mt-1">
                                        Property Details – Property Id{"  "}
                                        <span style={{ color: "#97d700" }}>
                                          #{currentProperty.orderId}
                                        </span>
                                      </h2>
                                    </div>
                                  </div>
                                  <div
                                    className="mt-2 mb-3"
                                    style={{ border: "2px solid #97d700" }}
                                  ></div>
                                </div>

                                <div
                                  className="d-flex justify-content-center"
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
                                          {" "}
                                          {currentProperty.streetNumber}{" "}
                                          {currentProperty.streetName},{" "}
                                          {currentProperty.city},{" "}
                                          {currentProperty.province}{" "}
                                          {currentProperty.zipCode}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td className="table-header">
                                          <span className="text-start">
                                            {" "}
                                            Property Type{" "}
                                          </span>
                                        </td>
                                        <td className="table-value">
                                          {currentProperty.typeOfBuilding}
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
                                          {currentProperty.typeOfAppraisal}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="table-header">
                                          <span className="text-start">
                                            {" "}
                                            Purpose
                                          </span>
                                        </td>
                                        <td className="table-value">
                                          {currentProperty.purpose}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="table-header">
                                          <span className="text-start">
                                            {" "}
                                            Lender Information
                                          </span>
                                        </td>
                                        <td className="table-value">
                                          {currentProperty.lenderInformation
                                            ? currentProperty.lenderInformation
                                            : "N.A."}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td className="table-header">
                                          <span className="text-start">
                                            Estimated Value / Purchased Price
                                          </span>
                                        </td>
                                        <td className="table-value">
                                          $
                                          {addCommasToNumber(
                                            currentProperty.estimatedValue
                                          )}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="table-header">
                                          <span className="text-start">
                                            Urgency
                                          </span>
                                        </td>
                                        <td className="table-value">
                                          {" "}
                                          {currentProperty.urgency === 0
                                            ? "Rush"
                                            : currentProperty.urgency === 1
                                            ? "Regular"
                                            : "N.A."}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="table-header">
                                          <span className="text-start">
                                            Appraisal Report Required By
                                          </span>
                                        </td>
                                        <td className="table-value">
                                          {currentProperty.quoteRequiredDate
                                            ? formatDate(
                                                currentProperty.quoteRequiredDate
                                              )
                                            : "N.A."}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="table-header">
                                          <span className="text-start">
                                            Remark / Summary
                                          </span>
                                        </td>
                                        <td className="table-value">
                                          {" "}
                                          {currentProperty.remark
                                            ? currentProperty.remark
                                            : "N.A."}
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
                                          {
                                            currentProperty.applicantFirstName
                                          }{" "}
                                          {currentProperty.applicantLastName}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td className="table-header">
                                          <span className="text-start">
                                            {" "}
                                            Applicant Email Address{" "}
                                          </span>
                                        </td>
                                        <td className="table-value">
                                          {
                                            currentProperty.applicantEmailAddress
                                          }
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="table-header">
                                          <span className="text-start">
                                            Applicant Phone Number
                                          </span>
                                        </td>
                                        <td className="table-value">
                                          {" "}
                                          {/* {currentProperty.applicantPhoneNumber} */}
                                          {formatPhoneNumber(
                                            currentProperty.applicantPhoneNumber
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <div className="d-flex justify-content-center gap-2 mt-3">
                                  <button
                                    className="btn btn-color"
                                    style={{ width: "100px" }}
                                    onClick={() =>
                                      PropertyInfoHandler(
                                        currentProperty.orderId
                                      )
                                    }
                                    title="Download Pdf"
                                  >
                                    <FaDownload />
                                  </button>
                                  <button
                                    className="btn btn-color"
                                    style={{ width: "100px" }}
                                    onClick={() => setModalIsPopupOpen(false)}
                                  >
                                    Ok
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        {modalOpen && (
                          <div className="modal">
                            <div
                              className="modal-content"
                              style={{ width: "30%" }}
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
                              <h3
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
                                – Property Id{" "}
                                <span style={{ color: "#97d700" }}>
                                  #{propertyId}
                                </span>
                              </h3>
                              <div
                                className="mb-2"
                                style={{ border: "2px solid #97d700" }}
                              ></div>
                              <p className="fs-5 text-center text-dark mt-4">
                                Are you sure you wish to{" "}
                                <span
                                  style={{ color: "red", fontWeight: "bold" }}
                                >
                                  {" "}
                                  {isHoldProperty
                                    ? `${
                                        propValue ? "On Hold" : "Remove On Hold"
                                      }`
                                    : `${
                                        propValue
                                          ? "Cancel"
                                          : "Remove On Cancel"
                                      }`}{" "}
                                </span>
                                the order ?{" "}
                              </p>
                              <div
                                className="mb-3 mt-4"
                                style={{ border: "2px solid #97d700" }}
                              ></div>
                              <div className="col-lg-12 d-flex justify-content-center gap-2">
                                <button
                                  disabled={disable}
                                  className="btn btn-color w-25"
                                  onClick={closeCancelHoldHandler}
                                >
                                  Cancel
                                </button>
                                <button
                                  disabled={disable}
                                  className="btn btn-color w-25"
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

                        {isModalOpen && (
                          <div className="modal">
                            <div
                              className="modal-content"
                              style={{ width: "25%" }}
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
                              <h3
                                className="text-center mt-3"
                                style={{ color: "#2e008b" }}
                              >
                                Information{" "}
                                <span style={{ color: "#97d700" }}></span>
                              </h3>
                              <div
                                className="mb-2"
                                style={{ border: "2px solid #97d700" }}
                              ></div>
                              <p className="fs-5 text-center text-dark mt-4">
                                You&apos;ve hit your subscription limit.
                                <br />
                                Kindly
                                <span className="text-danger fw-bold">
                                  Top Up.
                                </span>{" "}
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
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {holdModalOpen && (
                          <div className="modal">
                            <div
                              className="modal-content"
                              style={{ width: "25%" }}
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
                              <h3
                                className="text-center mt-3"
                                style={{ color: "#2e008b" }}
                              >
                                Information{" "}
                                <span style={{ color: "#97d700" }}></span>
                              </h3>
                              <div
                                className="mb-2"
                                style={{ border: "2px solid #97d700" }}
                              ></div>
                              <p className="fs-5 text-center text-dark mt-4">
                                The quotes are accessible for the active
                                properties only.
                              </p>
                              <div
                                className="mb-3 mt-4"
                                style={{ border: "2px solid #97d700" }}
                              ></div>
                              <div className="col-lg-12 d-flex justify-content-center gap-2">
                                <button
                                  // disabled={disable}
                                  className="btn btn-color w-25"
                                  onClick={() => setHoldModalOpen(false)}
                                >
                                  Ok
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

              {/* End .row */}
            </div>
            {/* End .row */}

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
