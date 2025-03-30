// Modal.js (a React component)

import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { encryptionData } from "../../../utils/dataEncryption";
import axios from "axios";
import { useRouter } from "next/router";
import { flip } from "@popperjs/core";
import Link from "next/link";
import Image from "next/image";

import { CldUploadWidget } from "next-cloudinary";
const Modal = ({
  modalOpen,
  setModalOpen,
  closeModal,
  currentBid,
  alreadyBidded,
  setIsQuoteModalOpen,
  setIsModalOpen,
  handleSubmit,
  setCurrentBid,
  setBidAmount,
  bidAmount,
  propertyId,
  closeQuoteModal,
  openQuoteModal,
}) => {
  const router = useRouter();
  const [value, setValue] = useState(null);
  const [description, setDescription] = useState("");
  const [toggle, setToggle] = useState(false);
  const [disable, setDisable] = useState(false);
  const [selectedImage, setSelectedImage] = useState({});

  const handleUpload = (result) => {
    // Handle the image upload result here
    console.log("handleUpload called", result.info);
    setSelectedImage({
      url: result.info.secure_url,
      name: result.info.original_filename + "." + result.info.format,
    });
    // if (result.info.secure_url) {
    //   setSelectedImage(result.info.secure_url);
    //   setProfilePhoto(result.info.secure_url);
    //   // You can also save the URL to your state or do other operations here
    // } else {
    //   // Handle the case when the upload failed
    //   console.error("Image upload failed");
    // }
  };

  const onCancelHandler = () => {
    setToggle(false);
    setValue(0);
    setDescription("");
    closeModal();
  };

  const handleToggle = () => {
    setToggle(true);
  };

  const onCloseModalHandler = () => {
    setValue("");
    setSelectedImage({});
    setDescription("");
    setToggle(false);
    setCurrentBid({});
    setBidAmount(0);
    setModalOpen(false);
  };

  const onSubmitHnadler = () => {
    setDisable(true);
    const bidAmount = value;
    const desp = description;

    if (bidAmount <= 0 || bidAmount === "") {
      toast.error("Quoted amount should be filled !");
      setDisable(false);
      return;
    } else {
      const user = JSON.parse(localStorage.getItem("user"));

      const formData = {
        orderId: propertyId,
        userId: user.userId,
        bidAmount: bidAmount,
        description: desp ? desp : "NA",
        token: user.token,
        lenderListUrl: selectedImage.url,
      };

      const payload = encryptionData(formData);

      toast.loading(
        alreadyBidded ? "Updating the quote..." : "Setting the quote..."
      );
      axios
        .post("/api/setBid", payload)
        .then((res) => {
          toast.dismiss();
          toast.success(
            alreadyBidded
              ? "Successfully updated the quote!"
              : "Successfully set the quote"
          );
          location.reload(true);
        })
        .catch((err) => {
          toast.dismiss();
          toast.error(
            `Got error while ${
              alreadyBidded ? "Updating the" : "Setting the"
            } quote, Try Again!!`,
            err
          );
        });
      setToggle(false);
    }
    setValue(null);
    setDescription("");
    setDisable(false);
    closeModal();
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const formatLargeNumber = (number) => {
    // Convert the number to a string
    const numberString = number.toString();

    // Determine the length of the integer part
    const integerLength = Math.floor(Math.log10(Math.abs(number))) + 1;

    // Choose the appropriate unit based on the length of the integer part
    let unit = "";

    if (integerLength >= 10) {
      unit = "B"; // Billion
    } else if (integerLength >= 7) {
      unit = "M"; // Million
    } else if (integerLength >= 4) {
      unit = "K"; // Thousand
    }

    // Divide the number by the appropriate factor
    const formattedNumber = (number / Math.pow(10, integerLength - 1)).toFixed(
      2
    );
    console.log(formatLargeNumber + ".." + unit);
    return `${formattedNumber}${unit}`;
  };

  const formatNumberWithCommas = (number) => {
    if (!number) return ""; // Handle empty input
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
  };

  const parseNumberFromCommas = (formattedValue) => {
    return formattedValue.replace(/,/g, ""); // Remove commas
  };

  const handleInputChange = (e) => {
    const rawValue = parseNumberFromCommas(e.target.value); // Remove commas for raw value
    if (!isNaN(rawValue)) {
      setValue(rawValue); // Update state with raw value
    }
  };

  const openConfirmModal = () => {
    if (!value) {
      toast.error("Quoted amount should be filled !");
    }
    if (!alreadyBidded && !selectedImage) {
      toast.error("Please upload the lender list document !");
      return;
    } else {
      setToggle(true);
    }
  };
  return (
    <div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content" style={{ width: "40%" }}>
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
              <h3 className="text-center mt-2">
                {" "}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "25px",
                    color: "#2e008b",
                  }}
                >
                  {!toggle
                    ? `${
                        alreadyBidded
                          ? "Appraisal Quote Updation Form "
                          : "Appraisal Quote Form"
                      }`
                    : `${
                        alreadyBidded
                          ? "Confirmation of Quote Updation Form "
                          : "Confirmation of Quote Form"
                      }`}{" "}
                  – Property Id{" "}
                  <span style={{ color: "#97d700" }}>#{propertyId}</span>
                </span>
              </h3>
            </div>
            <div>
              <div
                className="mt-2 mb-3"
                style={{ border: "2px solid #97d700" }}
              ></div>
            </div>
            <div>
              {!toggle ? (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row mb-2 text-center">
                      <div className="col-lg-12 mb-2">
                        <label
                          htmlFor=""
                          style={{
                            // paddingTop: "15px",
                            // fontWeight: "lighter",
                            fontSize: "19px",
                            color: "black",
                          }}
                        >
                          <span
                            className={
                              alreadyBidded ? "already-bidded" : "provide-quote"
                            }
                          >
                            {alreadyBidded ? (
                              <>
                                Your earlier quote was{" "}
                                <span className="bid-amount">
                                  ${addCommasToNumber(bidAmount)}
                                </span>
                              </>
                            ) : (
                              "Please provide a quote for this property"
                            )}
                          </span>
                        </label>
                        {/* <span style={{ color: 'red' }}>{bidAmount}</span> */}
                      </div>
                      <div className="row mb-2 mt-2">
                        <div className="col-lg-4 mb-2">
                          <label
                            htmlFor=""
                            style={{
                              paddingTop: "15px",
                              fontWeight: "bold",
                              fontSize: "19px",
                              color: "#2e008b",
                            }}
                          >
                            {`${
                              alreadyBidded
                                ? "Appraisal Updated Quote "
                                : "Appraisal Quote"
                            }`}{" "}
                            <span class="req-btn">*</span> :
                          </label>
                        </div>

                        <div className="col-lg-7">
                          <input
                            type="text"
                            value={formatNumberWithCommas(value)}
                            onChange={handleInputChange}
                            // onChange={(e) => setValue(e.target.value)}
                            className="form-control"
                            id="formGroupExampleInput3"
                            maxLength={30}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-4 mb-2">
                          <label
                            htmlFor=""
                            style={{
                              paddingTop: "15px",
                              fontWeight: "bold",
                              fontSize: "19px",
                              color: "#2e008b",
                            }}
                          >
                            Remark :
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
                <>
                  <p
                    className="m-3 text-center text-dark"
                    style={{ fontSize: "19px" }}
                  >
                    Are you confirming that you will quote this property for the
                    given amount : <br />
                    <h2 className="mt-2 text-color">
                      {" "}
                      ${addCommasToNumber(value)}
                    </h2>
                  </p>
                  {alreadyBidded && (
                    <p
                      className="m-3 text-center text-dark"
                      style={{ fontSize: "18px" }}
                    >
                      {" "}
                      from{" "}
                      <span
                        className="m-2"
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          fontSize: "22px",
                        }}
                      >
                        ${addCommasToNumber(bidAmount)}
                      </span>
                    </p>
                  )}
                </>
              )}
            </div>
            <div
              className="mt-2 mb-3"
              style={{ border: "2px solid #97d700" }}
            ></div>
            <div
              className="col-lg-12 text-center"
              style={{ marginRight: "4%" }}
            >
              {/* <button className="cancel-button" onClick={closeModal}>
                  Cancel
                </button> */}
              <button
                disabled={disable}
                className="btn btn-color w-25"
                onClick={onCloseModalHandler}
              >
                Cancel
              </button>
              <button
                disabled={disable}
                className="btn btn-color w-25 m-1"
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
