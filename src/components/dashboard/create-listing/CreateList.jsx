import { useEffect, useRef, useState } from "react";
import { Urgency, typeOfAppraisal, Purpose } from "./data";
import { typeOfBuilding } from "./data";
import moment from "moment";
import MyDatePicker from "./MyDatePicker";

const CreateList = ({
  isDisable,
  urgencyRef,
  areaRef,
  setAreaRef,
  buildinRef,
  setBuildinRef,
  appraisalQuoteDate,
  setAppraisalQuoteDate,
  propertyData,
  otherUrgencyValue,
  setDisable,
  bidLowerRangeRef,
  setBidLowerRangeRef,
  communityRef,
  setCommunityRef,
  setUrgencyRef,
  setEstimatedValue,
  estimatedValue,
  setPurpose,
  setOtherTypeOfBuilding,
  purpose,
  lenderInformation,
  setLenderInformation,
  setTypeOfAppraisal,
  typeOffAppraisal,
  otherPurpose,
  otherTypeOfAppraisal,
  otherUrgency,
  otherTypeOfBuilding,
  errorLabel,
  urgencyType,
  setOtherPurposeValue,
  setOtherTypeOfAppraisalValue,
  setOtherTypeOfBuildingValue,
  setOtherUrgencyValue,
  setUrgencyType,
  onChangeHandler,
  handleInputChangeNew,
  setIsFormDirty,
}) => {
  const [selectedOption, setSelectedOption] = useState("");

  const hiddenStyle = { backgroundColor: "#E8F0FE", display: "none" };
  const viewStyle = { backgroundColor: "#E8F0FE", display: "block" };

  const check = (e) => {
    const selectedIndex = e.target.selectedIndex;
    setSelectedOption(e.target.value);

    const otherDiv = document.getElementById("other-div");

    if (selectedIndex === 7) {
      otherDiv.style.display = "block";
    } else {
      otherDiv.style.display = "none";
    }
  };

  const setDate = (value) => {
    if (urgencyRef === "Rush") {
      setUrgencyRef(value);
    } else {
      const parts = value;
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JavaScript
      const year = parseInt(parts[2], 10);

      const originalDate = new Date(year, month, day);

      // Step 2: Add 30 days to the date
      const newDate = new Date(originalDate);
      newDate.setDate(newDate.getDate() + 30);

      // Step 3: Format the resulting date as "dd-mm-yyyy"
      const formattedDate = `${newDate
        .getDate()
        .toString()
        .padStart(2, "0")}-${(newDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${newDate.getFullYear()}`;

      console.log(formattedDate);
      setUrgencyRef(formattedDate);
    }
  };

  const errorLabelStyle = { borderColor: "red" };

  const checkIsError = (value) => {
    let isError = false;
    errorLabel.map((err, index) => {
      console.log(err, value);
      if (String(err) === String(value)) {
        isError = true;
      }
    });
    console.log(isError);
    return isError;
  };

  function getMinDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    // const hours = currentDate.getHours().toString().padStart(2, "0");
    // const minutes = currentDate.getMinutes().toString().padStart(2, "0");

    // Format the date as YYYY-MM-DDTHH:mm
    return `${year}-${month}-${day}`;
  }

  // let formatteddate= new Date();

  // const handleChange = (event) => {
  //   const selectedDate = event.target.value;

  //   // Convert the selected date to the desired format
  //   const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //   });

  //   formatteddate=formattedDate;
  //   // Now, you can use formattedDate for further processing or set it to state
  //   setUrgencyRef(formattedDate);
  // };

  const [selectedOption_01, setSelectedOption_01] = useState("");

  const check_01 = (e) => {
    const selectedIndex = e.target.selectedIndex;
    setSelectedOption_01(e.target.value);

    const otherDiv = document.getElementById("other-div_01");

    if (selectedIndex === 4) {
      otherDiv.style.display = "block";
    } else {
      otherDiv.style.display = "none";
    }
  };

  const [selectedOption_02, setSelectedOption_02] = useState("");

  const check_02 = (e) => {
    const selectedIndex = e.target.selectedIndex;
    setSelectedOption_02(e.target.value);

    const otherDiv = document.getElementById("other-div_02");

    if (selectedIndex === 4) {
      otherDiv.style.display = "block";
    } else {
      otherDiv.style.display = "none";
    }
  };

  const [selectedOption_03, setSelectedOption_03] = useState("");

  const check_03 = (e) => {
    const selectedIndex = e.target.selectedIndex;
    setSelectedOption_03(e.target.value);

    const otherDiv = document.getElementById("other-div_03");

    if (selectedIndex === 1) {
      otherDiv.style.display = "block";
    } else {
      otherDiv.style.display = "none";
    }
  };

  // const handleInputChange = (e) => {
  //   const inputValue = e.target.value;

  //   // Allow only numeric input
  //   const numericValue = inputValue.replace(/\D/g, "");

  //   // Restrict to 10 digits
  //   const truncatedValue = numericValue.slice(0, 10);
  //   if (truncatedValue.length === 10) {
  //     setEstimatedValue(truncatedValue);
  //   }

  //   setEstimatedValue(truncatedValue);
  // };

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
      setEstimatedValue(rawValue); // Update state with raw value
    }
    setIsFormDirty(true);
  };

  return (
    <>
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
                Property Type <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              <div
                className="form-group input-group ui_kit_select_search"
                style={{ marginLeft: "-6px" }}
              >
                <select
                  required
                  className="form-select"
                  data-live-search="true"
                  data-width="100%"
                  value={buildinRef}
                  // onChange={(e) => setBuildinRef(e.target.value)}
                  onChange={(e) => handleInputChangeNew(e, setBuildinRef)}
                  // onChange={(e) => setBuildinRef(e.target.value)}
                  disabled={isDisable}
                  style={
                    checkIsError("typeOfBuilding")
                      ? errorLabelStyle
                      : {
                          paddingTop: "15px",
                          paddingBottom: "15px",
                          backgroundColor: "#E8F0FE",
                          // color:"white"
                        }
                  }
                >
                  {typeOfBuilding.map((item, index) => {
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
            <div className="col-lg-3"></div>
            <div className="col-lg-5" style={{ marginLeft: "-6px" }}>
              <div id="other-div">
                {/* Content for the "Other" option */}
                <input
                  required
                  style={otherTypeOfBuilding ? viewStyle : hiddenStyle}
                  onChange={(e) => setOtherTypeOfBuildingValue(e.target.value)}
                  type="text"
                  className="form-control"
                  id="otherInput"
                  placeholder="Please enter details here"
                  name="otherInput"
                  maxLength={30}
                />
              </div>
            </div>
          </div>
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                htmlFor=""
                className="text-color"
                style={{
                  paddingTop: "15px",
                  color: "#1560bd",
                  fontWeight: "",
                  marginTop: "-13px",
                }}
              >
                Estimated Value / Purchase Price ($){" "}
                <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              <input
                required
                type="text"
                className="form-control"
                id="formGroupExampleInput3"
                style={
                  checkIsError("estimatedValue")
                    ? errorLabelStyle
                    : { backgroundColor: "#E8F0FE", marginLeft: "-5px" }
                }
                // onChange={(e) => setEstimatedValue(e.target.value)}
                onChange={handleInputChange}
                value={formatNumberWithCommas(estimatedValue)}
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
                Purpose <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              <div
                className="form-group input-group ui_kit_select_search"
                style={{ marginLeft: "-5px" }}
              >
                <select
                  required
                  className="form-select"
                  data-live-search="true"
                  data-width="100%"
                  value={purpose}
                  // onChange={(e) => setPurpose(e.target.value)}
                  onChange={(e) => handleInputChangeNew(e, setPurpose)}
                  disabled={isDisable}
                  style={
                    checkIsError("purpose")
                      ? errorLabelStyle
                      : {
                          paddingTop: "15px",
                          paddingBottom: "15px",
                          backgroundColor: "#E8F0FE",
                          // color:"white"
                        }
                  }
                >
                  {Purpose.map((item, index) => {
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
            <div className="col-lg-3"></div>
            <div className="col-lg-5" style={{ marginLeft: "-5px" }}>
              <div id="other-div_02">
                {/* Content for the "Other" option */}
                <input
                  required
                  type="text"
                  className="form-control"
                  id="otherInput"
                  placeholder="Please enter details here"
                  name="otherInput"
                  style={otherPurpose ? viewStyle : hiddenStyle}
                  onChange={(e) => setOtherPurposeValue(e.target.value)}
                  maxLength={30}
                />
              </div>
            </div>
          </div>
          {/* <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group"></div>
            <div className="col-lg-7">
              <div id="other-div" style={{ display: "none" }}>
                <input
                  required
                  style={{ backgroundColor: "#E8F0FE" }}
                  onChange={(e) => setBuildinRef(e.target.value)}
                  type="text"
                  className="form-control"
                  id="otherInput"
                  name="otherInput"
                />
              </div>
            </div>
          </div> */}
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
                Type of Appraisal <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              <div
                className="form-group input-group ui_kit_select_search"
                style={{ marginLeft: "-5px" }}
              >
                <select
                  required
                  className="form-select"
                  data-live-search="true"
                  data-width="100%"
                  value={typeOffAppraisal}
                  // onChange={(e) => setTypeOfAppraisal(e.target.value)}
                  onChange={(e) => handleInputChangeNew(e, setTypeOfAppraisal)}
                  style={
                    checkIsError("typeOfAppraisal")
                      ? errorLabelStyle
                      : {
                          paddingTop: "15px",
                          paddingBottom: "15px",
                          backgroundColor: "#E8F0FE",
                          // color:"white"
                        }
                  }
                >
                  {typeOfAppraisal.map((item, index) => {
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
            <div className="col-lg-3"></div>
            <div className="col-lg-5" style={{ marginLeft: "-5px" }}>
              <div id="other-div_01">
                {/* Content for the "Other" option */}
                <input
                  required
                  style={otherTypeOfAppraisal ? viewStyle : hiddenStyle}
                  onChange={(e) => setOtherTypeOfAppraisalValue(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Please enter details here"
                  id="otherInput"
                  name="otherInput"
                  maxLength={30}
                />
              </div>
            </div>
          </div>
          {/* <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group"></div>
            <div className="col-lg-7">
              <div id="other-div_01" style={{ display: "none" }}>
                <input
                  required
                  style={{ backgroundColor: "#E8F0FE" }}
                  type="text"
                  className="form-control"
                  id="otherInput"
                  name="otherInput"
                />
              </div>
            </div>
          </div> */}

          {/* <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group"></div>
            <div className="col-lg-7">
              <div id="other-div_02" style={{ display: "none" }}>
                <input
                  required
                  style={{ backgroundColor: "#E8F0FE" }}
                  type="text"
                  className="form-control"
                  id="otherInput"
                  name="otherInput"
                />
              </div>
            </div>
          </div> */}
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                htmlFor=""
                className="text-color"
                style={{
                  paddingTop: "15px",
                  color: "#1560bd",
                  fontWeight: "",
                }}
              >
                Lender Information
              </label>
            </div>
            <div className="col-lg-5">
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput3"
                style={{ backgroundColor: "#E8F0FE", marginLeft: "-5px" }}
                maxLength={30}
                // onChange={(e) => setLenderInformation(e.target.value)}
                onChange={(e) => handleInputChangeNew(e, setLenderInformation)}
                value={lenderInformation}
                disabled={isDisable}
              />
            </div>
          </div>

          <div className="row" style={{}}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                htmlFor=""
                className="text-color"
                style={{
                  paddingTop: "15px",
                  color: "#1560bd",
                  fontWeight: "",
                }}
              >
                Urgency <span class="req-btn">*</span>
              </label>
              <div className="hover-text-01">
                <div
                  className="tooltip-text-01"
                  style={{ marginTop: "-60px", marginLeft: "-100px" }}
                >
                  <ul>
                    <li>
                      Rush Request : Timeline for the appraisal report is 1 – 2
                      Days.
                    </li>
                    <li>
                      Regular Request : Timeline for the appraisal report is 3 –
                      4 days.
                    </li>
                  </ul>
                </div>
                <i class="fa fa-info-circle" aria-hidden="true"></i>
              </div>
            </div>
            <div className="col-lg-5">
              <div
                className="form-group input-group ui_kit_select_search mb-3"
                style={{ marginLeft: "-5px" }}
              >
                <select
                  className="form-select"
                  data-live-search="true"
                  data-width="100%"
                  // onChange={(e) => setUrgencyRef(e.target.value)}
                  onChange={(e) => handleInputChangeNew(e, setUrgencyRef)}
                  value={urgencyRef}
                  disabled={isDisable}
                  style={
                    checkIsError("urgency")
                      ? errorLabelStyle
                      : {
                          paddingTop: "15px",
                          paddingBottom: "15px",
                          backgroundColor: "#E8F0FE",
                        }
                  }
                >
                  {Urgency.map((item, index) => {
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
          <div
            className="row"
            style={{ marginBottom: "10px" }}
            id="other-div_03"
          >
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label htmlFor="" className="text-color bg-transparent mt-1">
                Appraisal Report Required By <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              {/* <MyDatePicker /> */}
              <input
                required
                style={
                  checkIsError("quoteRequiredDate")
                    ? errorLabelStyle
                    : {
                        paddingTop: "15px",
                        paddingBottom: "15px",
                        backgroundColor: "#E8F0FE",
                        marginLeft: "-5px",
                      }
                }
                type="date"
                className="form-control"
                id="formGroupExampleInput3"
                // onChange={(e) => setAppraisalQuoteDate(e.target.value)}
                onChange={(e) => handleInputChangeNew(e, setAppraisalQuoteDate)}
                value={appraisalQuoteDate}
                placeholder="MM-DD-YYYY"
                disabled={isDisable}
                min={getMinDateTime()}
                onKeyDown={(e) => e.preventDefault()} // Prevent keyboard interaction
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateList;
