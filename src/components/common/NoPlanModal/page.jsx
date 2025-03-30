import Image from "next/image";
import Link from "next/link";

const NoPlanModal = ({ onCloseHandler }) => {
  return (
    <>
        <div className="modal">
          <div className="modal-content">
            <div className="row">
              <div className="col-lg-12">
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
            </div>
            <h2 className="text-center mt-3" style={{ color: "#2e008b" }}>
              Unable to Found Subscription
            </h2>
            <div className="mb-2" style={{ border: "2px solid #97d700" }}></div>
            <p className="fs-5 text-center text-dark mt-4">
              Unable to fetch the Current Plan Details. Please try re-logging.
            </p>

            <div
              className="mb-3 mt-4"
              style={{ border: "2px solid #97d700" }}
            ></div>
            <div className="col-lg-12 text-center">
              <button
                className="btn w-25 btn-color m-1"
                onClick={onCloseHandler}
              >
                Login Again
              </button>
            </div>
          </div>
        </div>
    </>
  );
};

export default NoPlanModal;
