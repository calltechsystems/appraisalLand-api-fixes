import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios, { all } from "axios";
import millify from "millify";
import { AppraiserStatusOptions } from "../create-listing/data";
import {
  FaArchive,
  FaHandHoldingHeart,
  FaHandHoldingUsd,
  FaHandPointer,
  FaPause,
  FaRedo,
  FaEye,
} from "react-icons/fa";
import Image from "next/image";

const headCells = [
  {
    id: "order_id",
    numeric: false,
    label: "Property ID",
    width: 110,
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
    width: 160,
  },
  {
    id: "appraisal_status",
    numeric: false,
    label: "Appraisal Status",
    width: 160,
  },
  {
    id: "remarkButton",
    numeric: false,
    label: "Appraisal Remark",
    width: 170,
  },
  {
    id: "sub_date",
    numeric: false,
    label: "Quote Submitted Date",
    width: 220,
  },
  {
    id: "urgency",
    numeric: false,
    label: "Request Type",
    width: 140,
  },
  {
    id: "quote_required_by",
    numeric: false,
    label: "Appraisal Report Required By",
    width: 220,
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
    label: "Actions",
    width: 110,
  },
];

export default function Exemple({
  userData,
  archievePropertyHandler,
  start,
  end,
  open,
  setModalIsPopupOpen,
  close,
  properties,
  onHoldHandler,
  onCancelHandler,
  filterQuery,
  searchInput,
  refresh,
  setRefresh,
  setProperties,
  setCurrentProperty,
  setFilterQuery,
  setSearchInput,
  setPropertyId,
  setPropValue,
  setModalOpen,
  setIsCancelProperty,
  setIsHoldProperty,
  isBidded,
  setErrorMessage,
  setModalIsOpenError,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [allBids, setBids] = useState([]);
  const [show, setShow] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [remarkModal, setRemarkModal] = useState(false);
  const [remark, setRemark] = useState("N.A.");
  let tempData = [];

  useEffect(() => {
    if (searchInput === "") {
      setProperties([]);
      setBids([]);
      setRefresh(true);
    }
  }, [searchInput]);

  const sortObjectsByOrderIdDescending = (data) => {
    return data.sort((a, b) => b.order_id - a.order_id);
  };

  const filterBidsWithin24Hours = (property) => {
    let tempBid = 0,
      bidValue = {};
    let isAccepted = {};
    bids.filter((bid) => {
      if (bid.orderId === property.orderId) {
        if (bid.status === 1) {
          isAccepted = bid;
        } else {
          bidValue = bid;
        }
        tempBid = tempBid + 1;
      } else {
      }
    });
    return isAccepted.$id ? isAccepted : bidValue;
  };

  const getBidOfProperty = (orderId) => {
    let Bid = {};
    const data = JSON.parse(localStorage.getItem("user"));
    allBids.map((bid, index) => {
      if (
        String(bid.orderId) === String(orderId) &&
        String(data.userId) === String(bid.userId)
      ) {
        Bid = bid;
      }
    });
    return Bid;
  };

  const openRemarkModal = (property) => {
    const isBidded = getBidOfProperty(property.orderId); // Get the isBidded data
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

  const getOrderValue = (val) => {
    let title = "Appraisal Report Writing Completed and Submitted";
    AppraiserStatusOptions?.map((status) => {
      if (String(status.value) === String(val)) {
        title = status.type;
      }
    });
    return title;
  };

  const openModal = (propertyId, value, toggle) => {
    if (String(value) === String(1)) {
      setIsHoldProperty(true);
      setPropertyId(propertyId);
      setPropValue(toggle);
    } else {
      setIsCancelProperty(true);
      setPropertyId(propertyId);
      setPropValue(toggle);
    }
    setModalOpen(true);
  };

  const formatDateTime = (dateString) => {
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

  const formatDate = (dateString) => {
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

  const getStatusButtonClass = (orderStatus) => {
    if (orderStatus === 4 || orderStatus === 5) {
      return "btn btn-status-na w-100"; // Orange color class
    }
    return "btn btn-status w-100"; // Default color
  };

  // For EST date and time

  const refreshHandler = () => {
    setProperties([]);
    setBids([]);
    setFilterQuery("All");
    setSearchInput("");
    setRefresh(true);
  };

  const getPropertyStatusHandler = (property) => {
    let isInProgress = true;
    let isQuoteProvided = false;
    let isCompleted = false;
    let isAccepted = false;
    allBids.map((bid, index) => {
      if (
        bid.orderId === property.orderId &&
        bid.status === 1 &&
        bid.orderstatus === 3
      ) {
        isCompleted = true;
      }
      if (bid.orderId === property.orderId && bid.status === 1) {
        isAccepted = true;
      } else if (bid.orderId === property.orderId) {
        isQuoteProvided = true;
      }
    });
    return isCompleted ? 3 : isAccepted ? 2 : isQuoteProvided ? 1 : 0;
  };

  const openPopupModal = (property) => {
    setModalIsPopupOpen(true);
    setCurrentProperty(property);
  };
  useEffect(() => {
    const getData = () => {
      properties.map((property, index) => {
        const isBidded = getBidOfProperty(property.orderId);
        const isHold = property.isonhold;
        const isCancel = property.isoncancel;
        const isStatus = getPropertyStatusHandler(property);
        const isEditable = isStatus === 0 ? true : false;
        if (isBidded.$id && isStatus === 3) {
          const updatedRow = {
            order_id: property.orderId,
            sub_date: formatDateTime(property.addedDatetime),
            quote_required_by: property.quoteRequiredDate
              ? formatDateTime(property.quoteRequiredDate)
              : formatDateTime(property.addedDatetime),
            status:
              isHold || isCancel ? (
                <span className="btn bg-warning w-100">
                  {isHold ? "On Hold" : "Cancelled"}
                </span>
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
              ) : isStatus === 3 ? (
                <span className="btn btn-completed w-100 text-light">
                  Completed
                </span>
              ) : (
                <span className="btn bg-info w-100 text-light">Cancelled</span>
              ),
            appraisal_status:
              isHold || isCancel ? (
                <button className="btn btn-warning w-100">
                  {isHold ? "N.A." : "N.A."}
                </button>
              ) : isBidded.orderstatus !== 1 &&
                isBidded.orderstatus !== null &&
                isBidded.orderstatus !== undefined ? (
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
                        {getOrderValue(isBidded.orderstatus)}
                      </li>
                    </ul>
                  </div>
                  <button
                    className={getStatusButtonClass(isBidded.orderstatus)}
                  >
                    Status
                    <span className="m-1">
                      <i class="fa fa-info-circle" aria-hidden="true"></i>
                    </span>
                  </button>
                </div>
              ) : isBidded.$id &&
                isBidded.status === 1 &&
                isBidded.orderstatus === 1 &&
                isBidded.orderstatus !== undefined ? (
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
                        {getOrderValue(isBidded.orderstatus)} -{" "}
                        {formatDateTime(isBidded.statusdate)}
                      </li>
                    </ul>
                  </div>
                  <button
                    className={getStatusButtonClass(isBidded.orderstatus)}
                  >
                    Status
                    <span className="m-1">
                      <i class="fa fa-info-circle" aria-hidden="true"></i>
                    </span>
                  </button>
                </div>
              ) : (
                <button className="btn btn-warning w-100">
                  <span>N.A.</span>
                </button>
              ),
            address: `${property.streetNumber}, ${property.streetName}, ${property.city}, ${property.province}, ${property.zipCode}`,
            remarkButton: (
              <li
                className="list-inline-item"
                data-toggle="tooltip"
                data-placement="top"
                title="View Remark"
              >
                <div
                  className="w-100"
                  onClick={() => openRemarkModal(property)}
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
            amount: ` $ ${addCommasToNumber(property.estimatedValue)}`,
            purpose: property.purpose,
            type_of_appraisal: property.typeOfAppraisal,
            lender_information: property.lenderInformation
              ? property.lenderInformation
              : "N.A.",
            urgency: property.urgency === 0 ? "Rush" : "Regular",

            actions_01: (
              // <ul className="view_edit_delete_list mb0">
              <ul className="mb0 d-flex gap-1">
                {/* {!isEditable && ( */}
                <li title="Property Details" className="">
                  {/* <Link href={"#"}>
                      <span
                        className="btn btn-color w-100 mb-1"
                        onClick={() => openPopupModal(property)}
                      >
                        {" "}
                        Property Details{" "}
                      </span>
                    </Link>{" "} */}
                  <span
                    className="btn btn-color-table"
                    onClick={() => openPopupModal(property)}
                  >
                    <Link href={"#"}>
                      <span className="text-light flaticon-view"></span>
                    </Link>
                  </span>
                </li>
                {/* )} */}

                {!isEditable && !isCancel && (
                  <li title="Quotes">
                    {/* <Link href={`/my-property-bids/${property.propertyId}`}>
                      <span className="btn btn-color w-100 mb-1"> Quotes </span>
                    </Link>{" "} */}
                    <Link
                      className="btn btn-color-table"
                      // style={{ marginLeft: "4.3rem" }}
                      href={`/brokerage-properties-bid/${property.orderId}`}
                    >
                      <span className="flaticon-invoice">
                        {/* <FaHandHoldingUsd /> */}
                      </span>
                    </Link>
                  </li>
                )}

                {(isEditable || isStatus === 1) && !isCancel && (
                  <li title="Edit Property">
                    <Link
                      className="btn btn-color-table"
                      href={`/create-listing-1/${property.orderId}`}
                    >
                      <span className="flaticon-edit"></span>
                    </Link>
                  </li>
                )}

                {/* End li */}

                {!isCancel && isStatus !== 3 && isBidded.orderstatus !== 4 && (
                  <li title={!isHold ? "On Hold" : "Remove Hold"}>
                    <button
                      className="btn btn-color-table "
                      style={{ border: "1px solid grey" }}
                      onClick={() =>
                        openModal(property.orderId, 1, isHold ? 0 : property)
                      }
                      title={
                        isHold ? "Remove On Hold Property" : "On Hold Property"
                      }
                    >
                      <Link href="#" className="text-light">
                        {isHold ? (
                          <FaPlay className="text-light" />
                        ) : (
                          <FaPause className="text-light" />
                        )}
                      </Link>
                    </button>
                  </li>
                )}
                {/* )} */}

                {/* {isEditable && ( */}
                {!isCancel && isStatus !== 3 && !isHold && (
                  <li title={"Order Cancel"}>
                    <span
                      className="btn btn-color-table"
                      style={{ border: "1px solid grey" }}
                      // onClick={() =>
                      //   onCancelHandler(property.propertyId, !isCancel)
                      // }
                      onClick={() => openModal(property.orderId, 2, property)}
                    >
                      <Link href="#">
                        {/* <img
                          width="25px"
                          style={{ backgroundColor: "white" }}
                          src="https://static.thenounproject.com/png/225895-200.png"
                          alt=""
                        /> */}
                        <i className="fa fa-times text-light"></i>
                      </Link>
                    </span>
                  </li>
                )}
                {/* )} */}

                {/* {isEditable && (
                  <li title="Edit Property">
                    <Link href="#">
                      <span className="btn btn-color w-100 mb-1">
                        {" "}
                        On Hold{" "}
                      </span>
                    </Link>{" "}
                    <Link
                      className="btn btn-color-table"
                      href={`/create-listing/${property.propertyId}`}
                    >
                      <span className="flaticon-edit"></span>
                    </Link>
                  </li>
                )} */}

                {/* {!isEditable && (
                <li
                  className="list-inline-item"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Archive Property"
                >
                  <span
                    className="btn btn-color-table"
                    onClick={() => archievePropertyHandler(property.propertyId)}
                  >
                    <Link className="color-light" href={`/archive-property`}>
                      <span className="flaticon-box"></span>
                    </Link>
                  </span>
                </li>
              )} */}
              </ul>
            ),
          };
          tempData.push(updatedRow);
        }
      });
      setUpdatedData(tempData);
    };
    getData();
  }, [properties, allBids]);

  useEffect(() => {
    setProperties([]);
    setBids([]);
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: userData.token,
    };

    axios
      .get("/api/getAllListedProperties", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          userId: data?.userId,
        },
      })
      .then((res) => {
        toast.dismiss();
        setDataFetched(true);
        const temp = res.data.data.properties.$values;
        let tempProperties = [];
        tempProperties = temp.filter((prop, index) => {
          if (String(prop.userId) === String(data.userId)) {
            return true;
          } else {
            return false;
          }
        });
        setProperties(tempProperties);
      })
      .catch((err) => {
        toast.dismiss();
        setDataFetched(false);
        toast.error(err?.response?.data?.error);
      });

    let tempBids = [];
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
      });
    setRefresh(false);
  }, [refresh]);
  return (
    <>
      {updatedData && (
        <SmartTable
          title=""
          setFilterQuery={setFilterQuery}
          setSearchInput={setSearchInput}
          data={sortObjectsByOrderIdDescending(updatedData)}
          headCells={headCells}
          searchInput={searchInput}
          filterQuery={filterQuery}
          refreshHandler={refreshHandler}
          properties={updatedData}
          dataFetched={dataFetched}
          start={start}
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
