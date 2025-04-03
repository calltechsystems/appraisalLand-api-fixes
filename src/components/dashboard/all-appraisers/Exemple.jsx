import { useEffect, useState } from "react";
import SmartTable from "./SmartTable";
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
    label: "Phone",
    width: 150,
  },

  {
    id: "email",
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
    width: 180,
  },
  {
    id: "action",
    numeric: false,
    label: "Action",
    width: 100,
  },
];

const temporaryData = [
  {
    email: "test@gmail.com",
    firstname: "Joe",
    lastname: "Doe",
    company: "Appraiser Company 1",
    phone: "+91 12324 235644",
    date: " 29 December 2023",
  },
  {
    email: "test@gmail.com",
    firstname: "Joe",
    lastname: "Doe",
    company: "Appraiser Company 1",
    phone: "+91 12324 235644",
    date: " 29 December 2023",
  },
  {
    email: "test@gmail.com",
    firstname: "Joe",
    lastname: "Doe",
    company: "Appraiser Company 1",
    phone: "+91 12324 235644",
    date: " 29 December 2023",
  },
  {
    email: "test@gmail.com",
    firstname: "Joe",
    lastname: "Doe",
    company: "Appraiser Company 1",
    phone: "+91 12324 235644",
    date: " 29 December 2023",
  },
  {
    email: "test@gmail.com",
    firstname: "Joe",
    lastname: "Doe",
    company: "Appraiser Company 1",
    phone: "+91 12324 235644",
    date: " 29 December 2023",
  },
];
let count = 0;

export default function Exemple({
  userData,
  open,
  close,
  setAssignAppraiserId,
  start,
  setAppraiser,
  end,
  setUpdatedCode,
  setCurrentViewAppraiser,
  setOpenViewModal,
  setAppraiserCompanyInfo,
  setCloseRegisterModal,
  properties,
  setIsStatusModal,
  setProperties,
  setFilterQuery,
  setSearchInput,
  openModalBroker,
  setErrorMessage,
  setModalIsOpenError,
  setOpenEditModal,
  setSelectedAppraiser,
  setallListedAssignAppraiser,
  setRefresh,
  setStartLoading,
  refresh,
}) {
  const [updatedData, setUpdatedData] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [dataFetched, setDataFetched] = useState(false);
  const [bids, setBids] = useState([]);
  const [allAppraiser, setAllAppraiser] = useState([]);
  const [hideAction, setHideAction] = useState(false);
  const [hideClass, setHideClass] = useState("");
  const [show, setShow] = useState(false);
  let tempData = [];

  const openCredModal = (data) => {
    setCurrentViewAppraiser(data);
    setOpenViewModal(true);
  };

  const router = useRouter();

  const openStatusUpdateHandler = () => {
    setIsStatusModal(true);
  };

  const openEditModalHandler = (appraiser) => {
    setAssignAppraiserId(appraiser.id);
    setSelectedAppraiser(appraiser);
    setOpenEditModal(true);
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

  const sortObjectsByOrderIdDescending = (data) => {
    return data.sort((a, b) => b.appraisal_id - a.appraisal_id);
  };

  const checkData = properties && !updatedData ? true : false;
  useEffect(() => {
    setProperties([]);
  }, [checkData]);

  const getCurrentDate = (id) => {
    let specificAppraiser = {};
    allAppraiser.map((appraiser, index) => {
      if (String(appraiser.id) === String(id)) {
        specificAppraiser = appraiser;
      }
    });
    return specificAppraiser;
  };

  useEffect(() => {
    const getData = () => {
      const dateNow = formatDate(new Date());
      properties.map((data, index) => {
        const getCurrentdate = getCurrentDate(data?.item?.id);

        const updatedRow = {
          sno: index + 1,
          username: data.userInfo,
          appraiser_id: data.item.id,
          firstname: data.item.firstName ? data.item.firstName : "-",
          lastname: data.item.lastName ? data.item.lastName : "-",
          email: data.item.emailId ? data.item.emailId : "-",
          status:
            data.item.isActive && data?.item?.firstName ? (
              <span className="btn btn-success  w-100">Active</span>
            ) : !data?.item?.isActive && data?.item?.firstName ? (
              <span className="btn btn-danger  w-100">In-Active </span>
            ) : (
              <span className="btn btn-warning  w-100">Not Registered</span>
            ),
          phone: data.item.phoneNumber
            ? formatPhoneNumber(data.item.phoneNumber)
            : "-",
          address: data.item.streetName
            ? `${data.item.streetName} ${data.item.streetNumber},${data.item.province}-${data.item.postalCode}`
            : "N.A.",
          date:
            data?.item?.isActive && data?.item?.dateEstablished !== null
              ? formatDateTime(data?.item?.dateEstablished)
              : formatDateTime(data?.item?.dateEstablished),
          enddate:
            // !data?.isActive &&
            // data?.status !== "not registered" &&
            // data?.modifiedDateTime
            //   ? formatDate(data?.modifiedDateTime)
            //   : "-",
            !data?.item?.isActive && data?.item?.modifiedDateTime !== null
              ? formatDateTime(data?.item?.modifiedDateTime)
              : "-",
          action: (
            <div className="print-hidden-column">
              {data.item.firstName && (
                <button
                  className="btn btn-color m-1"
                  onClick={() => openEditModalHandler(data.item)}
                >
                  <i className="flaticon-edit"></i>
                </button>
              )}
              {/* <button
                className="btn btn-color m-1"
                onClick={() => openCredModal(data)}
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
  }, [properties]);

  useEffect(() => {
    setUpdatedCode(true);
  }, [updatedData]);

  const refreshHandler = () => {
    setRefresh(true);
    setStartLoading(true);
  };
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    const payload = {
      token: userData.token,
      userId: userData.userId,
    };
    const encryptedData = encryptionData(payload);
    axios
      .get("/api/getAllAppraiserByCompanyId", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          // companyId: data?.appraiserCompanyDetail?.appraiserCompanyId || "", 
          userId: data?.appraiserCompanyDetail?.appraiserCompanyId || "", 

        },
      })
      .then((res) => {
        setDataFetched(true);
        setAppraiserCompanyInfo([]); // Ensure this reset is necessary
        setProperties(res.data?.data?.$values || []); // Avoid undefined issues
      })
      .catch((err) => {
        setDataFetched(false);
        setErrorMessage(
          err?.response?.data?.error ||
            "Something went wrong. Please try again."
        );
        setModalIsOpenError(true);
      });

    axios
      .get("/api/getAllAssignProperties", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        params: {
          userId: data.appraiserCompanyDetail?.appraiserCompanyId,
        },
      })
      .then((res) => {
        let tempProperties = res.data.data.$values;
        const temp = res.data.data.$values;

        setallListedAssignAppraiser(tempProperties);
      })
      .catch((err) => {});

    setRefresh(false);
  }, [refresh]);

  function sortAppraisersByStatus(appraisers) {
    const users = appraisers;
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
          properties={updatedData}
          dataFetched={dataFetched}
          refreshHandler={refreshHandler}
          setStartLoading={setStartLoading}
          start={start}
          end={end}
        />
      )}
    </>
  );
}
