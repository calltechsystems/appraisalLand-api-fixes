import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios, { all } from "axios";
import { AppraiserStatusOptions } from "../data";
import { FaArchive, FaPause } from "react-icons/fa";
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
    label: "Brokerage Info",
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
  setPropertyId,
  setPropValue,
  setModalOpen,
  setIsCancelProperty,
  setIsHoldProperty,
  isBidded,
  setOpenViewBrokerageModal,
  setSelectedBrokerage
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
    setUserNameSearch("")
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

  const getBrokerName = (userId) => {
    let requiredName = "";
    allBrokers.map((broker, index) => {
      if (String(broker.userId) === String(userId)) {
        requiredName = broker;
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

  const openBrokerageModalView = (currentBrokerage) => {
    if (currentBrokerage?.firstName) {
      setOpenViewBrokerageModal(true);
      setSelectedBrokerage({ ...currentBrokerage });
    } else {
      toast.error("No Info found.");
    }
  };

  const isLikeUserSearchedType = (userInfo) => {
    const searchFrom = String(userInfo.assistantFirstName).toLowerCase();
    const searchFrom2 = String(userInfo.assistantLastName).toLowerCase();
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
  //----
  const openBrokerageViewModal = (brokerageuserId) => {
    const brokerageInfo =
      allBrokers.filter((brokerage) => brokerage.userId == brokerageuserId) || [];
    if (brokerageInfo.length) {
      setSelectedBrokerage({ ...brokerageInfo[0] });
      setOpenViewBrokerageModal(true);
    } else {
      toast.error("User Doesnt Exist or No info present.");
    }
  };

  useEffect(() => {
    const getData = () => {
      properties.map((property, index) => {
        const isBidded = getBidOfProperty(property.orderId);
        const isHold = property.isOnHold;
        const isCancel = property.isOnCancel;
        const isStatus = getPropertyStatusHandler(property);
        const showUser = getBrokerName(property.userId);
        const isCorrect = isAccordingToStatus(isStatus, property);
        const isAccordingToSelectedName = isLikeUserSearchedType(showUser);
        const isEditable = isStatus === 0 ? true : false;
        if (!property.isArchive && isAccordingToSelectedName && isCorrect) {
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
                    Status
                    <span className="m-1">
                      <i class="fa fa-info-circle" aria-hidden="true"></i>
                    </span>
                  </span>
                </div>
              ) : isBidded.$id &&
                isBidded.status === 1 &&
                isBidded.orderStatus === 1 &&
                isBidded.orderStatus !== undefined ? (
                // <span className="btn bg-warning  w-100">
                //   {getOrderValue(isBidded.orderStatus)} -
                //   {formatDate(isBidded.statusDate)}
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
                        {getOrderValue(isBidded.orderStatus)} -
                        {formatDate(isBidded.statusDate)}
                      </li>
                    </ul>
                  </div>
                  <span className="btn btn-status w-100">
                    Status
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
                  onClick={() => openBrokerageModalView(showUser)}
                >
                  {showUser.firstName == ""
                      ? "N.A."
                      : `${showUser.firstName} ${showUser.lastName}`}
                </button>
              </a>
            ),
            actions_01: (
              <ul>

                {isBidded.status >= 0 ? <li title="Quotes">
                  <Link
                    className="btn btn-color-table"
                    href={`/admin-property-quotes/${property.orderId}`}
                  >
                    <span className="flaticon-invoice"></span>
                  </Link>
                </li> : ''}

              </ul>
            ),
          };
          tempData.push(updatedRow);
        }
      });
      setIsEdited(false);
      setUpdatedData(tempData);
    };
    getData();
  }, [properties, allBids, isEdited, allBrokers, userNameSearch]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: userData.token,
    };

    axios
      .get("/api/getAllBrokerageProperties", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        toast.dismiss();
        setDataFetched(true);
        const temp = res.data.data.result.$values;
        let tempProperties = [];

        temp.map((prop, index) => {
          const allMentionedProp = prop.$values;
          allMentionedProp.map((singleProp, idx) => {
            tempProperties.push(singleProp);
          });
        });
        axios
          .get("/api/getAllBids", {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          })
          .then((res) => {
            tempBids = res.data.data.$values;
            setProperties(tempProperties);
            setBids(tempBids);
            axios
              .get("/api/getAllBrokers", {
                headers: {
                  Authorization: `Bearer ${data.token}`,
                },
              })

              .then((res) => {
                let allbroker = res.data.data.$values;
                axios
                  .get("/api/getAllBrokerageCompany", {
                    headers: {
                      Authorization: `Bearer ${data.token}`,
                    },
                  })
                  .then((res) => {
                    const allbrokerage = res.data.data.result.$values;
                    let updated = allbroker;
                    allbrokerage.map((user, index) => {
                      updated.push(user);
                    });
                    // console.log(allbroker);

                    setAllBrokers(updated);
                  })
                  .catch((err) => {
                    setErrorMessage(err?.response?.data?.error);
                    setModalIsOpenError(true);
                  });
              })
              .catch((err) => {
                setErrorMessage(err?.response?.data?.error);
                setModalIsOpenError(true);
              });
          })
          .catch((err) => {
            toast.error(err);
            setDataFetched(false);
          });
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response?.data?.error);
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
