import Header from "../../common/header/dashboard/HeaderAdmin";
import SidebarMenu from "../../common/header/dashboard/SidebarMenuAdmin";
import MobileMenu from "../../common/header/MobileMenuAdmin";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Router, useRouter } from "next/router";
import DetailedInfo from "./DetailedInfo";
import AddTopUp from "./AddTopUp";
import Image from "next/image";
import Link from "next/link";
// import Modal_01 from "./YearlyModal";

const Index = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [planData, setPlanData] = useState([]);
  const [editPlan, setEditPlan] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
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
          if (String(plan.userType) === "4") {
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
                        <h3 className="heading-forms">Add Topup Properties</h3>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 col-lg-12">
                        <div className="my_dashboard_review row">
                          {/* <DetailedInfo /> */}
                          <AddTopUp
                            setModalMessage={setModalMessage}
                            setModalIsOpen={setModalIsOpen}
                            setIsError={setIsError}
                          />
                        </div>
                        {modalIsOpen && (
                          <div className="modal">
                            <div
                              className="modal-content"
                              style={{
                                borderColor: isError ? "#2e008b" : "#2e008b", // Red for error, blue for success
                                width: "25%",
                              }}
                            >
                              <div className="row">
                                <div className="col-lg-12">
                                  <Link href="/" className="">
                                    <Image
                                      width={50}
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
                                      }}
                                    >
                                      Appraisal
                                    </span>
                                    <span
                                      style={{
                                        color: "#97d700",
                                        fontWeight: "bold",
                                        fontSize: "24px",
                                      }}
                                    >
                                      {" "}
                                      Land
                                    </span>
                                  </Link>
                                </div>
                              </div>

                              {/* Dynamic Heading */}
                              <h3
                                className="text-center"
                                style={{
                                  color: isError ? "#2e008b" : "#2e008b",
                                }}
                              >
                                {isError ? "Error" : "Success"}
                              </h3>

                              <div
                                className="mb-2"
                                style={{
                                  border: `2px solid ${
                                    isError ? "#97d700" : "#97d700"
                                  }`,
                                }}
                              ></div>

                              {/* Dynamic Message */}
                              <p className="text-center fs-5 fw-bold">
                                {modalMessage}
                              </p>

                              <div
                                className="mb-2"
                                style={{
                                  border: `2px solid ${
                                    isError ? "#97d700" : "#97d700"
                                  }`,
                                }}
                              ></div>

                              <div
                                className="col-lg-12 text-center"
                                style={{ marginRight: "4%" }}
                              >
                                <button
                                  className="btn btn-color w-25"
                                  onClick={() => setModalIsOpen(false)}
                                >
                                  Ok
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

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
