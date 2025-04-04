import Header from "../../common/header/dashboard/HeaderBrokerage";
import SidebarMenu from "../../common/header/dashboard/SidebarMenuBrokerage";
import MobileMenu from "../../common/header/MobileMenu_02";
import Filtering from "./Filtering";
import AllStatistics from "./AllStatisticsCard";
import StatisticsChart from "./StatisticsChart";
import StatisticsPieChart from "./StatisticsPieChart";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toast";
import { Link } from "react-scroll";
import Image from "next/image";
import axios from "axios";
import Modal from "../../common/header/dashboard/NotificationModal";
import { useModal } from "../../../context/ModalContext";

const Index = () => {
  const [userData, setUserData] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [data, setData] = useState([]);
  const [bids, setBids] = useState([]);
  const [unfilteredData, setUnfilteredData] = useState([]);
  const [showLineGraph, setShowLineGraph] = useState(false);
  const [filterQuery, setFilterQuery] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [acceptedBids, setAcceptedBids] = useState(0);
  const [allQuotesBids, setAllQuotesBids] = useState(0);
  const [allProperties, setAllProperties] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
  const [modalIsPlanError, setModalIsPlaneError] = useState(false);
  const [message, setMessage] = useState("");
  const { isModalOpen, setIsModalOpen } = useModal();

  useEffect(() => {
    // Simulate an API call to check the user's plan status
    const fetchUserPlan = async () => {
      try {
        // Replace this with your actual API call
        const userData = JSON.parse(localStorage.getItem("user"));
        console.log("user", userData);
        if (!userData) {
          throw new Error("User not logged in");
        }
        // if (userData?.userType !== 1) {
        //   console.log("Not applicable for this user type.");
        //   return;
        // }

        const userActivePlans = userData?.userSubscription?.$values;
        //  console.log("plans", userActivePlans);

        const haveSubscription =
          userActivePlans?.length > 0
            ? userActivePlans[0]?.$id
              ? true
              : false
            : false;

        if (haveSubscription) {
          setMessage("");
        } else {
          // setMessage("You need an active plan to create a listing.");
          setModalIsPlaneError(true);
        }
      } catch (error) {
        setMessage("Error fetching plan information. Please try again.");
      } finally {
      }
    };

    fetchUserPlan();
  }, []);

  const planDetails = Array.isArray(userData?.plans?.$values)
    ? userData.plans.$values
    : [];
  const planData_01 = planDetails.map((plan) => ({
    id: plan.$id, // Replace with actual key names
    planName: plan.planName,
    noOfProperties: plan.noOfProperties,
    price: plan.price,
    status: plan.status,
  }));

  console.log("plan data", planData_01);

  const usedProp = userData?.usedproperty;
  const userPlans = Array.isArray(userData?.userSubscription?.$values)
    ? userData.userSubscription.$values
    : [];
  const planData_02 = userPlans.map((plan) => ({
    id: plan.$id, // Replace with actual key names
    planEndDate: plan.endDate,
  }));

  console.log("plans", planData_02);

  const closePlanErrorModal = () => {
    // setModalIsPlaneError(false);
    router.push("/brokerage-plans");
  };

  const closeModal = () => {
    setShowNotification(false);
  };

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

  // if (!userData) {
  //   router.push("/login");
  // } else if (!userData?.brokerDetail?.firstName) {
  //   router.push("/my-profile");
  // }

  const categorizeDataByMonth = (data) => {
    if (data.length <= 0) return [];
    // Initialize an object to store data by month
    const dataByMonth = {};

    const currentMonth = new Date().getMonth();

    data.forEach((property) => {
      const createdAtDate = new Date(property.createdAt);
      const month = createdAtDate.getMonth();
      if (month <= currentMonth) {
        if (!dataByMonth[month]) {
          dataByMonth[month] = [];
        }
        dataByMonth[month].push(property);
      }
    });

    const categorizedData = Object.entries(dataByMonth)?.map(
      ([month, properties]) => ({
        month: parseInt(month, 10),
        properties,
      })
    );

    categorizedData.sort((a, b) => a.month - b.month);

    return categorizedData;
  };

  const getBiddedTime = (orderId) => {
    let time = "";
    bids.map((bid, index) => {
      if (String(bid.orderId) === String(orderId) && bid.status === 1)
        [(time = bid.requestTime)];
    });
    return time;
  };

  const getAllBiddedTime = (orderId) => {
    let time = "";
    bids.map((bid, index) => {
      if (String(bid.orderId) === String(orderId)) [(time = bid.requestTime)];
    });
    return time;
  };

  const filterData = (tempData) => {
    const currentDate = new Date();
    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
    let tempAllAcceptedBids = 0;
    let tempAllQuotesBids = 0;
    let currentAllProperties = 0;

    switch (filterQuery) {
      case "Monthly":
        const oneMonthAgo = new Date(currentDate);
        oneMonthAgo.setMonth(currentDate.getMonth() - 1);
        tempData = tempData.filter((item) => {
          const isBidded = getBiddedTime(item?.orderId);
          const isAllBid = getAllBiddedTime(item?.orderId);
          if (isBidded !== "" && new Date(isBidded) >= oneMonthAgo) {
            tempAllAcceptedBids += 1;
          }

          if (isAllBid !== "" && new Date(isAllBid) >= oneMonthAgo) {
            tempAllQuotesBids += 1;
          }

          if (new Date(item.addedDatetime) >= oneMonthAgo) {
            currentAllProperties += 1;
          }

          return new Date(item.addedDatetime) >= oneMonthAgo;
        });
        setAllQuotesBids(tempAllQuotesBids);
        setAcceptedBids(tempAllAcceptedBids);
        setAllProperties(currentAllProperties);
        return tempData;

      case "Yearly":
        tempData = tempData.filter((item) => {
          const isBidded = getBiddedTime(item?.orderId);
          const isAllBid = getAllBiddedTime(item?.orderId);
          if (isBidded !== "" && new Date(isBidded) >= oneYearAgo) {
            tempAllAcceptedBids += 1;
          }
          if (isAllBid !== "" && new Date(isAllBid) >= oneYearAgo) {
            tempAllQuotesBids += 1;
          }
          if (new Date(item.addedDatetime) >= oneYearAgo) {
            currentAllProperties += 1;
          }
          return new Date(item.addedDatetime) >= oneYearAgo;
        });
        setAllQuotesBids(tempAllQuotesBids);
        setAcceptedBids(tempAllAcceptedBids);
        setAllProperties(currentAllProperties);
        return tempData;

      case "Weekly":
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);
        tempData = tempData.filter((item) => {
          const isBidded = getBiddedTime(item?.orderId);
          const isAllBid = getAllBiddedTime(item?.orderId);
          if (isBidded !== "" && new Date(isBidded) >= oneWeekAgo) {
            tempAllAcceptedBids += 1;
          }
          if (isAllBid !== "" && new Date(isAllBid) >= oneWeekAgo) {
            tempAllQuotesBids += 1;
          }
          if (new Date(item.addedDatetime) >= oneWeekAgo) {
            currentAllProperties += 1;
          }
          return new Date(item.addedDatetime) >= oneWeekAgo;
        });
        setAllQuotesBids(tempAllQuotesBids);
        setAcceptedBids(tempAllAcceptedBids);
        setAllProperties(currentAllProperties);
        return tempData;

      default:
        tempData = tempData.filter((item) => {
          const isBidded = getBiddedTime(item?.orderId);
          const isAllBid = getAllBiddedTime(item?.orderId);
          if (isBidded !== "") {
            tempAllAcceptedBids += 1;
          }
          if (isAllBid !== "") {
            tempAllQuotesBids += 1;
          }
          currentAllProperties += 1;

          return new Date(item.addedDatetime) >= oneYearAgo;
        });
        setAllQuotesBids(tempAllQuotesBids);
        setAllProperties(currentAllProperties);
        return tempData;
    }
  };

  useEffect(() => {
    let acceptedCount = 0;
    data.map((row, index) => {
      bids.map((bid, idx) => {
        if (String(row.orderId) === String(bid.orderId) && bid.status === 1) {
          acceptedCount += 1;
        }
      });
    });

    setAcceptedBids(acceptedCount);
  }, [data]);

  useEffect(() => {
    const dataTemp = filterData(data);
    setChartData(dataTemp);
  }, [filterQuery, bids, data]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setData([]);
        setBids([]);

        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUserData(storedUser);

        if (!storedUser) {
          router.push("/login");
          return;
        }

        if (!storedUser?.brokerageDetail?.firstName) {
          router.push("/brokerage-profile");
          return;
        }

        // Fetch listed properties
        const propertyResponse = await axios.get(
          "/api/getAllListedProperties",
          {
            headers: {
              Authorization: `Bearer ${storedUser?.token}`,
              "Content-Type": "application/json",
            },
            params: {
              userId: storedUser?.userId,
            },
          }
        );

        const {
          success,
          message,
          data: propertiesData,
        } = propertyResponse.data;
        if (!success) {
          toast.error(message);
          return;
        }
        const propertyList = propertiesData.properties.$values;
        const filteredProperties = propertyList.filter(
          (property) => String(property.userId) === String(storedUser.userId)
        );
        const formattedChartData = filterData(filteredProperties);

        setData(filteredProperties);
        setChartData(formattedChartData);
        setShowLineGraph(true);

        // Fetch bids
        const bidsResponse = await axios.get("/api/getAllBids", {
          headers: {
            Authorization: `Bearer ${storedUser?.token}`,
          },
          params: {
            email: storedUser?.userEmail,
          },
        });

        const {
          success: bidSuccess,
          message: bidMessage,
          data: bidsData,
        } = bidsResponse.data;

        if (!bidSuccess) {
          toast.error(bidMessage);
          return;
        }
        const bidList = bidsData.data.$values;
        let acceptedBidCount = 0;
        let allBids = [];

        bidList.forEach((bid) => {
          if (String(bid.userId) === String(storedUser.userId)) {
            if (bid.status === 1) {
              acceptedBidCount += 1;
            }
            allBids.push(bid);
          }
        });

        setAcceptedBids(acceptedBidCount);
        setBids(allBids);
      } catch (error) {
        toast.error(
          error?.response?.data?.error ||
            "An error occurred while fetching data"
        );
        console.error("Error fetching dashboard data:", error);
      } finally {
        setRefresh(false);
      }
    };

    fetchDashboardData();
  }, [refresh]);

  useEffect(() => {
    const categorizeDataByMonth = (data) => {
      if (data.length === 0) {
        return Array(12).fill(0); // Initialize an array with 12 elements, all initialized to 0.
      }

      const currentMonth = new Date().getMonth();

      const countsByMonth = Array(currentMonth + 1).fill(0);

      data.forEach((property) => {
        const createdAtDate = new Date(property.addedDatetime);
        const month = createdAtDate.getMonth();

        if (month <= currentMonth) {
          countsByMonth[month]++;
        }
      });

      return countsByMonth;
    };
    const temp = categorizeDataByMonth(chartData);
    setLineData(temp);
  }, [chartData]);

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header
        userData={userData ? userData : {}}
        setShowNotification={setShowNotification}
      />

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
              <div className="row mb-5">
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

                <div
                  className="dashboard-header col-lg-12 mb-2 pb-2 pt-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "5px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        color: "#97d700",
                        fontSize: "25px",
                      }}
                    >
                      <span style={{ color: "#2e008b" }}>Welcome</span>{" "}
                      {userData?.brokerageDetail?.firstName
                        ? userData?.brokerageDetail?.firstName
                        : "firstName"}{" "}
                      {userData?.brokerageDetail?.lastName
                        ? userData?.brokerageDetail?.lastName
                        : "lastName"}
                    </h2>
                    {/* <p>We are glad to see you again!</p> */}
                  </div>
                  <div>
                    <Filtering
                      setRefresh={setRefresh}
                      FilterQuery={filterQuery}
                      setFilterQuery={setFilterQuery}
                    />
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <AllStatistics
                  properties={data}
                  views={allQuotesBids}
                  bids={bids}
                  favourites={wishlist.length}
                  plans={planData_01}
                  plansNew={planData_02}
                  usedProp={usedProp}
                />
              </div>
              {/* End .row Dashboard top statistics */}

              {/* <div className="row">
                <div className="col-xl-6">
                  <div className="application_statics">
                    <h4 className="mb-4">Property Statistics</h4>
                    {data.length > 0 && showLineGraph ? (
                      <StatisticsChart data={lineData} />
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="application_statics">
                    <h4 className="mb-4">Plans Statistics</h4>
                    {data.length > 0 && showLineGraph ? (
                      <StatisticsPieChart data={lineData} />
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                </div>
              </div> */}

              {/* End .row  */}

              {modalIsPlanError && (
                <div className="modal">
                  <div
                    className="modal-content"
                    style={{ borderColor: "#97d700", width: "30%" }}
                  >
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
                          <h3 className=" text-color mt-1">Error</h3>
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
                      A valid subscription is required to access Appraisal Land.
                      Please subscribe now to enjoy our full range of services
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
                        className="btn btn-color"
                        onClick={() => closePlanErrorModal()}
                        style={{ width: "170px" }}
                      >
                        Subscribe Now
                        {/* <Link href="/my-plans" className="text-white">
                          Subscribe Now
                        </Link> */}
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
