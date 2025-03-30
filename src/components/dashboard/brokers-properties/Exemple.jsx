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
  FaPlay,
} from "react-icons/fa";
// import "./SmartTable.css";
import Image from "next/image";

const headCells = [
  {
    id: "property_id",
    numeric: false,
    label: "Property ID",
    width: 110,
  },
  {
    id: "broker",
    numeric: false,
    label: "Broker Name",
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
    id: "quote_required_by",
    numeric: false,
    label: "Appraisal Report Required By",
    width: 190,
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
    label: "Actions",
    width: 100,
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
  searchInput,
  filterQuery,
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
  openbrokerInfoModal,
  isBidded,
  setHoldModalOpen,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [allBids, setBids] = useState([]);
  const [show, setShow] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [allListedProperties, setAllListedProperties] = useState([]);
  let tempData = [];
  const [AllBrokers, setAllBrokers] = useState([]);
  const [archiveModal, setArchiveModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [remarkModal, setRemarkModal] = useState(false);
  const [remark, setRemark] = useState("N.A.");

  useEffect(() => {
    if (searchInput === "") {
      setFilterQuery("All");
      setSearchInput("");
      setRefresh(true);
    }
  }, [searchInput]);

  const sortObjectsByOrderIdDescending = (data) => {
    return data.sort((a, b) => b.property_id - a.property_id);
  };

  const getBrokerName = (id) => {
    let selectedAppraiser = {};
    AllBrokers.map((appraiser, index) => {
      if (String(appraiser.userId) === String(id)) {
        selectedAppraiser = appraiser;
      }
    });

    return `${selectedAppraiser.firstName} ${selectedAppraiser.lastName}`;
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const getBroker = (id) => {
    let selectedBroker = {};
    AllBrokers.map((appraiser, index) => {
      if (String(appraiser.userId) === String(id)) {
        selectedBroker = appraiser;
      }
    });

    openbrokerInfoModal(selectedBroker);
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

  const openArchiveModal = (property) => {
    setSelectedProperty(property); // Store the selected property
    setArchiveModal(true);
  };

  const closeArchiveModal = () => {
    setSelectedProperty(null); // Clear the selected property
    setArchiveModal(false); // Close the modal
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

  const getBidOfProperty = (orderId) => {
    let Bid = {};
    allBids.map((bid, index) => {
      if (String(bid.orderId) === String(orderId)) {
        Bid = bid;
      }
    });
    return Bid;
  };

  const openRemarkModal = (property) => {
    const isBidded = getBidOfProperty(property.orderId); // Get the isBidded data
    const isCancel = property.isoncancel;
    const isHold = property.isonhold;
    setRemark(
      isCancel || isHold ? "N.A." : isBidded.remark ? isBidded.remark : "N.A."
    );
    setSelectedProperty(property);
    setRemarkModal(true);
  };

  const closeRemarkModal = () => {
    setRemarkModal(false);
    setRemark("N.A.");
    setSelectedProperty(null);
  };

  const refreshHandler = () => {
    setAllListedProperties([]);
    setBids([]);
    setProperties([]);
    setRefresh(true);
  };

  const getPropertyStatusHandler = (property) => {
    let isInProgress = true;
    let isQuoteProvided = false;
    let isCompleted = false;
    let isAccepted = false;
    allBids.map((bid, index) => {
      if (
        bid.orderId === property?.orderId &&
        bid.status === 1 &&
        bid.orderstatus === 3
      ) {
        isCompleted = true;
      }
      if (bid.orderId === property?.orderId && bid.status === 1) {
        isAccepted = true;
      } else if (bid.orderId === property.orderId) {
        isQuoteProvided = true;
      }
    });
    return isCompleted ? 3 : isAccepted ? 2 : isQuoteProvided ? 1 : 0;
  };

  const getPropertyInfoById = (userId) => {
    let selectedProperty = {};
    allListedProperties.map((prop, index) => {
      if (String(prop.userId) === String(userId)) {
        selectedProperty = prop;
      }
    });
    return selectedProperty;
  };

  const openPopupModal = (property) => {
    setModalIsPopupOpen(true);
    setCurrentProperty(property);
  };
  useEffect(() => {
    const getData = () => {
      const tempData = []; // Make sure this is defined to hold the updated data.

      properties.map((property, index) => {
        const isBidded = getBidOfProperty(property?.orderId);
        const isHold = property?.isonhold;
        const isCancel = property?.isoncancel;
        const isStatus = getPropertyStatusHandler(property);
        const isEditable = isStatus === 0 ? true : false;
        if (isStatus === 3) {
          return; // This will skip adding the completed property to the table
        }
        if (!property?.isArchive) {
          const updatedRow = {
            property_id: property?.orderId,
            sub_date: formatDateTime(property?.addedDatetime),
            quote_required_by: property?.quoteRequiredDate
              ? formatDate(property?.quoteRequiredDate)
              : formatDate(property?.addedDatetime),
            broker: (
              <a href="#">
                <button
                  className=""
                  style={{
                    border: "0px",
                    color: "#2e008b",
                    textDecoration: "underline",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => getBroker(property?.userId)}
                >
                  {getBrokerName(property?.userId)}
                </button>
              </a>
            ),
            status:
              isHold || isCancel ? (
                <span className="btn bg-danger text-light w-100">
                  {isHold ? "On Hold" : "Cancelled"}
                </span>
              ) : isStatus === 3 ? (
                <span className="btn btn-completed w-100 text-light">
                  Completed
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
            address: `${property.streetNumber} ${property.streetName}, ${property.city}, ${property.province}, ${property.zipCode}`,
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
            // remark: isCancel
            //   ? "N.A."
            //   : isBidded.remark
            //   ? isBidded.remark
            //   : "N.A.",
            type_of_building: property.typeOfBuilding,
            amount: ` $ ${addCommasToNumber(property.estimatedValue)}`,
            purpose: property.purpose,
            type_of_appraisal: property.typeOfAppraisal,
            lender_information: property.lenderInformation
              ? property.lenderInformation
              : "N.A.",
            urgency: property.urgency === 0 ? "Rush" : "Regular",
            actions_01: (
              <ul className="d-flex justify-content-center gap-1">
                <li title="Property Details" className="">
                  <span
                    className="btn btn-color-table"
                    onClick={() => openPopupModal(property)}
                  >
                    <Link href={"#"}>
                      <span className="text-light flaticon-view"></span>
                    </Link>
                  </span>
                </li>
                {!isEditable && !isCancel && (
                  <li title="Quotes">
                    {isHold ? (
                      <button
                        className="btn btn-color-table"
                        onClick={() => setHoldModalOpen(true)} // Assuming setModalOpen manages modal state
                      >
                        <span className="flaticon-invoice"></span>
                      </button>
                    ) : (
                      <Link
                        className="btn btn-color-table"
                        href={`/brokerage-properties-bid/${property.orderId}`}
                      >
                        <span className="flaticon-invoice"></span>
                      </Link>
                    )}
                  </li>
                  // <li title="Quotes">
                  //   <Link
                  //     className="btn btn-color-table"
                  //     href={`/brokerage-properties-bid/${property.orderId}`}
                  //   >
                  //     <span className="flaticon-invoice"></span>
                  //   </Link>
                  // </li>
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
                        <span className="fa fa-times text-light"></span>
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

                <li title="Archive Property">
                  {/* <Link
                      href="#"
                      onClick={() =>
                        archievePropertyHandler(property.propertyId)
                      }
                    >
                      <span className="btn btn-color w-100">
                        {" "}
                        Archive Property{" "}
                      </span>
                    </Link> */}
                  <span
                    className="btn btn-color-table"
                    onClick={() => openArchiveModal(property)}
                  >
                    <Link className="color-light" href="#">
                      <span className="text-light">
                        <FaArchive />
                      </span>
                    </Link>
                  </span>
                </li>

                {/* End li */}
              </ul>
            ),
          };
          tempData.push(updatedRow);
        }
      });
      setUpdatedData(tempData);
    };
    getData();
  }, [properties]);

  useEffect(() => {
    setAllListedProperties([]);
    setBids([]);
    setProperties([]);
    setFilterQuery("All");
    setSearchInput("");
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
        setAllListedProperties(res.data.data.properties.$values);
      })
      .catch((err) => {
        toast.error(err);
        setDataFetched(false);
      });

    axios
      .get("/api/getBrokeragebrokerProperties", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          userId: data?.brokerage_Details?.id,
        },
      })
      .then((res) => {
        toast.dismiss();
        const temp = res.data.data.$values;
        let requiredRows = [];
        temp.map((row, index) => {
          const data = row?.properties.$values;
          data.map((prop, idx) => {
            requiredRows.push(prop);
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
            setProperties(requiredRows);
            setBids(tempBids);
          })
          .catch((err) => {
            toast.error(err);
          });
      });
    axios
      .get("/api/getAllBrokers", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })
      .then((res) => {
        let allbroker = res.data.data.$values;

        setAllBrokers(allbroker);
      })
      .catch((err) => {});

    let tempBids = [];

    setRefresh(false);
  }, [refresh]);
  return (
    <>
      {updatedData && (
        <SmartTable
          title=""
          searchInput={searchInput}
          filterQuery={filterQuery}
          setFilterQuery={setFilterQuery}
          setSearchInput={setSearchInput}
          data={sortObjectsByOrderIdDescending(updatedData)}
          headCells={headCells}
          refreshHandler={refreshHandler}
          start={start}
          dataFetched={dataFetched}
          properties={updatedData}
          end={end}
        />
      )}

      {archiveModal && (
        <div className="modal">
          <div className="modal-content" style={{ width: "30%" }}>
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
              Order Confirmation– Property Id{" "}
              <span style={{ color: "#97d700" }}>
                #{selectedProperty?.orderId}
              </span>
            </h3>
            <div className="mb-2" style={{ border: "2px solid #97d700" }}></div>
            <p className="fs-5 text-center text-dark mt-4">
              Are you sure for the order to be{" "}
              <span className="text-danger fw-bold">Archived</span> ?
            </p>
            <div
              className="mb-3 mt-4"
              style={{ border: "2px solid #97d700" }}
            ></div>
            <div className="col-lg-12 d-flex justify-content-center gap-2">
              <button
                // disabled={disable}
                className="btn btn-color w-25"
                onClick={closeArchiveModal}
              >
                Cancel
              </button>
              <button
                // disabled={disable}
                className="btn btn-color w-25"
                onClick={() =>
                  archievePropertyHandler(selectedProperty?.orderId)
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
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
