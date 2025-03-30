import Header from "../../common/header/dashboard/Header_02";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu_01";
import MobileMenu from "../../common/header/MobileMenu_01";
import Pagination from "./Pagination";
import SearchBox from "./SearchBox";
import BreadCrumb2 from "./BreadCrumb2";
import FeaturedItem from "./FeaturedItem";
import FilterTopBar from "../../common/listing/FilterTopBar";
import ShowFilter from "../../common/listing/ShowFilter";
import SidebarListing from "../../common/listing/SidebarListing";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [lowRangeBid, setLowRangeBid] = useState("");
  const [propertyId, setPropertyId] = useState(null);

  const router = useRouter();

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

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

      <div className="dashboard_sidebar_menu">
        <div
          className="offcanvas offcanvas-dashboard offcanvas-start"
          tabIndex="-1"
          id="DashboardOffcanvasMenu"
          data-bs-scroll="true"
        >
          <SidebarMenu />
        </div>
      </div>
      {/* End sidebar_menu */}

      {/* <!-- Our Dashbord --> */}
      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div className="container-fluid ovh">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">
                {/* Start Dashboard Navigation */}
                {/* <div className="col-lg-12">
                  <div className="dashboard_navigationbar dn db-1024">
                    <div className="dropdown">
                      <button
                        className="dropbtn"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#DashboardOffcanvasMenu"
                        aria-controls="DashboardOffcanvasMenu"
                      >
                        <i className="fa fa-bars pr10"></i> Dashboard Navigation
                      </button>
                    </div>
                  </div>
                </div> */}
                {/* End Dashboard Navigation */}

                <div className="our-listing bgc-f7 pb30-991 md-mt0 ">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-6">
                        <BreadCrumb2 />
                      </div>
                      {/* End .col */}

                      <div className="col-lg-6 position-relative">
                        {/* <div className="listing_list_style mb20-xsd tal-991">
                          <GridListButton />
                        </div> */}
                        {/* End list grid */}

                        <div className="dn db-991 mt100 mb0">
                          <ShowFilter />
                        </div>
                        {/* ENd button for mobile sidebar show  */}
                      </div>
                      {/* End .col filter grid list */}
                    </div>
                    {/* End Page Breadcrumb and Grid,List and filter Button */}

                    <div className="row">
                      <div className="col-md-12 col-lg-8">
                        <div className="grid_list_search_result ">
                          <div className="row align-items-center">
                            <FilterTopBar />
                          </div>
                        </div>
                        {/* End .row */}
                        {/* End .row */}

                        <div className="row">
                          <FeaturedItem
                            setModalOpen={openModal}
                            close={closeModal}
                            setLowRangeBid={setLowRangeBid}
                            setPropertyId={setPropertyId}
                          />
                          <Modal
                            modalOpen={modalOpen}
                            closeModal={closeModal}
                            lowRangeBid={lowRangeBid}
                            propertyId={propertyId}
                          />
                        </div>
                        {/* End .row */}

                        <div className="row">
                          <div className="col-lg-12 mt20">
                            <div className="mbp_pagination">
                              {/* <Pagination /> */}
                            </div>
                          </div>
                          {/* End paginaion .col */}
                        </div>
                        {/* End .row */}
                      </div>
                      {/* End  page conent */}

                      <div className="col-lg-4 col-xl-4">
                        <div className="sidebar-listing-wrapper">
                          <SidebarListing />
                        </div>
                        {/* End SidebarListing */}

                        <div
                          className="offcanvas offcanvas-start offcanvas-listing-sidebar"
                          tabIndex="-1"
                          id="sidebarListing"
                        >
                          <div className="offcanvas-header">
                            <h5 className="offcanvas-title">Advanced Search</h5>
                            <button
                              type="button"
                              className="btn-close text-reset"
                              data-bs-dismiss="offcanvas"
                              aria-label="Close"
                            ></button>
                          </div>
                          {/* End .offcanvas-heade */}

                          <div className="offcanvas-body">
                            <SidebarListing />
                          </div>
                        </div>
                        {/* End mobile sidebar listing  */}
                      </div>
                      {/* End sidebar conent */}
                    </div>
                    {/* End .row */}
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row mt50">
                <div className="col-lg-12">
                  <div className="copyright-widget-dashboard text-center">
                    <p>
                      &copy; {new Date().getFullYear()} Appraisal Land. All
                      Rights Reserved.
                    </p>
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End .col */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
