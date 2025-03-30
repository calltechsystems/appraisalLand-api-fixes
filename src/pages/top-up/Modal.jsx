import React, { useEffect, useState } from "react";
import axios from "axios";
import { encryptionData } from "../../utils/dataEncryption";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const Modal = ({ modalOpen, closeModal, price }) => {
  const [paypalUrl, setPaypalUrl] = useState("");
  const [status, setStatus] = useState(0);
  const [countdown, setCountdown] = useState(180);

  const checkOutHandler = () => {
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      planId: price.id,
      userId: data.userId,
      token: data.token,
    };

    const encryptiondata = encryptionData(payload);

    axios
      .post("/api/paypalPayement", encryptiondata)
      .then((res) => {
        setPaypalUrl(res.data.data.response);
        setStatus(1);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    let countdownInterval;

    if (status === 2 && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Handle countdown reaching 0, e.g., close modal or perform additional actions
      clearInterval(countdownInterval);
      location.reload(true);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [status, countdown]);

  return (
    <div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            {/* <span className="close" onClick={closeModal}>
              &times;
            </span> */}
            {status === 2 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <img
                  src="https://www.paypalobjects.com/webstatic/mktg/logo/bdg_payments_by_pp_2line.png"
                  alt="Payments by PayPal"
                  style={{ width: "60px", height: "30" }}
                />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <h2>Get Subscription on {price.title} Plan</h2>
              </div>
            )}
            <hr />
            {status === 2 ? (
              <div
                style={{ marginLeft: "10%", fontSize: "15px", marginTop: "2%" }}
              >
                <p>We have already redirected you to the paypal page.</p>
                <p>
                  Don&apos;t <span style={{ color: "red" }}>reload</span> or{" "}
                  <span style={{ color: "red" }}>refresh</span> the page
                </p>
              </div>
            ) : (
              <div
                style={{ marginLeft: "10%", fontSize: "15px", marginTop: "2%" }}
              >
                <p>Please checkout for further</p>
                <p>
                  Your selected Package{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "23px",
                      color: "#2e008b",
                    }}
                  >
                    {price.title}
                  </span>{" "}
                  with value{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "23px",
                      color: "#2e008b",
                    }}
                  >
                    ${price.price}
                  </span>
                  <p style={{ color: "orangered" }}>
                    (Note: Switching between tabs is disabled while this modal is open.)
                  </p>
                </p>
              </div>
            )}
            <hr />
            <div className="col-lg-12 text-center">
              {status !== 2 && (
                <button className="btn btn-color w-25 m-1" onClick={closeModal}>
                  Cancel
                </button>
              )}
              {paypalUrl ? (
                status === 1 ? (
                  <div onClick={() => setStatus(2)}>
                    <a href={paypalUrl} className="btn btn-color w-25">
                      <img
                        src="https://th.bing.com/th/id/OIP.pQDcRxJ3IS71sWCWQ96IUwHaHa?w=171&h=180&c=7&r=0&o=5&pid=1.7"
                        width={40}
                        height={30}
                        alt="PayPal"
                      />
                    </a>
                  </div>
                ) : (
                  <label
                    className="btn btn-color w-25"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: "36%",
                    }}
                  >
                    <ClipLoader color="#ffffff" loading={true} size={40} />
                    <span style={{ marginLeft: "10px" }}>Processing...</span>
                  </label>
                )
              ) : (
                <button
                  className="btn btn-color w-25"
                  onClick={checkOutHandler}
                >
                  Checkout
                </button>
              )}
            </div>
            {status === 2 && (
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

export default Modal;
