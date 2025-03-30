import React, { Component, useState } from "react";
import { useRouter } from "next/router";

const DetailedInfo = ({}) => {
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                className="text-color"
                style={{ paddingTop: "15px", fontWeight: "" }}
              >
                Email Address <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              <input
                type="text"
                style={{
                  backgroundColor: "#E8F0FE",
                }}
                className="form-control"
                id="formGroupExampleInput3"
                // onChange={(e) => setApplicantEmail(e.target.value)}
                // value={applicantEmail}
                // disabled={isDisable}
                maxLength={100}
              />
            </div>
          </div>

          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-lg-3 my_profile_setting_input form-group">
              <label
                className="text-color"
                style={{ paddingTop: "15px", fontWeight: "" }}
              >
                No. of Properties <span class="req-btn">*</span>
              </label>
            </div>
            <div className="col-lg-5">
              <input
                style={{
                  backgroundColor: "#E8F0FE",
                }}
                type="text"
                className="form-control"
                id="formGroupExampleInput3"
                // onChange={(e) => setApplicantFirstName(e.target.value)}
                // value={applicantFirstName}
                // disabled={isDisable}
                maxLength={30}
              />
            </div>
          </div>

          <div className="col-xl-12">
            <div className="my_profile_setting_input overflow-hidden mt30 text-center">
              <button
                // disabled={disable}
                className="btn btn5"
                // onClick={submitHandler}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailedInfo;
