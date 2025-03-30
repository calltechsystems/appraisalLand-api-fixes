import { useRouter } from "next/router";
import CopyrightFooter from "../common/footer/CopyrightFooter";
import Footer from "../common/footer/Footer";
import Header from "../common/header/DefaultHeader_01";
import MobileMenu from "../common/header/MobileMenu";
// import PopupSignInUp from "../common/PopupSignInUp";
import Link from "next/link";
import BreadCrumbBanner from "./BreadCrumbBanner";
import Image from "next/image";
import Form from "./Form";
import { useEffect, useState } from "react";
import CommonLoader from "../common/CommonLoader/page";

const Index = () => {
  const router = useRouter();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const [lastActivityTimestamp, setLastActivityTimestamp] = useState(
    Date.now()
  );

  const closeModal = () => {
    setModalIsOpen(false);
    // router.push("/");
  };

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
  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header />
      {isLoading && <CommonLoader />}

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      {/* <!-- Modal --> */}
      {/* <PopupSignInUp /> */}

      {/* <!-- Inner Page Breadcrumb --> */}
      {/* <BreadCrumbBanner /> */}

      {/* <!-- Our LogIn Register --> */}
      <section className="our-log bgc-fa pt50">
        <div className="container">
          <div className="row  ">
            <div className="col-sm-12 col-lg-12 offset-lg-0">
              <div
                className="login_form  inner_page"
                style={{
                  // boxShadow: "10px 10px 50px 10px rgba(19, 19, 28, 0.52)",
                  marginTop: "5px",
                }}
              >
                <Form
                  setModalIsOpen={setModalIsOpen}
                  setisLoading={setisLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Our Footer --> */}
      <section className="footer_one">
        <div className="container">
          <div className="row">
            <Footer />
          </div>
        </div>
      </section>

      {/* <!-- Our Footer Bottom Area --> */}
      <section className="footer_middle_area pt40 pb40">
        <div className="container">
          <CopyrightFooter />
        </div>
      </section>

      {modalIsOpen && (
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
                  <h3 className=" text-color mt-1">Success</h3>
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
              Your OTP has been successfully sent to your registered email.
              Please check your inbox to complete the verification.
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
                className="btn btn-color w-25"
                onClick={() => closeModal()}
                style={{}}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
