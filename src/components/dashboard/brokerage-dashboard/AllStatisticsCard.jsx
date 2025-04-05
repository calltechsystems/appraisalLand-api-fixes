// import './AllStatistics.css';
// import "font-awesome/css/font-awesome.min.css";
import { useMemo } from "react";

const AllStatistics = ({ properties, views, bids, favourites }) => {
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
    totalNoOfProperties,
    UsedPropertiesCount,
    quoteAccepted,
  } = useMemo(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
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
    let totalNoOfProperties = 0;
    let UsedPropertiesCount = 0;
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

    //Plan Data
    const currentPlanInfo = userData?.plans?.$values
      ? userData?.plans?.$values[0]
      : {};
    if (currentPlanInfo) {
      // PlanValidityCount = currentPlanInfo?.planValidity;
      PlanCount = currentPlanInfo?.planName;
      NoOfPropertiesCount = currentPlanInfo?.noOfProperties;
      UsedPropertiesCount = userData?.usedProperties || 0;
      totalNoOfProperties = userData?.totalNoOfProperties || 0;
    }

    // End Date
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
      totalNoOfProperties,
      UsedPropertiesCount,
      quoteAccepted,
    };
  }, [properties, bids]);

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

  const allStatistics = useMemo(
    () => [
      {
        id: "allPropertiesCount",
        blockStyle: "stylecardnew1",
        icon: "fa fa-home",
        timer: properties,
        // icon: "flaticon-house",
        value: allPropertiesCount,
        name: "All Properties",
      },
      {
        id: "quotesProvidedCount",
        blockStyle: "stylecardnew2",
        icon: "fa fa-file",
        value: quotesProvidedCount,
        name: "Quotes Provided",
      },
      {
        id: "quoteAccepted",
        blockStyle: "stylecardnew3",
        icon: "fa fa-check",
        value: quoteAccepted,
        timer: bids,
        name: "Quotes Accepted",
      },
      {
        // id: 4,
        blockStyle: "stylecardnew4",
        icon: "fa fa-edit",
        timer: favourites,
        id: "QuotesInProgressCount",
        blockStyle: "stylecardnew4",
        // icon: "flaticon-heart",
        value: QuotesInProgressCount,
        name: "Quotes in Progress",
      },
      {
        id: "QuotesCompletedCount",
        blockStyle: "stylecardnew5",
        icon: "fa fa-check-circle",
        timer: favourites,
        // icon: "flaticon-invoice",
        value: QuotesCompletedCount,
        name: "Quotes Completed",
      },
      {
        id: "QuotesOnHoldCount",
        blockStyle: "stylecardnew6",
        icon: "fa fa-pause",
        timer: favourites,
        name: "Quotes On Hold by Appraiser",
        // icon: "flaticon-house",
        value: QuotesOnHoldCount,
        // name: "Quotes on HOLD",
      },
      {
        id: "CancelledPropertiesCount",
        blockStyle: "stylecardnew7",
        icon: "fa fa-times-circle",
        timer: favourites,
        // icon: "flaticon-tick",
        value: CancelledPropertiesCount,
        name: "Cancelled Properties",
      },
      {
        id: "OnHoldPropertiesCount",
        blockStyle: "stylecardnew8",
        icon: "fa fa-pause",
        timer: favourites,
        name: "On Hold Properties by Broker",
        // icon: "flaticon-heart",
        value: OnHoldPropertiesCount,
        // name: "On Hold Properties",
      },
      {
        id: "PlanCount",
        blockStyle: "stylecardnew9",
        icon: "fa fa-credit-card",
        timer: favourites,
        // icon: "flaticon-heart",
        value: PlanCount,
        name: "Plan",
      },
      {
        id: "PlanValidityCount",
        blockStyle: "stylecardnew10",
        icon: "fa fa-hourglass-half",
        // timer: formatDate(planEndDate),
        name: "Plan validity",
        // icon: "flaticon-house",
        value: formatDate(PlanValidityCount),
        // name: "Plan Validity",
      },
      {
        id: "NoOfPropertiesCount",
        blockStyle: "stylecardnew11",
        icon: "fa fa-building",
        timer: favourites,
        // icon: "flaticon-invoice",
        value: totalNoOfProperties,
        name: "No. of Properties",
      },
      {
        id: "UsedPropertiesCount",
        blockStyle: "stylecardnew12",
        icon: "fa fa-home",
        timer: favourites,
        // icon: "flaticon-tick",
        value: UsedPropertiesCount,
        name: "Used Properties",
      },
    ],
    [
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
    ]
  );

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
