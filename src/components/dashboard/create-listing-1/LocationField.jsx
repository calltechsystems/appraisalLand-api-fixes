import { current } from "@reduxjs/toolkit";
import { province, typeOfBuilding } from "./data";
import { Urgency } from "./data";

const LocationField = ({
  isDisable,
  streetNameRef,
  setStreetNameRef,
  streetNumberRef,
  setStreetNumberRef,
  cityRef,
  setCityRef,
  setZipCodeRef,
  stateRef,
  setStateRef,
  handleZipCodeChange,
  zipCodeRef,
  errorLabel,
  areaRef,
  setAreaRef,
  setBuildinRef,
  propertyData,
  setDisable,
  buildinRef,
  bidLowerRangeRef,
  setBidLowerRangeRef,
  communityRef,
  setCommunityRef,
  setUrgencyRef,
}) => {
  const errorLabelStyle = { borderColor: "red" };

  const checkIsError = (value) => {
    let isError = false;
    errorLabel.map((err, index) => {
      if (String(err) === String(value)) {
        isError = true;
      }
    });
    return isError;
  };
  return (
    <>
      {/* Old Form */}

      <div className="row">
        <div className="col-lg-12">
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                className="text-color"
                htmlFor=""
                style={{
                  paddingTop: "15px",
                  color: "#1560bd",
                  fontWeight: "",
                }}
              >
                Street Number <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              <input
                style={
                  checkIsError("streetNumber")
                    ? errorLabelStyle
                    : { backgroundColor: "#E8F0FE" }
                }
                type="text"
                className="form-control"
                id="formGroupExampleInput3"
                onChange={(e) => setStreetNumberRef(e.target.value)}
                value={streetNumberRef}
                disabled={isDisable}
                maxLength={30}
              />
            </div>
          </div>
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                className="text-color"
                htmlFor=""
                style={{
                  paddingTop: "15px",
                  color: "#1560bd",
                  fontWeight: "",
                }}
              >
                Street Name <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              <input
                style={
                  checkIsError("streetName")
                    ? errorLabelStyle
                    : { backgroundColor: "#E8F0FE" }
                }
                type="text"
                className="form-control"
                id="formGroupExampleInput3"
                onChange={(e) => setStreetNameRef(e.target.value)}
                value={streetNameRef}
                disabled={isDisable}
                maxLength={30}
              />
            </div>
          </div>
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                className="text-color"
                htmlFor=""
                style={{
                  paddingTop: "15px",
                  color: "#1560bd",
                  fontWeight: "",
                }}
              >
                Unit / Apt. No.
              </label>
            </div>
            <div className="col-lg-5">
              <input
                style={{ backgroundColor: "#E8F0FE" }}
                type="text"
                className="form-control"
                id="formGroupExampleInput3"
                maxLength={30}
                // onChange={(e) => setStreetNumberRef(e.target.value)}
                // value={streetNumberRef}
                // disabled={isDisable}
              />
            </div>
          </div>
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                className="text-color"
                htmlFor=""
                style={{
                  paddingTop: "15px",
                  color: "#1560bd",
                  fontWeight: "",
                }}
              >
                City <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              <input
                style={
                  checkIsError("city")
                    ? errorLabelStyle
                    : { backgroundColor: "#E8F0FE" }
                }
                type="text"
                className="form-control"
                id="formGroupExampleInput3"
                onChange={(e) => setCityRef(e.target.value)}
                value={cityRef}
                disabled={isDisable}
                maxLength={30}
              />
            </div>
          </div>
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                className="text-color"
                htmlFor=""
                style={{
                  paddingTop: "15px",
                  color: "#1560bd",
                  fontWeight: "",
                }}
              >
                Province <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              {/*<input
              style={checkIsError("state") ? errorLabelStyle : { backgroundColor: "#E8F0FE" }}
                type="text"
                className="form-control"
                id="formGroupExampleInput3"
                onChange={(e) => setStateRef(e.target.value)}
                value={stateRef}
                disabled={isDisable}
                maxLength={30}
              />*/}
              <div
                className="form-group input-group ui_kit_select_search"
                // style={{ marginLeft: "-5px" }}
              >
                <select
                  className="form-select"
                  data-live-search="true"
                  data-width="100%"
                  onChange={(e) => setStateRef(e.target.value)}
                  value={stateRef}
                  // onChange={check_03}
                  disabled={isDisable}
                  style={
                    checkIsError("state")
                      ? errorLabelStyle
                      : {
                          paddingTop: "15px",
                          paddingBottom: "15px",
                          backgroundColor: "#E8F0FE",
                          // color:"white"
                        }
                  }
                >
                  {province.map((item, index) => {
                    return (
                      <option key={item.id} value={item.value}>
                        {item.type}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                className="text-color"
                htmlFor=""
                style={{
                  paddingTop: "15px",
                  color: "#1560bd",
                  fontWeight: "",
                }}
              >
                Postal Code <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              <input
                style={
                  checkIsError("zipCode")
                    ? errorLabelStyle
                    : { backgroundColor: "#E8F0FE" }
                }
                type="text"
                className="form-control"
                id="formGroupExampleInput3"
                onChange={(e) => handleZipCodeChange(e)}
                value={zipCodeRef}
                disabled={isDisable}
                maxLength={30}
              />
            </div>
          </div>
          {/* <div className="col-lg-6 mt20">
            <div className="form-group form-check custom-checkbox">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                required
                id="terms"
                style={{ border: "1px solid black" }}
              />
              <label
                className="form-check-label form-check-label"
                htmlFor="terms"
                style={{
                  color: "#2e008b",
                  fontWeight: "bold",
                }}
              >
                Validate Address
              </label>
            </div>
          </div> */}
          {/* <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                className="text-color"
                htmlFor=""
                style={{
                  paddingTop: "15px",
                  color: "#1560bd",
                  fontWeight: "",
                }}
              >
                Property Area (sq.ft)
              </label>
            </div>
            <div className="col-lg-5">
              <input
              style={{ backgroundColor: "#E8F0FE" }}
                type="number"
                className="form-control"
                id="formGroupExampleInput3"
                // onChange={(e) => setAreaRef(e.target.value)}
                // value={areaRef}
                // disabled={isDisable}
              />
            </div>
          </div>
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                className="text-color"
                htmlFor=""
                style={{
                  paddingTop: "15px",
                  color: "#1560bd",
                  fontWeight: "",
                }}
              >
                Type of Building <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              <div className="form-group input-group ui_kit_select_search mb-3">
                <select
                  required
                  className="form-select"
                  data-live-search="true"
                  data-width="100%"
                  // onChange={(e) => setBuildinRef(e.target.value)}
                  // // disabled={isDisable}
                  style={{
                    paddingTop: "15px",
                    paddingBottom: "15px",
                    backgroundColor: "#e8f0fe",
                  }}
                >
                  <option data-tokens="SelectRole" value={1}>
                    Choose..
                  </option>
                  <option data-tokens="SelectRole" value={1}>
                    Commercial
                  </option>
                  <option data-tokens="Agent/Agency" value={"Domestic"}>
                    Domestic
                  </option>
                  <option data-tokens="SingleUser" value={"Apartment"}>
                    Apartment
                  </option>
                </select>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default LocationField;
