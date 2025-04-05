// utils/dashboardUtils.js

export const calculate = (searchDate, diff) => {
  const newDateObj = new Date(searchDate);
  const currentObj = new Date();

  const getMonthsFDiff = currentObj.getMonth() - newDateObj.getMonth();
  const gettingDiff = currentObj.getDate() - newDateObj.getDate();
  const gettingYearDiff = currentObj.getFullYear() - newDateObj.getFullYear();

  const estimatedDiff =
    gettingDiff + getMonthsFDiff * 30 + gettingYearDiff * 365;
  return estimatedDiff <= diff;
};

export const getWishlishtTime = (wishlist, orderId) => {
  let time = "";
  wishlist.forEach((bid) => {
    if (String(bid.propertyId) === String(orderId)) {
      time = bid.addedDateTime;
    }
  });
  return time;
};

export const getBiddedTime = (bids, orderId) => {
  let time = "";
  bids.forEach((bid) => {
    if (String(bid.orderId) === String(orderId)) {
      time = bid.requestTime;
    }
  });
  return time;
};

export const filterData = (
  tempData,
  FilteringType,
  bids,
  wishlist,
  setDefaultCardsValues
) => {
  let tempAllBids = 0,
    tempAllWishlist = 0;

  const currentDate = new Date();

  let monthlyData = new Array(12).fill(0);
  let weeklyData = new Array(7).fill(0);

  switch (FilteringType) {
    case "Last 7 days":
      const sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(currentDate.getDate() - 7);

      tempData.forEach((item) => {
        const bidTime = getBiddedTime(bids, item.orderId);
        const wishlistTime = getWishlishtTime(wishlist, item.propertyId);

        if (bidTime && calculate(bidTime, 7)) {
          tempAllBids += 1;
          weeklyData[new Date(bidTime).getDay()]++;
        }

        if (wishlistTime && calculate(wishlistTime, 7)) {
          tempAllWishlist += 1;
          weeklyData[new Date(wishlistTime).getDay()]++;
        }
      });

      setDefaultCardsValues(tempAllBids, tempAllWishlist);
      return {
        data: weeklyData,
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      };

    case "Last 30 Days":
      const thirtyDaysAgo = new Date(currentDate);
      thirtyDaysAgo.setDate(currentDate.getDate() - 30);

      tempData.forEach((item) => {
        const bidTime = getBiddedTime(bids, item.orderId);
        const wishlistTime = getWishlishtTime(wishlist, item.propertyId);

        if (bidTime && calculate(bidTime, 30)) {
          tempAllBids += 1;
          monthlyData[new Date(bidTime).getDate() - 1]++;
        }

        if (wishlistTime && calculate(wishlistTime, 30)) {
          tempAllWishlist += 1;
          monthlyData[new Date(wishlistTime).getDate() - 1]++;
        }
      });

      setDefaultCardsValues(tempAllBids, tempAllWishlist);
      return {
        data: monthlyData,
        labels: Array.from({ length: 30 }, (_, i) => i + 1),
      };

    default:
      return {
        data: [],
        labels: [],
      };
  }
};

const setDefaultCardsValues = (bids, wishlists, setAllBiddedCards) => {
  setAllBiddedCards(bids);
  setAllWishlistedCards(wishlists);
};

export function getWeekNumber(date) {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
}

export const closePlanErrorModal = (router) => {
  router.push("/add-subscription");
};

export const closeErrorModal = (setModalIsOpenError) => {
  setModalIsOpenError(false);
};
