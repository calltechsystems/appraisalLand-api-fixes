import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { encryptionData } from "../../../utils/dataEncryption";
import { useRouter } from "next/router";
import Loader from "./Loader";
import { AppraiserStatusOptions } from "../create-listing/data";
import { FaArchive, FaEye } from "react-icons/fa";
import Image from "next/image";

const headCells = [
  {
    id: "order_id",
    numeric: false,
    label: "Property ID",
    width: 110,
  },
  {
    id: "appraiser_info",
    numeric: false,
    label: "Appraiser Info",
    width: 170,
  },
  {
    id: "address",
    numeric: false,
    label: "Property Address",
    width: 200,
  },
  {
    id: "status",
    numeric: false,
    label: "Quote Status",
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
    width: 160,
  },
  {
    id: "urgency",
    numeric: false,
    label: "Request Type",
    width: 200,
  },
  {
    id: "date",
    numeric: false,
    label: "Quote Submitted Date",
    width: 200,
  },
  {
    id: "quote_required_by",
    numeric: false,
    label: "Appraisal Report Required By",
    width: 200,
  },
  {
    id: "type_of_building",
    numeric: false,
    label: "Type of Property",
    width: 200,
  },
  {
    id: "estimated_value",
    numeric: false,
    label: "Estimated Value / Purchase Price ($)",
    width: 200,
  },
  {
    id: "type_of_appraisal",
    numeric: false,
    label: "Type Of Appraisal",
    width: 200,
  },
  {
    id: "purpose",
    numeric: false,
    label: "Purpose",
    width: 200,
  },
  {
    id: "lender_information",
    numeric: false,
    label: "Lender Information",
    width: 200,
  },
  {
    id: "broker",
    numeric: false,
    label: "Broker Info",
    width: 200,
  },
  {
    id: "property",
    numeric: false,
    label: "Property Info",
    width: 200,
  },
  {
    id: "appraiser_assign_date",
    numeric: false,
    label: "Appraiser Assign Date",
    width: 200,
  },
  {
    id: "appraiser_assign_completed_date",
    numeric: false,
    label: "Appraiser Assign Completed Date",
    width: 200,
  },
  {
    id: "action",
    numeric: false,
    label: "Action",
    width: 180,
  },
];

let count = 0;

