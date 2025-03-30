import axios from "axios";
import { useRef, useState } from "react";
import { useReducer } from "react";
import { FaEye } from "react-icons/fa";
import { encryptionData } from "../../../utils/dataEncryption";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const oldPasswordRef = useRef("");
  const newPasswordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const emailRef = useRef("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible_01, setPasswordVisible_01] = useState(false);
  const [passwordVisible_02, setPasswordVisible_02] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user")) || {};

  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibility_01 = () => {
    setPasswordVisible_01(!passwordVisible_01);
  };

  const togglePasswordVisibility_02 = () => {
    setPasswordVisible_02(!passwordVisible_02);
  };

  const submitHandler = async () => {
    const email = userData.userEmail;
    const newPassword = newPasswordRef.current.value;
    const oldPassword = oldPasswordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    console.log(oldPassword, newPassword, confirmPassword);
    if (String(newPassword) !== String(confirmPassword)) {
      toast.error("Both the passwords should be same ");
    } else {
      try {
        const payload = {
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword,
          token: userData.token,
        };

        const encryptedData = encryptionData(payload);

        toast.loading("Changing the password");
        const response = await axios.post(
          "/api/change-broker-password",
          encryptedData
        );
        if (!response) {
          toast.dismiss();
          toast.error("Failed Try Again");
        } else {
          toast.dismiss();
          localStorage.removeItem("user");
          router.push("/login");
        }
      } catch (err) {
        toast.error(err.response.data.error);
      }
    }
  };
  return (
    <>
      <div className="row">
        {/* <h4 className="mb-3">Manage Password</h4> */}
        <div class="accordion" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                <h4 className="">Manage Password</h4>
              </button>
            </h2>
            <div
              id="collapseThree"
              class="accordion-collapse collapse show"
              aria-labelledby="headingThree"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <div className="row">
                  <div className="col-lg-6 col-xl-3">
                    <div className="my_profile_setting_input form-group">
                      <label
                        htmlFor="formGroupExampleOldPass"
                        style={{
                          paddingBottom: "10px",
                          color: "#1560bd",
                          fontWeight: "",
                        }}
                      >
                        Old Password
                      </label>
                      <input
                        type={passwordVisible ? "text" : "password"} // Conditionally set the input type
                        className="form-control"
                        id="exampleInputPassword1"
                        // placeholder="Old Password"
                        required
                        ref={oldPasswordRef}
                        style={{ paddingRight: "40px" }} // Add right padding to accommodate the button
                      />
                    </div>
                  </div>
                  <div
                    className="col-lg-1"
                    style={{
                      width: "fit-content",
                      marginTop: "37px",
                      marginLeft: "-15px",
                    }}
                  >
                    <div
                      className="input-group-text"
                      style={{ border: "", cursor: "pointer" }}
                      // onMouseEnter={togglePasswordVisibility}
                      // onMouseLeave={togglePasswordVisibility}
                      onClick={togglePasswordVisibility}
                    >
                      <FaEye />
                    </div>
                  </div>
                  {/* End .col */}
                  <div className="col-lg-6 col-xl-3">
                    <div className="my_profile_setting_input form-group">
                      <label
                        htmlFor="formGroupExampleNewPass"
                        style={{
                          paddingBottom: "10px",
                          color: "#1560bd",
                          fontWeight: "",
                        }}
                      >
                        New Password
                      </label>
                      <input
                        type={passwordVisible ? "text" : "password"} // Conditionally set the input type
                        className="form-control"
                        id="exampleInputPassword1"
                        // placeholder="New Password"
                        required
                        ref={newPasswordRef}
                        style={{ paddingRight: "40px" }} // Add right padding to accommodate the button
                      />
                    </div>
                  </div>
                  <div
                    className="col-lg-1"
                    style={{
                      width: "fit-content",
                      marginTop: "37px",
                      marginLeft: "-15px",
                    }}
                  >
                    <div
                      className="input-group-text"
                      style={{
                        border: "",
                        cursor: "pointer",
                      }}
                      // onMouseEnter={togglePasswordVisibility}
                      // onMouseLeave={togglePasswordVisibility}
                      onClick={togglePasswordVisibility_01}
                    >
                      <FaEye />
                    </div>
                  </div>
                  {/* End .col */}
                  <div className="col-lg-6 col-xl-3">
                    <div className="my_profile_setting_input form-group">
                      <label
                        htmlFor="formGroupExampleConfPass"
                        style={{
                          paddingBottom: "10px",
                          color: "#1560bd",
                          fontWeight: "",
                        }}
                      >
                        Confirm New Password
                      </label>
                      <input
                        type={passwordVisible ? "text" : "password"} // Conditionally set the input type
                        className="form-control"
                        id="exampleInputPassword1"
                        // placeholder="Confirm New Password"
                        required
                        ref={confirmPasswordRef}
                        style={{ paddingRight: "40px" }} // Add right padding to accommodate the button
                      />
                    </div>
                  </div>{" "}
                  <div
                    className="col-lg-1"
                    style={{
                      width: "fit-content",
                      marginTop: "37px",
                      marginLeft: "-15px",
                    }}
                  >
                    <div
                      className="input-group-text"
                      style={{
                        border: "",
                        cursor: "pointer",
                      }}
                      // onMouseEnter={togglePasswordVisibility}
                      // onMouseLeave={togglePasswordVisibility}
                      onClick={togglePasswordVisibility_02}
                    >
                      <FaEye />
                    </div>
                  </div>
                  {/* End .col */}
                  <div className="col-xl-12">
                    <div className="my_profile_setting_input float-end fn-520 mt-4">
                      <button className="btn btn-color" onClick={submitHandler}>
                        Update
                      </button>
                    </div>
                  </div>
                  {/* End .col */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End .row */}
    </>
  );
};

export default ChangePassword;
