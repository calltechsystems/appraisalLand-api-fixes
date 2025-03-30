import { useMemo } from "react";

const AllStatistics = ({ properties, views, bids, favourites }) => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const userTypes = Array.isArray(userData?.userType)
    ? userData.userType
    : [userData?.userType]; // Handle multiple user types

  const {
    allPropertiesCount,
    quotesProvidedCount,
    QuotesInProgressCount,
    QuotesCompletedCount,
    QuotesOnHoldCount,
    CancelledPropertiesCount,
    OnHoldPropertiesCount,
    PlanCount,
    PlanValidityCount,
    NoOfPropertiesCount,
    UsedPropertiesCount,
    totalNoOfProperties,
    quoteAccepted,
  } = useMemo(() => {
    let allPropertiesCount = 0;
    let quotesProvidedCount = 0;
    let QuotesInProgressCount = 0;
    let QuotesCompletedCount = 0;
    let QuotesOnHoldCount = 0;
    let CancelledPropertiesCount = 0;
    let OnHoldPropertiesCount = 0;
    let PlanCount = 0;
    let PlanValidityCount = 0;
    let NoOfPropertiesCount = 0;
    let UsedPropertiesCount = 0;
    let totalNoOfProperties = 0;
    let quoteAccepted = 0;

    properties?.forEach((property) => {
      if (property.userId == userData?.userId) {
        allPropertiesCount += 1;
        CancelledPropertiesCount += property?.isoncancel ? 1 : 0;
        OnHoldPropertiesCount += property?.isonhold ? 1 : 0;

        bids.forEach((bid) => {
          if (bid.orderId == property?.orderId) {
            quotesProvidedCount += bid.status <= 1 ? 1 : 0;
            QuotesInProgressCount += bid?.status == 0 ? 1 : 0;
            quoteAccepted +=
              bid.status == 1 && bid?.orderStatus == null ? 1 : 0;
            QuotesCompletedCount +=
              bid?.status == 1 && bid?.orderstatus == 3 ? 1 : 0;
              QuotesOnHoldCount += bid?.orderstatus == 4 ? 1 : 0;
          }
        });
      }
    });

    // Plan Data
    const currentPlanInfo = userData?.plans?.$values
      ? userData?.plans?.$values[0]
      : {};
    if (currentPlanInfo) {
      PlanCount = currentPlanInfo?.planName;
      NoOfPropertiesCount = currentPlanInfo?.noOfProperties;
      UsedPropertiesCount = userData?.usedProperties || 0;
      totalNoOfProperties = userData?.totalNoOfProperties || 0;
    }

    // Subscription End Date
    const userPlans = userData?.userSubscription?.$values
      ? userData?.userSubscription?.$values[0]
      : {};
    if (userPlans) {
      PlanValidityCount = userPlans?.endDate;
    }

    return {
      allPropertiesCount,
      quotesProvidedCount,
      QuotesInProgressCount,
      QuotesCompletedCount,
      QuotesOnHoldCount,
      CancelledPropertiesCount,
      OnHoldPropertiesCount,
      PlanCount,
      PlanValidityCount,
      NoOfPropertiesCount,
      UsedPropertiesCount,
      totalNoOfProperties,
      quoteAccepted,
    };
  }, [properties, bids]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  // Define statistics data
  const allStatistics = useMemo(() => {
    const stats = [
      {
        id: "allPropertiesCount",
        blockStyle: "stylecardnew1",
        icon: "fa fa-home",
        value: allPropertiesCount,
        name: "All Properties",
        visibleFor: [1, 6], // User type 1 & 6
      },
      {
        id: "quotesProvidedCount",
        blockStyle: "stylecardnew2",
        icon: "fa fa-file",
        value: quotesProvidedCount,
        name: "Quotes Provided",
        visibleFor: [1, 6], // Only user type 1
      },
      {
        id: "quoteAccepted",
        blockStyle: "stylecardnew3",
        icon: "fa fa-check",
        value: quoteAccepted,
        name: "Quotes Accepted",
        visibleFor: [1, 6],
      },
      {
        id: "QuotesInProgressCount",
        blockStyle: "stylecardnew4",
        icon: "fa fa-edit",
        value: QuotesInProgressCount,
        name: "Quotes in Progress",
        visibleFor: [1],
      },
      {
        id: "QuotesCompletedCount",
        blockStyle: "stylecardnew5",
        icon: "fa fa-check-circle",
        value: QuotesCompletedCount,
        name: "Quotes Completed",
        visibleFor: [1, 6],
      },
      {
        id: "QuotesOnHoldCount",
        blockStyle: "stylecardnew6",
        icon: "fa fa-pause",
        value: QuotesOnHoldCount,
        name: "Quotes On Hold",
        visibleFor: [1, 6],
      },
      {
        id: "CancelledPropertiesCount",
        blockStyle: "stylecardnew7",
        icon: "fa fa-times-circle",
        value: CancelledPropertiesCount,
        name: "Cancelled Properties",
        visibleFor: [1, 6],
      },
      {
        id: "OnHoldPropertiesCount",
        blockStyle: "stylecardnew8",
        icon: "fa fa-pause",
        value: OnHoldPropertiesCount,
        name: "On Hold Properties",
        visibleFor: [1, 6],
      },
      {
        id: "PlanCount",
        blockStyle: "stylecardnew9",
        icon: "fa fa-credit-card",
        value: PlanCount,
        name: "Plan",
        visibleFor: [1],
      },
      {
        id: "PlanValidityCount",
        blockStyle: "stylecardnew10",
        icon: "fa fa-hourglass-half",
        value: formatDate(PlanValidityCount),
        name: "Plan Validity",
        visibleFor: [1],
      },
      {
        id: "NoOfPropertiesCount",
        blockStyle: "stylecardnew11",
        icon: "fa fa-building",
        value: totalNoOfProperties,
        name: "No. of Properties",
        visibleFor: [1],
      },
      {
        id: "UsedPropertiesCount",
        blockStyle: "stylecardnew12",
        icon: "fa fa-home",
        value: UsedPropertiesCount,
        name: "Used Properties",
        visibleFor: [1],
      },
    ];

    // Filter statistics based on userType
    return stats.filter((stat) =>
      userTypes.some((type) => stat.visibleFor.includes(type))
    );
  }, [
    allPropertiesCount,
    quotesProvidedCount,
    QuotesInProgressCount,
    QuotesCompletedCount,
    QuotesOnHoldCount,
    CancelledPropertiesCount,
    OnHoldPropertiesCount,
    PlanCount,
    PlanValidityCount,
    NoOfPropertiesCount,
    UsedPropertiesCount,
    userTypes,
  ]);

  return (
    <div className="statistics-container">
      {allStatistics.map((item) => (
        <div key={item.id} className={`ff_one ${item.blockStyle}`}>
          <div className="details">
            <div className="timer">{item.name}</div>
            <p>{item.value}</p>
          </div>
          <div className="icon">
            <i className={item.icon}></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllStatistics;