export default function Exemple({
  userData,
  start,
  setAssignedAppraiser,
  end,
  openAppraiserInfoModal,
  setAssignModal,
  setOpenAssignModal,
  setAssignPropertyId,
  setUpdatedCode,
  properties,
  setAssignedAppraiserInfo,
  setCurrentBid,
  setIsStatusModal,
  searchInput,
  filterQuery,
  setProperties,
  onWishlistHandler,
  participateHandler,
  setAssignAppraisers,
  setFilterQuery,
  setSearchInput,
  openModalBroker,
  setErrorMessage,
  setModalIsOpenError,
  setRefresh,
  setGeneratedProps,
  setAssignedProp,
  setAllBrokers,
  setStartLoading,
  setSelectedPropertyNew,
  setCurrentBiddedView,
  setOpenQuoteView,
  refresh,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [bids, setBids] = useState([]);
  const [hideAction, setHideAction] = useState(false);
  const [hideClass, setHideClass] = useState("");
  const [show, setShow] = useState(false);
  const [Appraiser, setAppraiser] = useState({});
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [remarkModal, setRemarkModal] = useState(false);
  const [remark, setRemark] = useState("N.A.");
  const [allListedAssignAppraiser, setallListedAssignAppraiser] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [allProperties, setAllProperties] = useState([]);
  const [allAssignAppraiser, setAllAssignAppraiser] = useState([]);
  let tempData = [];

  useEffect(() => {
    if (searchInput === "") {
      setRefresh(true);
    }
  }, [searchInput]);

  const openRemarkModal = (property) => {
    const isBidded = filterBidsWithin24Hours(property); // Get the isBidded data
    setRemark(isBidded && isBidded.remark ? isBidded.remark : "N.A.");
    setSelectedProperty(property);
    setRemarkModal(true);
  };

  const closeRemarkModal = () => {
    setRemarkModal(false);
    setRemark("N.A.");
    setSelectedProperty(null);
  };

  const calculateDate = (oldBid, newBid) => {
    if (!oldBid.requestTime) {
      return newBid;
    }

    const oldDate = new Date(oldBid.requestTime);
    const newDate = new Date(newBid.requestTime);

    if (oldDate <= newDate) {
      return newBid;
    }
    return oldBid;
  };

  const getFinalBid = (tempBids) => {
    let finalBid = {};
    tempBids.map((bid, index) => {
      if (!finalBid) {
        finalBid = bid;
      } else {
        if (bid.status === 1) {
          if (finalBid.status === 1) {
            const customBid = calculateDate(finalBid, bid);
            finalBid = customBid;
          } else {
            finalBid = bid;
          }
        } else {
          const customBid = calculateDate(finalBid, bid);
          finalBid = customBid;
        }
      }
    });

    return finalBid;
  };

  const filterBidsWithin24Hours = (property) => {
    const data = JSON.parse(localStorage.getItem("user"));
    let tempBid = 0;
    let bidValue = {};
    let tempBids = [];
    bids.filter((bid) => {
      if (
        bid.orderId === property.orderId &&
        bid.appraiserUserId === data.userId
      ) {
        tempBids.push(bid);
        bidValue = bid;
        tempBid = tempBid + 1;
      } else {
      }
    });
    const customBid = getFinalBid(tempBids);
    return customBid;
  };

  const getPropertyInfo = (orderId) => {
    let currentProperty = {};
    allProperties.map((prop, index) => {
      if (String(prop.$id) === String(orderId)) {
        currentProperty = prop;
      }
    });
    return currentProperty;
  };

  const getAppraiser = (id) => {
    let selectedAppraiser = {};
    allAssignAppraiser.map((appraiser, index) => {
      //console.log(appraiser, id);
      if (String(appraiser.id) === String(id)) {
        selectedAppraiser = appraiser;
      }
    });

    //console.log(selectedAppraiser);
    openAppraiserInfoModal(selectedAppraiser);
  };
  const getAppraiserName = (id) => {
    let selectedAppraiser = {};
    allAssignAppraiser.map((appraiser, index) => {
      //console.log(appraiser, id);
      if (String(appraiser.id) === String(id)) {
        selectedAppraiser = appraiser;
      }
    });

    return `${selectedAppraiser.firstName} ${selectedAppraiser.lastName}`;
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const router = useRouter();

  const getOrderValue = (val, orderId) => {
    let title = "Applicant Contancted By Appraiser";
    AppraiserStatusOptions.map((status) => {
      if (String(status.id) === String(val)) {
        title = status.type;
      }
    });
    return title;
  };

  const checkIsOfSameCompany = (id) => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data.appraiserCompany_Datails?.appraiserCompanyId === id) {
      return true;
    } else {
      return false;
    }
  };

  const openStatusUpdateHandler = (bidId, property) => {
    setCurrentBid(bidId);
    setSelectedPropertyNew(property);
    setIsStatusModal(true);
  };

  const removeWishlistHandler = (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));

    const formData = {
      userId: userData.userId,
      propertyId: id,
      token: userData.token,
    };

    const payload = encryptionData(formData);
    toast.loading("removing this property into your wishlist");
    axios
      .delete("/api/removeWishlistProperty", {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        params: {
          userId: id,
        },
      })
      .then((res) => {
        toast.dismiss();
        toast.success("Successfully removed !!! ");
        location.reload(true);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response?.data?.error);
      });
  };

  const onDeletePropertyHandler = () => {};

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

  const openQuoteViewModal = (bid) => {
    setCurrentBiddedView(bid);
    setOpenQuoteView(true);
  };

  const checkWishlistedHandler = (data) => {
    let temp = {};
    // //console.log(wishlist, data);
    wishlist.map((prop, index) => {
      if (
        String(prop?.propertyId) === String(data?.propertyId) &&
        String(prop?.userId) === String(userData.userId)
      ) {
        temp = prop;
      }
    });
    return temp ? temp : {};
  };

  const openAssignModalHandler = (property) => {
    let requiredAppraiser = {};
    allAssignAppraiser.map((appraiser, index) => {
      if (String(appraiser.id) === String(property.appraiserid)) {
        requiredAppraiser = appraiser;
      }
    });
    setAssignPropertyId(property.propertyId);
    setAssignedAppraiserInfo(requiredAppraiser);
    setSelectedPropertyNew(property);
    setAssignModal(true);
  };

  const checkIsAlreadyExisting = (specificAppraiser, allSelectedAppraisers) => {
    let isPresent = false;

    allSelectedAppraisers.map((app, index) => {
      if (String(app.id) === String(specificAppraiser.id)) {
        isPresent = true;
      }
    });

    return isPresent;
  };

  useEffect(() => {
    let requiredAssign = [];
    allAssignAppraiser.map((appraiser, index) => {
      const isPresent = checkIsAlreadyExisting(appraiser, requiredAssign);
      if (appraiser.isActive == true && !isPresent) {
        requiredAssign.push(appraiser);
      }
    });
    setAssignAppraisers(requiredAssign);
  }, [allListedAssignAppraiser, allAssignAppraiser]);

  const sortObjectsByOrderIdDescending = (data) => {
    return data.sort((a, b) => b.order_id - a.order_id);
  };

  const [isBroker, setIsBroker] = useState(-1);

  const formatLargeNumber = (number) => {
    // Convert the number to a string
    const numberString = number.toString();

    // Determine the length of the integer part
    const integerLength = Math.floor(Math.log10(Math.abs(number))) + 1;

    // Choose the appropriate unit based on the length of the integer part
    let unit = "";

    if (integerLength >= 10) {
      unit = "B"; // Billion
    } else if (integerLength >= 7) {
      unit = "M"; // Million
    } else if (integerLength >= 4) {
      unit = "K"; // Thousand
    }

    // Divide the number by the appropriate factor
    const formattedNumber = (number / Math.pow(10, integerLength - 1)).toFixed(
      2
    );

    return `${formattedNumber}${unit}`;
  };

  console.log("assignProperties", allProperties, properties);

  useEffect(() => {
    let tempGeneratedProp = [];
    const getData = () => {
      let tempData = [];
      properties.map((property, index) => {
        // const currentProperty = propertyDetail?.propertyDetails;
        // const property = getPropertyInfo(propertyDetail?.propertyid);
        const isWishlist = checkWishlistedHandler(property);
        const isBidded = filterBidsWithin24Hours(property);
        tempGeneratedProp.push(property);
        console.log("isBidded", property.orderId, isBidded, property);
        const isWait = property?.isonhold || property?.isoncancel;

        // Skip Completed Orders
        if (isBidded.orderstatus !== 3) return;

        const updatedRow = {
          order_id: property?.orderId,
          address: property?.city
            ? `${property?.city}-${property?.province},${property?.zipCode}`
            : "-",
          estimated_value: property?.estimatedValue
            ? `$ ${addCommasToNumber(property?.estimatedValue)}`
            : "$ 0",
          purpose: property?.purpose ? property?.purpose : "N.A.",
          // remark: isBidded?.remark ? <p>{isBidded.remark}</p> : "N.A.",
          // remark: isBidded && isBidded.remark ? isBidded.remark : "N.A.",
          remarkButton: (
            <li
              className="list-inline-item"
              data-toggle="tooltip"
              data-placement="top"
              title="View Remark"
            >
              <div className="w-100" onClick={() => openRemarkModal(property)}>
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
          appraiser_assign_date: property?.createdDateTime
            ? formatDateTime(property?.createdDateTime)
            : "-",
          appraiser_assign_completed_date:
            isBidded.$id &&
            isBidded?.status === 1 &&
            isBidded?.orderstatus === 3 &&
            isBidded.orderstatus !== null
              ? formatDateTime(isBidded?.requestTime)
              : "",
          status:
            isBidded?.bidId && isBidded.status === 2 ? (
              <span className="btn btn-danger  w-100">Declined</span>
            ) : isWait ? (
              <span className="btn btn-danger  w-100">
                {property.isoncancel
                  ? "Cancelled"
                  : property.isonhold
                  ? "On Hold"
                  : ""}
              </span>
            ) : isBidded.bidId ? (
              isBidded.orderstatus === 3 ? (
                <span className="btn btn-completed w-100">Completed</span>
              ) : isBidded.status === 0 ? (
                <span className="btn bg-info text-light  w-100">
                  Quote Provided
                </span>
              ) : isBidded.status === 1 ? (
                <span className="btn btn-success  w-100">Accepted</span>
              ) : (
                ""
              )
            ) : (
              <span className="btn btn-warning  w-100">New</span>
            ),
          appraisal_status:
            isBidded.status === 1 && isBidded.orderstatus === 1 ? (
              // <span className="btn btn-warning  w-100">
              //   {getOrderValue(isBidded.orderstatus)} -
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
                      {getOrderValue(isBidded.orderstatus)} -{" "}
                      {formatDateTime(isBidded.statusdate)}
                    </li>
                  </ul>
                </div>
                <button className={getStatusButtonClass(isBidded.orderstatus)}>
                  Status
                  <span className="m-1">
                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
            ) : isBidded.status === 1 && isBidded.orderstatus !== null ? (
              // <span className="btn btn-warning  w-100">
              //   {getOrderValue(isBidded.orderstatus)}
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
                      {getOrderValue(isBidded.orderstatus)}
                    </li>
                  </ul>
                </div>
                <button className={getStatusButtonClass(isBidded.orderstatus)}>
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
          broker: (
            <div>
              {isBidded.status === 1 ? (
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
                    onClick={() => openModalBroker(property, 2)}
                  >
                    Broker
                  </button>
                </a>
              ) : isBidded.status === 2 ? (
                <h6 style={{ color: "red" }}> Declined</h6>
              ) : (
                <p className="text-secondary">On quote approval</p>
              )}
            </div>
          ),
          appraiser_info: (
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
                onClick={() => getAppraiser(property?.appraiserid)}
              >
                {getAppraiserName(property?.appraiserid)}
              </button>
            </a>
          ),
          property: (
            <div>
              {isBidded.status === 1 ? (
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
                    onClick={() => openModalBroker(property, 1)}
                  >
                    Property
                  </button>
                </a>
              ) : isBidded.status === 2 ? (
                <h6 style={{ color: "red" }}> Declined</h6>
              ) : (
                <p className="text-secondary">On quote approval</p>
              )}
            </div>
          ),
          type_of_appraisal: property?.typeOfAppraisal
            ? property?.typeOfAppraisal
            : "N.A.",
          type_of_building: property?.typeOfBuilding
            ? property?.typeOfBuilding
            : "N.A.",
          quote_required_by: formatDate(property?.quoteRequiredDate),
          date: formatDateTime(property?.addedDatetime),
          bidAmount: property?.bidLowerRange,
          lender_information: property?.lenderInformation
            ? property?.lenderInformation
            : "N.A.",
          urgency:
            property?.urgency === 0
              ? "Rush"
              : property?.urgency === 1
              ? "Regular"
              : "N.A.",

          action: (
            <div className="print-hidden-column">
              {isBidded.status === 2 ? (
                <>
                  <ul>
                    <li
                      className="list-inline-item"
                      data-toggle="tooltip"
                      data-placement="top"
                    >
                      <span className="btn btn-danger  w-100">Declined </span>
                    </li>
                  </ul>
                </>
              ) : isWait ? (
                <ul>
                  {/* <p className="btn btn-danger  w-100">
                    {`No further actions can be taken on this property since it is ${
                      property.isoncancel ? "Cancelled" : "On Hold"
                    } .`}
                  </p> */}
                  <p>{`No further actions available because property is ${
                    property.isoncancel ? "Cancelled" : "On Hold"
                  }.`}</p>
                </ul>
              ) : isBidded.$id && isBidded.orderstatus === 3 ? (
                <li
                  className="list-inline-item"
                  data-toggle="tooltip"
                  // style={{ margin: "2%" }}
                  data-placement="top"
                  title="View Quote"
                >
                  {" "}
                  <span
                    className="btn btn-color-table"
                    onClick={() => openQuoteViewModal(isBidded)}
                  >
                    <Link href={"#"}>
                      <span className="text-light flaticon-view"></span>
                    </Link>
                  </span>
                </li>
              ) : isWait ? (
                <>
                  <p className="btn btn-danger  w-100">
                    {`No further actions can be taken on this property since it is ${
                      property.isoncancel ? "Cancelled" : "On Hold"
                    } .`}
                  </p>
                </>
              ) : (
                <>
                  {isBidded.$id &&
                    (isBidded.status === 2 || isBidded.status === 1) && (
                      <li
                        className="list-inline-item"
                        data-toggle="tooltip"
                        // style={{ margin: "2%" }}
                        data-placement="top"
                        title="View Quote"
                      >
                        {" "}
                        <span
                          className="btn btn-color-table"
                          onClick={() => openQuoteViewModal(isBidded)}
                        >
                          <Link href={"#"}>
                            <span className="text-light flaticon-view"></span>
                          </Link>
                        </span>
                      </li>
                    )}
                  <li
                    className="list-inline-item"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Re-Assign Appraiser"
                  >
                    <div
                      className="w-100"
                      onClick={() => openAssignModalHandler(property)}
                    >
                      <button
                        href="#"
                        className="btn btn-color"
                        // style={{ marginLeft: "12px" }}
                      >
                        <Link href="#">
                          <span className="text-light flaticon-user"></span>
                        </Link>
                      </button>
                    </div>
                  </li>
                  {isBidded.$id &&
                    isBidded.status === 1 &&
                    isBidded.orderstatus !== 3 && (
                      <button
                        href="#"
                        title="Update Status"
                        className="btn btn-color m-1"
                        onClick={() =>
                          openStatusUpdateHandler(isBidded, property)
                        }
                      >
                        <Link href="#">
                          <span className="flaticon-edit text-light"></span>
                        </Link>
                      </button>
                    )}
                </>
              )}
            </div>
          ),
        };
        tempData.push(updatedRow);
      });
      setAssignedProp(tempData);
      setGeneratedProps(tempGeneratedProp);
      setUpdatedData(tempData);
    };

    getData();
  }, [properties, wishlist, bids, allListedAssignAppraiser]);
  console.log("updatedDATA", updatedData);

  useEffect(() => {
    setUpdatedCode(true);
  }, [updatedData]);

  const refreshHandler = () => {
    setRefresh(true);
    setStartLoading(true);
  };
  useEffect(() => {
    setProperties([]);
    setBids([]);
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
        setDataFetched(true);
        const propertyInfo = res.data.data.properties.$values;

        axios
          .get("/api/getAllAssignProperties", {
            headers: {
              Authorization: `Bearer ${data?.token}`,
              "Content-Type": "application/json",
            },
            params: {
              userId: data.appraiserCompany_Datails?.appraiserCompanyId,
            },
          })
          .then((res) => {
            let tempProperties = res.data.data.$values;
            const temp = res.data.data.$values;

            let assignedProps = [];
            temp.map((prop, index) => {
              propertyInfo.map((assProp, idx) => {
                if (String(prop.propertyid) === String(assProp.propertyId)) {
                  const newRow = {
                    ...assProp,
                    appraiserid: prop.appraiserid,
                    createdDateTime: prop.createdDateTime,
                  };
                  assignedProps.push(newRow);
                }
              });
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

                const updatedBids = tempBids.filter((prop, index) => {
                  if (String(prop.appraiserUserId) === String(data.userId)) {
                    return true;
                  } else {
                    return false;
                  }
                });
                setBids(updatedBids);
                setProperties(assignedProps);

                axios
                  .get("/api/appraiserWishlistedProperties", {
                    headers: {
                      Authorization: `Bearer ${data?.token}`,
                      "Content-Type": "application/json",
                    },
                  })
                  .then((res) => {
                    const tempData = res.data.data.$values;

                    const responseData = tempData.filter((prop, index) => {
                      if (String(prop.userId) === String(data.userId)) {
                        return true;
                      } else {
                        return false;
                      }
                    });
                    const tempId = responseData;
                    setWishlist(responseData);
                  })
                  .catch((err) => {
                    toast.error(err?.response);
                    setErrorMessage(err?.response);
                    setModalIsOpenError(true);
                  });
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
        setDataFetched(false);
        setErrorMessage(err?.response?.data?.error);
        setModalIsOpenError(true);
      });

    axios
      .get("/api/getAllAssignProperties", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        params: {
          userId: data.appraiserCompany_Datails?.appraiserCompanyId,
        },
      })
      .then((res) => {
        let tempProperties = res.data.data.$values;
        const temp = res.data.data.$values;

        setallListedAssignAppraiser(tempProperties);
      })
      .catch((err) => {});

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

    axios
      .get("/api/getAllAppraiserByCompanyId", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          // Ensure the parameter key is correct for your API
          userId: data?.appraiserCompany_Datails?.appraiserCompanyId || "",
        },
      })
      .then((res) => {
        // Provide a fallback for the expected response structure
        const allData = res.data?.data?.$values || [];
        const onlyAppraiserData = allData.map((appraiser) => appraiser.item);
        setAllAssignAppraiser(onlyAppraiserData);
      })
      .catch((err) => {
        // Use a default error message if the error object doesn't contain one
        const errorMsg =
          err?.response?.data?.error || "An unexpected error occurred.";
        setErrorMessage(errorMsg);
        setModalIsOpenError(true);
      });

    setRefresh(false);
  }, [refresh]);
  return (
    <>
      {refresh ? (
        <Loader />
      ) : (
        <SmartTable
          title=""
          setSearchInput={setSearchInput}
          setFilterQuery={setFilterQuery}
          data={sortObjectsByOrderIdDescending(updatedData)}
          headCells={headCells}
          setRefresh={setRefresh}
          searchInput={searchInput}
          filterQuery={filterQuery}
          setProperties={setProperties}
          refresh={refresh}
          refreshHandler={refreshHandler}
          setStartLoading={setStartLoading}
          start={start}
          properties={updatedData}
          dataFetched={dataFetched}
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
