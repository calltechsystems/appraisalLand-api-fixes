import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { encryptionData } from "../../../utils/dataEncryption";
import { useRouter } from "next/router";
import Loader from "./Loader";
import { FaArchive } from "react-icons/fa";
import { AppraiserStatusOptions } from "../data";
// import "./SmartTable.css";

const headCells = [
  {
    id: "order_id",
    numeric: false,
    label: "Order ID",
    width: 100,
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
    width: 190,
  },
  {
    id: "remark",
    numeric: false,
    label: "Remark",
    width: 160,
  },
  {
    id: "urgency",
    numeric: false,
    label: "Urgency",
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
    label: "Broker",
    width: 200,
  },
  {
    id: "property",
    numeric: false,
    label: "Property",
    width: 200,
  },

  {
    id: "action",
    numeric: false,
    label: "Actions",
    width: 100,
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
  setIsStatusModal,
  setProperties,
  setAllBrokers,
  searchInput,
  filterQuery,
  onWishlistHandler,
  participateHandler,
  setFilterQuery,
  setSearchInput,
  openModalBroker,
  setErrorMessage,
  setModalIsOpenError,
  onArchivePropertyHandler,
  setRefresh,
  unArchivePropertyHandler,
  setAllArchive,
  allArchive,
  setStartLoading,
  refresh,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [bids, setBids] = useState([]);
  const [hideAction, setHideAction] = useState(false);
  const [hideClass, setHideClass] = useState("");
  const [show, setShow] = useState(false);

  const [dataFetched, setDataFetched] = useState(false);
  let tempData = [];

  useEffect(() => {
    if (searchInput === "") {
      setRefresh(true);
    }
  }, [searchInput]);

  const getOrderValue = (val) => {
    let title = "";
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
      console.log("ischeck", propertyId, prop.property);
      if (String(prop.property.propertyId) === String(propertyId)) {
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
  const router = useRouter();

  const openStatusUpdateHandler = (bidId) => {
    setCurrentBid(bidId);
    setIsStatusModal(true);
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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

  const onDeletePropertyHandler = () => {};

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    const originalDate = new Date(dateString);

    // Adjust for Eastern Standard Time (EST) by subtracting 5 hours
    const estDate = new Date(originalDate.getTime() - 5 * 60 * 60 * 1000);

    // Format the EST date
    const formattedDate = estDate.toLocaleString("en-US", options);
    return formattedDate;
  };

  const checkWishlistedHandler = (data) => {
    let temp = {};
    // console.log(wishlist, data);
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

  const checkCanBidAgainHandler = (data) => {
    let temp = true;
    return temp;
  };

  const sortObjectsByOrderIdDescending = (data) => {
    return data.sort((a, b) => b.order_id - a.order_id);
  };

  const checkData = properties && !updatedData ? true : false;
  useEffect(() => {
    setProperties([]);
  }, [checkData]);

  useEffect(() => {
    const getData = () => {
      allArchive.map((prop, index) => {
        const property = prop.property;
        const isWishlist = checkWishlistedHandler(property);
        const isBidded = filterBidsWithin24Hours(property);

        const anotherBid = alreadyAccepted(property);
        const isArchive = foundArchiveHandler(property.propertyId);

        const isWait = property.isOnHold || property.isOnCancel;
        const updatedRow = {
          order_id: property.orderId,
          address: `${property.city}-${property.province},${property.zipCode}`,
          estimated_value: property.estimatedValue
            ? `$ ${addCommasToNumber(property.estimatedValue)}`
            : "$ 0",
          purpose: property.purpose ? property.purpose : "N.A.",
          appraisal_status:
            isBidded.status === 1 && isBidded.orderStatus === 1 ? (
              // <span className="btn btn-warning  w-100">
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
                <button className="btn btn-status">
                  Current Status
                  <span className="m-1">
                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
            ) : isBidded.status === 1 && isBidded.orderStatus !== null ? (
              // <span className="btn btn-warning  w-100">
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
                <button className="btn btn-status">
                  Current Status
                  <span className="m-1">
                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
            ) : (
              <span className="btn btn-warning  w-100">N.A.</span>
            ),
          remark: isBidded && isBidded.remark ? isBidded.remark : "N.A.",
          status:
          (anotherBid === true && isBidded.status !== 2)    ? (
            <span className="btn btn-danger  w-100">Broker has already selected the quote</span>
          ) :
            isBidded?.bidId && isBidded.status === 2 ? (
              <span className="btn btn-danger  w-100">Rejected</span>
            ) : isWait ? (
              <span className="btn btn-danger  w-100">
                {property.isOnCancel
                  ? "Cancelled"
                  : property.isOnHold
                  ? "On Hold"
                  : ""}
              </span>
            ) : isBidded.bidId ? (
              isBidded.orderStatus === 3 ? (
                <span className="btn btn-completed w-100">Completed</span>
              ) : isBidded.status === 0 ? (
                <span className="btn btn-primary  w-100">Quote Provided</span>
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
                    Broker Info
                  </button>
                </a>
              ) : isBidded.status === 2 ? (
                <h6 style={{ color: "red" }}> Declined</h6>
              ) : (
                <p>Information will be available post quote acceptance.</p>
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
                      // fontWeight: "bold",
                      backgroundColor: "transparent",
                    }}
                    onClick={() => openModalBroker(property, 1)}
                  >
                    Property Info
                  </button>
                </a>
              ) : isBidded.status === 2 ? (
                <h6 style={{ color: "red" }}> Declined</h6>
              ) : (
                <p>Information will be available post quote acceptance.</p>
              )}
            </div>
          ),
          type_of_appraisal: property.typeOfAppraisal
            ? property.typeOfAppraisal
            : "N.A.",
          type_of_building:
            property.typeOfBuilding > 0 ? "Apartment" : property.typeOfBuilding,
          quote_required_by: formatDate(property.quoteRequiredDate),
          date: formatDate(property.addedDatetime),
          bidAmount: property.bidLowerRange,
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
            <div className="print-hidden-column">
              {/* {isWait ? (
                <p className="btn btn-danger  w-100">
                  {`No further actions can be taken on this property since it is ${
                    property.isOnCancel ? "Cancelled" : "On Hold"
                  } !.`}
                </p>
              ) : (
                ""
              )} */}

              <li
                className="list-inline-item"
                data-toggle="tooltip"
                data-placement="top"
                title="Un-Archive Property"
              >
                <div
                  className="w-100"
                  onClick={() => onArchivePropertyHandler(property.orderId)}
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
            </div>
          ),
        };
        tempData.push(updatedRow);
      });
      setUpdatedData(tempData);
    };
    getData();
  }, [properties]);

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
    setWishlist([]);
    setSearchInput("");
    setFilterQuery("All");
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: userData.token,
    };
    let tempProperties = [],
      tempWishlist = [];
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

        tempProperties = temp.filter((prop, index) => {
          if (String(prop.userId) === String(data.userId)) {
            return true;
          } else {
            return false;
          }
        });

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

            setBids(tempBids);
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
                setProperties(tempProperties);
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
        setDataFetched(false);
        setErrorMessage(err?.response?.data?.error);
        setModalIsOpenError(true);
      });

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
      .get("/api/getArchiveAppraiserProperty", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        params: {
          userId: data.userId,
        },
      })
      .then((res) => {
        setAllArchive(res.data.data.$values);
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.error);
        setModalIsOpenError(true);
      });

    console.log("end", bids, properties, wishlist);
    setRefresh(false);
  }, [refresh]);
  // console.log(sortObjectsByOrderIdDescending(updatedData));
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
          searchInput={searchInput}
          filterQuery={filterQuery}
          refreshHandler={refreshHandler}
          setStartLoading={setStartLoading}
          start={start}
          properties={updatedData}
          dataFetched={dataFetched}
          end={end}
        />
      )}
    </>
  );
}
