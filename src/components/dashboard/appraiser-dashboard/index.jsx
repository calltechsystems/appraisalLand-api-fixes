import Header from "../../common/header/dashboard/Header_02";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu_01";
import MobileMenu from "../../common/header/MobileMenu_01";
import Filtering from "./Filtering";
import AllStatistics from "./StatisticsCard";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { filterData, getWeekNumber, closePlanErrorModal } from "./function";
import { PlanErrorModal } from "./PlanErrorModal";

const Index = () => {
  const [userData, setUserData] = useState({});
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [FilteringType, setFilteringType] = useState("All");
  const [AllWishlistedCards, setAllWishlistedCards] = useState(0);
  const [AllBiddedCards, setAllBiddedCards] = useState(0);
  const [bids, setBids] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [modalIsPlanError, setModalIsPlaneError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));

        if (!userData) {
          throw new Error("User not logged in");
        }
        if (userData?.userType !== 3) {
          console.log("Not applicable for this user type.");
          return;
        }

        const userActivePlans = userData?.userSubscription?.$values;

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
    id: plan.$id,
    planName: plan.planName,
    noOfProperties: plan.noOfProperties,
    price: plan.price,
    status: plan.status,
  }));

  const usedProp = userData?.usedProperties;
  const totalNoOfProperties = userData?.totalNoOfProperties;
  const userPlans = Array.isArray(userData?.userSubscription?.$values)
    ? userData.userSubscription.$values
    : [];
  const planData_02 = userPlans.map((plan) => ({
    id: plan.$id,
    planEndDate: plan.endDate,
  }));

  const [lastActivityTimestamp, setLastActivityTimestamp] = useState(
    Date.now()
  );

  useEffect(() => {
    const activityHandler = () => {
      setLastActivityTimestamp(Date.now());
    };

    window.addEventListener("mousemove", activityHandler);
    window.addEventListener("keydown", activityHandler);
    window.addEventListener("click", activityHandler);

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setWishlist([]);
        setBids([]);
        setProperties([]);

        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUserData(storedUser);

        if (!storedUser) {
          router.push("/login");
          return;
        }

        if (!storedUser?.appraiserDetail?.firstName) {
          router.push("/appraiser-profile");
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

        setProperties(propertyList);

        // Fetch Wishlist
        const wishlistResponse = await axios.get(
          "/api/appraiserWishlistedProperties",
          {
            headers: {
              Authorization: `Bearer ${storedUser?.token}`,
            },
          }
        );

        const {
          success: wishlistSuccess,
          message: wishlistMessage,
          data: wishlistData,
        } = wishlistResponse.data;

        if (!wishlistSuccess) {
          toast.error(wishlistMessage);
          return;
        }

        const tempData = wishlistData.wishlist.$values;

        const responseData = tempData.filter((prop, index) => {
          if (String(prop.userId) === String(storedUser.userId)) {
            return true;
          } else {
            return false;
          }
        });
        setWishlist(responseData);

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
        let allBids = [];

        bidList.forEach((bid) => {
          if (String(bid.appraiserUserId) === String(storedUser.userId)) {
            allBids.push(bid);
          }
        });

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
    const categorizeDataByMonth = () => {
      const type = FilteringType ? FilteringType : "Monthly";
      const data = properties;
      if (data.length === 0) {
        return Array(12).fill(0);
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

      return type === "Monthly"
        ? counts.Monthly
        : type === "Weekly"
        ? counts.Weekly
        : counts.Yearly;
    };
    const temp = filterData(properties);

    setChartData(temp.data);
  }, [properties, bids, wishlist, FilteringType]);

  return (
    <>
      <Header userData={userData} />
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

      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div className="container-fluid ovh">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row mb-5">
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
                      {userData?.appraiserDetail
                        ? `${userData?.appraiserDetail?.firstName} ${userData?.appraiserDetail?.lastName}`
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

              {modalIsPlanError && (
                <PlanErrorModal
                  closePlanErrorModal={closePlanErrorModal}
                  router={router}
                />
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
