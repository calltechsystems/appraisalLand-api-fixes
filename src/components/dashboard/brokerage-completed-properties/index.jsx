import Header from "../../common/header/dashboard/HeaderBrokerage";
import SidebarMenu from "../../common/header/dashboard/SidebarMenuBrokerage";
import MobileMenu from "../../common/header/MobileMenu_01";
import TableData from "./TableData";
import Filtering from "./Filtering";
import FilteringBy from "./FilteringBy";
import Pagination from "./Pagination";
import SearchBox from "./SearchBox";
import { useEffect, useRef } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import millify from "millify";
import { useRouter } from "next/router";
import Modal from "./Modal";
import { encryptionData } from "../../../utils/dataEncryption";
import Loader from "./Loader";
import { AppraiserStatusOptions } from "../create-listing/data";
import { useModal } from "../../../context/ModalContext";

const Index = () => {
  const { isModalOpen, setIsModalOpen } = useModal();
  const [searchInput, setSearchInput] = useState("");
  const [isStatusModal, setIsStatusModal] = useState(false);
  const [toggleId, setToggleId] = useState(-1);
  const [toggleWishlist, setToggleWishlist] = useState(0);
  const [searchResult, setSearchResult] = useState([]);
  const [property, setProperty] = useState("");
  const [startLoading, setStartLoading] = useState(false);
  const [filterProperty, setFilterProperty] = useState("");
  const [showPropDetails, setShowPropDetails] = useState(false);
  const [filterQuery, setFilterQuery] = useState("All");
  const [searchQuery, setSearchQuery] = useState("city");
  const [properties, setProperties] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [lowRangeBid, setLowRangeBid] = useState("");
  const [propertyId, setPropertyId] = useState(null);
  const [updatedCode, setUpdatedCode] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState("");
  const [typeView, setTypeView] = useState(0);
  const [modalIsPopupOpen, setModalIsPopupOpen] = useState(false);

  const [wishlistedProperties, setWishlistedProperties] = useState([]);

  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [refresh, setRefresh] = useState(false);

  const [start, setStart] = useState(0);

  const [end, setEnd] = useState(4);

  const closeErrorModal = () => {
    setModalIsOpenError(false);
  };

  const handleStatusUpdateHandler = () => {};

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

  const [openDate, setOpenDate] = useState(false);
  const [statusDate, setStatusDate] = useState("");

  const handleStatusSelect = (value) => {
    if (String(value) === "Appraisal Visit Confirmed") {
      setOpenDate(true);
    }
  };

  const openModalBroker = (property, value) => {
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
      "<html><head><title>Property Information</title></head><body>"
    );
    printWindow.document.write(
      "<h1>" + `Property info of order ${orderId}` + "</h1>"
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
      <section className="our-dashbord dashbord bgc-f7 pb50 dashboard-height">
        <div
          className="container-fluid ovh table-padding container-padding"
          style={{}}
        >
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">
                <div className="col-lg-12 col-xl-12"></div>

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
                          filterQuery={filterQuery}
                          searchInput={searchInput}
                          end={end}
                          properties={
                            searchInput === "" && filterQuery === "All"
                              ? properties
                              : filterProperty
                          }
                          setUpdatedCode={setUpdatedCode}
                          setModalIsPopupOpen={setModalIsPopupOpen}
                          onWishlistHandler={onWishlistHandler}
                          participateHandler={participateHandler}
                          setErrorMessage={setErrorMessage}
                          setModalIsOpenError={setModalIsOpenError}
                          setRefresh={setRefresh}
                          setWishlistedProperties={setWishlistedProperties}
                          setFilterQuery={setFilterQuery}
                          setSearchInput={setSearchInput}
                          setCurrentProperty={setCurrentProperty}
                          refresh={refresh}
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

                        <div>
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
                                          {
                                            currentProperty.applicantEmailAddress
                                          }
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
                              </div>
                            </div>
                          )}
                        </div>

                        {openBrokerModal && typeView === 2 && (
                          <div className="modal">
                            <div className="modal-content">
                              <h3 className="text-center">Broker Details</h3>

                              <div
                                className="d-flex justify-content-center"
                                id="broker-info-container"
                              >
                                <table
                                  style={{
                                    width: "550px",
                                    textAlign: "center",
                                    borderRadius: "5px",
                                  }}
                                  id="table-broker-info"
                                >
                                  <thead>
                                    <tr>
                                      <th
                                        style={{
                                          border: "1px solid grey",
                                          color: "#2e008b",
                                        }}
                                      >
                                        Title
                                      </th>
                                      <th
                                        style={{
                                          border: "1px solid grey",
                                          width: "250px",
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
                                        {broker.applicantPhoneNumber}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                `
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
                                    <span className="flaticon-download "></span>
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

                      {/* End .table-responsive */}

                      {/* End .mbp_pagination */}
                    </div>
                    {/* End .property_table */}
                  </div>
                </div>
                {/* End .col */}
              </div>

              <div className="row">
                <Modal
                  modalOpen={modalOpen}
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
