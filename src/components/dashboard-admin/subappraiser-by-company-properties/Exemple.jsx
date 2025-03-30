import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios, { all } from "axios";
import { AppraiserStatusOptions } from "../data";
import { FaEye } from "react-icons/fa";
import Image from "next/image";
const headCells = [
  {
    id: "order_id",
    numeric: false,
    label: "Property ID",
    width: 110,
  },

  {
    id: "appraiserComanyInfo",
    numeric: false,
    label: "Appraiser Company Info",
    width: 200,
  },
  {
    id: "appraiserInfo",
    numeric: false,
    label: "Appraiser Info",
    width: 200,
  },
  {
    id: "plan",
    numeric: false,
    label: "Plan Info",
    width: 100,
  },
  {
    id: "address",
    numeric: false,
    label: "Property Address",
    width: 280,
  },
  {
    id: "status",
    numeric: false,
    label: "Order Status",
    width: 200,
  },
  {
    id: "appraisal_status",
    numeric: false,
    label: "Appraisal Status",
    width: 200,
  },
  {
    id: "remarkButton",
    numeric: false,
    label: "Appraiser Remark",
    width: 170,
  },
  {
    id: "sub_date",
    numeric: false,
    label: "Quote Submitted Date",
    width: 220,
  },
  {
    id: "quote_required_by",
    numeric: false,
    label: "Appraisal Report Required By",
    width: 220,
  },
  {
    id: "urgency",
    numeric: false,
    label: "Request Type",
    width: 140,
  },

  {
    id: "type_of_building",
    numeric: false,
    label: "Property Type",
    width: 140,
  },
  {
    id: "amount",
    numeric: false,
    label: "Estimated Value / Purchase Price",
    width: 150,
  },
  {
    id: "purpose",
    numeric: false,
    label: "Purpose",
    width: 130,
  },
  {
    id: "type_of_appraisal",
    numeric: false,
    label: "Type Of Appraisal",
    width: 160,
  },
  {
    id: "lender_information",
    numeric: false,
    label: "Lender Information",
    width: 160,
  },

  {
    id: "actions_01",
    numeric: false,
    label: "Action",
    width: 80,
  },
];

