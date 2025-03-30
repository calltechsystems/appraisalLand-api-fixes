import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import Image from "next/image";
import ReviseCheckout from "./UpgradeCheckoutPage";

const ReviseSubscriptionModal = ({
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
      "The action window may have been closed unexpectedly, either due to upgradation or an abrupt closure. Please try again to complete your payment."
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

  console.log({ onSuccess });
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
                  <div className="col-lg-1"></div>
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
                    Your subscription has been upgraded successfully . Thank you
                    for your time and it would reflect from your next cycle.
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
                      <span className="text-success fw-bold">Upgrade</span> ?
                    </span>
                    <br />
                    <span className="text-dark">
                      You have selected the {""}
                      <label
                        style={{
                          fontWeight: "bold",
                          fontSize: "22px",
                          color: "#2e008b",
                        }}
                      >
                        {capitalizeFirstLetter(price.title)}
                      </label>{" "}
                      for{" "}
                      <label
                        style={{
                          fontWeight: "bold",
                          fontSize: "23px",
                          color: "#2e008b",
                        }}
                      >
                        ${price.price}{" "}
                      </label>
                      {" "}per month?
                    </span>
                    <br />
                    <span style={{ fontSize: "15px" }}>
                      Please click checkout to proceed with the Order
                    </span>
                  </div>
                ) : showPaypalPage && status == 1 ? (
                  <>
                    <ReviseCheckout
                      currentSubscription={currentSubscription}
                      price={currentSelectedPlan}
                      setErrorOccurred={setErrorOccurred}
                      setOnSuccess={setOnSuccess}
                      setErrorMessage={setErrorMessage}
                      paymentType={"upgrade_plan"}
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
                    Proceed to Upgradation
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

export default ReviseSubscriptionModal;
