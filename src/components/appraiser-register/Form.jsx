import { useRef, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { encryptionData } from "../../utils/dataEncryption";
import Link from "next/link";
import Image from "next/image";

const Form = ({
  setModalIsOpenError,
  setErrorMessage,
  setCloseRegisterModal,
  setIsLoading
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const emailRegisterRef = useRef();
  const [isLoading, setLoading] = useState(false);

  const registerHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const email = emailRegisterRef.current.value;

    if (!email) {
      setErrorMessage("Email cannot be empty.");
      setModalIsOpenError(true);
      // return;
    } else {
      const userData = JSON.parse(localStorage.getItem("user"));

      const data = {
        email,
        companyId: userData.appraiserCompany_Datails.appraiserCompanyId, // Replace with actual company ID
      };

      try {
        const encryptedData = encryptionData(data);
        setLoading(true);
        toast.loading("Registering user...");
        await axios.post("/api/registerByCompany", encryptedData);
        toast.dismiss();
        setIsLoading(false);
        setModalIsOpen(true);
        // toast.success("Successfully added!");
        // setTimeout(() => {
        //   window.location.reload(); 
        // }, 2000); 

      } catch (err) {
        toast.dismiss();
        setIsLoading(false);
        const status = err.response?.request?.status;
        if (status === 409) {
          toast.error("Email is already registered!");
        } else {
          toast.error(err.message || "An error occurred.");
        }
      } finally {
        setLoading(false);
      }
      // location.reload();
    }
    // setDisable(false);
  };
  const closeModal = () => {
    setModalIsOpen(false);
    window.location.reload();
  };
  return (
    <div className="row mt-4">
      <div className="col-lg-12">
        <form onSubmit={registerHandler}>
          {/* Email Input */}
          <div className="form-group input-group position-relative">
            <input
              type="email"
              className="form-control"
              placeholder="Username / Email"
              ref={emailRegisterRef}
              required
            />
            <div className="input-group-text p-3">
              <FaEnvelope />
            </div>
          </div>

          {/* Buttons */}
          <div className="col-lg-12 text-center mt-4">
            <button
              type="button"
              onClick={() => setCloseRegisterModal(false)}
              className="btn btn-color w-25 mx-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-25 mx-1 btn btn-color w-25"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
      {modalIsOpen && (
        <div className="modal">
          <div
            className="modal-content"
            style={{ border: "2px solid #97d700", width: "40%" }}
          >
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <Link href="/" className="">
                    <Image
                      width={60}
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
              <div className="row">
                <div className="col-lg-12 text-center">
                  <h3 className=" text-color mt-1">Success</h3>
                </div>
              </div>
              <div
                className="mt-2 mb-3"
                style={{ border: "2px solid #97d700" }}
              ></div>
            </div>
            <span
              className="text-center mb-2 text-dark fw-bold"
              style={{ fontSize: "18px" }}
            >
              The appraiser has been successfully added to Appraisal Land. Please
              verify the account within 72 hours by clicking the registration
              link sent to the provided email.
            </span>
            <div
              className="mt-2 mb-3"
              style={{ border: "2px solid #97d700" }}
            ></div>
            <div
              className="col-lg-12 text-center"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button
                className="btn btn-color w-25"
                onClick={() => closeModal()}
                style={{}}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
