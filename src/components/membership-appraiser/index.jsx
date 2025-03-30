import { useEffect, useState } from "react";
import CopyrightFooter from "../common/footer/CopyrightFooter";
import Footer from "../common/footer/Footer";
import Header from "../common/header/DefaultHeader_01";
import MobileMenu from "../common/header/MobileMenu";
import Pricing from "./Pricing";
import Modal from "./Modal";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";
import Package from "./Package";
import BreadCrumbBanner from "./BreadCrumbBanner";

// import Header from "../home/Header";

const Index = () => {
  const [isSelected, setSelected] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("Monthly");
  const [modalOpen, setModalOpen] = useState(false);
  const [planData, setPlanData] = useState([]);
  const [price, setPrice] = useState({
    title: "Basic",
    price: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/getAllPlans", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setPlanData(res.data.data.$values);
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, [router]);

  const [isChecked, setIsChecked] = useState(false);

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
  };
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const togglePlan = () => {
    setSelectedPlan(selectedPlan === "Monthly" ? "Yearly" : "Monthly");
  };

  const changePlan = (newPlan) => {
    console.log(newPlan);
    if (String(newPlan) === "Monthly") {
      setSelected(1);
    } else {
      setSelected(2);
    }
    console.log("selected ", isSelected);
    setSelectedPlan(newPlan);
  };

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header />

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      {/* <!-- Modal --> */}

      {/* <!-- Inner Page Breadcrumb --> */}
      <BreadCrumbBanner />

      {/* <!-- Service Section Area --> */}
      <div className="our-dashbord" style={{}}>
        <div className="ovh">
          <div className="row">
            <div className="col-lg-12 col-lg-6 maxw100flex-992">
              <div className="main-title text-center mt-2">
                <h2
                  className=""
                  style={{
                    backgroundColor: "#2e008b",
                    color: "white",
                    padding: "20px",
                  }}
                >
                  Ready to get started?
                </h2>

                {/* <div className="toggleContainer mt-3">
                  <span
                    className="fw-bold text-dark"
                    style={{ fontSize: "20px" }}
                  >
                    Yearly
                  </span>
                  <div style={{ width: "24%", height: "70%" }}>
                    <label
                    // className={`toggleLabel ${selectedPlan}`}
                    // onClick={togglePlan}
                    >
                      <div className="toggle-switch">
                        <label className="switch">
                          <input
                            type="checkbox"
                            onClick={togglePlan}
                            checked={isChecked}
                            onChange={toggleSwitch}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </label>
                  </div>

                  <span
                    className="text-dark fw-bold"
                    style={{ fontSize: "20px" }}
                  >
                    Monthly
                  </span>
                </div> */}
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="container">
            <div className="row">
              <Package
                isPlan={selectedPlan}
                setModalOpen={setModalOpen}
                setPrice={setPrice}
                data={planData}
                selectedplan={selectedPlan}
              />
              {/* <Pricing
                isPlan={selectedPlan}
                setModalOpen={setModalOpen}
                setPrice={setPrice}
                data={planData}
                selectedplan={selectedPlan}
              /> */}
              <Modal
                modalOpen={modalOpen}
                closeModal={closeModal}
                price={price}
                selectedPlan={selectedPlan}
              />
              {/* <Pricing hideButton={false}/> */}
            </div>
          </div>
          {/* End .row */}
        </div>
      </div>

      {/* <!-- Property Search --> */}
      <section
        id="property-search"
        className="property-search home1-overlay bg-img5"
      >
        <div className="row">
          <div className="col-lg-12">
            <div className="search_smart_property text-center">
              <h2 className="text-light">
                Having trouble finding what you want?
              </h2>
              <p className="text-light">
                To learn more about the plans available and how to tailor your
                Appraisal Link membership to maximize your earning potential,
                speak with a product consultant.
              </p>
              <Link href="/contact">
                <button className="btn ssp_btn">Contact Us</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
