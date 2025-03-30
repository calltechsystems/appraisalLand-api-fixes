// Modal.js (a React component)

import React from "react";

const Modal = ({ modalOpen, closeModal }) => {
  console.log("jl");
  return (
    <div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
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
                  Update Plan Details
                </span>
              </h2>
              {/* <p className="text-center">
                {" "}
                Please place a bid to fill your amount
              </p> */}
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
                    <div className="row">
                      <div className="col-lg-3 mb-2">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "15px", fontWeight: "lighter" }}
                        >
                          Plan Title <span class="req-btn">*</span> :
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          required
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput3"
                          value="Lite"
                        />
                      </div>
                    </div>
                    <div className="row mb-2 mt-2">
                      <div className="col-lg-3 mb-2">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "15px", fontWeight: "lighter" }}
                        >
                          Plan Amount <span class="req-btn">*</span> :
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          required
                          type="number"
                          className="form-control"
                          id="formGroupExampleInput3"
                          value="11"
                        />
                      </div>
                    </div>
                    <div className="row mb-2 mt-2">
                      <div className="col-lg-3 mb-2">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "15px", fontWeight: "lighter" }}
                        >
                          Properties <span class="req-btn">*</span> :
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          required
                          type="number"
                          className="form-control"
                          id="formGroupExampleInput3"
                          value="5"
                        />
                      </div>
                    </div>
                    <div className="row mb-2 mt-2">
                      <div className="col-lg-3 mb-2">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "15px", fontWeight: "lighter" }}
                        >
                          Validity(Days) <span class="req-btn">*</span> :
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          required
                          type="number"
                          className="form-control"
                          id="formGroupExampleInput3"
                          value="30"
                        />
                      </div>
                    </div>
                    <div className="row mb-2 mt-2">
                      <div className="col-lg-3 mb-2">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "15px", fontWeight: "lighter" }}
                        >
                          Roll Over <span class="req-btn">*</span> :
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          required
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput3"
                          value="No"
                        />
                      </div>
                    </div>
                    <div className="row mb-2 mt-2">
                      <div className="col-lg-3 mb-2">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "15px", fontWeight: "lighter" }}
                        >
                          Support <span class="req-btn">*</span> :
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          required
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput3"
                          value="Limited"
                          // placeholder="Limited"
                        />
                      </div>
                    </div>
                  </div>

                  {/* End .col */}
                </div>
              </div>
            </div>
            <div className="button-container">
              {/* <button className="cancel-button" onClick={closeModal}>
                  Cancel
                </button> */}
              <button className="btn btn-log w-35 btn-thm">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
