import Header from "../../common/header/dashboard/HeaderAdmin";
import SidebarMenu from "../../common/header/dashboard/SidebarMenuAdmin";
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
import { AppraiserStatusOptions } from "../data";

const Index = () => {
  const [disable, setDisable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isStatusModal, setIsStatusModal] = useState(false);
  const [userNameSearch, setUserNameSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState(0);
  const [toggleId, setToggleId] = useState(-1);
  const [toggleWishlist, setToggleWishlist] = useState(0);
  const [searchResult, setSearchResult] = useState([]);
  const [property, setProperty] = useState("");
  const [typeView, setTypeView] = useState(0);
  const [startLoading, setStartLoading] = useState(false);
  const [currentProperty, setCurrentProperty] = useState("");
  const [filterProperty, setFilterProperty] = useState([]);
  const [showPropDetails, setShowPropDetails] = useState(false);
  const [filterQuery, setFilterQuery] = useState("All");
  const [searchQuery, setSearchQuery] = useState("city");
  const [properties, setProperties] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [lowRangeBid, setLowRangeBid] = useState("");
  const [propertyId, setPropertyId] = useState(null);
  const [currentModalInfoType, setCurrentModalInfoType] = useState('');

  const [wishlistedProperties, setWishlistedProperties] = useState([]);
  const [updatedCode, setUpdatedCode] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [refresh, setRefresh] = useState(false);

  const [openPlanModal, setOpenPlanModal] = useState(false);
  const [viewPlanData, setViewPlanData] = useState({});

  const [start, setStart] = useState(0);
  const [isHoldProperty, setIsHoldProperty] = useState(0);
  const [isCancelProperty, setIsCancelProperty] = useState(0);

  const [end, setEnd] = useState(4);

  const [CurrentBidInfo, setCurrentBidInfo] = useState({});
  const [OpenBidViewModal, setOpenBidViewModal] = useState(false);

  const closeErrorModal = () => {
    setModalIsOpenError(false);
  };

  const closeBidViewModal = () => {
    setOpenBidViewModal(false);
    setCurrentBidInfo({});
  };

  const closeStatusUpdateHandler = () => {
    setOpenDate(false);
    setIsStatusModal(false);
  };

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
    setIsModalOpen(false);
    setIsQuoteModalOpen(true);
  };

  const [openDate, setOpenDate] = useState(false);

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
    const inactivityCheckInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivityTimestamp;

      if (timeSinceLastActivity > 600000) {
        localStorage.removeItem("user");
        router.push("/login");
      }
    }, 60000); 

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

  const archievePropertyHandler = (id) => {
    const data = JSON.parse(localStorage.getItem("user"));

    toast.loading("Archiving this Property");
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
        toast.success("Successfully Added to Archived Properties!!");
        router.push("/archive-property");
      })
      .catch((err) => {
        toast.error(err);
      });
    // closeModal();
  };

  const [propValue, setPropValue] = useState({});

  const onHoldHandler = () => {
    setDisable(true);
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
    setDisable(true);
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

  const closeCancelHoldHandler = () => {
    setIsCancelProperty(false);
    setIsHoldProperty(false);
    setModalOpen(false);
  };

  useEffect(() => {
    const filterProperties = (propertys, userNameSearch) => {
      if (userNameSearch === "") {
        return propertys;
      }
      const filteredProperties = propertys.filter((prop) => {
        const searchString = String(userNameSearch).toLowerCase()
        const apprasierCompany = prop.apprasierCompany;
        if(apprasierCompany?.firstName){

          const includesFirstName = 
          String(apprasierCompany.firstName).toLowerCase().includes
          (searchString);

          const includesLastName = 
          String(apprasierCompany.lastName).toLowerCase()
          .includes(searchString);
          return includesFirstName || includesLastName;
        }
        else{
          return false;
        }
      });

      return filteredProperties;
    };
    const filteredData = filterProperties(properties, userNameSearch);
    setFilterProperty(filteredData);
  }, [userNameSearch]);

  useEffect(() => {
    const filterProperties = (propertys, searchInput) => {
      if (searchInput === "") {
        return propertys;
      }
      const filteredProperties = propertys.filter((prop) => {
        const property = prop.property;
        if(!property){
          return false;
        }
        // Convert the search input to lowercase for a case-insensitive search
        const searchTerm = searchInput.toLowerCase();

        if (String(property?.orderId) === String(searchTerm)) {
          return true;
        }
        
        else
          return (
            String(property?.orderId).toLowerCase().includes(searchTerm) ||
            property?.zipCode.toLowerCase().includes(searchTerm) ||
            property?.city.toLowerCase().includes(searchTerm) ||
            property?.province.toLowerCase().includes(searchTerm) 
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
        return tempData?.property?.filter((item) => calculate(item, 7));
      case "Last 30 Days":
        const thirtyDaysAgo = new Date(currentDate);
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        return tempData?.property?.filter((item) => calculate(item, 30));
      case "Last 3 Month":
        const threeMonthsAgo = new Date(currentDate);
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
        return tempData?.property?.filter((item) => calculate(item, 90));

      default:
        return tempData; 
    }
  };

  useEffect(() => {
    const tmpData = filterData(properties);
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

  const [userData, setUserData] = useState(348);

  const brokerInfoHandler = (orderId) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Brokerage Information</title></head><body>"
    );
    printWindow.document.write("<h1>" + `Brokerage information` + "</h1>");
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

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      // second: "numeric",
      hour12: true, // Set to false for 24-hour format
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  useEffect(() => {
    const tempData = properties;
    if (searchInput === "") {
      return;
    } else if (searchQuery === "city") {
      const newProperties = tempData.filter((item) => {
        if (item?.city?.toLowerCase() === searchInput.toLowerCase()) {
          return true;
        } else {
          return false;
        }
      });
      setSearchResult(newProperties);
    } else if (searchQuery === "state") {
      const newProperties = tempData.filter((item) => {
        if (item?.state?.toLowerCase() === searchInput.toLowerCase()) {
          return true;
        } else {
          return false;
        }
      });
      setSearchResult(newProperties);
    } else {
      const newProperties = tempData.filter((item) => {
        if (item?.zipCode?.toLowerCase() === searchInput.toLowerCase()) {
          return true;
        } else {
          return false;
        }
      });
      setSearchResult(newProperties);
    }
  }, [searchInput]);

  const closePlanModal = () => {
    setOpenPlanModal(false);
  };

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
        <div className="container-fluid ovh table-padding container-padding">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">
              
                {/* End Dashboard Navigation */}

                <div className="col-lg-12 col-xl-12 mb5 mt10">
                  <div className="style2 mb30-991">
                    <h3 className="heading-forms">Sub Appraiser Properties</h3>
                    {/* <p>We are glad to see you again!</p>                                                             */}
                  </div>
                </div>
                {/* End .col */}

                <div className="col-lg-12 col-xl-12">
                 
                </div>
                {/* End .col */}

                <div className="col-lg-12">
                  <div className="">
                    <div className="property_table">
                      <div className="mt0">
                        <TableData
                          userData={userData}
                          setModalOpen={setModalOpen}
                          setIsStatusModal={setIsStatusModal}
                          close={closeModal}
                          setPropertyId={setPropertyId}
                          setPropValue={setPropValue}
                          setProperties={setProperties}
                          start={start}
                          end={end}
                          userNameSearch={userNameSearch}
                          setUserNameSearch={setUserNameSearch}
                          statusSearch={statusSearch}
                          setStatusSearch={setStatusSearch}
                          properties={
                            searchInput === "" && filterQuery === "All" && userNameSearch === ""
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
                          setViewPlanData={setViewPlanData}
                          setOpenPlanModal={setOpenPlanModal}
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
                          setCurrentBidInfo={setCurrentBidInfo}
                          setOpenBidViewModal={setOpenBidViewModal}
                          setCurrentModalInfoType={setCurrentModalInfoType}
                        />

                        <div>
                        {openBrokerModal && (
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
                                    <h1 className=" text-color mt-1">
                                      {currentModalInfoType} {" "} Details
                                    </h1>
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
                                  <table
                                    style={{
                                      width: "700px",
                                      textAlign: "start",
                                      borderRadius: "5px",
                                      fontSize: "17px",
                                      fontWeight: "bold",
                                    }}
                                    id="table-broker-info"
                                  >
                                    <thead>
                                      <tr>
                                        <th
                                          style={{
                                            border: "1px solid #2e008b",
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
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          <span className="text-start">
                                            Appraiser Name
                                          </span>
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            width: "250px",
                                            color: "black",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {broker.firstName} {broker.lastName}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            color: "#2e008b",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          <span className="text-start">
                                            Company Name
                                          </span>
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            width: "250px",
                                            color: "black",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {broker.companyName
                                            ? broker.companyName
                                            : "N.A."}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            color: "#2e008b",
                                            paddingLeft: "10px",
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
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {broker.emailId}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            color: "#2e008b",
                                            paddingLeft: "10px",
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
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {broker.phoneNumber}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            color: "#2e008b",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          <span className="text-start">
                                            Cell Number
                                          </span>
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            width: "250px",
                                            color: "black",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {broker.cellNumber}
                                        </td>
                                      </tr>
                                      
                                      <tr>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            color: "#2e008b",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          <span className="text-start">
                                            Appraiser designation
                                          </span>
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            width: "250px",
                                            color: "black",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {broker.designation}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            color: "#2e008b",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          <span className="text-start">
                                            Address
                                          </span>
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            width: "400px",
                                            color: "black",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {broker.streetNumber}{" "}
                                          {broker.streetName} {broker.area} ,{" "}
                                          {broker.city} {broker.state}-
                                          {broker.postalCode}
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
                                        brokerInfoHandler(broker.orderId)
                                      }
                                      title="Download Pdf"
                                    >
                                      Download
                                    </div>
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

{OpenBidViewModal && (
                            <div className="modal">
                              <div
                                className="modal-content"
                                style={{ width: "40%" }}
                              >
                                <div className="row">
                                  <div className="col-lg-12">
                                    <Link href="/">
                                      <Image
                                        width={50}
                                        height={45}
                                        className="logo1 img-fluid"
                                        style={{ marginTop: "-20px" }}
                                        src="/assets/images/logo.png"
                                        alt="header-logo"
                                      />
                                      <span
                                        style={{
                                          color: "#2e008b",
                                          fontWeight: "bold",
                                          fontSize: "24px",
                                        }}
                                      >
                                        Appraisal
                                      </span>
                                      <span
                                        style={{
                                          color: "#97d700",
                                          fontWeight: "bold",
                                          fontSize: "24px",
                                        }}
                                      >
                                        Land
                                      </span>
                                    </Link>
                                  </div>
                                </div>
                                <div className="row text-center">
                                  <div className="col-lg-12">

                                    <h2 className="text-color mt-1">
                                      Quote Information
                                    </h2>

                                  </div>
                                </div>
                                <div
                                  className="mt-2 mb-3"
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
                                      {CurrentBidInfo && (
                                        <>
                                          <tr>

                                            <td className="table-header">
                                              Quote Id

                                            </td>
                                            <td className="table-value">
                                              {CurrentBidInfo.bidId}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className="table-header">
                                              Appraiser Name
                                            </td>
                                            <td className="table-value">
                                              {CurrentBidInfo.appraiserName}
                                            </td>
                                          </tr>
                                          <tr>

                                            <td className="table-header">
                                              Quote Amount

                                            </td>
                                            <td className="table-value">
                                              $ {CurrentBidInfo.bidAmount}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className="table-header">
                                              Description
                                            </td>
                                            <td className="table-value">
                                              {CurrentBidInfo.description}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className="table-header">
                                              Lender List
                                            </td>
                                            <td className="table-value">
                                              {CurrentBidInfo.lenderListUrl ? (
                                                <a
                                                  href={
                                                    CurrentBidInfo.lenderListUrl
                                                  }
                                                  download
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                >
                                                  Download
                                                </a>
                                              ) : (
                                                "N/A"
                                              )}
                                            </td>
                                          </tr>
                                        </>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="row text-center mt-3">
                                  <div className="col-lg-12">
                                    <button
                                      className="btn btn-color"
                                      style={{ width: "100px" }}
                                      onClick={closeBidViewModal}
                                    >
                                      Ok
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {openPlanModal && (
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
                                    <h1 className=" text-color mt-1">
                                      Plan Details
                                    </h1>
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
                                  <table
                                    style={{
                                      width: "700px",
                                      textAlign: "start",
                                      borderRadius: "5px",
                                      fontSize: "17px",
                                      fontWeight: "bold",
                                    }}
                                    id="table-plan-info"
                                  >
                                    <thead>
                                      <tr>
                                        <th
                                          style={{
                                            border: "1px solid #2e008b",
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
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          <span className="text-start">
                                            Plan Name
                                          </span>
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            width: "250px",
                                            color: "black",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {viewPlanData?.planName}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            color: "#2e008b",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          <span className="text-start">
                                            Plan Amount
                                          </span>
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            width: "250px",
                                            color: "black",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {viewPlanData?.planAmount}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            color: "#2e008b",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          <span className="text-start">
                                            Payement Id
                                          </span>
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            width: "250px",
                                            color: "black",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {viewPlanData.paymentid}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            color: "#2e008b",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          <span className="text-start">
                                            No Of Properties
                                          </span>
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            width: "250px",
                                            color: "black",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {viewPlanData.noOfProperties}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            color: "#2e008b",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          <span className="text-start">
                                            Used Properties
                                          </span>
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            width: "250px",
                                            color: "black",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {viewPlanData.usedProperties}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            color: "#2e008b",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          <span className="text-start">
                                            Start Date
                                          </span>
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            width: "250px",
                                            color: "black",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {formatDate(viewPlanData.startDate)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            color: "#2e008b",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          <span className="text-start">
                                            End Date
                                          </span>
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid #2e008b",
                                            width: "250px",
                                            color: "black",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {formatDate(viewPlanData?.endDate)}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <div className="row text-center mt-3">
                                  <div className="col-lg-12">
                                    <button
                                      className="btn btn-color w-25 text-center"
                                      onClick={closePlanModal}
                                    >
                                      Ok
                                    </button>
                                  </div>
                                </div>
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
                                        propValue
                                          ? "On Cancel"
                                          : "Remove On Hold"
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
