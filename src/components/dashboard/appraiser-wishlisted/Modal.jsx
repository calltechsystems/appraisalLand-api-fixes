// Modal.js (a React component)

import React, { useRef } from "react";
import toast from "react-hot-toast";
import { encryptionData } from "../../../utils/dataEncryption";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";

const Modal = ({ modalOpen, closeModal, lowRangeBid, propertyId }) => {
  const valueRef = useRef(0);
  const descriptionRef = useRef("");
  const router = useRouter();

  const onCancelHandler = () => {
    closeModal();
  };

  const onSubmitHnadler = () => {
    const bidAmount = valueRef.current.value;
    const description = descriptionRef.current.value;

    const user = JSON.parse(localStorage.getItem("user"));

    const formData = {
      propertyId: propertyId,
      userId: user.userId,
      bidAmount: bidAmount,
      description: description,
      token: user.token,
    };

    const payload = encryptionData(formData);

    toast.loading("Setting a bid");
    axios
      .post("/api/setBid", payload)
      .then((res) => {
        toast.dismiss();
        toast.success("Successfully set the bid ");
        closeModal();
        router.push("/biding-history");
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Try Again");
      });
  };
  return (
    <div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
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
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2 className="text-center">
                {" "}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "29px",
                    color: "#2e008b",
                  }}
                >
                  Appraisal Quote Form
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
            <div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row mb-2 mt-2 text-center">
                    <div className="row mb-2 mt-2">
                      <div className="col-lg-3 mb-2">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "15px", fontWeight: "lighter" }}
                        >
                          Appraisal Quote <span class="req-btn">*</span> :
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="number"
                          ref={valueRef}
                          className="form-control"
                          id="formGroupExampleInput3"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-3 mb-2">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "15px", fontWeight: "lighter" }}
                        >
                          Description
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          ref={descriptionRef}
                          className="form-control"
                          id="formGroupExampleInput3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* End .col */}
                </div>
              </div>
            </div>
            <div className="button-container" style={{ marginRight: "4%" }}>
              {/* <button className="cancel-button" onClick={closeModal}>
                  Cancel
                </button> */}
              <button className="btn btn-log w-35 mr-20" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-log w-35 btn-thm"
                onClick={onSubmitHnadler}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
