import { useRouter } from "next/router";
import CopyrightFooter from "../common/footer/CopyrightFooter";
import Footer from "../common/footer/Footer";
import Header from "../common/header/DefaultHeader_01";
import MobileMenu from "../common/header/MobileMenu";
import PopupSignInUp from "../common/PopupSignInUp";
import BreadCrumbBanner from "./BreadCrumbBanner";
import Form from "./Form";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CommonLoader from "../common/CommonLoader/page";

const Index = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const closeModal = () => {
    setModalIsOpen(false);
    window.location.reload();
  };

  const closeErrorModal = () => {
    setModalIsOpenError(false);
    window.location.reload();
  };

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      {/* <Header />*/}
      {isLoading && <CommonLoader />}

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      {/* <!-- Modal --> */}
      {/* <PopupSignInUp /> */}

      {/* <!-- Inner Page Breadcrumb --> */}
      {/* <BreadCrumbBanner /> */}

      {/* <!-- Our LogIn Register --> */}
      <section className="our-log bgc-fa pt100">
        <div className="container">
          <div className="row  ">
            <div className="col-sm-12 col-lg-12 offset-lg-0">
              <div className="login_form  inner_page">
                <Form
                  setModalIsOpen={setModalIsOpen}
                  setModalIsOpenError={setModalIsOpenError}
                  setErrorMessage={setErrorMessage}
                  setIsLoading={setIsLoading}
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
            style={{ border: "2px solid #97d700", width: "40%" }}
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
              The broker has been successfully added to Appraisal Land. Please
              verify the account within 72 hours by clicking the registration
              link sent to the provided email.
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

      {modalIsOpenError && (
        <div className="modal">
          <div
            className="modal-content"
            style={{ borderColor: "orangered", width: "20%" }}
          >
            <h3 className="text-center" style={{ color: "orangered" }}>
              Error
            </h3>
            <div style={{ borderWidth: "2px", borderColor: "orangered" }}>
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
                style={{ borderColor: "orangered", color: "orangered" }}
              >
                Cancel
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
      {/*<div className="footer_middle_area pt40 pb40">
        <div className="container">
          <CopyrightFooter />
        </div>
      </div>*/}
    </>
  );
};

export default Index;
