import Header from "../../common/header/dashboard/HeaderAdmin";
import SidebarMenu from "../../common/header/dashboard/SidebarMenuAdmin";
import MobileMenu from "../../common/header/MobileMenuAdmin";
import FeaturedItem from "./PricingMonthly";
import { useEffect, useState } from "react";
import Modal from "./MonthlyModal";
import toast from "react-hot-toast";
import axios from "axios";
import { Router, useRouter } from "next/router";
// import Modal_01 from "./YearlyModal";

const Index = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [planData, setPlanData] = useState([]);
  const [editPlan, setEditPlan] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/getAllPlans", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const tempPlans = res.data.data.$values;
        let selectivePlansAccordingToUser = [];
        tempPlans.map((plan, index) => {
          if (String(plan.userType) === "2") {
            selectivePlansAccordingToUser.push(plan);
          }
        });
        setPlanData(selectivePlansAccordingToUser);
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, [Router]);
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
        <div className="container-fluid container-padding ovh">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">
                <div className="our-listing bgc-f7 pb30-991 md-mt0 ">
                  <div className="container-fluid">
                    <div className="col-lg-12 col-xl-12 text-center mt-1 mb-5">
                      <div className="style2 mb30-991">
                        <h3 className="heading-forms">
                          Mortgage Brokerage Plans
                        </h3>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 col-lg-12">
                        <div className="row">
                          <FeaturedItem
                            data={planData}
                            setEditPlan={setEditPlan}
                            editPlan={editPlan}
                            setModalOpen={openModal}
                          />
                          <Modal
                            modalOpen={modalOpen}
                            closeModal={closeModal}
                            editPlan={editPlan}
                          />
                        </div>
                        {/* End .row */}
                      </div>
                      {/* End  page conent */}
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
