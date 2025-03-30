import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import {
  FaArchive,
  FaHandHoldingHeart,
  FaHandHoldingUsd,
  FaHandPointer,
  FaPause,
  FaRedo,
} from "react-icons/fa";
import { useRouter } from "next/router";
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
    width: 250,
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
    width: 180,
  },
  {
    id: "sub_date",
    numeric: false,
    label: "Quote Submitted Date",
    width: 200,
  },
  {
    id: "urgency",
    numeric: false,
    label: "Type of Request",
    width: 100,
  },
  {
    id: "quote_required_by",
    numeric: false,
    label: "Appraisal Report Required By",
    width: 200,
  },
  // {
  //   id: "user",
  //   numeric: false,
  //   label: "Appraiser",
  //   width: 200,
  // },
  // {
  //   id: "amount",
  //   numeric: false,
  //   label: "Quote Amount",
  //   width: 200,
  // },

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

  // {
  //   id: "actions",
  //   numeric: false,
  //   label: "Actions",
  //   width: 170,
  // },
  {
    id: "actions_01",
    numeric: false,
    label: "Actions",
    width: 110,
  },
];

const data = [
  {
    _id: "6144e83a966145976c75cdfe",
    email: "minagerges123@gmail.com",
    name: "Pending",
    date: "2021-09-17 19:10:50",
    subject: "23456",
    phone: "+96170345114",
    message: "ahlannn",
  },
  {
    _id: "61439914086a4f4e9f9d87cd",
    email: "amineamine1996@gmail.com",
    name: "Completed",
    phone: "+96176466341",
    subject: "12345",
    message: "121212121212121",
    date: "2021-09-16 22:20:52",
  },
  {
    _id: "61439887086a4f4e9f9d87cc",
    email: "as@a.com",
    name: "Progress",
    phone: "+96176466341",
    subject: "54321",
    message: "as",
    date: "2021-09-16 22:18:31",
  },
];

