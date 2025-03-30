import React, { useEffect, useState } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import toast from "react-hot-toast";
import axios from "axios";

import {
  generateRequestPayload,
  generateResponsePayload,
  getCurrentIdToBeCancelled,
  getNextDate,
} from "../../../utils/Paypal/GeneratePayloads.js";
import { getPayPalAccessToken, PayPalApi } from "./utilFunctions.js";

const Checkout = ({
  topUpDetails,
  setErrorOccurred,
  setOnSuccess,
  currentSubscription,
  paymentType,
  setErrorMessage,
  userDetailField,
}) => {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const [currency, setCurrency] = useState(options.currency || "CAD");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("user")) || {});
  }, [topUpDetails]);

  const onCurrencyChange = ({ target: { value } }) => {
    setCurrency(value);
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: value,
      },
    });
  };

  const createSubscription = (data, actions) => {
    const payload = generateRequestPayload(
      paymentType,
      currentSubscription,
      userData,
      currency,
      userDetailField
    );
    return actions.subscription.create(payload);
  };

  const saveCancellationPlanData = async (payload) => {
    try {
      const cancellationResponse = await axios.post(
        "/api/savePaypalSubscriptionCancellationData",
        payload,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (cancellationResponse) {
        setOnSuccess(true);
      } else {
        setErrorMessage(
          "Your subscription payment was processed by PayPal. However, we encountered an issue while updating your account. Please contact support with your transaction details."
        );
        setErrorOccurred(true);
      }
    } catch (err) {
      console.error("Got error while saving the cancellation data", err);
      setErrorMessage(
        "Your subscription payment was processed by PayPal. However, we encountered an issue while updating your account. Please contact support with your transaction details."
      );
      setErrorOccurred(true);
    } finally {
      toast.dismiss();
    }
  };

  const saveAndCancelSubscription = async (payload, subscriptionId) => {
    toast.loading("Processing subscription data...");

    const saveDataPromise = axios.post(
      "/api/saveRecurringPaymentData",
      payload,
      {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    );

    const accessToken = await getPayPalAccessToken();
    const cancelSubscriptionPromise = axios.post(
      `${PayPalApi.baseUrl}/v1/billing/subscriptions/${getCurrentIdToBeCancelled(currentSubscription)}/cancel`,
      { reason: "Customer requested cancellation" },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    try {
      const [savingRecurringResponse, planCancellationResponse] =
        await Promise.all([saveDataPromise, cancelSubscriptionPromise]);

      //cancellation payload
      const planCancellationRequest = { subscriptionId };
      const planCancellationDataResponse = planCancellationResponse?.data;

      //------------ FORMED USING RECURRING DATA
      let cancellationPayload = { ...payload };
      delete cancellationPayload["startTime"];
      delete cancellationPayload["newPlanId"];
      cancellationPayload["cancellationDateTime"] = new Date().toISOString();
      cancellationPayload["subscriptionStatus"] = "CANCELLED";
      cancellationPayload["paymentRequestSent"] = JSON.stringify({
        ...planCancellationDataResponse,
      });
      cancellationPayload["paypalSubscriptionId"] = getCurrentIdToBeCancelled(currentSubscription),
      cancellationPayload["planId"] = currentSubscription?.planId
      cancellationPayload["paymentRequestReceived"] = JSON.stringify({
        ...planCancellationRequest,
      });

      //calling the api to save the plan cancellation data
      saveCancellationPlanData(cancellationPayload);
    } catch (err) {
      console.error("Error during subscription processing:", err);
      setErrorMessage(
        "Your subscription payment was processed by PayPal. However, we encountered an issue while updating your account. Please contact support with your transaction details."
      );
      setErrorOccurred(true);
    }
    toast.dismiss();
  };

  const onApproveOrder = async (data, actions) => {
    const subscriptionId = data.subscriptionID;
    const requestPayload = generateRequestPayload(
      paymentType,
      currentSubscription,
      userData,
      currency,
      userDetailField
    );

    const response = {
      paymentDetails: { ...data },
      actionsData: { ...actions.subscription.get() },
    };

    const responsePayload = generateResponsePayload(
      paymentType,
      topUpDetails,
      userData,
      requestPayload,
      response,
      currentSubscription,
      topUpDetails,
      userDetailField
    );

    responsePayload["startTime"] = new Date(
      getNextDate(new Date(currentSubscription?.endDate))
    ).toISOString();

    await saveAndCancelSubscription(responsePayload, subscriptionId);
  };

  const onCancelOrder = (data) => {
    console.error("PayPal On Cancel data:", data);
    setErrorMessage("The payment has been canceled. Please try again.");
    setErrorOccurred(true);
  };

  const onError = (err) => {
    console.error("PayPal On Error data:", err);
    setErrorMessage(
      "An unexpected error occurred while processing your payment. Please try again."
    );
    setErrorOccurred(true);
  };

  return (
    <div className="checkout">
      {isPending ? (
        <p>LOADING...</p>
      ) : (
        <>
          <div className="text-center mt-2 mb-2">
            <label htmlFor="currency-selector">Select Currency :</label>
            <select
              id="currency-selector"
              value={currency}
              onChange={onCurrencyChange}
            >
              <option value="CAD">🇨🇦 CAD (Canadian Dollar)</option>
            </select>
          </div>

          <PayPalButtons
            style={{
              layout: "vertical",
              color: "blue",
              shape: "pill",
              label: "subscribe",
            }}
            createSubscription={createSubscription}
            onApprove={onApproveOrder}
            onCancel={onCancelOrder}
            onError={onError}
          />
        </>
      )}
    </div>
  );
};

const CheckoutPage = ({
  currentSubscription,
  price,
  setErrorOccurred,
  setOnSuccess,
  paymentType,
  userDetailField,
  setErrorMessage,
}) => (
  <PayPalScriptProvider
    options={{
      "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      currency: "CAD",
      intent: "subscription",
      vault: true,
    }}
  >
    <Checkout
      topUpDetails={price}
      setErrorOccurred={setErrorOccurred}
      setOnSuccess={setOnSuccess}
      currentSubscription={currentSubscription}
      paymentType={paymentType}
      setErrorMessage={setErrorMessage}
      userDetailField={userDetailField}
    />
  </PayPalScriptProvider>
);

export default CheckoutPage;
