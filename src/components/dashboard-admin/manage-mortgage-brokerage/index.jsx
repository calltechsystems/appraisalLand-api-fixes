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
import { FaDownload } from "react-icons/fa";

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

  useEffect(() => {
    setAllAppraiser([]);
    setProperties([]);
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
          .get("/api/getAllBrokerageCompany", {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          })
          .then((brokerrr) => {
            let allActiveAppraiser = 0;
            const allrequiredBroker = brokerrr.data.data.result.$values;
            let allfinalBrokers = [];
            allrequiredBroker.map((broker, index) => {
              prop.map((property, idx) => {
                if (String(property.userId) === String(broker.userId)) {
                  allfinalBrokers.push({
                    ...property,
                    firstName: broker.firstName,
                    lastName: broker.lastName,
                  });
                }
              });
              if (broker.firstName !== null) allActiveAppraiser += 1;
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
                  allrequiredBroker.map((app, idx) => {
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
            setAllAppraiser(allrequiredBroker);
            setProperties(allfinalBrokers);
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
    setBidChartData(generateMonthCountArray());
  }, [properties, filterQuery]);

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
    let filteredData = [];
    allAppraiser.map((appraiser, index) => {
      if (
        String(appraiser.firstName)
          .toLowerCase()
          .includes(String(searchInput).toLowerCase()) ||
        String(appraiser.lastName)
          .toLowerCase()
          .includes(String(searchInput).toLowerCase()) ||
        String(appraiser.assistantFirstName)
          .toLowerCase()
          .includes(String(searchInput).toLowerCase()) ||
        String(appraiser.assistantLastName)
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

  const isRegularPlan = (planName) => {
    if (
      String(planName).toLowerCase().includes("lite") ||
      String(planName).toLowerCase().includes("lite") ||
      String(planName).toLowerCase().includes("lite")
    ) {
      return true;
    }
    return false;
  };

  const getFormattedData = (users, transactions) => {
    let formattedUsers = [];

    users.map((user, index) => {
      let updatedUser = {};
      transactions.map((detail, index2) => {
        if (
          String(user.userId) === String(detail?.userId) &&
          !updatedUser?.$id &&
          isRegularPlan(detail?.transactionDetail)
        ) {
          updatedUser = {
            ...user,
            planName: detail?.transactionDetail,
            endDate: detail?.endDate,
          };
        }
      });
      if (updatedUser?.$id) {
        formattedUsers.push(updatedUser);
      } else {
        formattedUsers.push({
          ...user,
          planName: "-",
          endDate: "-",
        });
      }
    });
    return formattedUsers;
  };

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

  const closeBrokerModal = () => {
    setOpenBrokerModal(false);
  };

  const brokerInfoHandler = (orderId) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Brokerage Information</title></head><body>"
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

  const refreshHandler = () => {
    setRefresh(true);
  };

  function generateMonthCountArray() {
    const monthCountArray = Array(12).fill(0);
    properties.map((obj, index) => {
      const requestMonth = new Date(obj.modifiedDatetime).getMonth();
      if (filterByDateRange(filterQuery, obj.modifiedDatetime)) {
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
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-lg-12">
                  <div>
                    <div className="col-lg-12">
                      <div className="packages_table">
                        <div className=" mt0">
                          <PackageData
                            setBroker={setBroker}
                            setOpenBrokerModal={setOpenBrokerModal}
                            data={
                              searchInput !== ""
                                ? sortFunction(
                                    getFormattedData(FilteredData, allHistory)
                                  )
                                : sortFunction(
                                    getFormattedData(allAppraiser, allHistory)
                                  )
                            }
                            setRefresh={setRefresh}
                            properties={properties}
                            allBids={allBids}
                            setOpenEditModal={setOpenEditModal}
                            setSelectedUser={setSelectedUser}
                            allSubscriptionHistory={allHistory}
                            allBrokerageData={allAppraiser}
                            searchInput={searchInput}
                            setSearchInput={setSearchInput}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
                        <h2 className=" text-color mt-1">
                          Mortgage Brokerage Details
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
                          <tr>
                            <td className="table-header">
                              <span className="text-start">Name</span>
                            </td>
                            <td className="table-value">
                              {broker.firstName} {broker.lastName}
                            </td>
                          </tr>

                          <tr>
                            <td className="table-header">
                              <span className="text-start">Brokerage Name</span>
                            </td>
                            <td className="table-value">
                              {broker.brokerageName
                                ? broker.brokerageName
                                : "N.A."}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-header">
                              <span className="text-start">Email Address</span>
                            </td>
                            <td className="table-value">{broker.emailId}</td>
                          </tr>
                          <tr>
                            <td className="table-header">
                              <span className="text-start">Phone Number</span>
                            </td>
                            <td className="table-value">
                              {broker.phoneNumber}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-header">
                              <span className="text-start">Cell Number</span>
                            </td>
                            <td className="table-value">
                              {broker.cellNumber ? broker.cellNumber : "N.A."}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-header">
                              <span className="text-start">
                                Mortgage Broker Licence No
                              </span>
                            </td>
                            <td className="table-value">
                              {broker.mortageBrokerLicNo}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-header">
                              <span className="text-start">
                                Mortgage Brokerage Licence No
                              </span>
                            </td>
                            <td className="table-value">
                              {broker.mortageBrokerageLicNo}
                            </td>
                          </tr>
                          <tr>
                            <td className="table-header">
                              <span className="text-start">Address</span>
                            </td>
                            <td className="table-value">
                              {broker.streetNumber} {broker.streetName}{" "}
                              {broker.apartmentNumber}, {broker.city}{" "}
                              {broker.state}-{broker.postalCode}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      <button
                        className="btn btn-color"
                        onClick={() => brokerInfoHandler(broker.orderId)}
                        style={{ width: "100px" }}
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

              <div className="row"></div>

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
