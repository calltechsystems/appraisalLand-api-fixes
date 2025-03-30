import React, { useEffect, useState } from "react";
import Header from "../../components/common/header/dashboard/HeaderAppraiserCompany";
import MobileMenu from "../../components/common/header/MobileMenu";
import Pricing from "./pricing";
import SidebarMenu from "../../components/common/header/dashboard/SidebarMenu_002";
import axios from "axios";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Index = ({
  setModalOpen,
  currentSubscription,
  setPrice,
  modalOpen,
  setcurrentSubscription,
  setCanUpgrade,
  canUpgrade,
  userDetailField,
  setIsSubscriptionDetailsEmpty,
}) => {
  const [selectedPlan, setSelectedPlan] = useState("Monthly");
  const [planData, setPlanData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [TopUpData, setTopUpData] = useState([]);
  const [IsAgainLoginPopUp, setIsAgainLoginPopUp] = useState(false);

  const router = useRouter();
  // const [userData_01, setUserData_01] = useState({});
  let userData = {};
  useEffect(() => {
    userData = JSON.parse(localStorage.getItem("user"));
    // setUserData_01(userData);
  });

  useEffect(() => {
    const isPaying = JSON.parse(localStorage.getItem("isPaying"));
    if (isPaying) {
      localStorage.removeItem("isPaying");
      setIsAgainLoginPopUp(true);
    }
    const fetchData = async () => {
      const data = JSON.parse(localStorage.getItem("user"));
      if (!data) {
        router.push("/login");
      } else {
        try {
          const res = await axios.get("/api/getAllPlans", {
            headers: {
              Authorization: `Bearer ${data?.token}`,
              "Content-Type": "application/json",
            },
          });
          const res2 = await axios.get("/api/getAllTopUpPlans", {
            headers: {
              Authorization: `Bearer ${data?.token}`,
              "Content-Type": "application/json",
            },
          });

          const res3 = await axios.get("/api/getSpecificSubscriptionByUser", {
            headers: {
              Authorization: `Bearer ${data?.token}`,
              "Content-Type": "application/json",
            },
            params: {
              userId: data?.userId,
            },
          });

          //TO VERIFY ALL EXISTING USERS
          if (!res3?.data?.data?.messageCD) {
            const value = res3?.data?.data?.upgradeEligible == 1;
            setCanUpgrade(value);
            //if subscription Details are coming properly
            if (res3?.data?.data?.subcription_Dtails) {
              setcurrentSubscription({
                ...res3?.data?.data?.subcription_Dtails,
                upgradeEligible: res3?.data?.data?.upgradeEligible,
                activePaypalSubscriptionId:
                  res3?.data?.data?.activePaypalSubscriptionId,
                futurePaypalSubscriptionId:
                  res3?.data?.data?.futurePaypalSubscriptionId,
                payPalSubscriptionStatus:
                  res3?.data?.data?.payPalSubscriptionStatus,
              });
            }
            //when the subscirption_Details is == 'NULL'
            else {
              setIsSubscriptionDetailsEmpty(true);
            }
          }

          // const currentSubscriptionPlan = currentSubscription || {};

          let userInfo = JSON.parse(localStorage.getItem("user"));
          // let newInfo = {
          //   ...userInfo,
          //   plans: currentSubscriptionPlan ? {
          //     $id: userInfo?.plans?.$id,
          //     $values: currentSubscriptionPlan,
          //   } : userInfo?.plans?.$values,
          // };
          // localStorage.setItem("user", JSON.stringify(newInfo));

          const tempPlans = res.data.data.$values;
          let requiredPlans = [];
          tempPlans.map((plan, index) => {
            if (String(plan?.userType) === String(userInfo?.userType)) {
              requiredPlans.push(plan);
            }
          });

          const allTopUp = res2.data.data.$values;
          let getUserTopUpData = [];
          allTopUp?.map((top, index) => {
            if (String(top.userType) === String(userInfo.userType)) {
              getUserTopUpData.push(top);
            }
          });
          setTopUpData(getUserTopUpData);
          setPlanData(requiredPlans);
        } catch (err) {
          toast.error(err.message);
        }
      }
    };

    fetchData();
  }, []);

  const closeLoginPopup = () => {
    setIsAgainLoginPopUp(false);
    localStorage.removeItem("user");
    router.push("/login");
  };

  const sortFunction = (data) => {};
  const togglePlan = () => {
    setSelectedPlan(selectedPlan === "Monthly" ? "Yearly" : "Monthly");
  };

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <Header />

      <MobileMenu />

      <div className="dashboard_sidebar_menu">
        <div
          className="offcanvas offcanvas-dashboard offcanvas-start"
          tabIndex="-1"
          id="DashboardOffcanvasMenu"
          data-bs-scroll="true"
        >
          <SidebarMenu modalOpen={modalOpen} />
        </div>
      </div>

      <section className="our-dashbord dashbord bgc-f7 pb50" style={{}}>
        <div className="container-fluid ovh">
          <div className="col-lg-12 col-xl-12 text-center mt-1 mb-5">
            <div className="style2 mb30-991">
              <h3 className="heading-forms">
                Add / Upgrade / Cancel Subscriptions
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 col-lg-6 maxw100flex-992"></div>
          </div>
          <div className="row">
            {planData.length === 0 ? (
              <LoadingSpinner />
            ) : (
              <Pricing
                isPlan={selectedPlan === "Monthly" ? 1 : 2}
                setModalOpen={setModalOpen}
                setPrice={setPrice}
                currentSubscription={currentSubscription}
                data={planData}
                setData={setPlanData}
                topupData={TopUpData}
                userData={userData}
                planData={planData}
                canUpgrade={canUpgrade}
                setCanUpgrade={setCanUpgrade}
                setcurrentSubscription={setcurrentSubscription}
                userDetailField={userDetailField}
              />
            )}
          </div>
          {/* End .row */}
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

        {IsAgainLoginPopUp && (
          <div className="modal">
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
            <div
              className="modal-content"
              style={{ borderColor: "#2e008b", width: "20%" }}
            >
              <h4 className="text-center mb-1" style={{ color: "red" }}>
                Transaction Occurred
              </h4>
              <div
                className="mt-2 mb-3"
                style={{ border: "2px solid #97d700" }}
              ></div>
              <span className="text-center mb-2 text-dark fw-bold">
                Due to a failed payment or page reload, you have been redirected
                to the home page. Please click here to log in again.
              </span>
              <div
                className="mt-2 mb-3"
                style={{ border: "2px solid #97d700" }}
              ></div>
              <div
                className="text-center"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <button
                  className="btn btn-color"
                  onClick={() => closeLoginPopup()}
                  style={{}}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}
        {/* End .col */}
      </section>
    </>
  );
};

export default Index;
