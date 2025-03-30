import Social from "../common/footer/Social";

const AddressSidebar = () => {
  return (
    <>
      <div
        className="row mt-5 mb-5 justify-content-center"
        style={{ position: "relative", zIndex: "10" }}
      >
        <div
          className="col-lg-3 contact_localtion m-3"
          style={{
            boxShadow: "0px 0px 50px 0px rgba(19, 19, 28, 0.12)",
            width: "251px",
          }}
        >
          <h4 className="text-center">Office</h4>
          <div className="d-flex">
            <span className="btn text-color flaticon-house-2"></span>
            <p className="mt-2">
              XYZ street Model <br /> Town British Columbia Canada <br /> Pin Code
              123456
            </p>
          </div>
        </div>
        <div
          className="col-lg-3 contact_localtion m-3"
          style={{
            boxShadow: "0px 0px 50px 0px rgba(19, 19, 28, 0.12)",
            width: "251px",
          }}
        >
          <h4 className="text-center">Hours</h4>
          <div className="d-flex">
            <div>
              <span className="btn text-color flaticon-house-1"></span>
            </div>
            <div className="mt-2">
              <h5>Office Hours</h5>
              <p>
                Monday - Friday :<br /> 8 AM - 5 PM ET
              </p>
            </div>
          </div>
          <div className="d-flex">
            <div>
              <span className="btn text-color flaticon-house"></span>
            </div>
            <div className="mt-2">
              <h5>Support Hours</h5>
              <p>
                Monday - Friday :<br /> 7 AM - 6 PM ET
              </p>
            </div>
          </div>
        </div>
        <div
          className="col-lg-3 contact_localtion m-3"
          style={{
            boxShadow: "0px 0px 50px 0px rgba(19, 19, 28, 0.12)",
            width: "251px",
          }}
        >
          <h4 className="text-center">Contact</h4>
          <div className="d-flex">
            <span className="btn text-color flaticon-telephone"></span>
            <p className="mt-2">+1 302-000-1111</p>
          </div>
          {/* <div className="d-flex">
            <div>
              <span className="btn text-color flaticon-box"></span>
            </div>
            <div>
              <h5 className="mt-2">Customer Success</h5>
            </div>
          </div> */}
          <div className="d-flex">
            <span className="btn text-color flaticon-telephone"></span>
            <p className="mt-2">+1 302-000-1111</p>
          </div>
          <div className="d-flex">
            <span className="btn text-color flaticon-envelope"></span>
            <p className="mt-2">info@appraisallink.com</p>
          </div>
        </div>
        <div
          className="col-lg-3 contact_localtion m-3"
          style={{
            boxShadow: "0px 0px 50px 0px rgba(19, 19, 28, 0.12)",
            width: "251px",
          }}
        >
          <h4 className="text-center">Chat</h4>
          <p className="mt-2">Chat with us online !</p>
          <h5>Follow Us on !</h5>
          <ul className="contact_form_social_area mt-4">
            <Social />
          </ul>
        </div>
      </div>
    </>
  );
};

export default AddressSidebar;
