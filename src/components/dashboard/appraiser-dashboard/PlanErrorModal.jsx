export const PlanErrorModal = ({ closePlanErrorModal, router }) => (
  <div className="modal">
    <div
      className="modal-content"
      style={{ borderColor: "#97d700", width: "30%" }}
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
            <h3 className=" text-color mt-1">Error</h3>
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
        A valid subscription is required to access Appraisal Land. Please
        subscribe now to enjoy our full range of services
      </span>
      <div className="mt-2 mb-3" style={{ border: "2px solid #97d700" }}></div>
      <div
        className="col-lg-12 text-center"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <button
          className="btn btn-color"
          onClick={() => closePlanErrorModal(router)}
          style={{ width: "100px" }}
        >
          Subscribe
        </button>
      </div>
    </div>
  </div>
);
