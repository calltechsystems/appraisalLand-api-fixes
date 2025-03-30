import React, { useEffect, useState } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import toast from "react-hot-toast";

import {
  generateRequestPayload,
  generateResponsePayload,
} from "../../../utils/Paypal/GeneratePayloads.js";

import axios from "axios";
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

  const onCreateOrder = (data, actions) => {
    const payload = generateRequestPayload(
      paymentType,
      topUpDetails,
      userData,
      currency,
      userDetailField
    );
    return actions.order.create(payload);
  };

  const createSubscription = (data, actions) => {
    const payload = generateRequestPayload(
      paymentType,
      topUpDetails,
      userData,
      currency,
      userDetailField
    );
    return actions.subscription.create(payload);
  };

  const saveOneTimePaymentData = (payload) => {
    toast.loading("Saving the data to DB for Top Up");
    console.log({ payload });
    axios
      .post("/api/saveOneTimePaymentData", payload, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      .then((res) => {
        let defaultUserData = JSON.parse(localStorage.getItem("user")) || {};
        //set the planLimit , totalNoOfProperties
        // usedProperties count updted
        defaultUserData = {
          ...defaultUserData,
          ["planLimitExceed"]: res?.data?.userData?.planLimitExceed,
          ["usedProperties"]: res?.data?.userData?.usedProperties,
          ["totalNoOfProperties"]: res?.data?.userData?.totalNoOfProperties,
        };

        localStorage.setItem("user", JSON.stringify(defaultUserData));
        setOnSuccess(true);
      })
      .catch((err) => {
        console.error("Got error while adding TpUp", err);
        setErrorMessage(
          "Your payment for the Top-Up plan has been successfully processed by PayPal. However, we encountered an issue while applying the Top-Up to your account. Please contact support with your transaction details for assistance."
        );
        setErrorOccurred(true);
      });
    toast.dismiss();
  };

  const saveRecurringPaymentData = (payload) => {
    toast.loading("Saving the data to DB for Subscription");
    console.log({ payload });
    axios
      .post("/api/saveRecurringPaymentData", payload, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      .then((res) => {
        toast.success("Created Subscription Successfully.");
        // console.log(res);
        setOnSuccess(true);
      })
      .catch((err) => {
        console.error("Got error while cretaing subscription", err);
        setErrorMessage(
          "Your payment for the subscription has been successfully processed by PayPal. However, we encountered an issue while activating your subscription. Please contact support with your transaction details for assistance."
        );
        setErrorOccurred(true);
      });
    toast.dismiss();
  };

  const onApproveOrder = (data, actions) => {
    if (paymentType == "oneTime") {
      return actions.order.capture().then((details) => {
        const request = generateRequestPayload(
          paymentType,
          topUpDetails,
          userData,
          currency,
          userDetailField
        );
        const finalOneTimeData = generateResponsePayload(
          paymentType,
          topUpDetails,
          userData,
          request,
          details,
          currentSubscription,
          topUpDetails,
          userDetailField
        );
        saveOneTimePaymentData(finalOneTimeData);
      });
    } else if (paymentType == "subscription") {
      //Subscription
      const response = {
        paymentDetails: { ...data },
        actionsData: { ...actions.subscription.get() },
      };

      const request = generateRequestPayload(
        paymentType,
        topUpDetails,
        userData,
        currency,
        userDetailField
      );

      const finalRecurringData = generateResponsePayload(
        paymentType,
        topUpDetails,
        userData,
        request,
        response,
        currentSubscription,
        topUpDetails,
        userDetailField
      );
      saveRecurringPaymentData(finalRecurringData);
    }
  };

  //------------------CANCEL WHILE TRANSACTION----------------------
  const onCancelOrder = (data) => {
    console.error("PayPal On Cancel data:", data);

    let errorMessage = "The payment has been canceled.";

    if (data && data.reason) {
      switch (data.reason) {
        case "USER_CANCELED":
          errorMessage = "You have canceled the payment process.";
          break;
        case "TIMEOUT":
          errorMessage = "The payment process timed out. Please try again.";
          break;
        case "INCOMPLETE_PAYMENT":
          errorMessage =
            "The payment could not be completed. Please finalize the transaction.";
          break;
        case "PAYMENT_CANCELLED":
          errorMessage =
            "The payment was unexpectedly canceled. Please verify and try again.";
          break;
        default:
          errorMessage =
            "The payment was canceled due to an unknown reason. Please contact support if the issue persists.";
          break;
      }
    }

    setErrorMessage(errorMessage);
    // toast.error(errorMessage);
    setErrorOccurred(true);
  };

  //------------------ERROR WHILE TRANSACTION----------------------
  const onError = (err) => {
    console.error("PayPal On Error data:", err);

    let errorMessage =
      "An unexpected error occurred while processing your payment. Please try again.";

    if (err && err.message) {
      switch (err.message) {
        case "PAYMENT_DECLINED":
          errorMessage =
            "Your payment was declined. Please verify your payment details and try again.";
          break;
        case "PAYMENT_NETWORK_ERROR":
          errorMessage =
            "A network error occurred during the transaction. Please check your connection and try again.";
          break;
        case "INCOMPLETE_PAYMENT":
          errorMessage =
            "The payment could not be completed. Please ensure all steps are completed successfully.";
          break;
        case "PAYPAL_ACCOUNT_BLOCKED":
          errorMessage =
            "Your PayPal account is restricted. Please contact PayPal support for assistance.";
          break;
        case "CARD_DECLINED":
          errorMessage =
            "Your payment method was declined. Please use an alternative payment option.";
          break;
        case "EXPIRED_SESSION":
          errorMessage =
            "Your payment session has expired. Please restart the payment process.";
          break;
        case "UNAUTHORIZED":
          errorMessage =
            "You are not authorized to complete this transaction. Please verify your account credentials.";
          break;
        default:
          errorMessage =
            "An error occurred during the payment process. Please try again later.";
          break;
      }
    } else if (err.code) {
      switch (err.code) {
        case "BAD_REQUEST":
          errorMessage = "The payment request was invalid. Please try again.";
          break;
        case "INTERNAL_SERVER_ERROR":
          errorMessage =
            "A system error occurred. Please contact support if the issue persists.";
          break;
        case "NETWORK_ERROR":
          errorMessage =
            "A connection error occurred. Please check your internet connection and try again.";
          break;
        default:
          errorMessage = `An error occurred: ${err.code}. Please try again later.`;
          break;
      }
    }

    setErrorMessage(errorMessage);
    // toast.error(errorMessage);
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
              label: paymentType === "oneTime" ? "pay" : "subscribe",
            }}
            {...(paymentType === "oneTime"
              ? { createOrder: onCreateOrder }
              : { createSubscription: createSubscription })}
            onApprove={onApproveOrder}
            onCancel={onCancelOrder}
            onError={onError}
          />
        </>
      )}
    </div>
  );
};

// Wrap the Checkout component with PayPalScriptProvider
const CheckoutPage = ({
  currentSubscription,
  planDetails,
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
      intent: paymentType === "subscription" ? "subscription" : "capture",
      vault: paymentType === "subscription" ? true : false,
    }}
  >
    <Checkout
      topUpDetails={planDetails}
      setErrorOccurred={setErrorOccurred}
      setOnSuccess={setOnSuccess}
      currentSubscription={currentSubscription}
      paymentType={paymentType}
      userDetailField={userDetailField}
      setErrorMessage={setErrorMessage}
    />
  </PayPalScriptProvider>
);

export default CheckoutPage;
