// Modal.js (a React component)

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

const Modal = ({ modalOpen, closeModal, price, selectedPlan }) => {
  const router = useRouter();
  let user = {};
  const loginHandler = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.userType === 1) {
      router.push("/my-plans");
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("user"));
  }, []);
  return (
    <>
      <div>
        {modalOpen && (
          <div className="modal">
            <div className="modal-content">
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
              {/* <span className="close" onClick={closeModal}>
                &times;
              </span> */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3 className="text-center text-dark mt-2">
                  Get subscription to our{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "29px",
                      color: "#2e008b",
                    }}
                  >
                    {price.title} Plan
                  </span>
                </h3>
              </div>
              <div
                className="mb-2"
                style={{ border: "2px solid #97d700" }}
              ></div>
              <div className="text-center">
                <p className="m-3 text-dark" style={{ fontSize: "16px" }}>
                  Please click continue to login
                </p>
                <p className="m-3 text-dark" style={{ fontSize: "16px" }}>
                  Your selected Package{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "25px",
                      color: "#2e008b",
                    }}
                  >
                    {price.title} Plan
                  </span>{" "}
                  with value{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "25px",
                      color: "#2e008b",
                    }}
                  >
                    ${price.price}
                  </span>
                </p>
              </div>
              <div
                className="mb-2"
                style={{ border: "2px solid #97d700" }}
              ></div>
              <div className="col-lg-12 text-center">
                {/* <button className="cancel-button" onClick={closeModal}>
                  Cancel
                </button> */}
                <button className="btn w-25 btn-color m-1" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="btn btn-color w-25 m-1"
                  onClick={loginHandler}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Modal;
