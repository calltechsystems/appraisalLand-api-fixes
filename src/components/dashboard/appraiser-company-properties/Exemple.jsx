import { useEffect, useRef, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { encryptionData } from "../../../utils/dataEncryption";
import { useRouter } from "next/router";
import Loader from "./Loader";
import { FaArchive, FaDownload, FaEye } from "react-icons/fa";
import { AppraiserStatusOptions } from "../create-listing/data";
import millify from "millify";
import Image from "next/image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { extractNumericValue, extractTextContent, extractTextContentFromDate } from "./functions";

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
    id: "assigned_appraiser",
    numeric: false,
    label: "Assigned Status",
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
    label: "Estimated Property Value ($)",
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
    width: 210,
  },
];

let count = 0;

export default function Exemple({
  userData,
  open,
  close,
  start,
  end,
  setUpdatedCode,
  properties,
  setCurrentBid,
  setAllAppraiser,
  setAssignPropertyId,
  setAssignAppraiser,
  setAssignModal,
  setIsStatusModal,
  setProperties,
  setAllBrokers,
  setCurrentBiddedView,
  setOpenQuoteView,
  onWishlistHandler,
  participateHandler,
  setFilterQuery,
  setSearchInput,
  searchInput,
  filterQuery,
  openModalBroker,
  setErrorMessage,
  setModalIsOpenError,
  onArchivePropertyHandler,
  setRefresh,
  setStartLoading,
  refresh,
  setSelectedPropertyNew,
  setIsLoading,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [bids, setBids] = useState([]);
  const [hideAction, setHideAction] = useState(false);
  const [hideClass, setHideClass] = useState("");
  
  const [sortDesc, setSortDesc] = useState({});
  const [archiveModal, setArchiveModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [remarkModal, setRemarkModal] = useState(false);
  const [remark, setRemark] = useState("N.A.");
  const [archivedProperties, setArchivedProperties] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [assignedProperties, setAssignedProperties] = useState([]);
  let tempData = [];
  const [allArchive, setAllArchive] = useState([]);
  const [wishlistModal, setWishlistModal] = useState(false);
  const [isWishlistProperty, setIsWishlistProperty] = useState(0);
  const [selectedWishlistId, setSelectedWishlistId] = useState(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  const [propertiesPerPage, setPropertiesPerPage] = useState([])
  const intervalRef = useRef(null);

  useEffect(() => {
    if (searchInput === "") {
      setProperties([]);
      setBids([]);
      setRefresh(true);
    }
  }, [searchInput]);
  const getOrderValue = (val) => {
    let title = "Applicant Contacted by appraiser";
    AppraiserStatusOptions.map((status) => {
      if (String(status.id) === String(val)) {
        title = status.type;
      }
    });
    return title;
  };

  const cleanUrl = (zipUrl) => zipUrl.replace(/,$/, "");

  const downloadZip = async (url, propertyId) => {
    const zipUrl = cleanUrl(url);

    try {
      if (!zipUrl) {
        toast.error("No attachments available.");
        return;
      }

      toast.loading("Downloading...");

      const response = await axios.get(zipUrl, { responseType: "blob" });

      const fileName =
        `${propertyId}_attachments.zip` || "Downloaded_Files.zip";
      saveAs(response.data, fileName); // Directly download the zip file

      toast.success("ZIP file downloaded successfully!");
      toast.dismiss();
    } catch (error) {
      console.log({ error });
      toast.error("Failed to download ZIP file.");
      console.error("Error:", error);
    }
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

  const openStatusUpdateHandler = (bid, property) => {
    setCurrentBid(bid);
    setSelectedPropertyNew(property);
    setIsStatusModal(true);
  };

  const openArchiveModal = (property) => {
    setSelectedProperty(property); // Store the selected property
    setArchiveModal(true);
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

  const removeWishlistHandler = (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const formData = {
      userId: userData.userId,
      propertyId: id,
      token: userData.token,
    };

    const payload = encryptionData(formData);
    setIsLoading(true);
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
        setIsLoading(false);
        toast.success("Successfully removed !!! ");
        location.reload(true);
      })
      .catch((err) => {
        toast.dismiss();
        setIsLoading(false);
        toast.error(err?.response?.data?.error);
      });
  };

  const getStatusButtonClass = (orderStatus) => {
    if (orderStatus === 4 || orderStatus === 5) {
      return "btn btn-status-na w-100"; // Orange color class
    }
    return "btn btn-status w-100"; // Default color
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
      hour12: true,
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  const openQuoteViewModal = (bid) => {
    setCurrentBiddedView(bid);
    setOpenQuoteView(true);
  };

  const checkWishlistedHandler = (data) => {
    let temp = {};
    wishlist.map((prop, index) => {
      if (
        String(prop.propertyId) === String(data.propertyId) &&
        String(prop.userId) === String(userData.userId)
      ) {
        temp = prop;
      }
    });
    return temp ? temp : {};
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const openAssignModalHandler = (property) => {
    console.log({ Assignable_property: property });
    setAssignPropertyId(property.propertyId);
    setSelectedPropertyNew(property);
    setAssignModal(true);
  };

  const sortObjectsByOrderIdDescending = (data) => {
    return data.sort((a, b) => b.order_id - a.order_id);
  };

  const checkData = properties && !updatedData ? true : false;
  useEffect(() => {
    setProperties([]);
  }, [checkData]);

  const checkIfPropertyAlreadyAssigned = (propertyId) => {
    let assigned = {};
    assignedProperties.map((prop, index) => {
      if (prop?.propertyid == propertyId) {
        assigned = prop;
      }
    });

    return assigned;
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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const getData = () => {
      let tempData = [];
      properties.map((property, index) => {
        const isWishlist = checkWishlistedHandler(property);
        const isBidded = filterBidsWithin24Hours(property);
        const anotherBid = alreadyAccepted(property);
        const isAlreadyArchived = getisAlreadyArchived(property.propertyId);

        const haveSubscription = userData?.planLimitExceed;

        const isAssigned = checkIfPropertyAlreadyAssigned(property.propertyId);

        const isArchive = foundArchiveHandler(property.propertyId);

        // Skip Completed Orders
        if (isBidded.orderstatus === 3) return;

        if (!isAlreadyArchived) {
          const isWait = property.isonhold || property.isoncancel;
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
                        {console.log("statusDate:", isBidded.statusDate)}
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
                    <span style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                      Status
                    </span>
                    <span className="m-1">
                      <i class="fa fa-info-circle" aria-hidden="true"></i>
                    </span>
                  </span>
                </div>
              ) : (
                <span className="btn btn-warning w-100">N.A.</span>
              ),
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
            // remark: property.isoncancel
            //   ? "N.A."
            //   : isBidded.remark
            //   ? isBidded.remark
            //   : "N.A.",
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
                        // fontWeight: "bold",
                        backgroundColor: "transparent",
                      }}
                      onClick={() => openModalBroker(property, 2)}
                    >
                      Broker
                    </button>
                  </a>
                ) : isBidded.status === 2 ||
                  anotherBid?.bidId ||
                  (anotherBid === true && isBidded.status !== 2) ? (
                  <h6 style={{ color: "red" }}> Declined</h6>
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
                ) : isBidded.status === 2 ||
                  anotherBid?.bidId ||
                  (anotherBid === true && isBidded.status !== 2) ? (
                  <h6 style={{ color: "red" }}> Declined</h6>
                ) : (
                  <p className="text-secondary">On quote approval</p>
                )}
              </div>
            ),
            assigned_appraiser: isAssigned?.id ? (
              <span
                className=""
                style={{
                  border: "0px",
                  color: "green",
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                }}
              >
                Assigned
              </span>
            ) : (
              <span
                className=""
                style={{
                  border: "0px",
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                }}
              >
                Not Assigned
              </span>
            ),
            type_of_appraisal: property.typeOfAppraisal
              ? property.typeOfAppraisal
              : "NA",
            type_of_building:
              property.typeOfBuilding > 0
                ? "Apartment"
                : property.typeOfBuilding,
            quote_required_by: formatDate(property.quoteRequiredDate),
            date: formatDateTime(property.addedDatetime),
            bidAmount: millify(property.bidLowerRange),
            lender_information: property.lenderInformation
              ? property.lenderInformation
              : "NA",
            lender_information_btn: "N.A.",
            urgency:
              property.urgency === 0
                ? "Rush"
                : property.urgency === 1
                ? "Regular"
                : "",

            action: (
              <div
                className="print-hidden-column"
                style={{ display: "flex", justifyContent: "center" }}
              >
                {isBidded.$id &&
                  (isBidded.status === 2 || isBidded.status === 1) && (
                    <>
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
                    </>
                  )}
                {isBidded.status === 2 || anotherBid?.bidId ? (
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
                ) : isWait && property.status !== 2 ? (
                  <>
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
                  </>
                ) : isBidded && isBidded.status !== 1 ? (
                  <ul className="mb0 d-flex gap-1">
                    {isWishlist.id ? (
                      <li>
                        <button
                          title="Remove Wishlist"
                          className="btn"
                          style={{
                            border: "1px solid grey",
                          }}
                          onClick={() =>
                            openIsWishlistPropertyModal(isWishlist.id, property)
                          }
                        >
                          <img
                            width={26}
                            height={26}
                            src="https://png.pngtree.com/png-clipart/20200226/original/pngtree-3d-red-heart-cute-valentine-romantic-glossy-shine-heart-shape-png-image_5315044.jpg"
                          />
                        </button>
                      </li>
                    ) : isBidded.orderstatus === 3 ? (
                      <span className="btn btn-success w-100">Completed</span>
                    ) : (
                      !anotherBid && (
                        <li
                          className="list-inline-item"
                          title="Wishlist Property"
                        >
                          {
                            <button
                              className="btn"
                              style={{
                                border: "1px solid grey",
                              }}
                              onClick={() => openWishlistModal(property)}
                            >
                              <span className="flaticon-heart text-color"></span>
                            </button>
                          }
                        </li>
                      )
                    )}

                    {(!isBidded.$id || isBidded?.status < 1) &&
                      !isWait &&
                      !anotherBid && (
                        <li
                          className="list-inline-item"
                          data-toggle="tooltip"
                          data-placement="top"
                          title={`${
                            isBidded.$id ? "View/Update Quote" : "Provide Quote"
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
                ) : isBidded.status === 1 && isBidded.orderstatus !== 3 ? (
                  !isWait && (
                    <>
                      <button
                        href="#"
                        title="Update Status"
                        className="list-inline-item btn btn-color w-20"
                        // style={{ marginLeft: "12px" }}
                        onClick={() =>
                          openStatusUpdateHandler(isBidded, property)
                        }
                      >
                        <Link href="#">
                          <span className="flaticon-edit text-light"></span>
                        </Link>
                      </button>
                      {!isAssigned?.id &&
                        isBidded.$id &&
                        isBidded.status === 1 && (
                          <li
                            className="list-inline-item"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Assign Appraiser"
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
                        )}
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
                    </>
                  )
                ) : (
                  <>
                    <li
                      className="list-inline-item"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Archive Property"
                    >
                      <div
                        className="list-inline-item"
                        onClick={() => openArchiveModal(property)}
                      >
                        <button
                          href="#"
                          className="btn btn-color w-20"
                          // style={{ marginLeft: "12px" }}
                        >
                          <Link href="#">
                            <span className="text-light">
                              {" "}
                              <FaArchive />
                            </span>
                          </Link>
                        </button>
                      </div>
                    </li>
                    {/* <p className="btn btn-completed  w-100">Completed </p> */}
                  </>
                )}
                {isBidded.status === 1 && property.attachmentFlag === true ? (
                  <>
                    <ul className="d-flex">
                      <li
                        className="list-inline-item"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Download Attachment"
                      >
                        {" "}
                        <span
                          className="btn btn-color-table"
                          onClick={() =>
                            downloadZip(
                              property.attachment,
                              property?.propertyId
                            )
                          }
                        >
                          <Link href={"#"} onClick={(e) => e.preventDefault()}>
                            <span className="text-light">
                              {" "}
                              <FaDownload />
                            </span>
                          </Link>
                        </span>
                      </li>
                    </ul>
                  </>
                ) : (
                  ""
                )}
              </div>
            ),
          };
          tempData.push(updatedRow);
        }
      });
      setPropertiesPerPage(tempData.slice(start, end));
      setUpdatedData(tempData);
    };
    getData();
  }, [properties, wishlist, bids, assignedProperties]);

  useEffect(() => {
    setPropertiesPerPage(updatedData.slice(start, end))
  },[start, end, updatedData])

  useEffect(() => {
    setUpdatedCode(true);
  }, [updatedData]);

    const sortData = (cell) => {
    let tempData = [...updatedData];

    const newSortDesc = { ...sortDesc };
    newSortDesc[cell] = !newSortDesc[cell];

    tempData.sort((a, b) => {
      let valueA = extractTextContent(a[cell]);
      let valueB = extractTextContent(b[cell]);

      if (String(cell) === "date" || String(cell) === "quote_required_by") {
        valueA = extractTextContentFromDate(a[cell]);
        valueB = extractTextContentFromDate(b[cell]);
      }

      if (String(cell) === "estimated_value") {
        valueA = extractNumericValue(a[cell]);
        valueB = extractNumericValue(b[cell]);
      }

      // Perform comparison based on the sorting order
      if (newSortDesc[cell]) {
        return valueA < valueB ? 1 : -1;
      } else {
        return valueA > valueB ? 1 : -1;
      }
    });

    setSortDesc(newSortDesc);
    setUpdatedData([...tempData])
    // setData(tempData);
  }

  const refreshHandler = () => {
    setRefresh(true);
    setStartLoading(true);
  };

  const fetchData = () => {
    setProperties([]);
    setBids([]);
    setFilterQuery("All");
    setSearchInput("");
    setWishlist([]);
    const data = JSON.parse(localStorage.getItem("user"));
    axios
      .get("/api/getArchiveAppraiserProperty", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
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

    const startDate = new Date();
    axios
      .get("/api/getArchiveAppraiserProperty", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
        },
        params: {
          userId: data.userId,
        },
      })
      .then((res) => {
        const archivedList = res.data.data.$values;
        setAllArchive(res.data.data.$values);
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
        const temp = res.data.data.properties.$values;

        let tempBids = [];
        axios
          .get("/api/getAllBids", {
            headers: {
              Authorization: `Bearer ${data?.token}`,
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

            const updatedPropertiesUnArchived = [];
                temp.map((prop) => {
                  const isArchived = archivedList.filter(
                    (archivedProp) => archivedProp.propertyId == prop.propertyId
                  );
                  if (isArchived.length == 0) {
                    const isPropBid = updatedBids.filter((bid) => bid.orderId == prop.orderId);
                    console.log({isPropBid: isPropBid})
                    if(isPropBid.length > 0 && isPropBid[0].orderstatus !== "3"){
                      updatedPropertiesUnArchived.push(prop);
                    }
                  }
                  
                });
                console.log({updatedPropertiesUnArchived})
                setProperties(updatedPropertiesUnArchived);
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
                
                setWishlist(responseData);
                
              })
              .catch((err) => {
                toast.error(err?.response);
              });
            axios
              .get("/api/getAllAssignProperties", {
                headers: {
                  Authorization: `Bearer ${data?.token}`,
                },
                params: {
                  userId: data.appraiserCompanyDetail?.appraiserCompanyId,
                },
              })
              .then((res) => {
                let tempProperties = res.data.data.$values;
                const temp = res.data.data.$values;

                setAssignedProperties(tempProperties);
              })
              .catch((err) => {});
          })
          .catch((err) => {});
      })
      .catch((err) => {});

    axios
      .get("/api/getAllBrokers", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
        },
      })
      .then((res) => {
        let allbroker = res.data.data.$values;
        axios
          .get("/api/getAllBrokerageCompany", {
            headers: {
              Authorization: `Bearer ${data?.token}`,
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
          .catch((err) => {});
      })
      .catch((err) => {});

    axios
      .get("/api/getAllAppraiserByCompanyId", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
        },
        params: {
          userId: data.appraiserCompanyDetail?.appraiserCompanyId,
        },
      })
      .then((res) => {
        setAssignAppraiser(res.data.data.$values);
      })
      .catch((err) => {});

    
      })
      .catch((err) => {
        setDataFetched(false);
      });

    setRefresh(false);
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(() => {
      fetchData();
    }, 180000);

    return () => clearInterval(intervalRef.current);
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
          data={sortObjectsByOrderIdDescending(propertiesPerPage)}
          headCells={headCells}
          setRefresh={setRefresh}
          setProperties={setProperties}
          refresh={refresh}
          searchInput={searchInput}
          filterQuery={filterQuery}
          refreshHandler={refreshHandler}
          setStartLoading={setStartLoading}
          properties={propertiesPerPage}
          allProperties={updatedData}
          dataFetched={dataFetched}
          start={start}
          end={end}
          setUpdatedData={setUpdatedData}
          sortDesc={sortDesc}
          setSortDesc={setSortDesc}
          sortData={sortData}
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
            <h2 className="text-center mt-3" style={{ color: "#2e008b" }}>
              Order Confirmation{" "}
              <span style={{ color: "#97d700" }}>
                #{selectedProperty?.orderId}
              </span>
            </h2>
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
                onClick={() => {
                  onArchivePropertyHandler(selectedProperty?.orderId);
                  setArchiveModal(false);
                }}
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
                onClick={() => {
                  onWishlistHandler(selectedProperty.propertyId);
                  setWishlistModal(false);
                }}
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
