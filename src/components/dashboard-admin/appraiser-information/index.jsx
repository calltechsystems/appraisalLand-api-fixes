import Header from "../../common/header/dashboard/Header";
import SidebarMenu from "../../common/header/dashboard/SidebarMenuAdmin";
import MobileMenu from "../../common/header/MobileMenuAdmin";
import Filtering from "./Filtering";
import AllStatistics from "./AllStatistics";
import StatisticsChart from "./StatisticsChart";
import StatisticsPieChart from "./StatisticsPieChart";
import PackageData from "./PackageData";
import { useRouter } from "next/router";
import SearchUser from "./SearchUser";

const Index = () => {
  // let userData =(JSON.parse(localStorage.getItem("user"))) ;
  // const router = useRouter();

  // if (!userData) {
  //   router.push("/login");
  // } else if (!userData?.broker_Details?.firstName) {
  //   router.push("/my-profile");
  // }

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

                <div
                  className="col-lg-12 mb10"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">
                      {"firstName"} {"lastName"}
                    </h2>
                    <p>We are glad to see you again!</p>
                  </div>
                  <div>
                    <Filtering />
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-lg-6">
                  <div className="row">
                    <AllStatistics />
                  </div>
                  <div className="application_statics">
                    <h4 className="mb-4">View Statistics</h4>
                    <StatisticsChart />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="application_statics">
                    <h4 className="mb-4">Plan Wise Appraisers</h4>
                    <StatisticsPieChart />
                  </div>
                </div>
              </div>
              {/* End .row Dashboard top statistics */}

              <div className="row mt-5">
                <div className="col-lg-12">
                  <div className="my_dashboard_review mb40">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-8">
                          <h4 className="mt-2">All Brokers</h4>
                        </div>
                        <div className="col-lg-4 mb-2 candidate_revew_search_box">
                          <SearchUser />
                        </div>
                      </div>
                      <div className="packages_table">
                        <div className="table-responsive mt0">
                          <PackageData />
                        </div>
                      </div>
                      {/* End .packages_table */}

                      {/* <div className="pck_chng_btn text-end">
                        <button className="btn btn-lg">Update Package</button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                {/* <div className="col-xl-6">
                  <div className="application_statics">
                    <h4 className="mb-4">View Statistics</h4>
                    <StatisticsChart />
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="application_statics">
                    <h4 className="mb-4">Plan Wise Brokers</h4>
                    <StatisticsPieChart />
                  </div>
                </div> */}

                {/* End statistics chart */}

                {/*<div className="col-xl-5">
                  <div className="recent_job_activity">
                    <h4 className="title mb-4">Recent Activities</h4>
                    <Activities />
                  </div>
                </div>*/}
              </div>
              {/* End .row  */}

              <div className="row mt50">
                <div className="col-lg-12">
                  <div className="copyright-widget text-center">
                    <p>© 2023 Appraisal Link. All Rights Reserved.</p>
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
