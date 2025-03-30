import BreadCrumb from "../common/BreadCrumb";

const BreadCrumbBanner = () => {
  return (
    <section className="inner_page_breadcrumb">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="breadcrumb_content">
              {/* <BreadCrumb title="about us" /> */}
              <h4 className="breadcrumb_title">Appraiser Company User Guide</h4>
            </div>
          </div>
          {/* End .col */}
        </div>
      </div>
    </section>
  );
};

export default BreadCrumbBanner;
