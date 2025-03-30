import { useRouter } from "next/router";
import CopyrightFooter from "../common/footer/CopyrightFooter";
import Footer from "../common/footer/Footer";
import Header from "../common/header/DefaultHeader_01";
import MobileMenu from "../common/header/MobileMenu";
import PopupSignInUp from "../common/PopupSignInUp";
import BreadCrumbBanner from "./BreadCrumbBanner";
import Form from "./Form";
import { useState } from "react";

const Index = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenError, setModalIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const closeModal = () => {
    setModalIsOpen(false);
    router.push("/login");
  };

  const closeErrorModal = () => {
    setModalIsOpenError(false);
    location.reload(true);
  };

  return (
    <>
      {/* <!-- Main Header Nav --> */}
     {/* <Header />*/ }

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
            style={{ borderColor: "green", width: "20%" }}
          >
            <h3 className="text-center" style={{ color: "green" }}>
              Success
            </h3>
            <div style={{ borderWidth: "2px", borderColor: "green" }}>
              <br />
            </div>
            <h5 className="text-center">You are Successfully registered !!</h5>
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
