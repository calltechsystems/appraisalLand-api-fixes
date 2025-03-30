// Modal.js (a React component)

import React, { useRef } from "react";
import toast from "react-hot-toast";
import { encryptionData } from "../../../utils/dataEncryption";
import axios from "axios";

const Modal = ({ modalOpen, closeModal , lowRangeBid , propertyId}) => {

  const valueRef = useRef(0);
  const descriptionRef = useRef("");

  const onSubmitHnadler = ()=>{
    const bidAmount = valueRef.current.value;
    const description = descriptionRef.current.value;

    const user = JSON.parse(localStorage.getItem("user"));

    console.log(bidAmount,description,propertyId , user.userId);

    if(bidAmount < 1 || bidAmount < lowRangeBid ){
      toast.error("Amount should be in a range");
    }
    else{
      const formData = {
        propertyId : propertyId,
        userId : user.userId,
        bidAmount : bidAmount,
        description : description,
        token : user.token
      };

      const payload = encryptionData(formData);

      toast.loading("Setting a bid");
      axios.post("/api/setBid",payload)
      .then((res)=>{
        toast.dismiss();
        toast.success("Successfully set the bid ");
        closeModal();
      }).catch((err)=>{
        toast.dismiss();
        toast.error("Try Again");
      });
    }
  }
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
                  Participate in Bid
                </span>
              </h2>
              <p className="text-center">
                {" "}
                Please place a bid to fill your amount
              </p>
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
                          Bid Amount  (Lower Range)<span class="req-btn">*</span> :
                        </label>
                      </div>
                      <div className="col-lg-7">
                        <input
                          type="text"
                          value={lowRangeBid}
                          className="form-control"
                          id="formGroupExampleInput3"
                        />
                      </div>
                    </div>
                    <div className="row mb-2 mt-2">
                      <div className="col-lg-3 mb-2">
                        <label
                          htmlFor=""
                          style={{ paddingTop: "15px", fontWeight: "lighter" }}
                        >
                          Your Amount <span class="req-btn">*</span> :
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
            <div className="button-container">
              {/* <button className="cancel-button" onClick={closeModal}>
                  Cancel
                </button> */}
              <button className="btn btn-log w-35 btn-thm" onClick={onSubmitHnadler}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
