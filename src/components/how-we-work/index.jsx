import CopyrightFooter from "../common/footer/CopyrightFooter";
import Footer from "../common/footer/Footer";
import Header from "../common/header/DefaultHeader_01";
import MobileMenu from "../common/header/MobileMenu";
import Partners from "../common/Partners";
import WhyChoose from "../common/WhyChoose";
import Testimonial from "../home-7/Testimonial";
import BreadCrumbBanner from "./BreadCrumbBanner";
import Team from "./Team";
import OurMission from "./OurMission";
import Image from "next/image";
import TermsCondions from "./TermsCondions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Index = () => {
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
  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header />

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      {/* <!-- Inner Page Breadcrumb --> */}
      <BreadCrumbBanner />

      {/* <!-- About Text Content --> */}
      <div className="about-section" style={{  }}>
        {/* <div className="container"> */}
        <div className="row">
          <div className="col-lg-12">
            <div
              className="main-title text-center mt-2"
              style={{
                backgroundColor: "#2e008b",
                color: "white",
                paddingTop: "10px",
                paddingBottom: "2px"
              }}
            >
              <h2 className="text-light">How that works</h2>
            </div>
          </div>
        </div>
        {/* End .row */}

        <div className="container mb-5 bgc-f7">
          <div className="row">
            {/* <OurMission /> */}
            <TermsCondions />
          </div>
        </div>
        {/* End .row */}

        {/* <!-- Property Search --> */}
        <section
          id="property-search"
          className="property-search home1-overlay bg-img4"
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="search_smart_property text-center">
                <h2 className="text-light">
                  Appraising properties, simplifying the appraisal process.
                </h2>
                <p className="text-light">
                  Throughout the home appraisal process of appraisal link serves
                  as a point of contact between the broker and the appraiser.
                </p>
                <Link href="/sign-up" className="my_profile_setting_input">
                  <button className="btn btn2">Register</button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

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
