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
  allBrokerageData,
  setOpenEditModal,
  setSelectedUser,
  searchInput,
  setSearchInput,
  setTotalPropertiesCount,
  setTotalCompletedPropertiesCount,
  setTotalAcceptPropertiesCount,
  setTotalPendingPropertiesCount,
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
      id: "brokerage_name",
      numeric: false,
      label: "Brokerage Name",
      width: 200,
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
      width: 180,
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
      label: "Appraisal Completed",
      width: 180,
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

  const formatDateFromIso = (isoDate) => {
    const date = new Date(isoDate);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
    return formattedDate;
  };

  const getCurrentBrokerageCompanySubscription = (userId) => {
    const activeSubscirption = allSubscriptionHistory.filter(
      (subscription) => subscription.isActive && subscription.userId == userId
    );
    let planName = "N.A.";
    let expiryDate = "N.A.";
    if (activeSubscirption.length) {
      planName = activeSubscirption[0]?.planName;
      expiryDate = formatDateFromIso(activeSubscirption[0].endDate);
    }
    return { planName, expiryDate };
  };

  const openEditModalHandler = (userId) => {
    const appraiserCompany =
      allBrokerageData.filter((info) => info.userId == userId)?.[0] || {};
    setSelectedUser(appraiserCompany);
    setOpenEditModal(true);
  };

  useEffect(() => {
    let tempData = [];
    let totalPropertiesCount = 0; // Variable to store total Properties count
    let totalPendingPropertiesCount = 0;
    let totalAcceptPropertiesCount = 0;
    let totalCompletedPropertiesCount = 0;

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
        const { planName, expiryDate } = getCurrentBrokerageCompanySubscription(
          row.userId
        );
        const newRow = {
          sno: index + 1,
          brokerage_name: (
            <span
              onClick={() => openViewModal(row)}
              style={{
                textDecoration: "underline",
                color: "blueviolet",
                cursor: "pointer",
              }}
            >
              {row.assistantFirstName == ""
                ? "N.A."
                : `${row.assistantFirstName} ${row.assistantLastName}`}
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
          status: row.firstName ? (
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

        // Add totalBids of the current user to the total count
        totalPropertiesCount += allProperties || 0;
        totalPendingPropertiesCount += pendingProperties || 0;
        totalAcceptPropertiesCount += acceptedProperties || 0;
        totalCompletedPropertiesCount += completedProperties || 0;

        setTotalPropertiesCount(totalPropertiesCount);
        setTotalPendingPropertiesCount(totalPendingPropertiesCount);
        setTotalAcceptPropertiesCount(totalAcceptPropertiesCount);
        setTotalCompletedPropertiesCount(totalCompletedPropertiesCount);

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
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
    </>
  );
};

export default SearchData;
