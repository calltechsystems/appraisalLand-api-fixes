import { useRouter } from "next/router";
import CopyrightFooter from "../common/footer/CopyrightFooter";
import Footer from "../common/footer/Footer";
import Header from "../common/header/DefaultHeader_01";
import MobileMenu from "../common/header/MobileMenu";
import PopupSignInUp from "../common/PopupSignInUp";
import BreadCrumbBanner from "./BreadCrumbBanner";
import Form from "./Form";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ErrorModal from "../common/popUpModal/errorModal/index";
import CommonLoader from "../common/CommonLoader/page";

const Index = ({ user }) => {
  const [show, setShow] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [change, setChange] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const closeModal = () => {
    setModalIsOpen(false);
    // setOpenViewModal(false);
    router.push("/");
  };

  const closeErrorModal = () => {
    setModalIsOpenError(false);
    // const prevState = change;
    // captchaRef.current.value = "";
    // setStyle({
    //   borderColor: "black",
    //   borderWidth: "1px",
    // });
    // setChange(!prevState);
    // };
    // location.reload(true);
  };

  useEffect(() => {
    const initialRoute = router.asPath;

    const handleRouteChange = (url) => {
      if (url === initialRoute) {
        location.reload(true);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

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
      <section className="our-log bgc-fa pt60">
        <div className="container">
          <div className="row  ">
            <div className="col-sm-12 col-lg-12 offset-lg-0">
              <div
                className="login_form  inner_page"
                style={{ padding: "10px" }}
              >
                <Form
                  user={user}
                  setModalIsOpen={setModalIsOpen}
                  setModalIsOpenError={setModalIsOpenError}
                  setErrorMessage={setErrorMessage}
                  setLoading={setLoading}
                  // setOpenViewModal={setOpenViewModal}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {modalIsOpen && (
        <div className="modal">
          <div
            className="modal-content"
            style={{ border: "2px solid #97d700", width: "20%" }}
          >
            <h3 className="text-center" style={{ color: "green" }}>
              Success
            </h3>
            <div style={{ borderWidth: "2px", borderColor: "green" }}>
              <br />
            </div>
            <h5 className="text-center">Successfully logged in</h5>
            <div
              className="text-center"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <button
                className="btn w-35 btn-white"
                onClick={() => closeModal()}
                style={{ borderColor: "green", color: "green" }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {modalIsOpenError && (
        <div className="modal">
          <div
            className="modal-content"
            style={{ border: "2px solid #97d700", width: "26%" }}
          >
            <div className="col-lg-12">
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
              {errorMessage}
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
                onClick={() => closeErrorModal()}
                style={{}}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}



      {/* <!-- Our Footer --> */}
      <section className="footer_one p20">
        <div className="container">
          <div className="row">
            <Footer />
          </div>
        </div>
      </section>

      {/* <!-- Our Footer Bottom Area --> */}
      <div className="footer_middle_area">
        <div className="container">
          <CopyrightFooter />
        </div>
      </div>
    </>
  );
};

export default Index;
