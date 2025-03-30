const ChangePassword = () => {
  return (
    <>
      <div className="row">
        <h4 className="mb-3">Manage Password</h4>
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
                Change Password
              </button>
            </h2>
            <div
              id="collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <div className="row">
                  <div className="col-xl-4">
                    <div className="my_profile_setting_input form-group">
                      <label htmlFor="formGroupExampleOldPass">
                        Old Password
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleOldPass"
                        placeholder="alitfn"
                      />
                    </div>
                  </div>
                  {/* End .col */}

                  <div className="col-lg-6 col-xl-4">
                    <div className="my_profile_setting_input form-group">
                      <label htmlFor="formGroupExampleNewPass">
                        New Password
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleNewPass"
                      />
                    </div>
                  </div>
                  {/* End .col */}

                  <div className="col-lg-6 col-xl-4">
                    <div className="my_profile_setting_input form-group">
                      <label htmlFor="formGroupExampleConfPass">
                        Confirm New Password
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleConfPass"
                      />
                    </div>
                  </div>
                  {/* End .col */}

                  <div className="col-xl-12">
                    <div className="my_profile_setting_input float-start fn-520">
                      <button className="btn btn2 btn-dark">
                        Update Password
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

      <div className="row"></div>
    </>
  );
};

export default ChangePassword;
