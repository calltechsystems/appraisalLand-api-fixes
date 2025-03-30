import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { encryptionData } from "../../../utils/dataEncryption";
import { useRouter } from "next/router";
import Loader from "./Loader";
// import "./SmartTable.css";

const headCells = [
  {
    id: "orderId",
    numeric: false,
    label: "Property ID",
    width: 100,
  },

  {
    id: "appraiser_name",
    numeric: false,
    label: "Appraiser info",
    width: 200,
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
    id: "typeOfBuilding",
    numeric: false,
    label: "Type of Property",
    width: 200,
  },
  
  {
    id: "estimatedValue",
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
    label: "Action",
    width: 180,
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
  setIsStatusModal,
  setProperties,
  deletePropertyHandler,
  onWishlistHandler,
  participateHandler,
  setFilterQuery,
  setSearchInput,
  openModalBroker,
  setErrorMessage,
  setModalIsOpenError,
  setRefresh,
  setStartLoading,
  refresh,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [bids, setBids] = useState([]);
  const [hideAction, setHideAction] = useState(false);
  const [hideClass, setHideClass] = useState("");
  const [show, setShow] = useState(false);
  let tempData = [];

  const filterBidsWithin24Hours = (property) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    let tempBid = 0,
      bidValue = {};
      console.log(bids);
    bids.filter((bid) => {
      if (bid.propertyId === property.propertyId ) {
        console.log("matched", bid);
        tempBid = tempBid + 1;
        bidValue = bid;
      } else {
      }
    });
    return tempBid > 0 ? bidValue : {};
    // const currentTime = new Date();
    // const twentyFourHoursAgo = currentTime - 24 * 60 * 60 * 1000; // Subtracting milliseconds for 24 hours
    //    const requestTime = new Date(tempBid.requestTime);
    //   return requestTime >= twentyFourHoursAgo && requestTime <= currentTime;
  };

  const router = useRouter();

  const openStatusUpdateHandler = () => {
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
        window.location.reload();
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response?.data?.error);
      });
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

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  const checkWishlistedHandler = (data) => {
    let temp = {};
    // console.log(wishlist, data);
    wishlist.map((prop, index) => {
      if (String(prop.propertyId) === String(data.propertyId) && String(prop.userId) === String(userData.userId) ) {
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
    return data.sort((a, b) => b.orderId - a.orderId);
  };

  
  const checkData = (properties && !updatedData) ? true : false;
  useEffect(()=>{
    setProperties([]);
  },[checkData]);

  useEffect(() => {
    const getData = () => {
      properties.map((property, index) => {
        const isWishlist = checkWishlistedHandler(property);
        const isBidded = filterBidsWithin24Hours(property);
        

        const updatedRow = {
          orderId: property.orderId ,
          address: `${property.city}-${property.province},${property.zipCode}`,
          estimatedValue: property.estimatedValue
            ? `$ ${property.estimatedValue}`
            : "$ 0",
            
          purpose: property.purpose ? property.purpose : "NA",
          appraiser_name:"",
          appraisal_status: isBidded.bidId ? (
            isBidded.status === 0 ? (
              <span
                className="btn bg-info text-light  w-100"
              >
                Quote Provided
              </span>
            ) : isBidded.status === 1 ? (
              <span
                className="btn btn-success  w-100"
                
              >
                Accepted
              </span>
            ) : (
              <span className="btn btn-danger  w-100">Rejected</span>
            )
          ) : (
            <span className="btn btn-warning  w-100">New</span>
          ),
          status: isBidded.bidId ? (
            isBidded.status === 0 ? (
              <span
                className="btn bg-info text-light  w-100"
              >
                Quote Provided
              </span>
            ) : isBidded.status === 1 ? (
              <span
                className="btn btn-success  w-100"
                
              >
                Accepted
              </span>
            ) : (
              <span className="btn btn-danger  w-100">Rejected</span>
            )
          ) : (
            <span className="btn btn-warning  w-100">New</span>
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
                    onClick={() => openModalBroker(property,1)}
                  >
                   Broker Info
                  </button>
                </a>
              ) : isBidded.status === 2 ? (
                <h6 style={{ color: "red" }}> Declined</h6>
              ) : (
                <p>
                  Broker Information will be available post the quote acceptance
                </p>
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
                    onClick={() => openModalBroker(property,2)}
                  >
                    Property Info
                  </button>
                </a>
              ) : isBidded.status === 2 ? (
                <h6 style={{ color: "red" }}> Declined</h6>
              ) : (
                <p>
                  Broker Information will be available post the quote acceptance
                </p>
              )}
            </div>
          ),
          type_of_appraisal: property.typeOfAppraisal
            ? property.typeOfAppraisal
            : "NA",
          typeOfBuilding:
            property.typeOfBuilding > 0 ? "Apartment" : property.typeOfBuilding,
          quote_required_by: formatDate(property.addedDatetime),
          date: formatDate(property.addedDatetime),
          bidAmount: property.bidLowerRange,
          lender_information: property.lenderInformation
            ? property.lenderInformation
            : "NA",
          urgency:
            property.urgency === 0
              ? "Rush"
              : property.urgency === 1
              ? "Regular"
              : "NA",

          action: (
            <div className="print-hidden-column">
              {isBidded && isBidded.status !== 1 ? (
                <ul className="">
                  {isWishlist.id ? (
                    <button
                      className="btn "
                      style={{ border: "1px solid grey" }}
                      onClick={() => removeWishlistHandler(isWishlist.id)}
                    >
                      <img
                        width={26}
                        height={26}
                        src="https://png.pngtree.com/png-clipart/20200226/original/pngtree-3d-red-heart-cute-valentine-romantic-glossy-shine-heart-shape-png-image_5315044.jpg"
                      />
                    </button>
                  ) : (
                    <li
                      className="list-inline-item"
                      title="Wishlist Property"
                      style={{
                        width: "30px",
                        border: "none",
                        textAlign: "center",
                        borderRadius: "5px",
                      }}
                    >
                      {
                        <button
                          className="btn"
                          style={{ border: "1px solid grey" }}
                          onClick={() => onWishlistHandler(property.propertyId)}
                        >
                          <span className="flaticon-heart text-color"></span>
                        </button>
                      }
                    </li>
                  )}

                  {!isBidded.$id && (
                    <li
                      className="list-inline-item"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Provide Quote"
                    >
                      <div
                        className="w-100"
                        onClick={() =>
                          participateHandler(
                            property.bidLowerRange,
                            property.propertyId
                          )
                        }
                      >
                        <button
                          href="#"
                          className="btn btn-color w-100 mt-1"
                          style={{ marginLeft: "12px" }}
                        >
                          Provide Quote
                        </button>
                      </div>
                    </li>
                  )}

                 
                  <li
                  className="list-inline-item"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Provide Quote"
                >
                  <div
                    className="w-100"
                    onClick={() =>
                      onDeletePropertyHandler(property.propertyId)
                    }
                  >
                    <button
                      href="#"
                      className="btn btn-color w-100 mt-1"
                      style={{ marginLeft: "12px" }}
                    >
                    Archive Property
                    </button>
                  </div>
                </li>
                </ul>
              ) : (
                 <button
                          href="#"
                          className="btn btn-color w-100 mt-1"
                          style={{ marginLeft: "12px" }}
                          onClick={openStatusUpdateHandler}
                        >
                          Order Update
                        </button>
              )}
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
    console.log("inside");
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: userData.token,
    };
    let tempProperties = [],
      tempWishlist = [];
    axios
      .get("/api/getPropertiesById", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          userId: data?.userId,
        },
      })
      .then((res) => {
        const temp = res.data.data.property.$values;

        tempProperties = temp.filter((prop,index)=>{
          if(String(prop.userId) === String(data.userId)){
            return true
          }
          else{
            return false
          }
        })
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.error);
        setModalIsOpenError(true);
      });
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
    let tempBids = [];
    axios
      .get("/api/getAllBids", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })
      .then((res) => {
        console.log(res);
        tempBids = res.data.data.result.$values;
        const updatedBids = tempBids.filter((prop,index)=>{
          if(String(prop.appraiserUserId) === String(data.userId)){
            return true;
          }
          else{
            return false;
          }
        })
        setBids(updatedBids);
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.error);
        setModalIsOpenError(true);
      });

    console.log("end", bids, properties, wishlist);
    setRefresh(false);
  }, [refresh]);
  console.log(sortObjectsByOrderIdDescending(updatedData));
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
          end={end}
        />
      )}
    </>
  );
}
