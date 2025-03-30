import Header from "../../common/header/dashboard/HeaderAppraiserCompany";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu_002";
import MobileMenu from "../../common/header/MobileMenu_01";
import TableData from "./TableData";
import Pagination from "./Pagination";
import { useEffect, useRef } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";
import Modal from "./Modal";
import { encryptionData } from "../../../utils/dataEncryption";
import Loader from "./Loader";
import { AppraiserStatusOptions } from "../create-listing/data";
import Link from "next/link";
import Image from "next/image";
import { FaDownload } from "react-icons/fa";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [isStatusModal, setIsStatusModal] = useState(false);

  const [disable, setDisable] = useState(false);
  const [toggleId, setToggleId] = useState(-1);
  const [toggleWishlist, setToggleWishlist] = useState(0);
  const [searchResult, setSearchResult] = useState([]);
  const [property, setProperty] = useState("");
  const [typeView, setTypeView] = useState(0);
  const [startLoading, setStartLoading] = useState(false);
  const [filterProperty, setFilterProperty] = useState("");
  const [showPropDetails, setShowPropDetails] = useState(false);
  const [filterQuery, setFilterQuery] = useState("All");
  const [searchQuery, setSearchQuery] = useState("city");
  const [properties, setProperties] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [lowRangeBid, setLowRangeBid] = useState("");
  const [propertyId, setPropertyId] = useState(null);
  const [wishlistedProperties, setWishlistedProperties] = useState([]);
  const [updatedCode, setUpdatedCode] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [refresh, setRefresh] = useState(false);
  const [openQuoteView, setOpenQuoteView] = useState(false);
  const [currentBiddedView, setCurrentBiddedView] = useState({});

  const [orderStatus, setOrderStatus] = useState(-1);

  const [allBrokers, setAllBrokers] = useState([]);
  const [start, setStart] = useState(0);

  const [end, setEnd] = useState(4);

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
  };

  const [remark, setRemark] = useState("");

  const handleStatusUpdateHandler = () => {
    setDisable(true);

    const data = JSON.parse(localStorage.getItem("user"));
    const payload = {
      token: data.token,
      Quoteid: currentBid.bidId,
      OrderStatus: Number(orderStatus),
      statusDate: statusDate,
      remark: remark,
    };

    const encryptedBody = encryptionData(payload);
    toast.loading("Updating order status!!");
    axios
      .put("/api/updateOrderStatus", encryptedBody)
      .then((res) => {
        toast.dismiss();
        toast.success("Successfully updated!!");
        location.reload(true);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response?.data?.error);
      });

    setRemark("");
    setCurrentBid({});
    setIsStatusModal(false);
  };

  const closeStatusUpdateHandler = () => {
    setOpenDate(false);
    setIsStatusModal(false);
  };

  const [openBrokerModal, setOpenBrokerModal] = useState(false);
  const [broker, setBroker] = useState({});

  const closeBrokerModal = () => {
    setOpenBrokerModal(false);
  };

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  const openQuoteModal = () => {
    setIsModalOpen(false);
    setIsQuoteModalOpen(true);
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      // second: "numeric",
    };

    const originalDate = new Date(dateString);

    // Adjust for Eastern Standard Time (EST) by subtracting 5 hours
    const estDate = new Date(originalDate.getTime() - 5 * 60 * 60 * 1000);

    // Format the EST date
    const formattedDate = estDate.toLocaleString("en-US", options);
    return formattedDate;
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const closeQuoteViewModal = () => {
    setOpenQuoteView(false);
    setCurrentBiddedView({});
  };

  const [openDate, setOpenDate] = useState(false);
  const [statusDate, setStatusDate] = useState("");

  const [allAppraiser, setAllAppraiser] = useState([]);
  const [assignModal, setAssignModal] = useState(false);

  const handleStatusSelect = (value) => {
    if (String(value) === "Appraisal Visit Confirmed") {
      setOpenDate(true);
    }
    let selectedValue = 0;
    AppraiserStatusOptions.map((prop, index) => {
      if (String(prop.type) === String(value)) {
        console.log(prop.type, value, prop.id);
        selectedValue = prop.id;
      }
    });

    if (currentBid.orderStatus >= selectedValue) {
      toast.error("Select the next status please !!");
    } else {
      setOrderStatus(selectedValue);
    }
  };

  let [selectedBroker, setSelectedBroker] = useState({});
  const openModalBroker = (property, value) => {
    allBrokers.map((broker) => {
      if (String(broker.userId) === String(property.userId)) {
        setSelectedBroker(broker);
      }
    });

    setBroker(property);

    setTypeView(value);
    setOpenBrokerModal(true);
  };

  const [selectedAppraiser, setSelectedAppraiser] = useState(-1);
  const [assignPropertyId, setAssignPropertyId] = useState(-1);

  const assignAppraiserUpdateHandler = () => {
    const data = JSON.parse(localStorage.getItem("user"));
    const payload = {
      companyid: data.appraiserCompany_Datails.appraiserCompanyId,
      propertyid: Number(assignPropertyId),
      appraiserid: Number(selectedAppraiser),
    };

    const encryptedData = encryptionData(payload);
    toast.loading("Assigning the property!!....");
    axios
      .post("/api/assignPropertyToAppraiser", encryptedData, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })
      .then((res) => {
        toast.dismiss();
        toast.success("Successfully assigned the property!");
        location.reload(true);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err);
      });
    setAssignPropertyId(-1);
  };

  const closeAssignModal = () => {
    setAssignModal(false);
    setAssignPropertyId(-1);
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
  };

  function getMinDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");

    // Format the date as YYYY-MM-DDTHH:mm
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

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

  const onArchivePropertyHandler = (propertyId) => {
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      orderId: propertyId,
      userid: data.userId,
      status: true,
      token: data.token,
    };

    toast.loading("Archiving the desired property!!.");

    const encryptedBody = encryptionData(payload);

    axios
      .post("/api/setArchivePropertyByAppraiser", encryptedBody, {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        toast.dismiss();
        toast.success("Archived property!");
        location.reload(true);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err);
      });
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

  useEffect(() => {
    setIsLoading(false);
  }, [updatedCode]);

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data) {
      router.push("/login");
    }
    if (!data?.appraiserCompany_Datails?.firstName) {
      router.push("appraiser-company-profile");
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
    printWindow.document.write("<html><head><title></title></head><body>");

    // Add the header section
    printWindow.document.write(`
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-12 text-center" style="margin-left:250px; margin-top:50px" >
            <a href="/" class="">
              <img width="40" height="45" class="logo1 img-fluid" style="margin-top:-20px" src="/assets/images/Appraisal_Land_Logo.png" alt="header-logo2.png" />
              <span style="color:#2e008b; font-weight:bold; font-size:18px; margin-top:20px">
                Appraisal
              </span>
              <span style="color:#97d700; font-weight:bold; font-size:18px; margin-top:20px">
                Land
              </span>
            </a>
          </div>
        </div>
        <hr style="width:27%; margin-left:200px; color:#2e008b" />
      </div>
    `);

    printWindow.document.write(
      `<h3 style="margin-left:200px;">Broker Details of Order No. ${orderId}</h3>`
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
    printWindow.document.write("<html><head><title></title></head><body>");

    // Add the header section
    printWindow.document.write(`
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-12 text-center" style="margin-left:250px; margin-top:50px" >
            <a href="/" class="">
              <img width="40" height="45" class="logo1 img-fluid" style="margin-top:-20px" src="/assets/images/Appraisal_Land_Logo.png" alt="header-logo2.png" />
              <span style="color:#2e008b; font-weight:bold; font-size:18px; margin-top:20px">
                Appraisal
              </span>
              <span style="color:#97d700; font-weight:bold; font-size:18px; margin-top:20px">
                Land
              </span>
            </a>
          </div>
        </div>
        <hr style="width:27%; margin-left:200px; color:#2e008b" />
      </div>
    `);

    printWindow.document.write(
      `<h3 style="margin-left:200px;">Property Details of Order No. ${orderId}</h3>`
    );
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

  const [isUpdateBid, setIsUpdateBid] = useState(false);
  const [bidAmount, setbidAmount] = useState(0);
  const [alreadyBidded, setAlreadyBidded] = useState(false);

  const participateHandler = (val, id, isUpdate, value, isBidded) => {
    console.log(val, id, isUpdate, value);
    if (isUpdate) {
      setLowRangeBid(val);
      setIsUpdateBid(isUpdate);
      setbidAmount(value);
      setPropertyId(id);
      setAlreadyBidded(isBidded);
      setModalOpen(true);
    } else {
      setLowRangeBid(val);
      setPropertyId(id);
      setAlreadyBidded(isBidded);
      setModalOpen(true);
    }
  };

  const [currentBid, setCurrentBid] = useState({});

  const onWishlistHandler = (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));

    const formData = {
      userId: userData.userId,
      propertyId: selectedAppraiser,
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
      {/* <!-- Main Header Nav --> */}
      <Header userData={userData} />

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

                {/* <div className="col-lg-12 col-xl-12 text-center mt-1">
                  <div className="style2 mb30-991">
                    <h3 className="breadcrumb_title">Quotes History</h3>
                  </div>
                </div> */}
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
                          setModalOpen={openModal}
                          setIsStatusModal={setIsStatusModal}
                          close={closeModal}
                          setProperties={setProperties}
                          start={start}
                          end={end}
                          setAssignPropertyId={setAssignPropertyId}
                          onArchivePropertyHandler={onArchivePropertyHandler}
                          properties={
                            searchInput === "" && filterQuery === "All"
                              ? properties
                              : filterProperty
                          }
                          setCurrentBid={setCurrentBid}
                          setUpdatedCode={setUpdatedCode}
                          onWishlistHandler={onWishlistHandler}
                          participateHandler={participateHandler}
                          setErrorMessage={setErrorMessage}
                          setModalIsOpenError={setModalIsOpenError}
                          setRefresh={setRefresh}
                          setAllAppraiser={setAllAppraiser}
                          setAssignModal={setAssignModal}
                          setAllBrokers={setAllBrokers}
                          setFilterQuery={setFilterQuery}
                          setSearchInput={setSearchInput}
                          refresh={refresh}
                          setCurrentBiddedView={setCurrentBiddedView}
                          setOpenQuoteView={setOpenQuoteView}
                          searchInput={searchInput}
                          filterQuery={filterQuery}
                          setWishlistedProperties={setWishlistedProperties}
                          setStartLoading={setStartLoading}
                          openModalBroker={openModalBroker}
                        />

                        {modalIsOpenError && (
                          <div className="modal">
                            <div
                              className="modal-content"
                              style={{ width: "20%" }}
                            >
                              <div className="row">
                                <div className="col-lg-12">
                                  <Link href="/" className="">
                                    <Image
                                      width={50}
                                      height={45}
                                      className="logo1 img-fluid"
                                      style={{ marginTop: "-25px" }}
                                      src="/assets/images/Appraisal_Land_Logo.png"
                                      alt="header-logo2.png"
                                    />
                                    <span
                                      style={{
                                        color: "#2e008b",
                                        fontWeight: "bold",
                                        fontSize: "22px",
                                        // marginTop: "20px",
                                      }}
                                    >
                                      Appraisal
                                    </span>
                                    <span
                                      style={{
                                        color: "#97d700",
                                        fontWeight: "bold",
                                        fontSize: "22px",
                                        // marginTop: "20px",
                                      }}
                                    >
                                      {" "}
                                      Land
                                    </span>
                                  </Link>
                                </div>
                              </div>
                              <h3 className="text-center mt-2 text-color">
                                Error
                              </h3>
                              <div
                                style={{
                                  borderWidth: "2px",
                                  borderColor: "orangered",
                                }}
                              >
                                <div
                                  className="mt-1 mb-3"
                                  style={{ border: "2px solid #97d700" }}
                                ></div>
                              </div>
                              <h5 className="text-center text-dark">
                                {errorMessage}
                              </h5>
                              <div
                                className="mt-2 mb-3"
                                style={{ border: "2px solid #97d700" }}
                              ></div>
                              <div className="text-center">
                                <button
                                  className="btn btn-color w-25"
                                  onClick={closeErrorModal}
                                >
                                  Ok
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {openBrokerModal && typeView === 1 && (
                          <div className="modal">
                            <div className="modal-content">
                              <div className="row">
                                <div className="col-lg-12 d-flex justify-content-between">
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
                              <div className="row">
                                <div className="col-lg-12 text-center">
                                  <h2 className=" text-color mt-1">
                                    Property Details – Property Id{"  "}
                                    <span style={{ color: "#97d700" }}>
                                      #{broker.orderId}
                                    </span>
                                  </h2>
                                </div>
                              </div>
                              <div
                                className="mb-3 mt-2"
                                style={{ border: "2px solid #97d700" }}
                              ></div>
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
                                        {broker.streetNumber}{" "}
                                        {broker.streetName} {broker.city}{" "}
                                        {broker.province} {broker.zipCode}
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
                                        {broker.typeOfBuilding}
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
                                        {broker.typeOfAppraisal}
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
                                        {broker.purpose}
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
                                        {broker.lenderInformation
                                          ? broker.lenderInformation
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
                                          broker.estimatedValue
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
                                        {broker.urgency === 0
                                          ? "Rush"
                                          : broker.urgency === 1
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
                                        {broker.quoteRequiredDate
                                          ? formatDate(broker.quoteRequiredDate)
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
                                        {broker.remark ? broker.remark : "N.A."}
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
                                        {broker.applicantFirstName}{" "}
                                        {broker.applicantLastName}
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
                                        {broker.applicantEmailAddress}
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
                                        {formatPhoneNumber(
                                          broker.applicantPhoneNumber
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
                                    PropertyInfoHandler(broker.orderId)
                                  }
                                  title="Download Pdf"
                                >
                                  <FaDownload />
                                </button>
                                <button
                                  className="btn btn-color"
                                  style={{ width: "100px" }}
                                  onClick={closeBrokerModal}
                                >
                                  Ok
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {openQuoteView && (
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
                              <h3 className="text-center mt-2 text-color">
                                Provided Quote – Property Id{" "}
                                <span style={{ color: "#97d700" }}>
                                  #{currentBiddedView.orderId}
                                </span>
                              </h3>
                              <div>
                                <div
                                  className="mt-2 mb-3"
                                  style={{ border: "2px solid #97d700" }}
                                ></div>
                              </div>
                              <p className="text-center fs-5 text-dark">
                                The Last Provided Quote was{" "}
                                <span
                                  style={{
                                    color: "#97d700",
                                    fontWeight: "bold",
                                    fontSize: "22px",
                                  }}
                                >
                                  $
                                  {addCommasToNumber(
                                    currentBiddedView?.bidAmount
                                  )}
                                </span>
                              </p>
                              <p className="text-center fs-6 text-dark">
                                Updated At :{" "}
                                {formatDateTime(currentBiddedView?.requestTime)}
                              </p>

                              <div className="text-center" style={{}}>
                                <div>
                                  <div
                                    className="mt-2 mb-3"
                                    style={{ border: "2px solid #97d700" }}
                                  ></div>
                                </div>
                                <button
                                  className="btn btn-color w-25"
                                  onClick={closeQuoteViewModal}
                                >
                                  Ok
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {openBrokerModal && typeView === 2 && (
                          <div className="modal">
                            <div className="modal-content">
                              <div className="row">
                                <div className="col-lg-12 d-flex justify-content-between">
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
                              <div className="row">
                                <div className="col-lg-12 text-center">
                                  <h2 className=" text-color mt-1">
                                    Mortgage Broker Details – Property Id{"  "}
                                    <span style={{ color: "#97d700" }}>
                                      #{broker.orderId}
                                    </span>
                                  </h2>
                                </div>
                              </div>
                              <div
                                className="mt-2 mb-3"
                                style={{ border: "2px solid #97d700" }}
                              ></div>
                              <div
                                className="d-flex justify-content-center"
                                id="broker-info-container"
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
                                        <span>Mortgage Broker Name</span>
                                      </td>
                                      <td className="table-value">
                                        {selectedBroker.firstName}{" "}
                                        {selectedBroker.lastName}
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Company Name
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {selectedBroker.companyName
                                          ? selectedBroker.companyName
                                          : selectedBroker.brokerageName}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Email Address
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {selectedBroker.emailId}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Phone Number
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {formatPhoneNumber(
                                          selectedBroker.phoneNumber
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Cell Number
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {selectedBroker.cellNumber
                                          ? formatPhoneNumber(
                                              selectedBroker.cellNumber
                                            )
                                          : "N.A."}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Mortgage Broker Licence No.
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {selectedBroker.mortageBrokerLicNo}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Mortgage Brokerage Licence No.
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {selectedBroker.mortageBrokerageLicNo}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="table-header">
                                        <span className="text-start">
                                          Address
                                        </span>
                                      </td>
                                      <td className="table-value">
                                        {selectedBroker.streetNumber}{" "}
                                        {selectedBroker.streetName}{" "}
                                        {selectedBroker.apartmentNo}{" "}
                                        {selectedBroker.city}{" "}
                                        {selectedBroker.province}{" "}
                                        {selectedBroker.postalCode}
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
                                          Brokerage Name
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          
                                          width: "250px",
                                          color: "black",
                                          paddingLeft:"10px"
                                        }}
                                      >
                                        {selectedBroker.brokerageName
                                          ? selectedBroker.brokerageName
                                          : "N.A."}
                                      </td>
                                    </tr> */}

                                    {/* <tr>
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
                                          
                                          width: "250px",
                                          color: "black",
                                          paddingLeft:"10px"
                                        }}
                                      >
                                        {selectedBroker.assistantFirstName
                                          ? selectedBroker.assistantFirstName
                                          : "N.A."}
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
                                          Applicant Phone Number
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "250px",
                                          color: "black",
                                          paddingLeft:"10px"
                                        }}
                                      >
                                        {selectedBroker.assistantPhoneNumber
                                          ? selectedBroker.assistantPhoneNumber
                                          : "N.A."}
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
                                          Applicant Email Address
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #2e008b",
                                          width: "250px",
                                          color: "black",
                                          paddingLeft:"10px"
                                        }}
                                      >
                                        {selectedBroker.assistantEmailAddress
                                          ? selectedBroker.assistantEmailAddress
                                          : "N.A."}
                                      </td>
                                    </tr> */}
                                  </tbody>
                                </table>
                              </div>
                              <div className="d-flex justify-content-center gap-2 mt-3">
                                <button
                                  className="btn btn-color"
                                  style={{ width: "100px" }}
                                  onClick={() =>
                                    brokerInfoHandler(broker.orderId)
                                  }
                                  title="Download Pdf"
                                >
                                  <FaDownload />
                                </button>
                                <button
                                  className="btn btn-color"
                                  style={{ width: "100px" }}
                                  onClick={closeBrokerModal}
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
              {isQuoteModalOpen && (
                <div className="modal">
                  <div className="modal-content">
                    <h3 className="text-center">Quote Confirmation</h3>
                    <h5 className="text-center">
                      Are you sure you want to quote this property over this
                      amount :{valueRef?.current?.value} ?
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
                    <h3 className="text-center">Assign Appraiser</h3>

                    <select
                      required
                      className="form-select"
                      data-live-search="true"
                      data-width="100%"
                      onChange={(e) => setSelectedAppraiser(e.target.value)}
                      // value={buildinRef}
                      // onChange={(e) => setBuildinRef(e.target.value)}
                      // onChange={(e) => setBuildinRef(e.target.value)}
                      // disabled={isDisable}
                      style={{
                        paddingTop: "15px",
                        paddingBottom: "15px",
                        backgroundColor: "#E8F0FE",
                      }}
                    >
                      {allAppraiser.map((item, index) => {
                        <option value={0}>....</option>;
                        return (
                          <option key={item.id} value={item.$id}>
                            {item.firstName} {item.lastName}
                          </option>
                        );
                      })}
                    </select>

                    {/* <p>Are you sure you want to delete the property: {property.area}?</p> */}
                    <div className="text-center" style={{}}>
                      <button
                        className="btn w-35 btn-white"
                        onClick={() => closeAssignModal()}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-color w-10 mt-1"
                        style={{ marginLeft: "12px" }}
                        onClick={assignAppraiserUpdateHandler}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {isStatusModal && (
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
                        <h2 className=" text-color mt-1">
                          Appraisal Status Updation
                        </h2>
                      </div>
                    </div>
                    <div
                      className="mb-4"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    <select
                      required
                      className="form-select mb-3"
                      data-live-search="true"
                      data-width="100%"
                      onChange={(e) => handleStatusSelect(e.target.value)}
                      // value={buildinRef}
                      // onChange={(e) => setBuildinRef(e.target.value)}
                      // onChange={(e) => setBuildinRef(e.target.value)}
                      // disabled={isDisable}
                      style={{
                        paddingTop: "15px",
                        paddingBottom: "15px",
                        backgroundColor: "#E8F0FE",
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
                    {openDate && (
                      <div
                        className="col-lg-12 pt-20"
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <label style={{ color: "black", fontWeight: "bold" }}>
                          Date and Time <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          required
                          type="datetime-local"
                          className="form-control"
                          id="formGroupExampleInput3"
                          onChange={(e) => setStatusDate(e.target.value)}
                          value={statusDate}
                          min={getMinDateTime()}
                        />
                      </div>
                    )}
                    <div>
                      <h4 style={{ color: "#2e008b", fontWeight: "bold" }}>
                        Remark
                      </h4>
                      <input
                        required
                        type="text"
                        className="form-control mb-3"
                        id="formGroupExampleInput3"
                        onChange={(e) => setRemark(e.target.value)}
                        value={remark}
                      />
                    </div>
                    <div
                      className="mb-3 mt-2"
                      style={{ border: "2px solid #97d700" }}
                    ></div>
                    {/* <p>Are you sure you want to delete the property: {property.area}?</p> */}
                    <div className="text-center" style={{}}>
                      <button
                        disabled={disable}
                        className="btn w-35 btn-color"
                        onClick={closeStatusUpdateHandler}
                      >
                        Cancel
                      </button>
                      <button
                        disabled={disable}
                        className="btn btn-color w-10"
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
                  setIsModalOpen={setIsModalOpen}
                  closeModal={closeModal}
                  lowRangeBid={lowRangeBid}
                  isUpdateBid={isUpdateBid}
                  bidAmount={bidAmount}
                  setModalOpen={setModalOpen}
                  propertyId={propertyId}
                  setIsQuoteModalOpen={setIsQuoteModalOpen}
                  openQuoteModal={openQuoteModal}
                  closeQuoteModal={closeQuoteModal}
                  currentBid={currentBid}
                  setCurrentBid={setCurrentBid}
                  setBidAmount={setbidAmount}
                  alreadyBidded={alreadyBidded}
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

            {/* <div className="row">
              <div className="col-lg-12 mt20">
                <div className="mbp_pagination">
                  <Pagination
                    setStart={setStart}
                    setEnd={setEnd}
                    properties={properties}
                  />
                </div>
              </div>
            </div> */}

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
