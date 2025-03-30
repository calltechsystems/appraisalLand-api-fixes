import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getPayPalAccessToken, PayPalApi } from "./utilFunctions";
import { generateResponsePayload, getCurrentIdToBeCancelled } from "../../../utils/Paypal/GeneratePayloads";

const CancelCheckout = ({
  topUpDetails,
  setErrorOccurred,
  setOnSuccess,
  currentSubscription,
  setErrorMessage,
  paymentType,
  userDetailField,
}) => {
  const [currency, setCurrency] = useState("CAD");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("user")) || {});
  }, []);

  const saveCancellationData = async (payload) => {
    try {
      const response = await axios.post(
        "/api/savePaypalSubscriptionCancellationData",
        payload,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response) {
        setOnSuccess(true);
      }
    } catch (err) {
      console.error("got error while saving the cancellation plan:", err);
      setErrorMessage("Got error while saving the cancellation info to DB");
      setErrorOccurred(true);
    }
  };

  // Function to cancel subscription
  const cancelSubscription = async (subscriptionId) => {
    try {
      toast.loading("Cancelling the Plan");
      const accessToken = await getPayPalAccessToken();

      const cancelSubscriptionStatus = await axios.get(
        `${PayPalApi.baseUrl}/v1/billing/subscriptions/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const cancelSubscriptionResponse = await axios.post(
        `${PayPalApi.baseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`,
        { reason: "Customer requested cancellation" },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const request = { subscriptionId };
      const response = { ...cancelSubscriptionResponse };

      const payload = generateResponsePayload(
        paymentType,
        topUpDetails,
        userData,
        request,
        response,
        currentSubscription,
        topUpDetails,
        userDetailField
      );
      saveCancellationData(payload);

    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      toast.error("Failed to cancel subscription:", error);
      // setErrorMessage(
      //   "Your payment has been processed successfully by PayPal. However, we encountered an issue while updating your subscription. Please contact support with your transaction details for assistance."
      // );
      setErrorOccurred(true);
    } finally {
      toast.dismiss();
    }
  };

  const handleCancelSubscription = () => {
    if (currentSubscription) {
      const paypalSubscriptionId = getCurrentIdToBeCancelled(currentSubscription);
      cancelSubscription(paypalSubscriptionId)
    } else {
      console.error("No subscription ID found.");
      setErrorMessage("No subscription ID found. Please try again");
      setErrorOccurred(true);
    }
  };
  return (
    <div className="checkout text-center">
      <span style={{ fontSize: "17px" }}>
        Please click checkout to proceed with the Order
      </span>
      <br />
      <button
        className="btn btn-color w-50 mt-2"
        // style={{ marginLeft: "20px" }}
        onClick={handleCancelSubscription}
      >
        Cancel Subscription
      </button>
    </div>
  );
};

export default CancelCheckout;
