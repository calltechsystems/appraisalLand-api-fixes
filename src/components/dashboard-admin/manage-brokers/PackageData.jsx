import axios from "axios";
import toast from "react-hot-toast";
import SmartTable from "./TabularView";
import { useEffect, useState } from "react";

const SearchData = ({
  data,
  properties,
  setRefresh,
  setBroker,
  allBids,
  setOpenBrokerModal,
  allSubscriptionHistory,
  allBrokerData,
  setOpenEditModal,
  setSelectedUser,
  setSearchInput,
  searchInput
}) => {
  const [updatedCode, setUpdatedCode] = useState([]);
  const [dataFetched, setDataFetched] = useState(true);

  const headCells = [
    {
      id: "sno",
      numeric: false,
      label: "S.no",
      width: 80,
    },

    {
      id: "broker_name",
      numeric: false,
      label: "Broker Name",
      width: 180,
    },

    {
      id: "firstname",
      numeric: false,
      label: "First Name",
      width: 220,
    },
    {
      id: "lastname",
      numeric: false,
      label: "Last Name",
      width: 220,
    },
    {
      id: "registeredUserId",
      numeric: false,
      label: "Registered User Id",
      width: 220,
    },
    {
      id: "currentSubscription",
      numeric: false,
      label: "Plan Name",
      width: 220,
    },
    {
      id: "expiryDateOfSubscirption",
      numeric: false,
      label: "Valid Upto",
      width: 220,
    },

    {
      id: "submitted_properties",
      numeric: false,
      label: "Properties Submitted",
      width: 180,
    },
    {
      id: "accepted_properties",
      numeric: false,
      label: "Accepted Property",
      width: 170,
    },
    {
      id: "progress_properties",
      numeric: false,
      label: "Appraisal In Progress",
      width: 250,
    },
    {
      id: "completed_properties",
      numeric: false,
      label: "Completed Appraisal",
      width: 190,
    },
    {
      id: "status",
      numeric: false,
      label: "Status",
      width: 150,
    },
    {
      id: "action",
      numeric: false,
      label: "Actions",
      width: 200,
    },
  ];

  const formatDateforISO = (isoDate) => {
    const date = new Date(isoDate);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
    return formattedDate;
  };

  const getBrokerSubscription = (userId) => {
    const activeSubscirption = allSubscriptionHistory.filter(
      (subscription) => subscription.isActive && subscription.userId == userId
    );
    let planName = "N.A.";
    let expiryDate = "N.A.";
    if (activeSubscirption.length) {
      planName = activeSubscirption[0]?.planName;
      expiryDate = formatDateforISO(activeSubscirption[0].endDate);
    }
    return { planName, expiryDate };
  };

  const openEditModalHandler = (userId) => {
    const appraiserCompany =
      allBrokerData.filter((info) => info.userId == userId)?.[0] || {};
    setSelectedUser(appraiserCompany);
    setOpenEditModal(true);
  };

  useEffect(() => {
    let tempData = [];
    const getData = () => {
      data?.map((row, index) => {
        const completedProperties = getPropertySubmitted(
          row.userId
        ).completedProperties;
        const acceptedProperties = getPropertySubmitted(
          row.userId
        ).acceptedProperties;
        const allProperties = getPropertySubmitted(row.userId).allProperties;
        const pendingProperties = getPropertySubmitted(
          row.userId
        ).pendingProperties;
        const { planName, expiryDate } = getBrokerSubscription(
          row.userId
        );
        const newRow = {
          sno: index + 1,
          broker_name: (
            <span
              onClick={() => openViewModal(row)}
              style={{
                textDecoration: "underline",
                color: "blueviolet",
                cursor: "pointer",
              }}
            >
              {/* {row.firstName} {row.lastName} */}
              {!row.firstName ? "NA" : `${row.firstName} ${row.lastName}`}
            </span>
          ),
          firstname: row.firstName ? row.firstName : "N.A.",
          lastname: row.lastName ? row.lastName : "N.A.",
          registeredUserId: row.emailId,
          currentSubscription: planName,
          expiryDateOfSubscirption: expiryDate,
          submitted_properties: allProperties,
          accepted_properties: acceptedProperties,
          progress_properties: pendingProperties,
          completed_properties: completedProperties,
          status: row.isActive ? (
            <span className="btn btn-success  w-100">Active</span>
          ) : (
            <span className="btn btn-danger  w-100">In-Active </span>
          ),
          action: (
            <div className="print-hidden-column">
              {row.firstName && (
                <button
                  className="btn btn-color m-1"
                  onClick={() => openEditModalHandler(data.userId)}
                >
                  <i className="flaticon-edit"></i>
                </button>
              )}
            </div>
          ),
        };

        tempData.push(newRow);
      });
      return tempData;
    };
    const resultedArray = getData();
    setUpdatedCode(resultedArray);
  }, [data, properties]);

  const formatDate = (dateString) => {
    if (dateString === "-") {
      return dateString;
    }
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      // hour: "numeric",
      // minute: "numeric",
      // second: "numeric",
    };

    const originalDate = new Date(dateString);
    const estDate = new Date(originalDate.getTime() - 5 * 60 * 60 * 1000);

    const formattedDate = estDate.toLocaleString("en-US", options);
    return formattedDate;
  };
  const allPropertiesForUser = (id) => {
    let allProperties = 0;
    properties?.map((bid, index) => {
      if (String(bid.userId) === String(id)) {
        allProperties += 1;
      }
    });

    return allProperties;
  };

  const getPropertySubmitted = (userId) => {
    let completedProperties = 0,
      acceptedProperties = 0,
      pendingProperties = 0,
      allProperties = 0;
    allBids.map((bid, index) => {
      if (String(userId) === String(bid.userId)) {
        allProperties += 1;
        if (bid.status === 1 && bid.orderStatus === 3) {
          completedProperties += 1;
        }
        if (bid.status === 1) {
          acceptedProperties += 1;
        }
        if (bid.status === 0) {
          pendingProperties += 1;
        }
      }
    });

    return {
      acceptedProperties,
      completedProperties,
      allProperties,
      pendingProperties,
    };
  };

  const openViewModal = (user) => {
    setBroker(user);
    setOpenBrokerModal(true);
  };

  const refreshHandler = () => {
    setRefresh(true);
  };
  return (
    <>
      <SmartTable
        headCells={headCells}
        data={updatedCode}
        properties={updatedCode}
        dataFetched={dataFetched}
        refreshHandler={refreshHandler}
        setSearchInput={setSearchInput}
        searchInput={searchInput}
      />
    </>
  );
};

export default SearchData;
