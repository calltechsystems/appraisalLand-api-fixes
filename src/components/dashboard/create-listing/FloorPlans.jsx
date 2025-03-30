const FloorPlans = () => {
  return (
    <div className="row">
      <div className="col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="planDsecription">Street Name</label>
          <input type="text" className="form-control" id="planDsecription" placeholder="xyz" />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="planBedrooms">Street Number</label>
          <input type="text" className="form-control" id="planBedrooms" placeholder="xyz"/>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="planBathrooms">City</label>
          <input type="text" className="form-control" id="planBathrooms" placeholder="xyz"/>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="planPrice">State</label>
          <input type="text" className="form-control" id="planPrice" placeholder="xyz"/>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="planPostfix">Zip Code</label>
          <input type="text" className="form-control" id="planPostfix" placeholder="xyz"/>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="planSize">Type of Building</label>
          <input type="text" className="form-control" id="planSize" placeholder="xyz"/>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="planSize">Urgency</label>
          <input type="text" className="form-control" id="planSize" placeholder="xyz"/>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="planSize">Community</label>
          <input type="text" className="form-control" id="planSize" placeholder="xyz"/>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="planSize">Applicant First Name</label>
          <input type="text" className="form-control" id="planSize" placeholder="John"/>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="planSize">Applicant Last Name</label>
          <input type="text" className="form-control" id="planSize" placeholder="Seena"/>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="planSize">Applicant Phone Number</label>
          <input type="text" className="form-control" id="planSize" placeholder="0907854326"/>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="planSize">Applicant Email Address</label>
          <input type="text" className="form-control" id="planSize" placeholder="John@test.com"/>
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label>Plan Image</label>
          <div className="avatar-upload">
            <div className="avatar-edit">
              <input
                className="btn btn-thm"
                type="file"
                id="imageUpload"
                accept=".png, .jpg, .jpeg"
              />
              <label htmlFor="imageUpload"></label>
            </div>
            <div className="avatar-preview">
              <div id="imagePreview"></div>
            </div>
          </div>
        </div>
      </div> */}
      {/* End .col */}

      {/* <div className="col-xl-12">
        <div className="my_profile_setting_textarea mt30-991">
          <label htmlFor="planDescription">Plan Description</label>
          <textarea
            className="form-control"
            id="planDescription"
            rows="7"
          ></textarea>
        </div>
      </div> */}
      {/* End .col */}

      <div className="col-xl-12">
        <div className="my_profile_setting_input">
          {/* <button className="btn btn1 float-start">Back</button> */}
          <button className="btn btn2 float-end">Submit</button>
        </div>
      </div>
      {/* End .col */}
    </div>
  );
};

export default FloorPlans;
