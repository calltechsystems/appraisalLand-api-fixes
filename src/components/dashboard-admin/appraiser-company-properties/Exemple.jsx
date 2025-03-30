import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios, { all } from "axios";
import { AppraiserStatusOptions } from "../data";
import { FaArchive, FaEye, FaPause } from "react-icons/fa";
import Image from "next/image";

const headCells = [
  {
    id: "order_id",
    numeric: false,
    label: "Property ID",
    width: 110,
  },

  {
    id: "broker",
    numeric: false,
    label: "Appraiser Company Info",
    width: 200,
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
    width: 170,
  },
  {
    id: "appraisal_status",
    numeric: false,
    label: "Appraisal Status",
    width: 170,
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
  openModalBroker,
  open,
  setModalIsPopupOpen,
  close,
  filterQuery,
  searchInput,
  properties,
  onHoldHandler,
  onCancelHandler,
  userNameSearch,
  statusSearch,
  refresh,
  setRefresh,
  setProperties,
  setOpenPlanModal,
  setViewPlanData,
  setCurrentProperty,
  setFilterQuery,
  setSearchInput,
  setPropertyId,
  setPropValue,
  setBids,
  allBids,
  setModalOpen,
  allAppraisers,
  setAllAppraisers,
  setUserNameSearch,
  setStatusSearch,
  setIsCancelProperty,
  setIsHoldProperty,
  isBidded,
  setOpenBidViewModal,
  setCurrentBidInfo,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [show, setShow] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [remarkModal, setRemarkModal] = useState(false);
  const [remark, setRemark] = useState("N.A.");
  const [selectedProperty, setSelectedProperty] = useState(null);
  let tempData = [];

  useEffect(() => {
    if (refresh === true) {
      setSearchInput("");
      setFilterQuery("All");
      setUserNameSearch("");
      setStatusSearch(0);
    }
  }, [refresh]);

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
      hour12: true,
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  const formatDateNew = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: true,
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  const checkAlreadythere = (data, orderId) => {
    let isPresent = false;
    data.map((row, index) => {
      if (String(row.orderId) === String(orderId)) {
        isPresent = true;
      }
    });
    return isPresent;
  };

  const getBidOfProperty = (orderId) => {
    let allBid = [];

    allBids.map((bid, index) => {
      if (String(bid.orderId) === String(orderId)) {
        allAppraisers.map((appraiser, idx) => {
          if (
            String(appraiser.userId) === String(bid.appraiserUserId) &&
            !checkAlreadythere(allBid, bid.orderId)
          ) {
            allBid.push(bid);
          }
        });
      }
    });

    return allBid;
  };

  const refreshHandler = () => {
    setProperties([]);
    setBids([]);
    setRefresh(true);
  };

  const openRemarkModal = (property, isBidded) => {
    setRemark(isBidded && isBidded.remark ? isBidded.remark : "N.A.");
    setSelectedProperty(property);
    setRemarkModal(true);
  };

  const closeRemarkModal = () => {
    setRemarkModal(false);
    setRemark("N.A.");
    setSelectedProperty(null);
  };

  const getAppraiser = (userId) => {
    let requiredName = "";
    allAppraisers.map((appraiser, index) => {
      if (String(appraiser.userId) === String(userId)) {
        requiredName = appraiser;
      }
    });
    return requiredName;
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

  const openBrokerModalView = (appraiserId) => {
    const selectedAppraiser = getAppraiser(appraiserId);
    openModalBroker(selectedAppraiser, 2);
  };

  const showBidInfo = (bid) => {
    setOpenBidViewModal(true);
    setCurrentBidInfo(bid);
  };

  const isLikeUserSearchedType = (userInfo) => {
    const searchFrom = String(userInfo.appraiserCompanyName).toLowerCase();
    const serachWith = String(userNameSearch).toLowerCase();
    if (
      userNameSearch === "" ||
      searchFrom.includes(serachWith)
    ) {
      return true;
    }
    return false;
  };

  const isAccordingToStatus = (bidStatus, property, isBidded) => {
    if (isBidded.status === 2) return false;
    if (String(statusSearch) === "0") return true;
    if (property.isOnHold && String(statusSearch) === "6") {
      return true;
    }
    if (property.isOnCancel && String(statusSearch) === "5") {
      return true;
    }
    if (String(bidStatus) === "2" && String(statusSearch) === "1") {
      return true;
    }
    if (String(bidStatus) === "3" && String(statusSearch) === "2") {
      return true;
    }
    if (String(bidStatus) === "1" && String(statusSearch) === "3") {
      return true;
    }
    if (String(bidStatus) === "0" && String(statusSearch) === "4") {
      return true;
    }

    return false;
  };

  useEffect(() => {
    const getData = () => {
      properties.map((property, index) => {
        const allListedBids = getBidOfProperty(property.orderId);
        allListedBids?.map((isBidded, index) => {
          const isHold = property.isOnHold;
          const isCancel = property.isOnCancel;
          const showUser = getAppraiser(isBidded.appraiserUserId);
          const isCorrect = isLikeUserSearchedType(showUser);
          const isStatus = getPropertyStatusHandler(property);
          const toSelectedStatus = isAccordingToStatus(
            isStatus,
            property,
            isBidded
          );
          if (!property.isArchive && toSelectedStatus && isCorrect) {
            const updatedRow = {
              order_id: property.orderId,
              sub_date: formatDate(property.addedDatetime),
              quote_required_by: property.quoteRequiredDate
                ? formatDateNew(property.quoteRequiredDate)
                : formatDateNew(property.addedDatetime),
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
                  <span className="btn bg-info w-100 text-light">
                    Cancelled
                  </span>
                ),
              appraisal_status:
                isHold || isCancel ? (
                  <button className="btn btn-warning w-100">
                    {isHold ? "N.A." : "N.A."}
                  </button>
                ) : isBidded.orderStatus !== 1 &&
                  isBidded.orderStatus !== null &&
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
              type_of_building: property.typeOfBuilding,
              amount: `$ ${addCommasToNumber(property.estimatedValue)}`,
              purpose: property.purpose,
              type_of_appraisal: property.typeOfAppraisal,
              lender_information: property.lenderInformation
                ? property.lenderInformation
                : "N.A.",
              urgency: property.urgency === 0 ? "Rush" : "Regular",
              broker: (
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
                      openBrokerModalView(isBidded.appraiserUserId)
                    }
                  >
                    {!showUser.appraiserCompanyName
                      ? "N.A."
                      : `${showUser.appraiserCompanyName}`}
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
            tempData.push(updatedRow);
          }
        });
      });
      setIsEdited(false);
      setUpdatedData(tempData);
    };
    getData();
  }, [properties, allAppraisers, isEdited, userNameSearch]);

  useEffect(() => {
    setAllAppraisers([]);
    setProperties([]);
    setBids([]);
    const data = JSON.parse(localStorage.getItem("user"));

    axios
      .get("/api/getAllListedProperties", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        toast.dismiss();
        setDataFetched(true);
        const AllMentionedProperties = res.data.data.properties.$values;

        axios
          .get("/api/getAllBids", {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          })
          .then((result) => {
            tempBids = result.data.data.$values;

            setBids(tempBids);
            setProperties(AllMentionedProperties);
          })
          .catch((err) => {
            toast.error(err);
            setDataFetched(false);
            // setModalIsOpenError(true);
          });
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response?.data?.error);
      });

    axios
      .get("/api/getAllAppraiserCompanies", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })

      .then((res) => {
        let allappraiser = res.data.data.result.$values;
        setAllAppraisers(allappraiser);
      })
      .catch((err) => {});

    setSearchInput("");
    setFilterQuery("All");

    let tempBids = [];

    setRefresh(false);
  }, [refresh]);
  return (
    <>
      {updatedData && (
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
      )}

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
