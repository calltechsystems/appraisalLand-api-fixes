// Modal.js (a React component)

import React from "react";
import Link from "next/link";
import Image from "next/image";


const LoginModal = ({ modalOpen, closeModal, price }) => {
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
                <h2 className="text-center">
                  Get to our{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "29px",
                      color: "#2e008b",
                    }}
                  >
                    {price.title} Plan
                  </span>
                </h2>
              </div>
              <div
                style={{
                  border: "1px",
                  borderStyle: "solid",
                  borderColor: "gray",
                }}
              ></div>
              <div style={{ marginLeft: "14%" }}>
                <p className="m-3" style={{ fontSize: "17px" }}>
                  Please checkout for payment option
                </p>
                <p className="m-3" style={{ fontSize: "17px" }}>
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
              <div className="button-container">
                <button className="btn btn-color w-25" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-log w-35 btn-thm">Checkout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LoginModal;
