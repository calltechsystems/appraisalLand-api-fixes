import CallToAction from "../common/CallToAction";
import CopyrightFooter from "../common/footer/CopyrightFooter";
import Footer from "../common/footer/Footer";
import MobileMenu from "../common/header/MobileMenu";
import Partners from "../common/Partners";
// import Header from "./Header";
import Hero from "./Hero";
import Link from "next/link";
import WhyChoose from "../common/WhyChoose";
import Team from "../about-us/Team";
import HeroSlider from "./HeroSlider";
import ComfortPlace from "./ComfortPlace";
import Testimonials from "./Testimonials";
import Header from "../common/header/DefaultHeader_01";
import { useRouter } from "next/router";
import Partners_01 from "../common/Partners_01";
import { useEffect, useState } from "react";

const Index = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const router = useRouter();

  const [lastActivityTimestamp, setLastActivityTimestamp] = useState(
    Date.now()
  );

  useEffect(() => {
    const activityHandler = () => {
      setLastActivityTimestamp(Date.now());
    };

    // Attach event listeners for user activity
    window.addEventListener("mousemove", activityHandler);
    window.addEventListener("keydown", activityHandler);
    window.addEventListener("click", activityHandler);

    // Cleanup event listeners when the component is unmounted
    return () => {
      window.removeEventListener("mousemove", activityHandler);
      window.removeEventListener("keydown", activityHandler);
      window.removeEventListener("click", activityHandler);
    };
  }, []);

  useEffect(() => {
    // Check for inactivity every minute
    const inactivityCheckInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivityTimestamp;

      // Check if there has been no activity in the last 10 minutes (600,000 milliseconds)
      if (timeSinceLastActivity > 600000) {
        localStorage.removeItem("user");
        router.push("/login");
      }
    }, 60000); // Check every minute

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(inactivityCheckInterval);
  }, [lastActivityTimestamp]);

  // if(userData && userData.userType === 1){
  //   router.push("/my-dashboard");
  // }
  // else if(userData && userData.userType === 2){
  //   router.push("/appraiser-dashboard");
  // }
  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header />
      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      {/* <!-- Modal --> */}
      {/* <PopupSignInUp /> */}

      {/* <!-- Home Design --> */}
      {/* <Hero /> */}
      {/* <HeroSlider/> */}

      {/* <!-- 4th Home Slider --> */}

      <div className="home-four ">
        <div className="container-fluid p0">
          <div className="main-banner-wrapper">
            <div className="arrow-style-2 banner-style-one ">
              <HeroSlider />
            </div>
          </div>
          {/* <!-- /.main-banner-wrapper --> */}
        </div>
        {/* End .container-fluid */}

        <div className="container home_iconbox_container">
          <div className="row posr">
            <div className="col-lg-12">
              <div className="home_content home4">
                <div
                  className="social-icons d-none d-lg-block"
                  style={{
                    position: "fixed",
                    right: "2px",
                    top: "160px",
                    borderRadius: "5px",
                    padding: "5px",
                    backgroundColor: "#2e008b",
                  }}
                >
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link social"
                  >
                    <i className="fa fa-facebook mx-2"></i>
                  </a>
                  <br />
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <i className="fa fa-instagram mx-2"></i>
                  </a>
                  <br />
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <i className="fa fa-linkedin mx-2"></i>
                  </a>
                </div>

                <div
                  className="d-none d-lg-block d-xl-block d-md-block home-text text-center"
                  style={{ marginTop: "-190px", marginBottom: "100px" }}
                >
                  <h2 className="fz50">
                    Brokers Paradise for all real estate appraisals
                  </h2>
                  <p className="fz18 color-white">
                    From as low as $11 per month for a limited time.
                  </p>
                </div>

                {/* for mobile view */}

                <div
                  className="d-sm-block d-md-none home-text text-center"
                  style={{ marginTop: "0px", marginBottom: "50px" }}
                >
                  <h2 className="fz50">
                    Brokers Paradise for all real estate appraisals
                  </h2>
                  <p className="fz18 color-white">
                    From as low as $11 per month for limited time.
                  </p>
                </div>

                {/* <GlobalHeroFilter className="home4" /> */}
                <div className="row">
                  <ComfortPlace />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- 4th Home Slider End --> */}

      {/* <!-- Why Chose Us --> */}
      <section id="why-chose" className="whychose_us bgc-f7 pb30">
        <div className="row">
          <div className="col-lg-12">
            <div className="main-title text-center">
              <h2
                style={{
                  backgroundColor: "#2e008b",
                  color: "white",
                  padding: "20px",
                }}
              >
                Why Choose Us
              </h2>
              {/* <p>We provide full service at every step.</p> */}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <WhyChoose />
          </div>
        </div>
      </section>

      {/* <!-- Property Search --> */}
      <section
        id="property-search"
        className="property-search home1-overlay bg-img4"
      >
        <div className="row">
          <div className="col-lg-12">
            <div className="search_smart_property text-center">
              <h2 className="text-light">Where Accuracy Meets Expertise</h2>
              <p className="text-light">
                Throughout the mortgage process, brokers serve as a point of
                contact between the borrower and the lender.
              </p>
              <Link href="/sign-up" className="my_profile_setting_input">
                <button className="btn btn2">Register</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Our Blog --> */}
      {/* <section className="our-blog bgc-f7 pb30">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="main-title text-center">
                <h2>Membership Plans</h2>
                <p>Choose a plan tailored to your needs.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <Blogs />
            <Pricing hideButton={true} />
          </div>
        </div>
      </section> */}

      <hr />

      {/* <!-- Our Team --> */}
      <section className="our-team bgc-f7">
        <div className="row">
          <div className="col-lg-12">
            <div className="main-title text-center">
              <h2
                style={{
                  backgroundColor: "#2e008b",
                  color: "white",
                  padding: "20px",
                }}
              >
                Meet Our Team
              </h2>
              <p>Our team of experts is there to grow your business.</p>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="team_slider gutter-x15">
                <Team />
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr />

      {/* <!-- Our Partners --> */}
      <section id="our-partners" className="our-partners">
        <div className="row">
          <div className="col-lg-12">
            <div className="main-title text-center">
              <h2
                style={{
                  backgroundColor: "#2e008b",
                  color: "white",
                  padding: "20px",
                }}
              >
                Our Brokerage Partners
              </h2>
              <p>We work with the Best Brokers at Brokerage Companies.</p>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <Partners />
          </div>
        </div>
      </section>

      <hr />

      {/* <!-- Our Partners --> */}
      <section id="our-partners" className="our-partners">
        <div className="row">
          <div className="col-lg-12">
            <div className="main-title text-center">
              <h2
                style={{
                  backgroundColor: "#2e008b",
                  color: "white",
                  padding: "20px",
                }}
              >
                Our Appraiser Partners
              </h2>
              <p>We work with the Best Appraisers at Appraisal Companies.</p>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <Partners_01 />
          </div>
        </div>
      </section>

      <hr />

      {/* <!-- Our Testimonials --> */}
      <section className="our-testimonials">
        <div className="row">
          <div className="col-lg-12 col-12">
            <div className="main-title text-center mb20">
              <h2
                style={{
                  backgroundColor: "#2e008b",
                  color: "white",
                  padding: "20px",
                }}
              >
                {/* What Customers Says About Us */}
                What Our Users Says
              </h2>
              <p>
                Discover how listable can help you find everything you want.
              </p>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row mt-5">
            <div className="col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
              <div className="testimonialsec slick-custom-as-nav">
                {/* <Testimonial /> */}
                <Testimonials />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Start Call to Action --> */}
      {/* <section className="start-partners bgc-thm pt50 pb50">
        <div className="container">
          <CallToAction />
        </div>
      </section> */}

      {/* <!-- Our Footer --> */}
      <section className="footer_one p20">
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
    </>
  );
};

export default Index;
