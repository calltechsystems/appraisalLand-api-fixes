import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { encryptionData } from "../../../utils/dataEncryption";
import { useRouter } from "next/router";
import Loader from "./Loader";

const headCells = [
  {
    id: "sno",
    numeric: false,
    label: "S. No",
    width: 60,
  },
  {
    id: "username",
    numeric: false,
    label: "User ID",
    width: 200,
  },
  {
    id: "firstname",
    numeric: false,
    label: "First Name",
    width: 120,
  },
  {
    id: "lastname",
    numeric: false,
    label: "Last Name",
    width: 120,
  },
  {
    id: "phone",
    numeric: false,
    label: "Phone Number",
    width: 150,
  },
  {
    id: "emailaddress",
    numeric: false,
    label: "Email Address",
    width: 200,
  },
  {
    id: "date",
    numeric: false,
    label: "Start Date",
    width: 200,
  },
  {
    id: "enddate",
    numeric: false,
    label: "End Date",
    width: 200,
  },
  {
    id: "status",
    numeric: false,
    label: "Status",
    width: 170,
  },
  {
    id: "action",
    numeric: false,
    label: "Action",
    width: 100,
  },
];

export default function Exemple({
  userData,
  open,
  close,
  start,
  end,
  setUpdatedCode,
  setCloseRegisterModal,
  properties,
  setIsStatusModal,
  setProperties,
  deletePropertyHandler,
  onWishlistHandler,
  participateHandler,
  setCurrentViewBroker,
  setOpenViewModal,
  setFilterQuery,
  setSearchInput,
  openModalBroker,
  setErrorMessage,
  setModalIsOpenError,
  selectedBroker,
  setSelectedBroker,
  setRefresh,
  setStartLoading,
  refresh,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [allBrokers, setAllBrokers] = useState([]);
  const [bids, setBids] = useState([]);
  const [hideAction, setHideAction] = useState(false);
  const [hideClass, setHideClass] = useState("");
  const [show, setShow] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  let tempData = [];

  const filterBidsWithin24Hours = (property) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    let tempBid = 0,
      bidValue = {};

    console.log(bids);
    bids.filter((bid) => {
      if (bid.propertyId === property.propertyId) {
        console.log("matched", bid);
        tempBid = tempBid + 1;
        bidValue = bid;
      } else {
      }
    });
    return tempBid > 0 ? bidValue : {};
  };

  const openCredModal = (data) => {
    setCurrentViewBroker(data);
    setOpenViewModal(true);
  };

  const findBroker = (userId) => {};

  const router = useRouter();

  const openStatusUpdateHandler = (broker) => {
    setSelectedBroker(broker);
    setIsStatusModal(true);
  };

  const formatPhoneNumber = (number) => {
    if (!number) return ""; // Handle empty input

    // Remove non-numeric characters
    const digits = number.replace(/\D/g, "");

    // Format the number as "416 123-4567"
    if (digits.length <= 3) {
      return digits; // e.g., "416"
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`; // e.g., "416 123"
    } else {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`; // e.g., "416 123-4567"
    }
  };

  const removeWishlistHandler = (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));

    const formData = {
      userId: userdata?.userId,
      propertyId: id,
      token: userdata?.token,
    };

    const payload = encryptionData(formData);
    toast.loading("removing this property into your wishlist");
    axios
      .delete("/api/removeWishlistProperty", {
        headers: {
          Authorization: `Bearer ${userdata?.token}`,
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
      month: "long",
      day: "numeric",
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
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

  const checkWishlistedHandler = (data) => {
    let temp = {};
    console.log(wishlist, data);
    wishlist.map((prop, index) => {
      if (String(prop.propertyId) === String(data?.propertyId)) {
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
    return data?.sort((a, b) => b.orderId - a.orderId);
  };

  const checkData = properties && !updatedData ? true : false;
  useEffect(() => {
    setProperties([]);
  }, [checkData]);

  useEffect(() => {
    let tempData = [];
    const getData = () => {
      const dateNow = formatDate(new Date());
      allBrokers?.map((temp, index) => {
        console.log(temp);
        const data = temp.broker;
        const updatedRow = {
          sno: index + 1,
          username: temp.userInformation,
          firstname: data?.firstName ? data?.firstName : "NA",
          lastname: data?.lastName ? data?.lastName : "NA",
          status:
            data?.isActive && data.firstName !== null ? (
              <span className="btn btn-success  w-100">Active</span>
            ) : !data?.isActive && data?.firstName ? (
              <span className="btn btn-danger  w-100">In-Active</span>
            ) : (
              <span className="btn btn-warning  w-100">Not Registered</span>
            ),
          phone: data?.phoneNumber
            ? formatPhoneNumber(data?.phoneNumber)
            : "NA",
          address: `${data?.streetName} ${data?.streetNumber},${data?.city}-${data?.postalCode}`,
          // date: dateNow,
          emailaddress: data?.emailId ? data?.emailId : "NA",
          date:
            data?.isActive && data?.dateEstablished !== null
              ? formatDateTime(data?.dateEstablished)
              : formatDateTime(data?.dateEstablished),
          enddate:
            // !data?.isActive &&
            // data?.status !== "not registered" &&
            // data?.modifiedDateTime
            //   ? formatDate(data?.modifiedDateTime)
            //   : "-",
            !data?.isActive && data?.modifiedDateTime !== null
              ? formatDateTime(data?.modifiedDateTime)
              : "-",
          action: (
            <div className="print-hidden-column">
              {data.firstName && (
                <button
                  href="#"
                  className="btn btn-color"
                  onClick={() => openStatusUpdateHandler(data)}
                  title="Update Status"
                >
                  <Link href="#">
                    <span className="flaticon-edit text-light"></span>
                  </Link>
                </button>
              )}
              {/* <button
                className="btn btn-color m-1"
                onClick={() => openCredModal(temp)}
              >
                <i className="flaticon-view"></i>
              </button> */}
            </div>
          ),
        };

        tempData.push(updatedRow);
      });
      setUpdatedData(tempData);
    };
    getData();
  }, [allBrokers]);

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
      userId: userData.userId,
    };
    const encryptedData = encryptionData(payload);
    let tempProperties = [],
      tempWishlist = [];

    axios
      .get("/api/getBrokerByBrokerageId", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          userId: data?.brokerageDetail?.id,
        },
      })
      .then((res) => {
        setDataFetched(true);
        console.log(res.data);
        // setAppraiserCompanyInfo(res.data?.data?.brokerage);
        setAllBrokers(res.data?.data?.brokers.$values);
      })
      .catch((err) => {
        setDataFetched(false);
        setErrorMessage(err?.response?.data?.error);
        setModalIsOpenError(true);
      });
    // console.log(err);
    setRefresh(false);
  }, [refresh]);

  function sortAppraisersByStatus(brokers) {
    const users = brokers;
    let finalResult = [];
    let active = [],
      inactive = [],
      registered = [];
    users.map((user, index) => {
      const status = user.status.props.children.trim();
      if (String(status) === "Active") {
        active.push(user);
      }
      if (String(status) === "In-Active") {
        inactive.push(user);
      }
      if (String(status) === "Not Registered") {
        registered.push(user);
      }
    });

    finalResult.push(...active);
    finalResult.push(...inactive);
    finalResult.push(...registered);
    return finalResult;
  }
  return (
    <>
      {refresh ? (
        <Loader />
      ) : (
        <SmartTable
          title=""
          setSearchInput={setSearchInput}
          setFilterQuery={setFilterQuery}
          data={sortAppraisersByStatus(updatedData)}
          headCells={headCells}
          setRefresh={setRefresh}
          setProperties={setProperties}
          setCloseRegisterModal={setCloseRegisterModal}
          refresh={refresh}
          refreshHandler={refreshHandler}
          dataFetched={dataFetched}
          properties={updatedData}
          setStartLoading={setStartLoading}
          start={start}
          end={end}
        />
      )}
    </>
  );
}
