import Header from "../../common/header/dashboard/HeaderAdmin";
import SidebarMenu from "../../common/header/dashboard/SidebarMenuAdmin";
import MobileMenu from "../../common/header/MobileMenuAdmin";
import SearchBox from "./SearchBox";
import BreadCrumb2 from "./BreadCrumb2";
import FeaturedItem from "./PricingMonthly";
// import FeaturedItem_01 from "./PricingYearly";
import FilterTopBar from "../../common/listing/FilterTopBar";
import ShowFilter from "../../common/listing/ShowFilter";
import SidebarListing from "../../common/listing/SidebarListing";
import GridListButton from "../../common/listing/GridListButton";
import { useState } from "react";
import Modal from "./MonthlyModal";
// import Modal_01 from "./YearlyModal";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // const [modalOpen_01, setModalOpen_01] = useState(false);

  // const openModal_01 = () => {
  //   setModalOpen_01(true);
  // };

  // const closeModal_01 = () => {
  //   setModalOpen_01(false);
  // };
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

                        {/* <div className="dn db-991 mt30 mb0">
                          <ShowFilter />
                        </div> */}
                        {/* ENd button for mobile sidebar show  */}
                      </div>
                      {/* End .col filter grid list */}
                    </div>
                    {/* End Page Breadcrumb and Grid,List and filter Button */}

                    <div className="row">
                      <div className="col-md-12 col-lg-12">
                        {/* <div className="grid_list_search_result ">
                          <div className="row align-items-center">
                            <FilterTopBar />
                          </div>
                        </div> */}
                        {/* End .row */}
                        {/* End .row */}

                        <div className="row">
                          {/* <h3>Monthly</h3> */}
                          <FeaturedItem setModalOpen={openModal} />
                          {/* <h3>Yearly</h3> */}
                          {/* <FeaturedItem_01 setModalOpen_01={openModal_01}/> */}
                          <Modal
                            modalOpen={modalOpen}
                            closeModal={closeModal}
                          />
                          {/* <Modal_01
                            modalOpen_01={modalOpen_01}
                            closeModal_01={closeModal_01}
                          /> */}
                        </div>
                        {/* End .row */}

                        <div className="row">
                          {/* <div className="col-lg-12 mt20">
                            <div className="mbp_pagination">
                              <Pagination />
                            </div>
                          </div> */}
                          {/* End paginaion .col */}
                        </div>
                        {/* End .row */}
                      </div>
                      {/* End  page conent */}

                      <div className="col-lg-4 col-xl-4">
                        <div className="sidebar-listing-wrapper">
                          {/* <SidebarListing /> */}
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
                  <div className="copyright-widget text-center">
                    <p>©2023 Appraisal Link. All Rights Reserved.</p>
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
