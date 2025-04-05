import { useEffect, useState } from "react";
import Header from "../../common/header/dashboard/Header_02";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu_01";
import MobileMenu from "../../common/header/MobileMenu_01";
import ProfileEditForm from "./ProfileEditForm";
import ProfileViewForm from "./ProfileViewForm";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const Index = ({ profileCount, setProfileCount }) => {
  const [showCard, setShowCard] = useState(false); 
  const [userData, setUserData] = useState({}); 
  const router = useRouter();
  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [modalIsOpenError_01, setModalIsOpenError_01] = useState(false);

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
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    if (!storedUserData) {
      router.push("/login");
    } else {
      setUserData(storedUserData); // Set user data in state
      if (storedUserData?.appraiserDetail?.firstName !== null) {
        setShowCard(true); 
      }
    }
  }, []); 

  const chnageShowCardHandler = (val) => {
    setShowCard(val);
  };

  const closeErrorModal = () => {
    setModalIsOpenError(false);
    setModalIsOpenError_01(false);
  };

  return (
    <>
      <Header
        profileCount={profileCount}
        setProfileCount={setProfileCount}
        userData={userData}
      />
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
          {userData && Object.keys(userData).length > 0 && (
            <>
              <div className="row">
                <div className="col-lg-12 maxw100flex-992">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="my_dashboard_review">
                        <div className="row">
                          <div className="col-xl-12">
                            {showCard ? (
                              <div className="mb-5">
                                <ProfileViewForm
                                  userData={userData}
                                  chnageShowCardHandler={chnageShowCardHandler}
                                />
                              </div>
                            ) : (
                              <ProfileEditForm
                                profileCount={profileCount}
                                setProfileCount={setProfileCount}
                                setShowCard={setShowCard}
                                setModalIsOpenError={setModalIsOpenError}
                                setModalIsOpenError_01={setModalIsOpenError_01}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {modalIsOpenError && (
                      <div className="modal">
                        <div
                          className="modal-content"
                          style={{ borderColor: "#2e008b", width: "40%" }}
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
                          <h2
                            className="text-center"
                            style={{ color: "orangered" }}
                          >
                            Alert
                          </h2>
                          <div
                            className="mb-3 mt-2"
                            style={{ border: "2px solid #97d700" }}
                          ></div>
                          <span className="text-center text-dark fs-4">
                            As SMS Notification is disabled you won&apos;t be
                            notified for listed changes and updates over SMS.
                          </span>
                          <div
                            className="mb-3 mt-2"
                            style={{ border: "2px solid #97d700" }}
                          ></div>
                          <div className="text-center">
                            <button
                              className="btn btn-color w-25"
                              onClick={() => closeErrorModal()}
                            >
                              Ok
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {modalIsOpenError_01 && (
                      <div className="modal">
                        <div
                          className="modal-content"
                          style={{ borderColor: "#2e008b", width: "40%" }}
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
                                  {" "}
                                  Land
                                </span>
                              </Link>
                            </div>
                          </div>
                          <h2
                            className="text-center"
                            style={{ color: "orangered" }}
                          >
                            Alert
                          </h2>
                          <div
                            className="mb-3 mt-2"
                            style={{ border: "2px solid #97d700" }}
                          ></div>
                          <span className="text-center text-dark fs-4">
                            As Email Notification is disabled you won&apos;t be
                            notified for listed changes and updates over Email.
                          </span>
                          <div
                            className="mb-3 mt-2"
                            style={{ border: "2px solid #97d700" }}
                          ></div>
                          <div className="text-center">
                            <button
                              className="btn btn-color w-25"
                              onClick={() => closeErrorModal()}
                            >
                              Ok
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row mt50">
                <div className="col-lg-12">
                  <div className="copyright-widget text-center">
                    <p>
                      &copy; {new Date().getFullYear()} Appraisal Land. All
                      Rights Reserved.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Index;
