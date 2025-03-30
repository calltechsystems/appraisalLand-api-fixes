import Header from "../../common/header/dashboard/HeaderAdmin";
import SidebarMenu from "../../common/header/dashboard/SidebarMenuAdmin";
import MobileMenu from "../../common/header/MobileMenuAdmin";
import Filtering from "./Filtering";
import AllStatistics from "./AllStatistics";
import StatisticsChart from "./StatisticsChart";
import StatisticsPieChart from "./StatisticsPieChart";
import PackageData from "./PackageData";
import { useRouter } from "next/router";
import SearchUser from "./SearchUser";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "../../common/LoadingSpinner";

const Index = () => {
  const [filterQuery, setFilterQuery] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [allAppraiser, setAllAppraiser] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bidChartData, setBidChartData] = useState([]);
  const [allBids, setBids] = useState([]);

  const [allHistory, setAllHistory] = useState([]);
  const [planCount, setPlanCount] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [acceptedBids, setAcceptedBids] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [dataFetched, setDataFetched] = useState([]);
  const [FilteredData, setFilteredData] = useState();
  const [refresh, setRefresh] = useState(false);
  const [openBrokerModal, setOpenBrokerModal] = useState(false);
  const [broker, setBroker] = useState({});

  const [disable, setDisable] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [totalBidsCount, setTotalBidsCount] = useState([]);
  const [totalPendingBidsCount, setTotalPendingBidsCount] = useState([]);
  const [totalAcceptBidsCount, setTotalAcceptBidsCount] = useState([]);
  const [totalCompletedBidsCount, setTotalCompletedBidsCount] = useState([]);

  useEffect(() => {
    setAllAppraiser([]);
    setBids([]);

    const data = JSON.parse(localStorage.getItem("user"));

    axios
      .get("/api/getAllListedProperties", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          userId: data?.userId,
        },
      })
      .then((res) => {
        toast.dismiss();

        setDataFetched(true);
        const prop = res.data.data.properties.$values;

        axios
          .get("/api/getAllAppraiser", {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          })
          .then((appraisersCompany) => {
            let allActiveAppraiser = 0;
            const allRequiredAppraiser =
              appraisersCompany.data.data.result.$values;
            allRequiredAppraiser.map((appraiser, index) => {
              if (appraiser.firstName !== null) {
                allActiveAppraiser += 1;
              }
            });
            axios
              .get("/api/getAllSubscriptionHistory", {
                headers: {
                  Authorization: `Bearer ${data.token}`,
                },
              })
              .then((historyRes) => {
                const allHistoryy = historyRes.data.data.$values;
                let finalHistory = [];
                let liteCount = 0,
                  ultimateCount = 0,
                  proCount = 0;
                allHistoryy.map((data, index) => {
                  let row = {};
                  allRequiredAppraiser.map((app, idx) => {
                    if (
                      String(app.userId) === String(data.userId) &&
                      !row?.$id
                    ) {
                      row = data;
                    }
                  });
                  if (row?.$id) {
                    if (
                      String(row?.planName).toLowerCase().includes("lite") &&
                      filterByDateRange(row.createdTime)
                    ) {
                      liteCount++;
                    }
                    if (
                      String(row?.planName)
                        .toLowerCase()
                        .includes("ultimate") &&
                      filterByDateRange(row.createdTime)
                    ) {
                      ultimateCount++;
                    }
                    if (
                      String(row?.planName).toLowerCase().includes("pro") &&
                      filterByDateRange(row.createdTime)
                    ) {
                      proCount++;
                    }
                    finalHistory.push(row);
                  }
                });
                let planArray = [];
                planArray.push(liteCount);
                planArray.push(proCount);
                planArray.push(ultimateCount);
                setPlanCount(planArray);
                setAllHistory(finalHistory);
              })
              .catch((err) => {});
            setAcceptedBids(allActiveAppraiser);
            setAllAppraiser(allRequiredAppraiser);
            axios
              .get("/api/getAllBids", {
                headers: {
                  Authorization: `Bearer ${data.token}`,
                },
                params: {
                  email: data.userEmail,
                },
              })
              .then((res) => {
                let allAcceptedBids = 0;
                tempBids = res.data.data.$values;

                setBids(tempBids);
                axios
                  .get("/api/appraiserWishlistedProperties", {
                    headers: {
                      Authorization: `Bearer ${data?.token}`,
                      "Content-Type": "application/json",
                    },
                  })
                  .then((res) => {
                    const tempData = res.data.data.$values;
                    const responseData = tempData.filter((prop, index) => {
                      if (String(prop.userId) === String(data.userId)) {
                        return true;
                      } else {
                        return false;
                      }
                    });
                    const tempId = responseData;
                    setWishlist(responseData);
                    setProperties(prop);
                  })
                  .catch((err) => {
                    toast.error(err?.response);
                    setErrorMessage(err?.response);
                  });
              })
              .catch((err) => {});
          })
          .catch((err) => {});
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err);
        setDataFetched(false);
      });

    let tempBids = [];

    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    let liteCount = 0,
      ultimateCount = 0,
      proCount = 0;
    allHistory.map((transaction, index) => {
      if (
        String(transaction?.planName).toLowerCase().includes("lite") &&
        filterByDateRange(transaction.createdTime)
      ) {
        liteCount++;
      }
      if (
        String(transaction?.planName).toLowerCase().includes("ultimate") &&
        filterByDateRange(transaction.createdTime)
      ) {
        ultimateCount++;
      }
      if (
        String(transaction?.planName).toLowerCase().includes("pro") &&
        filterByDateRange(transaction.createdTime)
      ) {
        proCount++;
      }
    });

    let planArray = [];
    planArray.push(liteCount);
    planArray.push(proCount);
    planArray.push(ultimateCount);
    setPlanCount(planArray);
  }, [allAppraiser, allBids, allHistory, bidChartData, filterQuery]);

  useEffect(() => {
    setBidChartData(generateMonthCountArray());
  }, [allBids, filterQuery]);

  useEffect(() => {
    let filteredData = [];
    allAppraiser.map((appraiser, index) => {
      if (
        String(appraiser.firstName)
          .toLowerCase()
          .includes(String(searchInput).toLowerCase()) ||
        String(appraiser.lastName)
          .toLowerCase()
          .includes(String(searchInput).toLowerCase()) ||
        String(appraiser.emailId)
          .toLowerCase()
          .includes(String(searchInput).toLowerCase())
      ) {
        filteredData.push(appraiser);
      }
    });
    setFilteredData(filteredData);
  }, [searchInput]);

  useEffect(() => {
    let allAppraisers = [],
      activeAppraiser = 0;
    allAppraiser.map((appraiser, index) => {
      if (filterByDateRange(filterQuery, appraiser.modifiedDateTime)) {
        allAppraisers.push(appraiser);
        if (appraiser.firstName !== null) {
          activeAppraiser += 1;
        }
      }
    });

    setFilteredData(allAppraisers);
    setAcceptedBids(activeAppraiser);
  }, [filterQuery]);

  const handleStatusUpdateHandler = () => {
    if (getIfAssignedProperties(selectedUser.id) && selectedUser.isActive) {
      setModalIsOpenError_01(true);
      setOpenEditModal(true);
    } else {
      const userData = JSON.parse(localStorage.getItem("user"));
      setDisable(true);
      const payload = {
        id: selectedUser.userId,
        IsActive: !selectedUser.isActive,
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

      setSelectedUser(-1);
    }
  };

  const closeStatusUpdateHandler = () => {
    setSelectedUser(-1);
    setOpenEditModal(false);
  };

  function filterByDateRange(filterQuery, date) {
    const currentDate = new Date();
    const dateToCheck = new Date(date);
    const timeDifference = currentDate - dateToCheck;
    let timeThreshold;
    switch (filterQuery) {
      case "Monthly":
        timeThreshold = 30 * 24 * 60 * 60 * 1000;
        break;
      case "Weekly":
        timeThreshold = 7 * 24 * 60 * 60 * 1000;
        break;
      case "Yearly":
        timeThreshold = 90 * 24 * 60 * 60 * 1000;
        break;
      default:
        return true;
    }
    return timeDifference <= timeThreshold;
  }

  const sortFunction = (rows) => {
    const appraisers = rows;
    appraisers.sort((a, b) => {
      if (a?.firstName === null && b?.firstName !== null) {
      } else if (a?.firstName !== null && b?.firstName === null) {
        return -1;
      } else {
        return a?.firstName?.localeCompare(b?.firstName);
      }
    });
    return appraisers;
  };

  const refreshHandler = () => {
    setRefresh(true);
  };

  const checkIfIsOfAppraiserCompanyBid = (id) => {
    let isPresent = false;
    allAppraiser.map((appraiser, index) => {
      if (String(appraiser.userId) === String(id)) {
        isPresent = true;
      }
    });
    return isPresent;
  };

  const closeBrokerModal = () => {
    setOpenBrokerModal(false);
  };

  const brokerInfoHandler = (orderId) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Appraiser Information</title></head><body>"
    );
    printWindow.document.write("<h1>" + `Broker information` + "</h1>");
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

  function generateMonthCountArray() {
    const monthCountArray = Array(12).fill(0);
    allBids.map((obj, index) => {
      const requestMonth = new Date(obj.requestTime).getMonth();
      if (
        checkIfIsOfAppraiserCompanyBid(obj.appraiserUserId) &&
        filterByDateRange(filterQuery, obj.requestTime)
      ) {
        monthCountArray[requestMonth]++;
      }
    });

    return monthCountArray;
  }

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
      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div className="container-fluid ovh">
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

                <div className="col-lg-12 text-center">
                  <h2
                    style={{
                      color: "#2e008b",
                      fontSize: "28px",
                      textAlign: "center",
                    }}
                  >
                    Appraiser
                  </h2>
                </div>
                <div className="d-flex justify-content-end mb-2">
                  <Filtering
                    refreshHandler={refreshHandler}
                    filterQuery={filterQuery}
                    setFilterQuery={setFilterQuery}
                  />
                </div>
              </div>
              {/* End .row */}

              {allAppraiser.length === 0 ? (
                <LoadingSpinner />
              ) : (
                <div className="row">
                  <div className="col-lg-7">
                    <div className="row">
                      <AllStatistics
                        totalBids={allAppraiser.length}
                        acceptedBids={acceptedBids}
                        totalBidsCount={totalBidsCount}
                        totalPendingBidsCount={totalPendingBidsCount}
                        totalAcceptBidsCount={totalAcceptBidsCount}
                        totalCompletedBidsCount={totalCompletedBidsCount}
                      />
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="application_statics">
                      <h4 className="" style={{ color: "#97d700" }}>
                        Active Plan Wise Appraisers
                      </h4>
                      <StatisticsPieChart planData={planCount} />
                    </div>
                  </div>
                </div>
              )}

              <div className="row mt-5">
                <div className="col-lg-12">
                  <div>
                    <div className="col-lg-12">
                      <div className="packages_table">
                        <div className="mt0">
                          <PackageData
                            setBroker={setBroker}
                            setOpenBrokerModal={setOpenBrokerModal}
                            setRefresh={setRefresh}
                            data={
                              searchInput !== ""
                                ? sortFunction(FilteredData)
                                : sortFunction(allAppraiser)
                            }
                            allBids={allBids}
                            allSubscriptionHistory={allHistory}
                            allAppraiser={allAppraiser}
                            setOpenEditModal={setOpenEditModal}
                            setSelectedUser={setSelectedUser}
                            setSearchInput={setSearchInput}
                            searchInput={searchInput}
                            setTotalBidsCount={setTotalBidsCount}
                            setTotalPendingBidsCount={setTotalPendingBidsCount}
                            setTotalAcceptBidsCount={setTotalAcceptBidsCount}
                            setTotalCompletedBidsCount={
                              setTotalCompletedBidsCount
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row"></div>

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
                        <h1 className=" text-color mt-1">Appraiser Details</h1>
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
                              <span className="text-start">Appraiser Name</span>
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
                              <span className="text-start">Company Name</span>
                            </td>
                            <td
                              style={{
                                border: "1px solid #2e008b",
                                width: "250px",
                                color: "black",
                                paddingLeft: "10px",
                              }}
                            >
                              {broker.companyName ? broker.companyName : "N.A."}
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
                              <span className="text-start">Email Address</span>
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
                              <span className="text-start">Phone Number</span>
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
                              <span className="text-start">Cell Number</span>
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
                                Appraiser Commission Rate
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
                              {broker.commissionRate}
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
                                Appraiser Max Number Of Assigned Orders
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
                              {broker.maxNumberOfAssignedOrders}
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
                              <span className="text-start">Address</span>
                            </td>
                            <td
                              style={{
                                border: "1px solid #2e008b",
                                width: "400px",
                                color: "black",
                                paddingLeft: "10px",
                              }}
                            >
                              {broker.streetNumber} {broker.streetName}{" "}
                              {broker.area} , {broker.city} {broker.state}-
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
                          onClick={() => brokerInfoHandler(broker.orderId)}
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
                          disabled={selectedUser?.isActive ? false : true}
                        >
                          In-active
                        </option>
                        <option
                          key={1}
                          value={1}
                          disabled={selectedUser?.isActive ? true : false}
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
              {/* End .col */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
