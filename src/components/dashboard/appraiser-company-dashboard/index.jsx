import Header from "../../common/header/dashboard/HeaderAppraiserCompany";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu_002";
import MobileMenu from "../../common/header/MobileMenu_01";
import Filtering from "./Filtering";
import AllStatistics from "./AllStatistics";
import StatisticsPieChart, { tempData } from "./StatisticsPieChart";
import StatisticsChart from "./StatisticsChart";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { Link } from "react-scroll";
import Image from "next/image";

const Index = () => {
  const [userData, setUserData] = useState({});
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [FilteringType, setFilteringType] = useState("Monthly");
  const [allProperties, setAllProperties] = useState([]);
  const [AllPropertiesCard, setAllPropertiesCard] = useState(0);
  const [AllWishlistedCards, setAllWishlistedCards] = useState(0);
  const [AllBiddedCards, setAllBiddedCards] = useState(0);
  const [bids, setBids] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalIsPlanError, setModalIsPlaneError] = useState(false);
  const [message, setMessage] = useState("");

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

  const usedProp = userData?.usedProperties;
  const totalNoOfProperties = userData?.totalNoOfProperties;
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
    router.push("/appraiser-company-add-subscription");
  };

  const closeErrorModal = () => {
    setModalIsOpenError(false);
  };

  // const [lastActivityTimestamp, setLastActivityTimestamp] = useState(
  //   Date.now()
  // );

  // useEffect(() => {
  //   const activityHandler = () => {
  //     setLastActivityTimestamp(Date.now());
  //   };

  //   // Attach event listeners for user activity
  //   window.addEventListener("mousemove", activityHandler);
  //   window.addEventListener("keydown", activityHandler);
  //   window.addEventListener("click", activityHandler);

  //   // Cleanup event listeners when the component is unmounted
  //   return () => {
  //     window.removeEventListener("mousemove", activityHandler);
  //     window.removeEventListener("keydown", activityHandler);
  //     window.removeEventListener("click", activityHandler);
  //   };
  // }, []);

  // useEffect(() => {
  //   // Check for inactivity every minute
  //   const inactivityCheckInterval = setInterval(() => {
  //     const currentTime = Date.now();
  //     const timeSinceLastActivity = currentTime - lastActivityTimestamp;

  //     // Check if there has been no activity in the last 10 minutes (600,000 milliseconds)
  //     if (timeSinceLastActivity > 600000) {
  //       localStorage.removeItem("user");
  //       router.push("/login");
  //     }
  //   }, 60000); // Check every minute

  //   // Cleanup the interval when the component is unmounted
  //   return () => clearInterval(inactivityCheckInterval);
  // }, [lastActivityTimestamp]);

  useEffect(() => {
    // userData = JSON.parse(localStorage.getItem("user"));
    const data = JSON.parse(localStorage.getItem("user"));
    setUserData(data);
    if (!data) {
      router.push("/login");
    } else if (!data?.appraiserCompanyDetail?.firstName) {
      router.push("/appraiser-company-profile");
    }
    if (!data) {
      router.push("/login");
    }

    const func = () => {
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
          const temp = res.data.data.properties.$values;

          setProperties(temp);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err?.response?.data?.error);
        });

      axios
        .get("/api/appraiserWishlistedProperties", {
          headers: {
            Authorization: `Bearer ${data?.token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const tempData = res.data.data.$values;

          // setAllWishlistedProperties(res.data.data.$values);
          const responseData = tempData.filter((prop, index) => {
            if (String(prop.userId) === String(data.userId)) {
              return true;
            } else {
              return false;
            }
          });
          console.log("wishlistddd", responseData);
          const tempId = responseData;
          setWishlist(responseData);
        })
        .catch((err) => {
          toast.error(err?.response);
          setErrorMessage(err?.response);
          setModalIsOpenError(true);
        });

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
          console.log(res.data.data);
          const tempBids = res.data.data.$values;
          let updatedBids = [];
          tempBids.map((bid, index) => {
            if (String(bid.appraiserUserId) === String(data.userId)) {
              updatedBids.push(bid);
            }
          });
          setBids(updatedBids);
        })
        .catch((err) => {
          setErrorMessage(err?.response?.data?.error);
          setModalIsOpenError(true);
        });
    };
    func();
    setRefresh(false);
  }, [refresh]);

  const calculate = (searchDate, diff) => {
    const newDateObj = new Date(searchDate);
    const currentObj = new Date();

    const getMonthsFDiff = currentObj.getMonth() - newDateObj.getMonth();
    const gettingDiff = currentObj.getDate() - newDateObj.getDate();
    const gettingYearDiff = currentObj.getFullYear() - newDateObj.getFullYear();

    const estimatedDiff =
      gettingDiff + getMonthsFDiff * 30 + gettingYearDiff * 365;

    console.log("dayss", diff, newDateObj.getDate(), currentObj.getDate());
    return estimatedDiff <= diff;
  };

  const getWishlishtTime = (orderId) => {
    let time = "";
    wishlist.map((bid, index) => {
      if (String(bid.propertyId) === String(orderId))
        [(time = bid.addedDateTime)];
    });
    return time;
  };

  const setDefaultCardsValues = (bids, wishlists) => {
    setAllBiddedCards(bids);
    setAllWishlistedCards(wishlists);
  };

  const getBiddedTime = (orderId) => {
    let time = "";
    bids.map((bid, index) => {
      if (String(bid.orderId) === String(orderId)) [(time = bid.requestTime)];
    });
    return time;
  };

  const filterData = (tempData) => {
    let tempAllBids = 0,
      tempAllWishlist = 0,
      tempAllProps = 0;
    const currentDate = new Date();
    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    let monthlyData = new Array(12).fill(0);
    let weeklyData = new Array(52).fill(0);
    let yearlyData = new Array(
      currentDate.getFullYear() - oneYearAgo.getFullYear() + 1
    ).fill(0);

    switch (FilteringType) {
      case "Last 7 days":
        const sevenDaysAgo = new Date(currentDate);
        sevenDaysAgo.setDate(currentDate.getDate() - 7);
        tempData.forEach((item) => {
          const bidTime = getBiddedTime(item.orderId);

          const wihlistTime = getWishlishtTime(item.propertyId);

          console.log("bidTime", bidTime, wihlistTime);
          if (bidTime !== "" && calculate(bidTime, 7)) {
            tempAllBids += 1;
            weeklyData[new Date(bidTime).getDay()]++;
          }
          if (wihlistTime !== "" && calculate(wihlistTime, 7)) {
            tempAllWishlist++;
            console.log("wishlists", tempAllWishlist);

            weeklyData[new Date(wihlistTime).getDay()]++;
          }
        });
        setDefaultCardsValues(tempAllBids, tempAllWishlist);

        return {
          data: weeklyData,
          labels: Array.from({ length: 7 }, (_, i) => i + 1),
        }; // Assuming labels are days of the week

      case "Last 30 Days":
        const thirtyDaysAgo = new Date(currentDate);
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        tempData.forEach((item) => {
          const bidTime = getBiddedTime(item?.orderId);

          const wihlistTime = getWishlishtTime(item?.propertyId);

          if (bidTime !== "" && calculate(bidTime, 30)) {
            tempAllBids += 1;
            monthlyData[new Date(bidTime).getMonth()]++;
          }
          if (wihlistTime !== "" && calculate(wihlistTime, 30)) {
            tempAllWishlist++;
            console.log("wishlists", tempAllWishlist);

            monthlyData[new Date(wihlistTime).getMonth()]++;
          }
        });
        setDefaultCardsValues(tempAllBids, tempAllWishlist);

        return {
          data: monthlyData,
          labels: Array.from({ length: 30 }, (_, i) => i + 1),
        }; // Assuming labels are days of the month

      case "Last 3 Month":
        const threeMonthsAgo = new Date(currentDate);
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
        tempData.forEach((item) => {
          const bidTime = getBiddedTime(item?.orderId);

          const wihlistTime = getWishlishtTime(item?.propertyId);

          if (bidTime !== "" && calculate(bidTime, 90)) {
            tempAllBids += 1;
            const monthDifference =
              currentDate.getMonth() - new Date(bidTime).getMonth();
            yearlyData[
              yearlyData.length - 1 - Math.floor(monthDifference / 3)
            ]++;
          }
          if (wihlistTime !== "" && calculate(wihlistTime, 90)) {
            tempAllWishlist++;

            const monthDifference =
              currentDate.getMonth() - new Date(wihlistTime).getMonth();
            yearlyData[
              yearlyData.length - 1 - Math.floor(monthDifference / 3)
            ]++;
          } else if (wihlistTime === null) {
            const monthDifferenceWithNullValue =
              currentDate.getMonth() - new Date().getMonth();
            yearlyData[
              yearlyData.length -
                1 -
                Math.floor(monthDifferenceWithNullValue / 3)
            ]++;
          }
        });
        setDefaultCardsValues(tempAllBids, tempAllWishlist);

        return {
          data: yearlyData,
          labels: Array.from({ length: yearlyData.length }, (_, i) => i + 1),
        }; // Assuming labels are months

      default:
        const threeMonthssAgo = new Date(currentDate);
        threeMonthssAgo.setMonth(currentDate.getMonth() - 3);
        tempData.forEach((item) => {
          const bidTime = getBiddedTime(item?.orderId);

          const wihlistTime = getWishlishtTime(item?.propertyId);

          if (bidTime !== "" && calculate(bidTime, 90)) {
            tempAllBids += 1;
            const monthDifference =
              currentDate.getMonth() - new Date(bidTime).getMonth();
            yearlyData[
              yearlyData.length - 1 - Math.floor(monthDifference / 3)
            ]++;
          }
          if (wihlistTime !== "" && calculate(wihlistTime, 90)) {
            tempAllWishlist++;

            const monthDifference =
              currentDate.getMonth() - new Date(wihlistTime).getMonth();
            yearlyData[
              yearlyData.length - 1 - Math.floor(monthDifference / 3)
            ]++;
          } else if (wihlistTime === null) {
            const monthDifferenceWithNullValue =
              currentDate.getMonth() - new Date().getMonth();
            yearlyData[
              yearlyData.length -
                1 -
                Math.floor(monthDifferenceWithNullValue / 3)
            ]++;
          }
        });
        setDefaultCardsValues(tempAllBids, tempAllWishlist);

        return {
          data: yearlyData,
          labels: Array.from({ length: yearlyData.length }, (_, i) => i + 1),
        }; // Assuming labels are years
    }
  };

  useEffect(() => {
    const categorizeDataByMonth = () => {
      const type = FilteringType ? FilteringType : "Monthly";
      const data = properties;
      if (data.length === 0) {
        return Array(12).fill(0); // Initialize an array with 12 elements, all initialized to 0.
      }

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const currentWeek = getWeekNumber(currentDate);

      const counts = {
        Monthly: Array(12).fill(0),
        Weekly: Array(52).fill(0),
        Yearly: Array(currentYear + 1).fill(0),
      };

      data.forEach((property) => {
        let isPresent = false;
        let time = {};

        wishlist.forEach((prop) => {
          if (String(prop.orderId) === String(property.orderId))
            time = prop.addedDatetime ? prop.addedDatetime : new Date();
          isPresent = true;
        });

        const createdAtDate = new Date(time);
        const propertyMonth = createdAtDate.getMonth();
        const propertyYear = createdAtDate.getFullYear();
        const propertyWeek = getWeekNumber(createdAtDate);

        if (isPresent) {
          if (
            type === "Monthly" &&
            propertyYear === currentYear &&
            propertyMonth <= currentMonth
          ) {
            counts.Monthly[propertyMonth]++;
          } else if (
            type === "Weekly" &&
            propertyYear === currentYear &&
            propertyWeek <= currentWeek
          ) {
            counts.Weekly[propertyWeek - 1]++;
          } else if (type === "Yearly" && propertyYear <= currentYear) {
            counts.Yearly[propertyYear]++;
          }
        }
      });

      data.forEach((property) => {
        let isPresent = false;
        let time = {};

        bids.forEach((bid) => {
          if (String(bid.orderId) === String(property.orderId)) {
            time = bid.requestTime;
            isPresent = true;
          }
        });

        const createdAtDate = new Date(time);
        const propertyMonth = createdAtDate.getMonth();
        const propertyYear = createdAtDate.getFullYear();
        const propertyWeek = getWeekNumber(createdAtDate);

        if (isPresent) {
          if (
            type === "Monthly" &&
            propertyYear === currentYear &&
            propertyMonth <= currentMonth
          ) {
            counts.Monthly[propertyMonth]++;
          } else if (
            type === "Weekly" &&
            propertyYear === currentYear &&
            propertyWeek <= currentWeek
          ) {
            counts.Weekly[propertyWeek - 1]++;
          } else if (type === "Yearly" && propertyYear <= currentYear) {
            counts.Yearly[propertyYear]++;
          } else {
            counts.Monthly[propertyMonth]++;
          }
        }
      });

      console.log("type", counts);
      return type === "Monthly"
        ? counts.Monthly
        : type === "Weekly"
        ? counts.Weekly
        : counts.Yearly;
    };

    const temp = filterData(properties);
    console.log(
      "filterData",
      FilteringType,
      properties,
      temp.data,
      categorizeDataByMonth(properties)
    );
    setChartData(temp.data);
  }, [properties, bids, wishlist, FilteringType]);

  function getWeekNumber(date) {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
  }
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
                      {userData?.appraiserCompanyDetail
                        ? `${userData?.appraiserCompanyDetail?.firstName} ${userData?.appraiserCompanyDetail?.lastName}`
                        : "Name"}
                    </h2>
                  </div>
                  <div>
                    <Filtering
                      setRefresh={setRefresh}
                      setFilteringType={setFilteringType}
                      FilteringType={FilteringType}
                    />
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <AllStatistics
                  properties={properties}
                  views={AllBiddedCards + AllWishlistedCards}
                  bids={bids}
                  wishlist={AllWishlistedCards}
                  plans={planData_01}
                  plansNew={planData_02}
                  usedProp={usedProp}
                  totalNoOfProperties={totalNoOfProperties}
                />
              </div>
              {/* End .row Dashboard top statistics */}

              {/* <div className="row">
                <div className="col-xl-6">
                  <div className="application_statics">
                    <h4 className="mb-4">View Statistics</h4>
                    {chartData.length > 0 ? (
                      <StatisticsChart data={chartData} />
                    ) : (
                      <StatisticsChart data={chartData} />
                    )}
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="application_statics">
                    <h4 className="mb-4">View Statistics</h4>
                    {chartData.length > 0 ? (
                      <StatisticsPieChart data={chartData} />
                    ) : (
                      <StatisticsPieChart data={chartData} />
                    )}
                  </div>
                </div>
              </div> */}

              {modalIsOpenError && (
                <div className="modal">
                  <div
                    className="modal-content"
                    style={{ borderColor: "orangered", width: "20%" }}
                  >
                    <h3 className="text-center" style={{ color: "orangered" }}>
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
                      style={{ display: "flex", flexDirection: "column" }}
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
                        style={{ width: "100px" }}
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* End .row  */}

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
