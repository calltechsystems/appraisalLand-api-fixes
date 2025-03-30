import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../common/CommonLoader/page";

const AddTopUp = ({ setModalMessage, setModalIsOpen, setIsError }) => {
  const [email, setEmail] = useState("");
  const [numProperties, setNumProperties] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    if (!email && !numProperties) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!email) {
      toast.error("Email is required.");
      return;
    }

    if (!numProperties) {
      toast.error("Number of properties is required.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Ensure numProperties is a positive number
    if (isNaN(numProperties) || numProperties <= 0) {
      toast.error("Number of properties must be a positive number.");
      return;
    }

    // Optional: Limit the number of properties (example: max 100)
    if (numProperties > 100) {
      toast.error("You can add up to 100 properties only.");
      return;
    }

    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await axios.post(
        "/api/addTopUpByAdmin",
        {
          emailId: email,
          noOfProperties: numProperties,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // toast.success("Top-up successful!");
        setModalMessage("Property Added Successfully.");
        setIsError(false);
        setModalIsOpen(true);
      } else {
        toast.error("Failed to add top-up. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      const err =
        error?.response?.data?.details?.message ||
        "An unexpected error occurred.";
      setModalMessage(err);
      setIsError(true);
      setModalIsOpen(true);
      console.log("Error:", err);
      // toast.error(err || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        {loading && <LoadingSpinner />}
        <div className="row" style={{ marginBottom: "10px" }}>
          <div className="col-lg-3 my_profile_setting_input form-group">
            <label className="text-color" style={{ paddingTop: "15px" }}>
              Email Address <span className="req-btn">*</span>
            </label>
          </div>
          <div className="col-lg-5">
            <input
              type="text"
              style={{ backgroundColor: "#E8F0FE" }}
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={100}
            />
          </div>
        </div>

        <div className="row" style={{ marginBottom: "10px" }}>
          <div className="col-lg-3 my_profile_setting_input form-group">
            <label className="text-color" style={{ paddingTop: "15px" }}>
              No. of Properties <span className="req-btn">*</span>
            </label>
          </div>
          <div className="col-lg-5">
            <input
              type="number"
              style={{ backgroundColor: "#E8F0FE" }}
              className="form-control"
              value={numProperties}
              onChange={(e) => setNumProperties(e.target.value)}
              maxLength={30}
            />
          </div>
        </div>

        <div className="col-xl-12">
          <div className="my_profile_setting_input overflow-hidden mt30 text-center">
            <button
              className="btn btn5"
              onClick={submitHandler}
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTopUp;