export default function Exemple({
  userData,
  open,
  start,
  end,
  close,
  setPropValue,
  properties,
  setRefresh,
  setModalIsPopupOpen,
  setAllArchive,
  refresh,
  setFilterQuery,
  setModalIsOpenError,
  setSearchInput,
  setProperties,
  searchInput,
  filterQuery,
  deletePropertyHandler,
  setModalOpen,
  setIsCancelProperty,
  setIsHoldProperty,
  setCurrentProperty,
  setPropertyId,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [allBids, setBids] = useState([]);
  const [show, setShow] = useState(false);

  const [dataFetched, setDataFetched] = useState(false);
  let tempData = [];

  const refreshHandler = () => {
    setProperties([]);
    setBids([]);
    setRefresh(true);
  };

  useEffect(() => {
    if (searchInput === "") {
      setProperties([]);
      setBids([]);
      setRefresh(true);
    }
  }, [searchInput]);
  const router = useRouter();

  const openStatusUpdateHandler = () => {
    setIsStatusModal(true);
  };

  const AppraiserStatusOptions = [
    {
      id: -1,
      type: "Select...",
      value: "",
    },
    {
      id: 0,
      type: "Applicant Contacted by appraiser",
      value: "Applicant Contacted by appraiser",
    },
    {
      id: 1,
      type: "Appraisal Visit Confirmed",
      value: "Appraisal Visit Confirmed",
    },
    {
      id: 2,
      type: "Appraisal Report Writing in Progress",
      value: "Appraisal Report Writing in Progress",
    },
    {
      id: 3,
      type: "Appraisal Report Writing Completed and Submitted",
      value: "Appraisal Report Writing Completed and Submitted",
    },

    {
      id: 4,
      type: "Assignment on Hold",
      value: "Assignment on Hold",
    },

    {
      id: 5,
      type: "Assignment Cancelled new status to be added",
      value: "Assignment Cancelled new status to be added",
    },

    {
      id: 6,
      type: "Appraisal visit completed; report writing is pending until fee received",
      value:
        "Appraisal visit completed; report writing is pending until fee received",
    },
  ];

  const getOrderValue = (val) => {
    let title = "";
    AppraiserStatusOptions?.map((status) => {
      if (String(status.id) === String(val)) {
        title = status.type;
      }
    });

    return title;
  };

  const openPopupModal = (property) => {
    setModalIsPopupOpen(true);
    setCurrentProperty(property);
  };

  const onUnarchiveHandler = (id) => {
    const data = JSON.parse(localStorage.getItem("user"));

    toast.loading("un-archiving the property!!...");
    // const encryptedBody = encryptionData(payload);
    axios
      .get("/api/propertyArcheive", {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        params: {
          orderId: id,
          status: false,
          userId: data.userId,
        },
      })
      .then((res) => {
        toast.dismiss();
        toast.success("Successfully unarchived the property!");
        window.location.reload();
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Try again!");
      });
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

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      // second: "numeric",
      hour12: false, // Set to false for 24-hour format
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

  const getPropertyStatusHandler = (property) => {
    let isInProgress = true;
    let isQuoteProvided = false;
    let isCompleted = false;
    let isAccepted = false;
    allBids.map((bid, index) => {
      if (
        bid.orderId === property.orderId &&
        bid.status === 1 &&
        bid.orderStatus === 3
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

  const sortObjectsByOrderIdDescending = (data) => {
    return data.sort((a, b) => b.order_id - a.order_id);
  };

  useEffect(() => {
    const getData = () => {
      properties.map((temp, index) => {
        const property = temp.property;

        if (property.$id) {
          const isStatus = getPropertyStatusHandler(property);
          const isBidded = getBidOfProperty(property.orderId);
          const isHold = property.isOnHold;
          const isCancel = property.isOnCancel;
          const isEditable = isStatus === 0 ? true : false;
          if (true) {
            const updatedRow = {
              order_id: property.orderId,
              sub_date: formatDate(property.addedDatetime),
              quote_required_by: property.quoteRequiredDate
                ? formatDateNew(property.quoteRequiredDate)
                : formatDateNew(property.addedDate),
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
                    <button className="btn btn-status">
                      Current Status
                      <span className="m-1">
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                      </span>
                    </button>
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
                    <button className="btn btn-status">
                      Current Status
                      <span className="m-1">
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>
                ) : (
                  <span className="btn btn-warning w-100">N.A.</span>
                ),
              address: `${property.streetNumber}, ${property.streetName}, ${property.city}, ${property.province}, ${property.zipCode}`,
              // user: property.applicantEmailAddress,
              type_of_building: property.typeOfBuilding,
              amount: ` $${property.estimatedValue}`,
              purpose: property.purpose,
              type_of_appraisal: property.typeOfAppraisal,
              lender_information: property.lenderInformation
                ? property.lenderInformation
                : "N.A.",
              urgency: property.urgency === 0 ? "Rush" : "Regular",

              actions_01: (
                <ul>
                  <li title="Un-Archive Property">
                    <span
                      className="btn btn-color-table"
                      onClick={() => onUnarchiveHandler(property.orderId)}
                    >
                      <Link className="color-light" href={`/archive-property`}>
                        <span className="text-light">
                          <FaArchive />
                        </span>
                      </Link>
                    </span>
                  </li>
                </ul>
                // <ul className="mb0 d-flex gap-1">
                //   <li title="Property Details" className="">
                //     <span
                //       className="btn btn-color-table"
                //       onClick={() => openPopupModal(property)}
                //     >
                //       <Link href={"#"}>
                //         <span className="text-light flaticon-view"></span>
                //       </Link>
                //     </span>
                //   </li>

                //   {!isEditable && (
                //     <li title="Quotes">
                //       <Link
                //         className="btn btn-color-table"
                //         href={`/my-property-bids/${property.orderId}`}
                //       >
                //         <span className="flaticon-invoice"></span>
                //       </Link>
                //     </li>
                //   )}

                //   {(isEditable || isStatus === 1) && (
                //     <li title="Edit Property">
                //       <Link
                //         className="btn btn-color-table"
                //         href={`/create-listing/${property.orderId}`}
                //       >
                //         <span className="flaticon-edit"></span>
                //       </Link>
                //     </li>
                //   )}

                //   {!isCancel && isStatus !== 3 && (
                //     <li title={!isHold ? "On Hold" : "Remove Hold"}>
                //       <span
                //         className="btn btn-color-table "
                //         style={{ border: "1px solid grey" }}
                //         onClick={() =>
                //           openModal(property.orderId, 1, isHold ? 0 : property)
                //         }
                //       >
                //         <Link href="#" className="text-light">
                //           <FaPause />
                //         </Link>
                //       </span>
                //     </li>
                //   )}

                //   {!isCancel && isStatus !== 3 && !isHold && (
                //     <li title={"Order Cancel"}>
                //       <span
                //         className="btn btn-color-table"
                //         style={{ border: "1px solid grey" }}
                //         onClick={() => openModal(property.orderId, 2, property)}
                //       >
                //         <Link href="#">
                //           <span className="flaticon-garbage text-light"></span>
                //         </Link>
                //       </span>
                //     </li>
                //   )}

                //   <li title="Un-Archive Property">
                //     <span
                //       className="btn btn-color-table"
                //       onClick={() => onUnarchiveHandler(property.orderId)}
                //     >
                //       <Link className="color-light" href={`/archive-property`}>
                //         <span className="text-light flaticon-close"></span>
                //       </Link>
                //     </span>
                //   </li>
                // </ul>
              ),
            };
            tempData.push(updatedRow);
          }
        }
      });
      setUpdatedData(tempData);
      setAllArchive(tempData);
    };
    getData();
  }, [properties]);

  useEffect(() => {
    setProperties([]);
    setBids([]);
    setSearchInput("");
    setFilterQuery("All");

    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: userData.token,
    };

    toast.loading("Getting properties...");

    axios
      .get("/api/getAllArchivePropertiesByBroker", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        params: {
          userId: data.userId,
        },
      })
      .then((res) => {
        setDataFetched(true);
        const temp = res.data.data.$values;
        setProperties(temp);
      })
      .catch((err) => {
        setDataFetched(false);
        toast.error(err);
        setModalIsOpenError(true);
      });
    toast.dismiss();

    let tempBids = [];
    axios
      .get("/api/getAllBids", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        tempBids = res.data.data.$values;
        setBids(tempBids);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
        setModalIsOpenError(true);
      });
    toast.dismiss();
    setRefresh(false);
  }, [refresh]);

  console.log(updatedData);

  return (
    <>
      {updatedData && (
        <SmartTable
          title=""
          setFilterQuery={setFilterQuery}
          searchInput={searchInput}
          filterQuery={filterQuery}
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
    </>
  );
}