export default function Exemple({
  userData,
  archievePropertyHandler,
  start,
  end,
  userNameSearch,
  setUserNameSearch,
  statusSearch,
  setStatusSearch,
  openModalBroker,
  open,
  setModalIsPopupOpen,
  close,
  filterQuery,
  searchInput,
  properties,
  onHoldHandler,
  onCancelHandler,
  refresh,
  setRefresh,
  setProperties,
  setOpenPlanModal,
  setViewPlanData,
  setCurrentProperty,
  setFilterQuery,
  setSearchInput,
  setOpenBidViewModal,
  setCurrentBidInfo,
  setCurrentModalInfoType
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [allBids, setBids] = useState([]);
  const [show, setShow] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [allBrokers, setAllBrokers] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [remarkModal, setRemarkModal] = useState(false);
  const [remark, setRemark] = useState("N.A.");
  const [selectedProperty, setSelectedProperty] = useState(null);
  let tempData = [];

  useEffect(() => {
    if (refresh === true) {
      setSearchInput("");
      setFilterQuery("All");
    }
  }, [refresh]);

  useEffect(() => {
    if (searchInput === "") {
      setProperties([]);
      setBids([]);
      setRefresh(true);
    }
  }, [searchInput]);

  useEffect(() => {
    console.log("userNameSearch", userNameSearch);
    setIsEdited(true);
  }, [userNameSearch, statusSearch]);

  const sortObjectsByOrderIdDescending = (data) => {
    return data.sort((a, b) => b.order_id - a.order_id);
  };

  const getOrderValue = (val) => {
    let title = "";
    AppraiserStatusOptions?.map((status) => {
      if (String(status.id) === String(val)) {
        title = status.type;
      }
    });
    return title;
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      // second: "numeric",
      hour12: true, // Set to false for 24-hour format
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  const formatDateNew = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      // hour: "numeric",
      // minute: "numeric",
      // second: "numeric",
      hour12: true, // Set to false for 24-hour format
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  const getBidOfProperty = (orderId) => {
    let Bid = {};
    allBids.map((bid, index) => {
      if (String(bid.orderId) === String(orderId)) {
        Bid = bid;
      }
    });
    return Bid;
  };

  const refreshHandler = () => {
    setProperties([]);
    setBids([]);
    setRefresh(true);
  };

  const openRemarkModal = (property, isBidded) => {
    // const isBidded = filterBidsWithin24Hours(property);
    setRemark(isBidded && isBidded.remark ? isBidded.remark : "N.A.");
    setSelectedProperty(property);
    setRemarkModal(true);
  };

  const closeRemarkModal = () => {
    setRemarkModal(false);
    setRemark("N.A.");
    setSelectedProperty(null);
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const getPropertyStatusHandler = (property) => {
    let isInProgress = true;
    let isQuoteProvided = false;
    let isCompleted = false;
    let isAccepted = false;
    allBids.map((bid, index) => {
      if (
        bid.orderId === property.orderId &&
        bid.status === 1 &&
        bid.orderStatus === 3 &&
        !property.isOnCancel &&
        !property.isOnHold
      ) {
        isCompleted = true;
      }
      if (
        bid.orderId === property.orderId &&
        bid.status === 1 &&
        !property.isOnCancel &&
        !property.isOnHold
      ) {
        isAccepted = true;
      } else if (
        bid.orderId === property.orderId &&
        !property.isOnCancel &&
        !property.isOnHold
      ) {
        isQuoteProvided = true;
      }
    });
    return isCompleted ? 3 : isAccepted ? 2 : isQuoteProvided ? 1 : 0;
  };

  const getCurrentBrokerPlan = (property) => {
    const data = JSON.parse(localStorage.getItem("user"));
    axios
      .get("/api/getBrokerTransactions", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          userId: property?.userId,
        },
      })
      .then((res) => {
        let allPlans = res.data.data.result.$values;
        let requiredPlan = {};
        allPlans.map((plan, index) => {
          if (
            new Date(plan.endDate) >= new Date() &&
            new Date() >= new Date(plan.startDate)
          ) {
            requiredPlan = plan;
          }
        });

        setViewPlanData(requiredPlan);
        setOpenPlanModal(true);
      })
      .catch((err) => {
        toast.error("Caught Error While Fetching the current Plan");
      });
  };

  const openAppraiserComapnyModalView = (userId, appraiserCompanyInfo, userType) => {
    setCurrentModalInfoType(userType)
    openModalBroker({ ...appraiserCompanyInfo }, 2);
  };

  const isLikeUserSearchedType = (userInfo) => {
    const searchFrom = String(userInfo.officeContactFirstName).toLowerCase();
    const searchFrom2 = String(userInfo.officeContactLastName).toLowerCase();
    const serachWith = String(userNameSearch).toLowerCase();
    if (
      userNameSearch === "" ||
      searchFrom.includes(serachWith) ||
      searchFrom2.includes(serachWith)
    ) {
      return true;
    }
    return false;
  };

  const isAccordingToStatus = (bidStatus, property) => {
    if (String(statusSearch) === "0") return true;
    else if (Boolean(property.isOnHold) && String(statusSearch) === "6") {
      return true;
    } else if (Boolean(property.isOnCancel) && String(statusSearch) === "5") {
      return true;
    } else if (String(bidStatus) === "2" && String(statusSearch) === "1") {
      return true;
    } else if (String(bidStatus) === "3" && String(statusSearch) === "2") {
      return true;
    } else if (String(bidStatus) === "1" && String(statusSearch) === "3") {
      return true;
    } else if (String(bidStatus) === "0" && String(statusSearch) === "4") {
      return true;
    }
  };

  const showBidInfo = (bid) => {
    setOpenBidViewModal(true);
    setCurrentBidInfo(bid);
  };

  useEffect(() => {
    const getData = () => {
      let dataUpdated = [];
      properties?.map((propInfo, index) => {
        const property = propInfo?.property;
        if (!property) return;
        const apprasierInfo = { ...propInfo.appraiser };
        const appraiserCompanyInfo = { ...propInfo.appraiserCompany };

        const isBidded = getBidOfProperty(property?.orderId);
        const isHold = property?.isOnHold;
        const isCancel = property?.isOnCancel;
        const isStatus = getPropertyStatusHandler(property);
        const isCorrect = isAccordingToStatus(isStatus, property);
        const isAccordingToSelectedName =
          isLikeUserSearchedType(appraiserCompanyInfo);
        if (!property?.isArchive && isAccordingToSelectedName && isCorrect) {
          const updatedRow = {
            order_id: property.orderId,
            sub_date: formatDate(property?.addedDatetime),
            quote_required_by: property?.quoteRequiredDate
              ? formatDateNew(property?.quoteRequiredDate)
              : formatDateNew(property?.addedDatetime),
            status:
              isHold || isCancel ? (
                <span className="btn bg-danger text-light w-100">
                  {isHold ? "On Hold" : "Cancelled"}
                </span>
              ) : isStatus === 3 ? (
                <span className="btn btn-completed w-100">Completed</span>
              ) : isStatus === 2 ? (
                <span className="btn bg-success w-100 text-light">
                  Accepted
                </span>
              ) : isStatus === 0 ? (
                <span className="btn bg-primary w-100 text-light">
                  In Progress
                </span>
              ) : isStatus === 1 ? (
                <span className="btn bg-info w-100 text-light">
                  Quote Provided
                </span>
              ) : (
                <span className="btn bg-info w-100 text-light">Cancelled</span>
              ),
            appraisal_status:
              isHold || isCancel ? (
                <button className="btn btn-warning w-100">
                  {isHold ? "N.A." : "N.A."}
                </button>
              ) : isBidded.orderStatus !== 1 &&
                isBidded.orderStatus !== null &&
                isBidded.orderStatus !== undefined ? (
                // <span className="btn bg-warning  w-100">
                //   {getOrderValue(isBidded.orderStatus)}
                // </span>
                <div className="hover-text">
                  <div
                    className="tooltip-text"
                    style={{
                      marginTop: "-60px",
                      marginLeft: "-100px",
                    }}
                  >
                    <ul>
                      <li style={{ fontSize: "15px" }}>
                        {getOrderValue(isBidded.orderStatus)}
                      </li>
                    </ul>
                  </div>
                  <span className="btn btn-status w-100">
                    Current Status
                    <span className="m-1">
                      <i class="fa fa-info-circle" aria-hidden="true"></i>
                    </span>
                  </span>
                </div>
              ) : isBidded.$id &&
                isBidded.status === 1 &&
                isBidded.orderStatus === 1 &&
                isBidded.orderStatus !== undefined ? (
                <div className="hover-text">
                  <div
                    className="tooltip-text"
                    style={{
                      marginTop: "-60px",
                      marginLeft: "-100px",
                    }}
                  >
                    <ul>
                      <li style={{ fontSize: "15px" }}>
                        {getOrderValue(isBidded.orderStatus)} -
                        {formatDate(isBidded.statusDate)}
                      </li>
                    </ul>
                  </div>
                  <span className="btn btn-status w-100">
                    Current Status
                    <span className="m-1">
                      <i class="fa fa-info-circle" aria-hidden="true"></i>
                    </span>
                  </span>
                </div>
              ) : (
                <span className="btn btn-warning w-100">N.A.</span>
              ),
            address: `${property.streetNumber} ${property.streetName}, ${property.city}, ${property.province}, ${property.zipCode}`,
            remark: isBidded.remark ? isBidded.remark : "N.A.",
            // remark: property.remark ? property.remark : "N.A.",
            remarkButton: (
              <li
                className="list-inline-item"
                data-toggle="tooltip"
                data-placement="top"
                title="View Remark"
              >
                <div
                  className="w-100"
                  onClick={() => openRemarkModal(property, isBidded)}
                >
                  <button
                    href="#"
                    className="btn btn-color"
                    style={{ width: "120px" }}
                  >
                    <Link href="#">
                      <span className="text-light">
                        {" "}
                        {/* <FaSms/> */}
                        View
                      </span>
                    </Link>
                  </button>
                </div>
              </li>
            ),
            // user: property.applicantEmailAddress,
            type_of_building: property.typeOfBuilding,
            // amount: ` $ ${millify(property.estimatedValue)}`,
            amount: `$ ${addCommasToNumber(property.estimatedValue)}`,
            purpose: property.purpose,
            type_of_appraisal: property.typeOfAppraisal,
            lender_information: property.lenderInformation
              ? property.lenderInformation
              : "N.A.",
            urgency: property.urgency === 0 ? "Rush" : "Regular",
            appraiserComanyInfo: (
              <a href="#">
                <button
                  className="list-inline-item"
                  style={{
                    border: "0px",
                    color: "#2e008b",
                    textDecoration: "underline",
                    backgroundColor: "transparent",
                  }}
                  onClick={() =>
                    openAppraiserComapnyModalView(
                      property.userId,
                      appraiserCompanyInfo,
                      'Appraiser Company'
                    )
                  }
                >
                  {!appraiserCompanyInfo ||
                  appraiserCompanyInfo.officeContactFirstName == ""
                    ? "N.A."
                    : `${appraiserCompanyInfo.officeContactFirstName} ${appraiserCompanyInfo.officeContactLastName}`}
                </button>
              </a>
            ),
            appraiserInfo: (
              <a href="#">
                <button
                  className="list-inline-item"
                  style={{
                    border: "0px",
                    color: "#2e008b",
                    textDecoration: "underline",
                    backgroundColor: "transparent",
                  }}
                  onClick={() =>
                    openAppraiserComapnyModalView(
                      property.userId,
                      apprasierInfo,
                      'Appraiser'
                    )
                  }
                >
                  {!apprasierInfo ||
                  appraiserCompanyInfo.firstName == ""
                    ? "N.A."
                    : `${appraiserCompanyInfo.firstName} ${appraiserCompanyInfo.lastName}`}
                </button>
              </a>),
            plan: (
              <a href="#">
                <button
                  className=""
                  style={{
                    border: "0px",
                    color: "#2e008b",
                    textDecoration: "underline",
                    // fontWeight: "bold",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => getCurrentBrokerPlan(property)}
                >
                  Plan Details
                </button>
              </a>
            ),
            actions_01: (
              <ul>
                <li title="View Bid for Property">
                  <span
                    className="btn btn-color-table"
                    onClick={() => showBidInfo(isBidded)}
                  >
                    <span className="text-light">
                      <FaEye />
                    </span>
                  </span>
                </li>
              </ul>
            ),
          };
          dataUpdated.push(updatedRow);
        }
      });
      setIsEdited(false);
      setUpdatedData(dataUpdated);
    };
    getData();
  }, [properties, allBids, statusSearch]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: userData.token,
    };

    axios
      .get("/api/getAllSubAppraiserByCompany", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const data = res.data.data.result.$values || [];
        setProperties([...data]);
      });

    axios
      .get("/api/getAllBids", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })
      .then((res) => {
        tempBids = res.data.data.$values;
        setBids(tempBids);
      })
      .catch((err) => {
        toast.error(err);
        setDataFetched(false);
      });

    setSearchInput("");
    setFilterQuery("All");
    setProperties([]);
    setBids([]);

    let tempBids = [];

    setRefresh(false);
  }, [refresh]);
  return (
    <>
      <SmartTable
        title=""
        searchInput={searchInput}
        userNameSearch={userNameSearch}
        setUserNameSearch={setUserNameSearch}
        statusSearch={statusSearch}
        setStatusSearch={setStatusSearch}
        setFilterQuery={setFilterQuery}
        setSearchInput={setSearchInput}
        data={sortObjectsByOrderIdDescending(updatedData)}
        headCells={headCells}
        filterQuery={filterQuery}
        refreshHandler={refreshHandler}
        start={start}
        dataFetched={dataFetched}
        properties={updatedData}
        end={end}
      />

      {remarkModal && (
        <div className="modal">
          <div className="modal-content" style={{ width: "35%" }}>
            <div className="row">
              <div className="col-lg-12">
                <Link href="/" className="">
                  <Image
                    width={50}
                    height={45}
                    className="logo1 img-fluid"
                    style={{ marginTop: "-20px" }}
                    src="/assets/images/logo.png"
                    alt="header-logo2.png"
                  />
                  <span
                    style={{
                      color: "#2e008b",
                      fontWeight: "bold",
                      fontSize: "24px",
                      // marginTop: "20px",
                    }}
                  >
                    Appraisal
                  </span>
                  <span
                    style={{
                      color: "#97d700",
                      fontWeight: "bold",
                      fontSize: "24px",
                      // marginTop: "20px",
                    }}
                  >
                    {" "}
                    Land
                  </span>
                </Link>
              </div>
            </div>
            <h3 className="text-center mt-3" style={{ color: "#2e008b" }}>
              Appraiser Remarks - Property Id{" "}
              <span style={{ color: "#97d700" }}>
                #{selectedProperty?.orderId}
              </span>
            </h3>
            <div className="mb-2" style={{ border: "2px solid #97d700" }}></div>
            <div className="text-center">
              <span className="fs-5 text-dark mt-4 remark-text">{remark}</span>
            </div>
            <div
              className="mb-3 mt-4"
              style={{ border: "2px solid #97d700" }}
            ></div>
            <div className="col-lg-12 d-flex justify-content-center gap-2">
              <button
                // disabled={disable}
                className="btn btn-color w-25"
                onClick={closeRemarkModal}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
