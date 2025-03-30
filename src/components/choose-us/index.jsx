import React from "react";
import WhyChoose from "../common/WhyChoose";
import Header from "../common/header/DefaultHeader_01";
import Footer from "../common/footer/Footer";
import CopyrightFooter from "../common/footer/CopyrightFooter";
import MobileMenu from "../common/header/MobileMenu";

const ChooseUs = () => {
  return (
    <div>
      <Header />
      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      <section id="why-chose" className="whychose_us bgc-f7 pb30 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="main-title text-center">
                <h2>Why Choose Us</h2>
                <p>We provide full service at every step.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <WhyChoose />
          </div>
        </div>
      </section>
      {/* <section>
        <div className="row mt80">
          <div className="col-lg-6 offset-lg-3">
            <div className="main-title text-center">
              <h2>Why Choose Us</h2>
              <p>We provide full service at every step.</p>
            </div>
          </div>
        </div>

        <div className="row">
          <WhyChoose />
        </div>
      </section> */}
      {/* End .row */}
      {/* <!-- Our Footer --> */}
      <section className="footer_one">
        <div className="container">
          <div className="row">
            <Footer />
          </div>
        </div>
      </section>

      {/* <!-- Our Footer Bottom Area --> */}
      <div className="footer_middle_area">
        <div className="container">
          <CopyrightFooter />
        </div>
      </div>
    </div>
  );
};

export default ChooseUs;
