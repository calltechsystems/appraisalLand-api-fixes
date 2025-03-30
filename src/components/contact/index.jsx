import Image from "next/image";
import CopyrightFooter from "../common/footer/CopyrightFooter";
import Footer from "../common/footer/Footer";
import Header from "../common/header/DefaultHeader_01";
import MobileMenu from "../common/header/MobileMenu";
import AddressSidebar from "./AddressSidebar";
import BreadCrumbBanner from "./BreadCrumbBanner";
import HeroSlider from "./HeroSlider";
import Form from "./Form";
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
      {/* <BreadCrumbBanner /> */}

      <div className="container-fluid p0">
        <div className="main-banner-wrapper">
          <div className="arrow-style-2 banner-style-one ">
            {/* <div className="home-text text-center">
              <h2 className="fz55">Discover your place to live</h2>
              <p className="fz18 color-white">Get started in few clicks.</p>
            </div> */}
            <HeroSlider />
            <h4
              className="text-light text-center"
              style={{
                marginTop: "-30rem",
                position: "relative",
                paddingBottom: "60px",
              }}
            >
              Our goal is to promptly attend to your requirements, allowing you
              to focus on what&apos;s most important to you: managing your
              business. If you require immediate assistance, please either dial
              one of the numbers provided below or engage with us via our online
              chat platform.
            </h4>
          </div>
        </div>
        {/* <!-- /.main-banner-wrapper --> */}
      </div>
      {/* End .container-fluid */}

      {/* <!-- Our Contact --> */}
      <section className="our-contact pb0 bgc-f7">
        <div className="container" style={{ marginTop: "-70px" }}>
          <div className="row">
            <div className="container">
              <div className="row">
                <AddressSidebar />
              </div>
            </div>

            {/* <div className="col-lg-5 col-xl-4 mb-5"></div> */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}

        {/* <div className="container-fluid p0 mt50">
          <div className="row">
            <div className="col-lg-12">
              <div className="h600" id="map-canvas">
                <div className="gmap_canvas pe-none">
                  <iframe
                    title="map"
                    className="gmap_iframe"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d193309.02147838814!2d-74.53513266718751!3d40.79602810000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1663993365939!5m2!1sen!2sbd"
                  ></iframe> */}
        {/* End iframe */}
      </section>

      <div className="row">
        <div className="col-lg-12">
          <div
            className="main-title text-center mt-2"
            style={{
              backgroundColor: "#2e008b",
              color: "white",
              padding: "15px",
            }}
          >
            <h2 className="text-light">Reach Out With Your Queries </h2>
          </div>
        </div>
      </div>
      {/* End .row */}

      <div className="col-lg-12 mb-5">
        <div className="container">
          <div
            className="row"
            style={{
              boxShadow: "10px 10px 50px 10px rgba(19, 19, 28, 0.52)",
              borderRadius: "0 5px 5px",
            }}
          >
            <div
              className="col-lg-3"
              style={{
                borderRadius: "4px 0 0 4px",
                opacity: "",
                background: "#2e008b",
                // background:
                //   "url(https://i.pinimg.com/originals/02/7e/fd/027efde1602fe8a0a642fafbe5673b42.jpg)",
              }}
            >
              <h3
                className="text-center text-light"
                style={{ marginTop: "13rem", lineHeight: "1.5" }}
              >
                {" "}
                Reach out to our team for any questions or inquiries you have!
              </h3>
            </div>
            <div className="col-lg-9 form_grid">
              <div className="">
                <Form />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End .col */}

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
