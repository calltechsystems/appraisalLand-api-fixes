import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import Image from "next/image";
import CancelCheckout from "./CancelCheckoutPage";

const CancelSubscriptionModal = ({
  currentSubscription,
  modalOpen,
  closeModal,
  price,
  userDetailField,
}) => {
  const [paypalUrl, setPaypalUrl] = useState("");
  const [status, setStatus] = useState(0);
  const [countdown, setCountdown] = useState(180);
  const [currentSelectedPlan, setCurrentSelectedPlan] = useState({});
  const [showPaypalPage, setShowPaypalPage] = useState(false);

  const [errorOcurred, setErrorOccurred] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [onSuccess, setOnSuccess] = useState(false);
  const [termsPolicyAccepted, setTermsPolicyAccepted] = useState(0);

  //set the default Error message
  useEffect(() => {
    setErrorMessage(
      "The action window may have been closed unexpectedly, either due to cancellation or an abrupt closure. Please try again to complete your payment."
    );
  }, []);

  useEffect(() => {
    let countdownInterval;

    if (status === 1 && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(countdownInterval);
      closePaypalPage();
      location.reload(true);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [status, countdown]);

  useEffect(() => {
    if (onSuccess || errorOcurred) {
      setStatus(0);
    }
  }, [onSuccess, errorOcurred]);

  const capitalizeFirstLetter = (word) => {
    if (!word || typeof word !== "string") {
      return "";
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  const openPaypalPage = () => {
    setCurrentSelectedPlan(price);
    setStatus(1);
    setShowPaypalPage(true);
  };

  const closePaypalPage = () => {
    setShowPaypalPage(false);
    setCurrentSelectedPlan({});
    setStatus(0);
    closeModal();
  };

  const resetFields = () => {
    setErrorOccurred(false);
    setStatus(0);
    setShowPaypalPage(false);
    setCurrentSelectedPlan({});
    setTermsPolicyAccepted(false);
    closeModal();
    window.location.reload();
  };

  return (
    <div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content" style={{ width: "35%" }}>
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-11">
                    <Link href="/" className="">
                      <Image
                        width={50}
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
                  <div className="col-lg-1">
                    {/* <img
                      src="data:image/jpeg;base64,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"
                      width={60}
                      height={30}
                    /> */}
                  </div>
                </div>
              </div>
            </div>

            <>
              <div
                className="mt-2 mb-3"
                style={{ border: "2px solid #97d700" }}
              ></div>

              {onSuccess ? (
                <div className="text-center" style={{ fontSize: "19px" }}>
                  <span className="text-dark">
                    Your subscription has been cancelled successfully . Thank
                    you for your time.
                  </span>
                </div>
              ) : (
                ""
              )}

              {!errorOcurred ? (
                !showPaypalPage ? (
                  <div className="text-center" style={{ fontSize: "19px" }}>
                    <span className="text-dark">
                      Are you sure you want to{" "}
                      <span className="text-danger fw-bold">cancel</span> ?
                    </span>
                    <br />
                    <span className="text-dark">
                      Your selected plan{" "}
                      <label
                        style={{
                          fontWeight: "bold",
                          fontSize: "22px",
                          color: "#2e008b",
                        }}
                      >
                        {capitalizeFirstLetter(currentSubscription.planName)}
                      </label>{" "}
                      with value{" "}
                      <label
                        style={{
                          fontWeight: "bold",
                          fontSize: "23px",
                          color: "#2e008b",
                        }}
                      >
                        ${currentSubscription.planAmount}{" "}
                      </label>{" "}
                      per month ?
                    </span>
                    <br />
                    <span style={{ fontSize: "15px" }}>
                      Please click checkout to proceed with the Order
                    </span>
                  </div>
                ) : showPaypalPage && status == 1 ? (
                  <>
                    <CancelCheckout
                      currentSubscription={currentSubscription}
                      planDetails={currentSelectedPlan}
                      setErrorOccurred={setErrorOccurred}
                      setOnSuccess={setOnSuccess}
                      setErrorMessage={setErrorMessage}
                      paymentType={"cancel_subscription"}
                      userDetailField={userDetailField}
                    />
                  </>
                ) : (
                  ""
                )
              ) : (
                <div className="text-center" style={{ fontSize: "19px" }}>
                  <span className="text-dark">{errorMessage}</span>
                </div>
              )}

              <div
                className="mt-2 mb-3"
                style={{ border: "2px solid #97d700" }}
              ></div>
              {status == 0 && !showPaypalPage ? (
                <div className="ml-6 custom-checkbox mb-3 text-center">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    checked={termsPolicyAccepted}
                    onClick={() => setTermsPolicyAccepted(!termsPolicyAccepted)}
                    id="terms"
                    style={{ border: "1px solid black" }}
                  />
                  <label
                    className="form-check-label form-check-label"
                    htmlFor="terms"
                    style={{ marginLeft: "10px" }}
                  >
                    {" "}
                    I have read and accept the{" "}
                    <Link
                      href="assets/images/Terms & Conditions.pdf"
                      target="_blank"
                      className="form-check-label text-primary"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    ?
                  </label>
                </div>
              ) : (
                ""
              )}
            </>

            {status == 1 && showPaypalPage ? (
              <div className="text-center">
                <button
                  className="btn btn-color w-25 text-center"
                  onClick={() => window.location.reload()}
                >
                  Cancel
                </button>
              </div>
            ) : // <label
            //   className="btn btn-color w-25"
            //   style={{
            //     display: "flex",
            //     alignItems: "center",
            //     justifyContent: "center",
            //     marginLeft: "36%",
            //   }}
            // >
            //   <ClipLoader color="#ffffff" loading={true} size={40} />
            //   <span style={{ marginLeft: "10px" }}>Processing...</span>
            // </label>
            status == 0 && !showPaypalPage ? (
              <>
                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-color w-25" onClick={resetFields}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-color"
                    onClick={openPaypalPage}
                    // style={{ marginLeft: "20px" }}
                    disabled={!termsPolicyAccepted}
                  >
                    Proceed to Cancellation
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <button className="btn btn-color w-25" onClick={resetFields}>
                  Close
                </button>
              </div>
            )}

            {status === 1 && !errorOcurred && (
              <div className="text-center mt-3">
                <h4>
                  Remaining Time: {Math.floor(countdown / 60)}:{countdown % 60}{" "}
                  mins{" "}
                </h4>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelSubscriptionModal;
