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
  FaEye,
} from "react-icons/fa";
import { useRouter } from "next/router";
import Image from "next/image";
// import "./SmartTable.css";
import { AppraiserStatusOptions } from "../create-listing/data";

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
    width: 250,
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
  filterQuery,
  searchInput,
  setFilterQuery,
  setModalIsOpenError,
  setSearchInput,
  setProperties,
  deletePropertyHandler,
  setModalOpen,
  setIsCancelProperty,
  setIsHoldProperty,
  setCurrentProperty,
  setPropertyId,
  setIsLoading,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [allBids, setBids] = useState([]);
  const [show, setShow] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [remarkModal, setRemarkModal] = useState(false);
  const [remark, setRemark] = useState("N.A.");
  const [dataFetched, setDataFetched] = useState(false);
  let tempData = [];

  useEffect(() => {
    if (searchInput === "") {
      setRefresh(true);
    }
  }, [searchInput]);

  const refreshHandler = () => {
    setProperties([]);
    setBids([]);
    setFilterQuery("All");
    setSearchInput("");
    setRefresh(true);
  };

  const router = useRouter();

  const openStatusUpdateHandler = () => {
    setIsStatusModal(true);
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

  const openPopupModal = (property) => {
    setModalIsPopupOpen(true);
    setCurrentProperty(property);
  };

  const openArchiveModal = (property) => {
    setSelectedProperty(property); // Store the selected property
    setArchiveModal(true);
  };

  const closeArchiveModal = () => {
    setSelectedProperty(null); // Clear the selected property
    setArchiveModal(false); // Close the modal
  };

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const onUnarchiveHandler = (id) => {
    setIsLoading(true);
    const data = JSON.parse(localStorage.getItem("user"));

    toast.loading("Un-archiving the property!!...");
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
        setIsLoading(false);
        toast.success("Successfully unarchived the property!");
        location.reload();
        // setRefresh(true);
      })
      .catch((err) => {
        toast.dismiss();
        setIsLoading(false);
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

  const formatDateTime = (dateString) => {
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
          const isHold = property.isonhold;
          const isCancel = property.isoncancel;
          console.log("property", property);
          const isEditable = isStatus === 0 ? true : false;
          if (true) {
            const updatedRow = {
              order_id: property.orderId,
              sub_date: formatDateTime(property.addedDatetime),
              quote_required_by: property.quoteRequiredDate
                ? formatDate(property.quoteRequiredDate)
                : formatDate(property.addedDate),
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
                ) : isBidded.orderstatus !== 1 &&
                  isBidded.orderstatus !== null &&
                  isBidded.orderstatus !== undefined ? (
                  // <span className="btn bg-warning  w-100">
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
                  // <span className="btn bg-warning  w-100">
                  //   {getOrderValue(isBidded.orderstatus)} -{" "}
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
                  <li title="Un-Archive Property">
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
                </ul>
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
    setFilterQuery("All");
    setSearchInput("");
    setProperties([]);
    setBids([]);

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
          setSearchInput={setSearchInput}
          data={sortObjectsByOrderIdDescending(updatedData)}
          headCells={headCells}
          refreshHandler={refreshHandler}
          start={start}
          searchInput={searchInput}
          filterQuery={filterQuery}
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
              Order Confirmation – Property Id{" "}
              <span style={{ color: "#97d700" }}>
                #{selectedProperty?.orderId}
              </span>
            </h3>
            <div className="mb-2" style={{ border: "2px solid #97d700" }}></div>
            <p className="fs-5 text-center text-dark mt-4">
              Are you sure for the order to be{" "}
              <span className="text-danger fw-bold">Un-archived</span> ?
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
                  onUnarchiveHandler(selectedProperty?.orderId);
                  setArchiveModal(false);
                }}
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
