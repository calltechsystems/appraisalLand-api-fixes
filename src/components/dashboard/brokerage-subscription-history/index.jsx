import { useEffect, useState } from "react";
import Header from "../../common/header/dashboard/HeaderBrokerage";
import SidebarMenu from "../../common/header/dashboard/SidebarMenuBrokerage";
import MobileMenu from "../../common/header/MobileMenu";
import Exemple from "./Exemple";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";
import { useModal } from "../../../context/ModalContext";
import Link from "next/link";
import Image from "next/image";

const Index = () => {
  const [data, setData] = useState([]);
  const router = useRouter();
  const { isModalOpen, setIsModalOpen } = useModal();
  let userData = {};

  const [lastActivityTimestamp, setLastActivityTimestamp] = useState(
    Date.now()
  );
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const datas = JSON.parse(localStorage.getItem("user"));
    setUserInfo(datas);
  }, []);

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

  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const closeErrorModal = () => {
    setModalIsOpenError(false);
  };

  const updatePlan = () => {
    router.push("/brokerage-plans");
  };

  useEffect(() => {
    userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      router.push("/login");
    } else if (!userData?.brokerage_Details?.firstName) {
      router.push("/brokerage-profile");
    }

    toast.loading("Getting Transactions...");
    axios
      .get("/api/getBrokerTransactions", {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          userId: userData?.userId,
        },
      })
      .then((res) => {
        toast.dismiss();
        console.log(res.data.data);
        setData(res?.data.data?.transactions?.$values);
        setRerender(false);
      })
      .catch((err) => {
        toast.dismiss();
      });
  }, []);

  return (
    <>
      <Header userData={userInfo} />

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
          style={{ marginLeft: "-10px", marginTop: "" }}
        >
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

              <div className="row align-items-center">
                <div className="col-lg-12 col-xl-12 text-center mt-1">
                  <div className="style2 mb30-991">
                    <h2 className="heading-forms">Transaction History</h2>
                  </div>
                </div>

                {/* End .col */}
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-lg-12">
                  <div className="">
                    <div className="col-lg-12">
                      <div className="property_table">
                        <div className="mt0">
                          <Exemple data={data} userData={userData} />
                          {modalIsOpenError && (
                            <div className="modal">
                              <div
                                className="modal-content"
                                style={{
                                  borderColor: "orangered",
                                  width: "20%",
                                }}
                              >
                                <h3
                                  className="text-center"
                                  style={{ color: "orangered" }}
                                >
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
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
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
                        </div>
                      </div>
                      {/* End .packages_table */}

                      <div className="col-lg-12 text-center pck_chng_btn mb100">
                        <button className="btn btn-color" onClick={updatePlan}>
                          Upgrade Subscription
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End .row */}

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
