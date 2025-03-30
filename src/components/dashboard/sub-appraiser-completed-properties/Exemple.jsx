import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { encryptionData } from "../../../utils/dataEncryption";
import { useRouter } from "next/router";
import Loader from "./Loader";
import { FaArchive, FaEye } from "react-icons/fa";
import { AppraiserStatusOptions } from "../create-listing/data";
import millify from "millify";
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
    width: 150,
  },
  {
    id: "date",
    numeric: false,
    label: "Order Submission Date",
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
    label: "Estimated Value / Purchase Price($)",
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
    id: "action",
    numeric: false,
    label: "Action",
    width: 110,
  },
];

let count = 0;

export default function Exemple({
  userData,
  open,
  close,
  start,
  end,
  setCurrentBiddedView,
  setUpdatedCode,
  properties,
  setCurrentBid,
  setAllAppraiser,
  setAssignPropertyId,
  setOpenQuoteView,
  setAssignModal,
  setIsStatusModal,
  setProperties,
  setAllBrokers,
  onWishlistHandler,
  participateHandler,
  setFilterQuery,
  setSearchInput,
  openModalBroker,
  searchInput,
  filterQuery,
  setErrorMessage,
  setModalIsOpenError,
  onArchivePropertyHandler,
  setRefresh,
  setStartLoading,
  refresh,
  setSelectedPropertyNew,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [bids, setBids] = useState([]);
  const [hideAction, setHideAction] = useState(false);
  const [hideClass, setHideClass] = useState("");
  const [show, setShow] = useState(false);
  const [archivedProperties, setArchivedProperties] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [statusData, setStatusData] = useState([]);
  let tempData = [];
  const [allArchive, setAllArchive] = useState([]);
  const [remarkModal, setRemarkModal] = useState(false);
  const [remark, setRemark] = useState("N.A.");
  const [wishlistModal, setWishlistModal] = useState(false);
  const [isWishlistProperty, setIsWishlistProperty] = useState(0);
  const [selectedWishlistId, setSelectedWishlistId] = useState(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  useEffect(() => {
    if (searchInput === "") {
      setRefresh(true);
    }
  }, [searchInput]);

  // const haveSubscription = userData?.planLimitExceed;
  // const openLimitModal = () => {
  //   if (haveSubscription === 1) {
  //     setIsLimitModalOpen(true); // Open modal
  //   } else {
  //     participateHandler(
  //       property.bidLowerRange,
  //       property.orderId,
  //       isBidded.status < 1,
  //       isBidded.bidAmount,
  //       isBidded.$id ? true : false
  //     );
  //   }
  // };

  const getOrderValue = (val) => {
    let title = "Applicant Contacted by appraiser";
    AppraiserStatusOptions.map((status) => {
      if (String(status.id) === String(val)) {
        title = status.type;
      }
    });
    return title;
  };

  const foundArchiveHandler = (propertyId) => {
    let isArchive = false;
    allArchive.map((prop, index) => {
      if (prop.propertyId === propertyId) {
        isArchive = true;
      }
    });
    return isArchive;
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

  const getisAlreadyArchived = (propertyId) => {
    let isPresent = false;
    archivedProperties.map((prop, index) => {
      if (String(prop.propertyId) === String(propertyId)) {
        isPresent = true;
      }
    });
    return isPresent;
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

  const alreadyAccepted = (property) => {
    const data = JSON.parse(localStorage.getItem("user"));
    let isAccepted = {};
    bids.filter((bid) => {
      if (
        String(bid.orderId) === String(property.orderId) &&
        String(bid.appraiserUserId) !== String(data.userId)
      ) {
        if (bid.status === 1) {
          isAccepted = bid;
        }
      }
    });
    return isAccepted.bidId ? true : false;
  };
  const router = useRouter();

  const openArchiveModal = (property) => {
    setSelectedProperty(property); // Store the selected property
    setArchiveModal(true);
  };

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

  const closeArchiveModal = () => {
    setSelectedProperty(null); // Clear the selected property
    setArchiveModal(false); // Close the modal
    setWishlistModal(false); // Close the modal
    setIsWishlistProperty(false);
  };

  const openWishlistModal = (property) => {
    setSelectedProperty(property); // Store the selected property
    setWishlistModal(true);
  };

  const openIsWishlistPropertyModal = (wishlistId, property) => {
    setSelectedWishlistId(wishlistId);
    setSelectedProperty(property);
    setIsWishlistProperty(true);
  };

  const handleConfirmRemoveWishlist = () => {
    if (selectedWishlistId) {
      // Call your removeWishlistHandler or similar logic here
      removeWishlistHandler(selectedWishlistId);
    }
    setIsWishlistProperty(false);
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const openStatusUpdateHandler = (bid, property) => {
    setCurrentBid(bid);
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

  const openQuoteViewModal = (bid) => {
    setCurrentBiddedView(bid);
    setOpenQuoteView(true);
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

  const checkWishlistedHandler = (data) => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    let temp = {};
    wishlist.map((prop, index) => {
      if (
        String(prop.propertyId) === String(data.propertyId) &&
        String(prop.userId) === String(userInfo.userId)
      ) {
        temp = prop;
      }
    });
    return temp ? temp : {};
  };

  const checkCanBidAgainHandler = (data) => {
    let temp = true;
    return temp;
  };

  const openAssignModalHandler = (property) => {
    setAssignPropertyId(property.$id);
    setAssignModal(true);
  };

  const sortObjectsByOrderIdDescending = (data) => {
    return data.sort((a, b) => b.order_id - a.order_id);
  };

  const checkData = properties && !updatedData ? true : false;
  useEffect(() => {
    setProperties([]);
  }, [checkData]);

  useEffect(() => {
    let tempStatusData = [];
    const getData = () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userActivePlans = userData?.userSubscription?.$values;
      let tempData = [];
      properties.map((property, index) => {
        console.log({ property });
        const isWishlist = checkWishlistedHandler(property);
        const isBidded = filterBidsWithin24Hours(property);
        const anotherBid = alreadyAccepted(property);
        const isAlreadyArchived = getisAlreadyArchived(property.propertyId);
        const haveSubscription = userData?.planLimitExceed;
        // userActivePlans?.length > 0
        //   ? userActivePlans[0]?.$id
        //     ? true
        //     : false
        //   : false;

        const isWait = property.isonhold || property.isoncancel;
        const isArchive = false;

        // Skip Completed Orders
        if (isBidded.orderstatus === 3) return;

        if (!isAlreadyArchived) {
          if (isBidded.status === 1) {
            console.log(getOrderValue(isBidded.orderstatus));
          }

          const newStatus = {
            status: isBidded.status,
            appraisal_status: isBidded.orderstatus,
            order_id: property.orderId,
          };
          const updatedRow = {
            order_id: property.orderId,
            address: `${property.city}-${property.province},${property.zipCode}`,
            estimated_value: property.estimatedValue
              ? `$ ${addCommasToNumber(property.estimatedValue)}`
              : "$ 0",
            purpose: property.purpose ? property.purpose : "N.A.",
            appraisal_status:
              isBidded.status === 1 && isBidded.orderstatus === 1 ? (
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
              ) : isBidded.status === 1 && isBidded.orderstatus !== null ? (
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
                  <span className={getStatusButtonClass(isBidded.orderstatus)}>
                    Status
                    <span className="m-1">
                      <i class="fa fa-info-circle" aria-hidden="true"></i>
                    </span>
                  </span>
                </div>
              ) : (
                <button className="btn btn-warning w-100">
                  <span>N.A.</span>
                </button>
              ),
            // remark: isBidded && isBidded.remark ? isBidded.remark : "N.A.",
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
            status:
              anotherBid === true && isBidded.status !== 2 ? (
                <span className="btn btn-danger  w-100">Declined</span>
              ) : isBidded?.bidId && isBidded.status === 2 ? (
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
                  <span className="btn bg-info text-light w-100">
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
            broker: (
              <div>
                {isBidded.status === 1 ? (
                  <a href="#">
                    <button
                      className="list-inline-item"
                      style={{
                        border: "0px",
                        color: "#2e008b",
                        textDecoration: "underline",
                        backgroundColor: "transparent",
                      }}
                      onClick={() => openModalBroker(property, 2)}
                    >
                      Broker Info
                    </button>
                  </a>
                ) : isBidded.status === 2 ||
                  anotherBid?.bidId ||
                  (anotherBid === true && isBidded.status !== 2) ? (
                  <h6 style={{ color: "red" }}> Declined</h6>
                ) : alreadyAccepted ? (
                  <span className="text-secondary">On quote approval</span>
                ) : (
                  <p className="text-secondary">On quote approval</p>
                )}
              </div>
            ),
            property: (
              <div>
                {isBidded.status === 1 ? (
                  <a href="#">
                    <button
                      className="list-inline-item"
                      style={{
                        border: "0px",
                        color: "#2e008b",
                        textDecoration: "underline",
                        backgroundColor: "transparent",
                      }}
                      onClick={() => openModalBroker(property, 1)}
                    >
                      Property Info
                    </button>
                  </a>
                ) : isBidded.status === 2 ||
                  anotherBid?.bidId ||
                  (anotherBid === true && isBidded.status !== 2) ? (
                  <h6 style={{ color: "red" }}> Declined</h6>
                ) : alreadyAccepted ? (
                  <span className="text-secondary">On quote approval</span>
                ) : (
                  <p className="text-secondary ">On quote approval</p>
                )}
              </div>
            ),
            type_of_appraisal: property.typeOfAppraisal
              ? property.typeOfAppraisal
              : "N.A.",
            type_of_building:
              property.typeOfBuilding > 0
                ? "Apartment"
                : property.typeOfBuilding,
            quote_required_by: formatDate(property.quoteRequiredDate),
            date: formatDateTime(property.addedDatetime),
            bidAmount: millify(property.bidLowerRange),
            lender_information: property.lenderInformation
              ? property.lenderInformation
              : "N.A.",
            urgency:
              property.urgency === 0
                ? "Rush"
                : property.urgency === 1
                ? "Regular"
                : "N.A.",

            action: (
              <div
                className="print-hidden-column"
                style={{ display: "flex", justifyContent: "center" }}
              >
                {isBidded.$id &&
                  (isBidded.status === 2 || isBidded.status === 1) &&
                  !anotherBid?.bidId && (
                    <li
                      className="list-inline-item"
                      data-toggle="tooltip"
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

                {isBidded.status === 2 || anotherBid.bidId ? (
                  <>
                    <ul>
                      <li
                        className="list-inline-item"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Archive Property"
                      >
                        <div
                          className="w-100"
                          onClick={() => openArchiveModal(property)}
                          // onClick={() =>
                          //   onArchivePropertyHandler(property.orderId)
                          // }
                        >
                          <button href="#" className="btn btn-color">
                            <Link href="#">
                              <span className="text-light">
                                {" "}
                                <FaArchive />
                              </span>
                            </Link>
                          </button>
                        </div>
                      </li>
                    </ul>
                  </>
                ) : isWait ? (
                  <>
                    {/* <p className="btn btn-danger  w-100">
                      {`No further actions can be taken on this property since it is ${
                        property.isoncancel ? "Cancelled" : "On Hold"
                      } .`}
                    </p> */}
                    <li
                      className="list-inline-item"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Archive Property"
                    >
                      <div
                        className="w-100"
                        onClick={() => openArchiveModal(property)}
                      >
                        <button href="#" className="btn btn-color ">
                          <Link href="#">
                            <span className="text-light">
                              {" "}
                              <FaArchive />
                            </span>
                          </Link>
                        </button>
                      </div>
                    </li>
                  </>
                ) : isBidded.$id && isBidded.orderstatus === 3 ? (
                  <>
                    {/* <p className="btn btn-success  w-100">Completed </p> */}
                    <li
                      className="list-inline-item"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Archive Property"
                    >
                      <div
                        className="w-100"
                        onClick={() => openArchiveModal(property)}
                      >
                        <button href="#" className="btn btn-color ">
                          <Link href="#">
                            <span className="text-light">
                              {" "}
                              <FaArchive />
                            </span>
                          </Link>
                        </button>
                      </div>
                    </li>
                  </>
                ) : (
                  <ul className="mb0 d-flex gap-1">
                    {isWishlist.id ? (
                      <button
                        className="btn "
                        style={{ border: "1px solid grey" }}
                        // onClick={() => removeWishlistHandler(isWishlist.id)}
                        onClick={() =>
                          openIsWishlistPropertyModal(isWishlist.id, property)
                        }
                        title="Remove Wishlist Property"
                      >
                        <img
                          width={26}
                          height={26}
                          src="https://png.pngtree.com/png-clipart/20200226/original/pngtree-3d-red-heart-cute-valentine-romantic-glossy-shine-heart-shape-png-image_5315044.jpg"
                        />
                      </button>
                    ) : (
                      !anotherBid && (
                        <li
                          className="list-inline-item"
                          title="Wishlist Property"
                        >
                          {
                            <button
                              className="btn"
                              style={{ border: "1px solid grey" }}
                              onClick={() => openWishlistModal(property)}
                            >
                              <span className="flaticon-heart text-color"></span>
                            </button>
                          }
                        </li>
                      )
                    )}

                    {(!isBidded.$id || isBidded?.status < 1) && !anotherBid && (
                      <li
                        className="list-inline-item"
                        data-toggle="tooltip"
                        data-placement="top"
                        title={`${
                          isBidded.$id ? "View / Update Quote" : "Provide Quote"
                        }`}
                      >
                        <div className="w-100">
                          <button
                            className="btn btn-color"
                            onClick={() => {
                              haveSubscription === 1
                                ? setIsLimitModalOpen(true) // Open modal if no subscription
                                : participateHandler(
                                    property.bidLowerRange,
                                    property.orderId,
                                    isBidded?.status < 1,
                                    isBidded?.bidAmount,
                                    isBidded?.$id ? true : false
                                  );
                            }}
                          >
                            <Link href="#">
                              <span className="flaticon-invoice text-light"></span>
                            </Link>
                          </button>
                        </div>
                      </li>
                      // <li
                      //   className="list-inline-item"
                      //   data-toggle="tooltip"
                      //   data-placement="top"
                      //   title={`${
                      //     isBidded.$id ? "View / Update Quote" : "Provide Quote"
                      //   }`}
                      // >
                      //   <div
                      //     className="w-100"
                      //     onClick={() =>
                      //       participateHandler(
                      //         property.bidLowerRange,
                      //         property.orderId,
                      //         isBidded.status < 1,
                      //         isBidded.bidAmount,
                      //         isBidded.$id ? true : false
                      //       )
                      //     }
                      //   >
                      //     <button href="#" className="btn btn-color">
                      //       <Link href="#">
                      //         <span className="flaticon-invoice text-light"></span>
                      //       </Link>
                      //     </button>
                      //   </div>
                      // </li>
                    )}

                    {isBidded.status === 1 && isBidded.orderstatus !== 3 ? (
                      <>
                        <ul>
                          <li
                            className="list-inline-item"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Status Update"
                          >
                            <button
                              href="#"
                              className="btn btn-color"
                              onClick={() =>
                                openStatusUpdateHandler(isBidded, property)
                              }
                            >
                              <Link href="#">
                                <span className="flaticon-edit text-light"></span>
                              </Link>
                            </button>
                          </li>
                        </ul>
                      </>
                    ) : (
                      ""
                    )}

                    {isWishlist.id ? (
                      ""
                    ) : (
                      <li
                        className="list-inline-item"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Archive Property"
                      >
                        <div
                          className="w-100"
                          onClick={() => openArchiveModal(property)}
                        >
                          <button href="#" className="btn btn-color">
                            <Link href="#">
                              <span className="text-light">
                                {" "}
                                <FaArchive />
                              </span>
                            </Link>
                          </button>
                        </div>
                      </li>
                    )}
                  </ul>
                )}

                {/* {isBidded.status === 1 && isBidded.orderstatus !== 3 ? (
                  <>
                    <ul>
                      <li
                        className="list-inline-item"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Status Update"
                      >
                        <button
                          href="#"
                          className="btn btn-color m-1"
                          onClick={() => openStatusUpdateHandler(isBidded)}
                        >
                          <Link href="#">
                            <span className="flaticon-edit text-light"></span>
                          </Link>
                        </button>
                      </li>
                    </ul>
                  </>
                ) : (
                  ""
                )} */}
              </div>
            ),
          };
          tempData.push(updatedRow);
          tempStatusData.push(newStatus);
        }
      });
      setUpdatedData(tempData);
      setStatusData(tempStatusData);
    };
    getData();
  }, [properties, wishlist, bids]);

  const refreshHandler = () => {
    setProperties([]);
    setWishlist([]);
    setBids([]);
    setRefresh(true);
    setStartLoading(true);
  };
  useEffect(() => {
    setProperties([]);
    setWishlist([]);
    setBids([]);
    setSearchInput("");
    setFilterQuery("All");
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: userData.token,
    };

    axios
      .get("/api/getArchiveAppraiserProperty", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        params: {
          userId: data.userId,
        },
      })
      .then((propertiess) => {
        const temp = propertiess.data.data.$values;
        let requiredProperties = [];
        temp.map((property, index) => {
          requiredProperties.push(property.property);
        });
        setArchivedProperties(requiredProperties);
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.error);
        setModalIsOpenError(true);
      });

    if (data?.userType === 5) {
      axios
        .get("/api/getAllAssignedPropertiesById", {
          headers: {
            Authorization: `Bearer ${data?.token}`,
            "Content-Type": "application/json",
          },
          params: {
            userId: data.appraiser_Details?.id,
          },
        })
        .then((res) => {
          toast.dismiss();
          const prop = res.data.data.properties.$values;
          setProperties(prop);

          axios
            .get("/api/getAllBids", {
              headers: {
                Authorization: `Bearer ${data.token}`,
              },
              params: {
                email: data.userEmail,
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
              axios
                .get("/api/appraiserWishlistedProperties", {
                  headers: {
                    Authorization: `Bearer ${data?.token}`,
                    "Content-Type": "application/json",
                  },
                })
                .then((res) => {
                  const tempData = res.data.data.$values;

                  // setAllWishlistedProperties(res.data.data.$values);
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
          // setRerender(false);
        })
        .catch((err) => {
          toast.dismiss();
          toast.error(err);
          // setErrorMessage(err?.response?.data?.error);
          // setModalIsOpenError(true);
        });
    } else {
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
          const prop = res.data.data.properties.$values;

          axios
            .get("/api/getAllBids", {
              headers: {
                Authorization: `Bearer ${data.token}`,
              },
              params: {
                email: data.userEmail,
              },
            })
            .then((res) => {
              tempBids = res.data.data.$values;
              const updatedBids = tempBids.filter((prop, index) => {
                return true;
              });
              setBids(updatedBids);
              axios
                .get("/api/appraiserWishlistedProperties", {
                  headers: {
                    Authorization: `Bearer ${data?.token}`,
                    "Content-Type": "application/json",
                  },
                })
                .then((res) => {
                  const tempData = res.data.data.$values;

                  // setAllWishlistedProperties(res.data.data.$values);
                  const responseData = tempData.filter((prop, index) => {
                    if (String(prop.userId) === String(data.userId)) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  const tempId = responseData;
                  setWishlist(responseData);
                  setProperties(prop);
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
          // setRerender(false);
        })
        .catch((err) => {
          toast.dismiss();
          toast.error(err);
          setDataFetched(false);
          // setErrorMessage(err?.response?.data?.error);
          // setModalIsOpenError(true);
        });
    }

    let tempBids = [];

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
      .get("/api/getAllAppraiser", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })
      .then((res) => {
        setAllAppraiser(res.data.data.result.$values);
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.error);
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
          setProperties={setProperties}
          refresh={refresh}
          refreshHandler={refreshHandler}
          setStartLoading={setStartLoading}
          start={start}
          searchInput={searchInput}
          filterQuery={filterQuery}
          dataFetched={dataFetched}
          statusData={statusData}
          properties={sortObjectsByOrderIdDescending(updatedData)}
          end={end}
        />
      )}
      {archiveModal && (
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
              Order Confirmation - Property Id{" "}
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
                  onArchivePropertyHandler(selectedProperty?.orderId)
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {wishlistModal && (
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
              Order Confirmation - Property Id{" "}
              <span style={{ color: "#97d700" }}>
                #{selectedProperty?.orderId}
              </span>
            </h3>
            <div className="mb-2" style={{ border: "2px solid #97d700" }}></div>
            <p className="fs-5 text-center text-dark mt-4">
              Are you sure for the order to be{" "}
              <span className="text-danger fw-bold">Wishlist</span> ?
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
                onClick={() => onWishlistHandler(selectedProperty.propertyId)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {isWishlistProperty && (
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
              Order Confirmation - Property Id{" "}
              <span style={{ color: "#97d700" }}>
                #{selectedProperty?.orderId}
              </span>
            </h3>
            <div className="mb-2" style={{ border: "2px solid #97d700" }}></div>
            <p className="fs-5 text-center text-dark mt-4">
              Are you sure for the order to be{" "}
              <span className="text-danger fw-bold">Remove Wishlist</span> ?
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
                // onClick={() => onWishlistHandler(selectedProperty.propertyId)}
                onClick={handleConfirmRemoveWishlist}
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

      {/* Modal */}
      {isLimitModalOpen && (
        <div className="modal">
          <div className="modal-content" style={{ width: "25%" }}>
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
              Information <span style={{ color: "#97d700" }}></span>
            </h3>
            <div className="mb-2" style={{ border: "2px solid #97d700" }}></div>
            <p className="fs-5 text-center text-dark mt-4">
              You&apos;ve hit your subscription limit.
              <br />
              Kindly Top Up.{" "}
              {/* <span className="text-danger fw-bold">Top Up</span>{" "} */}
            </p>
            <div
              className="mb-3 mt-4"
              style={{ border: "2px solid #97d700" }}
            ></div>
            <div className="col-lg-12 d-flex justify-content-center gap-2">
              <button
                // disabled={disable}
                className="btn btn-color w-25"
                onClick={() => setIsLimitModalOpen(false)}
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
