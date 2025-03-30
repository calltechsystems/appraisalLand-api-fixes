import { useEffect, useState } from "react";
import SmartTable from "./TabularView";

const SearchData = ({
  data,
  allBids,
  setRefresh,
  setBroker,
  setOpenBrokerModal,
  allSubscirptionHistory,
  allAppraiserCompanyData,
  setOpenEditModal,
  setSelectedUser,
  searchInput,
  setSearchInput,
}) => {
  const [updatedCode, setUpdatedCode] = useState([]);
  const [dataFetched, setDataFetched] = useState(true);

  const headCells = [
    {
      id: "sno",
      numeric: false,
      label: "S. No",
      width: 80,
    },

    {
      id: "appraiser_company",
      numeric: false,
      label: "Appraiser Company Name",
      width: 250,
    },
    {
      id: "plan",
      numeric: false,
      label: "Plan Info",
      width: 160,
    },
    {
      id: "firstname",
      numeric: false,
      label: "First Name",
      width: 160,
    },
    {
      id: "lastname",
      numeric: false,
      label: "Last Name",
      width: 160,
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
      width: 140,
    },
    {
      id: "expiryDateOfSubscirption",
      numeric: false,
      label: "Valid Upto",
      width: 120,
    },
    {
      id: "bids",
      numeric: false,
      label: "Quote Provided",
      width: 140,
    },

    {
      id: "quote_accepted",
      numeric: false,
      label: "Quote Accepted",
      width: 140,
    },

    {
      id: "quote_pending",
      numeric: false,
      label: "Quote Pending",
      width: 140,
    },

    {
      id: "completed_bids",
      numeric: false,
      label: "Quotes Completed",
      width: 170,
    },

    {
      id: "status",
      numeric: false,
      label: "Status",
      width: 140,
    },
    {
      id: "action",
      numeric: false,
      label: "Actions",
      width: 100,
    },
  ];

  // const formatDate = (isoDate) => {
  //   const date = new Date(isoDate);
  //   const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
  //     date.getMonth() + 1
  //   ).padStart(2, "0")}/${date.getFullYear()}`;
  //   return formattedDate;
  // };

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

  const getCurrentAppraiserCompanySubscription = (userId) => {
    const activeSubscirption = allSubscirptionHistory.filter(
      (subscription) => subscription.isActive && subscription.userId == userId
    );
    let planName = "N.A.";
    let expiryDate = "N.A.";
    if (activeSubscirption.length) {
      planName = activeSubscirption[0]?.planName;
      expiryDate = formatDate(activeSubscirption[0].endDate);
    }
    return { planName, expiryDate };
  };

  const openEditModalHandler = (userId) => {
    const appraiserCompany =
      allAppraiserCompanyData.filter((info) => info.userId == userId)?.[0] ||
      {};
    setSelectedUser(appraiserCompany);
    setOpenEditModal(true);
  };

  useEffect(() => {
    let tempData = [];
    const getData = () => {
      data?.map((row, index) => {
        const totalBids = allBidForUser(row.userId).allBid;
        const pendingBids = allBidForUser(row.userId).pendingBids;
        const acceptedBids = allBidForUser(row.userId).acceptedBids;
        const completedBids = allBidForUser(row.userId).completedBids;
        const { planName, expiryDate } = getCurrentAppraiserCompanySubscription(
          row.userId
        );
        const newRow = {
          sno: index + 1,
          appraiser_company: (
            <span
              onClick={() => openViewModal(row)}
              style={{
                textDecoration: "underline",
                color: "blueviolet",
                cursor: "pointer",
              }}
            >
              {!row.officeContactFirstName
                ? "N.A."
                : `${row.officeContactFirstName} ${row.officeContactLastName}`}
            </span>
          ),
          plan: (
            <a style={{
              border: "0px",
              color: "#2e008b",
              textDecoration: "underline",
            }}
            href={`/user-plan-details/${row.userId}`}>
              <span
                style={{
                  textDecoration: "underline",
                  color: "blueviolet",
                  cursor: "pointer",
                }}
              >
                Plan Details
              </span>
            </a>
          ),
          firstname: row.firstName ? row.firstName : "N.A.",
          lastname: row.lastName ? row.lastName : "N.A.",
          registeredUserId: row.emailId ? row.emailId : "N.A.",
          currentSubscription: planName,
          expiryDateOfSubscirption: expiryDate,
          bids: totalBids,
          quote_accepted: acceptedBids,
          quote_pending: pendingBids,
          completed_bids: completedBids,
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

        tempData.push(newRow);
      });
      return tempData;
    };
    const resultedArray = getData();
    setUpdatedCode(resultedArray);
  }, [data, allBids]);

  const allBidForUser = (id) => {
    let allBid = 0,
      acceptedBids = 0,
      completedBids = 0,
      pendingBids = 0;
    allBids?.map((bid, index) => {
      if (String(bid.appraiserUserId) === String(id)) {
        allBid += 1;
        if (bid.status === 1 && bid.orderStatus === 3) {
          completedBids += 1;
        }
        if (bid.status === 1) {
          acceptedBids += 1;
        }
        if (bid.status === 0) {
          pendingBids += 1;
        }
      }
    });
    return { allBid, completedBids, pendingBids, acceptedBids };
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
