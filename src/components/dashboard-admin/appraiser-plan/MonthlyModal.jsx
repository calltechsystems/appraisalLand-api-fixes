// Modal.js (a React component)

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { encryptionData } from "../../../utils/dataEncryption";

const Modal = ({ modalOpen, closeModal, editPlan }) => {
  const [planAmount, setPlanAmount] = useState(0);
  const [planProperties, setPlanProperties] = useState(0);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    setPlanAmount(editPlan?.monthlyAmount);
    setPlanProperties(editPlan?.noOfProperties);
  }, [editPlan]);

  const updateHandler = () => {
    if (
      String(planAmount) === String(editPlan?.monthlyAmount) &&
      String(planProperties) === String(editPlan?.noOfProperties)
    ) {
      closeModal();
      toast.error("No Change found !");
    } else {
      const userData = JSON.parse(localStorage.getItem("user"));

      const payload = {
        planID: editPlan?.id,
        numberOfProperty: planProperties,
        amount: planAmount,
        token: userData.token,
      };

      setDisable(true);
      const encryptedBody = encryptionData(payload);
      axios
        .post("/api/updatePlanDetails", encryptedBody, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
        .then((res) => {
          toast.success("Successfully Updated!!");
          window.location.reload();
        })
        .catch((err) => {
          toast.error("Try Again!!");
        });
      setDisable(false);
    }
  };

  return (
    <div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content" style={{ width: "35%" }}>
            {/* <span className="close" onClick={closeModal}>
              &times;
            </span> */}
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
            <div className="row">
              <div className="col-lg-12">
                <h3 className="text-center">
                  {" "}
                  <span
                    style={{
                      color: "#2e008b",
                    }}
                  >
                    Update Plan Details
                  </span>
                </h3>
              </div>
            </div>
            <div
              className="mb-3 mt-2"
              style={{ border: "2px solid #97d700" }}
            ></div>
            <div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row mb-2 mt-2">
                    <div className="row">
                      <div className="col-lg-4 mb-2 text-end_01">
                        <label
                          htmlFor=""
                          style={{
                            paddingTop: "15px",
                            fontSize: "19px",
                            fontWeight: "bold",
                            color: "#2e008b",
                          }}
                        >
                          Plan Title :
                        </label>
                      </div>
                      <div className="col-lg-6">
                        <input
                          required
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput3"
                          value={editPlan?.planName}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row mb-2 mt-2">
                      <div className="col-lg-4 mb-2 text-end_01">
                        <label
                          htmlFor=""
                          style={{
                            paddingTop: "15px",
                            fontSize: "19px",
                            fontWeight: "bold",
                            color: "#2e008b",
                          }}
                        >
                          Plan Amount :
                        </label>
                      </div>
                      <div className="col-lg-6">
                        <input
                          required
                          type="number"
                          className="form-control"
                          id="formGroupExampleInput3"
                          value={planAmount}
                          onChange={(e) => setPlanAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="row mb-2 mt-2">
                      <div className="col-lg-4 mb-2 text-end_01">
                        <label
                          htmlFor=""
                          style={{
                            paddingTop: "15px",
                            fontSize: "19px",
                            fontWeight: "bold",
                            color: "#2e008b",
                          }}
                        >
                          Properties :
                        </label>
                      </div>
                      <div className="col-lg-6">
                        <input
                          required
                          type="number"
                          className="form-control"
                          id="formGroupExampleInput3"
                          value={planProperties}
                          onChange={(e) => setPlanProperties(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="row mb-2 mt-2">
                      <div className="col-lg-4 mb-2 text-end_01">
                        <label
                          htmlFor=""
                          style={{
                            paddingTop: "15px",
                            fontSize: "19px",
                            fontWeight: "bold",
                            color: "#2e008b",
                          }}
                        >
                          Validity(Days) :
                        </label>
                      </div>
                      <div className="col-lg-6">
                        <input
                          required
                          disabled
                          type="number"
                          className="form-control"
                          id="formGroupExampleInput3"
                          value="30"
                        />
                      </div>
                    </div>
                    {/* <div className="row mb-2 mt-2">
                      <div className="col-lg-4 mb-2 text-end_01">
                        <label
                          htmlFor=""
                          style={{
                            paddingTop: "15px",
                            fontSize: "19px",
                            fontWeight: "bold",
                            color: "#2e008b",
                          }}
                        >
                          Support :
                        </label>
                      </div>
                      <div className="col-lg-6">
                        <input
                          required
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput3"
                          value="Limited"
                          // placeholder="Limited"
                        />
                      </div>
                    </div> */}
                  </div>

                  {/* End .col */}
                </div>
              </div>
              <div
                className="mb-3 mt-2"
                style={{ border: "2px solid #97d700" }}
              ></div>
            </div>
            <div className="row text-center mt-3">
              <div className="col-lg-12">
                <button className="btn btn-color w-25 m-1" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="btn btn-color w-25"
                  disabled={disable}
                  onClick={updateHandler}
                >
                  Submit
                </button>
              </div>
            </div>
            {/* <div className="button-container">
              <button
                className="btn btn-log w-35 btn-thm"
                disabled={disable}
                onClick={updateHandler}
              >
                Submit
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
