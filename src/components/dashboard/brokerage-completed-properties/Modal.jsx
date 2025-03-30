// Modal.js (a React component)

import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { encryptionData } from "../../../utils/dataEncryption";
import axios from "axios";
import { useRouter } from "next/router";

const Modal = ({
  modalOpen,
  closeModal,
  lowRangeBid,
  setIsModalOpen,
  handleSubmit,
  propertyId,
  closeQuoteModal,
  openQuoteModal,
}) => {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState("");

  const [toggle, setToggle] = useState(false);

  const onCancelHandler = () => {
    closeModal();
  };

  const handleToggle = () => {
    setToggle(true);
  };

  const onSubmitHnadler = () => {
    const bidAmount = value;
    const desp = description;

    if (bidAmount <= 0) {
      toast.error("Quoted amount should be filled !");
    } else {
      const user = JSON.parse(localStorage.getItem("user"));

      const formData = {
        propertyId: propertyId,
        userId: user.userId,
        bidAmount: bidAmount,
        description: desp ? desp : "NA",
        token: user.token,
      };

      const payload = encryptionData(formData);
      setIsModalOpen(false);
      toast.loading("Setting a bid");
      axios
        .post("/api/setBid", payload)
        .then((res) => {
          toast.dismiss();
          toast.success("Successfully set the bid ");
          window.location.reload();
        })
        .catch((err) => {
          toast.dismiss();
          toast.error("Try Again");
        });
      setToggle(false);
    }
  };

  const openConfirmModal = () => {
    setToggle(true);
  };
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
                  {!toggle ? "Appraisal Quote Form" : "Confirmation Form"}
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
              {!toggle ? (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row mb-2 mt-2 text-center">
                      <div className="row mb-2 mt-2">
                        <div className="col-lg-3 mb-2">
                          <label
                            htmlFor=""
                            style={{
                              paddingTop: "15px",
                              fontWeight: "lighter",
                            }}
                          >
                            Appraisal Quote <span class="req-btn">*</span> :
                          </label>
                        </div>
                        <div className="col-lg-7">
                          <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="form-control"
                            id="formGroupExampleInput3"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3 mb-2">
                          <label
                            htmlFor=""
                            style={{
                              paddingTop: "15px",
                              fontWeight: "lighter",
                            }}
                          >
                            Description
                          </label>
                        </div>
                        <div className="col-lg-7">
                          <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-control"
                            id="formGroupExampleInput3"
                          />
                        </div>
                      </div>
                    </div>

                    {/* End .col */}
                  </div>
                </div>
              ) : (
                <h4>
                  Are you confirm to quote this property on this provided amount
                  ? : {value}{" "}
                </h4>
              )}
            </div>
            <div className="button-container" style={{ marginRight: "4%" }}>
              {/* <button className="cancel-button" onClick={closeModal}>
                  Cancel
                </button> */}
              <button
                className="btn btn-log w-35 mr-20"
                onClick={closeQuoteModal}
              >
                Cancel
              </button>
              <button
                className="btn btn-log w-35 btn-thm"
                onClick={toggle ? onSubmitHnadler : openConfirmModal}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
