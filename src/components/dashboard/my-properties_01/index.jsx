import Header from "../../common/header/dashboard/Header";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu";
import MobileMenu from "../../common/header/MobileMenu_02";
import TableData from "./TableData";
import Filtering from "./Filtering";
import FilteringBy from "./FilteringBy";
import Pagination from "./Pagination";
import SearchBox from "./SearchBox";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";
import Exemple from "./Exemple";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [property, setProperty] = useState("");
  const [filterProperty, setFilterProperty] = useState("");
  const [filterQuery, setFilterQuery] = useState("Last 30 Days");
  const [properties, setProperties] = useState([]);

  const router = useRouter();

  const openModal = (property) => {
    setProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const filterProperties = (propertys, searchInput) => {
      if (searchInput === "") {
        return propertys;
      }
      const filteredProperties = propertys.filter((property) => {
        // Convert the search input to lowercase for a case-insensitive search
        const searchTerm = searchInput.toLowerCase();

        // Check if any of the fields contain the search term
        return (
          //implment search over this only
          String(property.orderId).toLowerCase().includes(searchTerm) ||
          property.zipCode.toLowerCase().includes(searchTerm) ||
          property.city.toLowerCase().includes(searchTerm) ||
          property.province.toLowerCase().includes(searchTerm)
        );
      });

      return filteredProperties;
    };
    const filteredData = filterProperties(properties, searchInput);
    setFilterProperty(filteredData);
  }, [searchInput]);

  const filterData = (tempData) => {
    const currentDate = new Date();
    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    switch (filterQuery) {
      case "Last 30 Days":
        const thirtyDaysAgo = new Date(currentDate);
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        return tempData.filter(
          (item) => new Date(item.addedDatetime) >= thirtyDaysAgo
        );
      case "Last 1 month":
        const oneMonthAgo = new Date(currentDate);
        oneMonthAgo.setMonth(currentDate.getMonth() - 1);
        return tempData.filter(
          (item) => new Date(item.addedDatetime) >= oneMonthAgo
        );
      case "Last 6 months":
        const sixMonthsAgo = new Date(currentDate);
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
        return tempData.filter(
          (item) => new Date(item.addedDatetime) >= sixMonthsAgo
        );
      case "Last 1 year":
        return tempData.filter(
          (item) => new Date(item.addedDatetime) >= oneYearAgo
        );
      default:
        return tempData; // Return all data if no valid timeFrame is specified
    }
  };

  useEffect(() => {
    const tmpData = filterData(properties);
    setProperties(tmpData);
  }, [filterQuery]);

  const handleDelete = () => {
    const data = JSON.parse(localStorage.getItem("user"));

    toast.loading("deleting this property");
    axios
      .delete("/api/deleteBrokerPropertyById", {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        params: {
          propertyId: property.propertyId,
        },
      })
      .then((res) => {
        setRerender(true);
      })
      .catch((err) => {
        toast.error(err);
      });
    toast.dismiss();
    closeModal();
  };

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data) {
      router.push("/login");
    } else if (!data?.broker_Details?.firstName) {
      router.push("/my-profile");
    }
    if (!data) {
      router.push("/login");
    }
    const fetchData = () => {
      if (data) {
        setUserData(data);
      }
    };
    fetchData();
  }, []);

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
        <div
          className="container-fluid ovh"
          style={{ marginLeft: "-10px", marginTop: "" }}
        >
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

                {/* <div className="col-lg-4 col-xl-4 mb10">
                  <div className="breadcrumb_content style2 mb30-991">
                    <h2 className="breadcrumb_title">My Properties</h2>
                    <p>We are glad to see you again!</p>                                                            
                  </div>
                </div> */}
                {/* End .col */}

                <div className="col-lg-12 col-xl-12">
                  <div className="candidate_revew_select style2 mb30-991">
                    <ul className="mb0">
                      <li className="list-inline-item">
                        <Filtering setFilterQuery={setFilterQuery} />
                      </li>
                      <li className="list-inline-item">
                        <FilteringBy setFilterQuery={setFilterQuery} />
                      </li>
                      <li className="list-inline-item">
                        <div className="candidate_revew_search_box course fn-520">
                          <SearchBox setSearchInput={setSearchInput} />
                        </div>
                      </li>
                      {/* End li */}

                      {/* <li className="list-inline-item">
                        <Filtering setFilterQuery={setFilterQuery} />
                      </li> */}
                      {/* End li */}
                    </ul>
                  </div>
                </div>
                {/* End .col */}

                <div className="col-lg-12">
                  <div className="my_dashboard_review mb40">
                    <div className="property_table">
                      <div className="table-responsive mt0">
                        {/* <TableData
                          userData={userData}
                          open={openModal}
                          close={closeModal}
                          setProperties={setProperties}
                          properties={
                            searchInput === "" ? properties : filterProperty
                          }
                        /> */}
                      </div>
                      {/* End .table-responsive */}

                      {/* End .mbp_pagination */}
                    </div>
                    {/* End .property_table */}
                  </div>
                </div>
                <Exemple />

                {/* End .col */}
              </div>

              <div className="row">
                <div className="col-lg-12 mt20">
                  <div className="mbp_pagination">
                    <Pagination
                      properties={properties}
                      setProperties={setProperties}
                    />
                  </div>
                </div>
                {/* End paginaion .col */}
              </div>
              {/* End .row */}
            </div>
            {/* End .row */}

            <div className="row mt50">
              <div className="col-lg-12">
                <div className="copyright-widget text-center">
                  <p>© 2020 Find House. Made with love.</p>
                </div>
              </div>
            </div>
            {/* End .col */}
            {isModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <h3 className="text-center">Delete Confirmation</h3>
                  <h5 className="text-center">
                    Are you sure you want to delete the property :{" "}
                    {property.area} ?
                  </h5>
                  {/* <p>Are you sure you want to delete the property: {property.area}?</p> */}
                  <div className="text-center" style={{}}>
                    <button
                      className="btn w-35 btn-thm3 m-2"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                    <button className="btn w-35 btn-white" onClick={closeModal}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
