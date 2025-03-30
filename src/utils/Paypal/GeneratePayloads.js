const getNextDate = (dateStr) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString();
};

const getCurrentIdToBeCancelled = (currentSubscription) => {
  if(currentSubscription?.upgradeEligible){
    //IF NO UPGRADE/DOWNGRADE DONE TO THE PLAN
    return currentSubscription?.activePaypalSubscriptionId
  }
  //AS ITS ALREADY CANCELLED WHILE UPGRADING / CHANGING THE PLAN
  return currentSubscription?.futurePaypalSubscriptionId
}

const generateCustomId = (brokerId, planId) => {
  if (!brokerId || !planId) {
    console.error("Missing brokerId or planId");
    return "invalid-id";
  }
  const currentDate = new Date();
  const formattedDate = currentDate
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const timestamp = currentDate.getTime();
  return `${brokerId}-${planId}-${formattedDate}-${timestamp}`;
};

const generateRequestPayload = (paymentType, details, userData, currency, userDetailField) => {

  if (paymentType === "oneTime") {
    // Payload for one-time payment
    const { title, id, price } = details;
    return {
      intent: "CAPTURE",
      purchase_units: [
        {
          description: `Broker ${title} Top Up Plan`,
          custom_id: generateCustomId(userData?.userId, id),
          start_time: new Date(convertToCanadaTime(new Date())).toISOString(),
          amount: {
            value: price,
            currency_code: currency,
            breakdown: {
              item_total: {
                value: price,
                currency_code: currency,
              },
              tax_total: {
                value: "0.00",
                currency_code: currency,
              },
            },
          },
          items: [
            {
              name: `Top Up ${title} Plan`,
              quantity: "1",
              unit_amount: {
                value: price,
                currency_code: currency,
              },
              description:
                "Monthly subscription top up add for listing properties",
              category: "DIGITAL_GOODS",
            },
          ],
        },
      ],
      application_context: {
        brand_name: "Appraisal Land",
        locale: "en-US",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    };
  } else if (paymentType === "subscription") {
    return {
      plan_id: details?.paypalPlanId,
      // start_time:new Date(convertToCanadaTime(new Date())).toISOString(),
      quantity: "1",
      subscriber: {
        name: {
          given_name: userData?.[userDetailField]?.firstName,
          surname: userData?.[userDetailField]?.lastName,
          phone: {
            phone_type: "MOBILE",
            phone_number: userData?.[userDetailField]?.phoneNumber,
          },
        },
        email_address: userData?.[userDetailField]?.emailId,
        shipping_address: {
          name: {
            full_name:
              userData?.[userDetailField]?.firstName +
              " " +
              userData?.[userDetailField]?.lastName,
          },
          address: {
            address_line_1:
              userData?.[userDetailField]?.apartmentNo +
              "," +
              userData?.[userDetailField]?.streetNumber +
              " " +
              userData?.[userDetailField]?.streetName +
              " " +
              userData?.[userDetailField]?.area,
            address_line_2:
              userData?.[userDetailField]?.apartmentNo +
              "," +
              userData?.[userDetailField]?.streetNumber +
              " " +
              userData?.[userDetailField]?.streetName +
              " " +
              userData?.[userDetailField]?.area,
            admin_area_2: userData?.[userDetailField]?.province,
            admin_area_1: userData?.[userDetailField]?.city,
            postal_code: userData?.[userDetailField]?.postalCode,
            country_code: "US",
          },
        },
      },
      application_context: {
        brand_name: "Appraisal Land",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        payment_method: {
          payer_selected: "PAYPAL",
          payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
        },
        return_url: "https://appraisal-eta.vercel.app/my-plans",
        cancel_url: "https://appraisal-eta.vercel.app/my-plans",
      },
      // plan:{
      //   taxes: {
      //     inclusive: false,
      //     percentage: '13.16'
      //   }
      // }
    };
  } else if (paymentType === "upgrade_plan") {
    return {
      plan_id: details?.payPalProductId,
      start_time:getNextDate(new Date(convertToCanadaTime(details?.endDate)).toISOString()),
      quantity: "1",
      subscriber: {
        name: {
          given_name: userData?.[userDetailField]?.firstName,
          surname: userData?.[userDetailField]?.lastName,
          phone: {
            phone_type: "MOBILE",
            phone_number: userData?.[userDetailField]?.phoneNumber,
          },
        },
        email_address: userData?.[userDetailField]?.emailId,
        shipping_address: {
          name: {
            full_name:
              userData?.[userDetailField]?.firstName +
              " " +
              userData?.[userDetailField]?.lastName,
          },
          address: {
            address_line_1:
              userData?.[userDetailField]?.apartmentNo +
              "," +
              userData?.[userDetailField]?.streetNumber +
              " " +
              userData?.[userDetailField]?.streetName +
              " " +
              userData?.[userDetailField]?.area,
            address_line_2:
              userData?.[userDetailField]?.apartmentNo +
              "," +
              userData?.[userDetailField]?.streetNumber +
              " " +
              userData?.[userDetailField]?.streetName +
              " " +
              userData?.[userDetailField]?.area,
            admin_area_2: userData?.[userDetailField]?.province,
            admin_area_1: userData?.[userDetailField]?.city,
            postal_code: userData?.[userDetailField]?.postalCode,
            country_code: "US",
          },
        },
      },
      application_context: {
        brand_name: "Appraisal Land",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        payment_method: {
          payer_selected: "PAYPAL",
          payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
        },
        return_url: "https://appraisal-eta.vercel.app/my-plans",
        cancel_url: "https://appraisal-eta.vercel.app/my-plans",
      },
    };
  } else {
    throw new Error("Invalid type provided. Use 'oneTime' or 'subscription'.");
  }
};

function convertToCanadaTime(dateInput) {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  // Convert to Canada Eastern Time (UTC -5 or UTC -4 during DST)
  const options = {
    timeZone: "America/Toronto",
    hour12: true,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

const generateResponsePayload = (
  paymentType,
  details,
  userData,
  request,
  response,
  currentSubscription,
  topUpDetails,
  userDetailField
) => {

  if (paymentType === "oneTime") {
    // Payload for one-time payment
    return {
      createTime: new Date(convertToCanadaTime(new Date())).toISOString(),
      updateTime: new Date(convertToCanadaTime(new Date())).toISOString(),
      planId: currentSubscription?.planId,
      planAmount: currentSubscription?.planAmount,
      planName: currentSubscription?.planName,
      userId: userData?.userId,
      paymentId: response?.id,
      topUpId: topUpDetails?.id,
      paymentRequestSent: JSON.stringify(request),
      paymentResponseReceived: JSON.stringify(response),
      status: "COMPLETED",
      currencyCode: "CAD",
    };
  } else if (paymentType === "subscription") {
  const { title, id, price } = details;
    // Payload for subscription payment
    return {
      customId: generateCustomId(userData?.userId, id),
      userId: userData?.userId,
      newPlanId: Number(topUpDetails?.item?.id),
      paypalSubscriptionId: response?.paymentDetails?.subscriptionID,
      // currentPlanId: currentSubscription?.planId,
      startTime: new Date(convertToCanadaTime(new Date())).toISOString(),
      subscriber: {
        profileName:
          userData?.[userDetailField]?.firstName +
          " " +
          userData?.[userDetailField]?.lastName,
        phoneId: userData?.[userDetailField]?.phoneNumber,
        emailId: userData?.[userDetailField]?.emailId,
      },
      applicationContext: {
        brandName: "Appraisal Land",
        locale: "en-US",
        userAction: "SUBSCRIBE_NOW",
        returnUrl: "https://appraisal-eta.vercel.app/my-plans",
        cancelUrl: "https://appraisal-eta.vercel.app/my-plans",
      },
      paymentSource: {
        source: response?.paymentDetails?.paymentSource,
      },
      paymentStatus: "COMPLETED",
      paymenttype: "RECURRING",
      currencycode: "CAD",
      paymentId: response?.paymentDetails?.orderID,
      paymentRequestSent: JSON.stringify(request),
      paymentRequestReceived: JSON.stringify(response),
    };
  } else if (paymentType === "upgrade_plan") {
    return {
      customId: generateCustomId(userData?.userId, currentSubscription?.planId),
      userId: userData?.userId,
      newPlanId: Number(topUpDetails?.item?.id),
      paypalSubscriptionId: response?.paymentDetails?.subscriptionID,
      // currentPlanId: currentSubscription?.planId,
      startTime: new Date(convertToCanadaTime(new Date())).toISOString(),
      subscriber: {
        profileName:
          userData?.[userDetailField]?.firstName +
          " " +
          userData?.[userDetailField]?.lastName,
        phoneId: userData?.[userDetailField]?.phoneNumber,
        emailId: userData?.[userDetailField]?.emailId,
      },
      applicationContext: {
        brandName: "Appraisal Land",
        locale: "en-US",
        userAction: "SUBSCRIBE_NOW",
        returnUrl: "https://appraisal-eta.vercel.app/my-plans",
        cancelUrl: "https://appraisal-eta.vercel.app/my-plans",
      },
      paymentSource: {
        source: response?.paymentDetails?.paymentSource,
      },
      paymentStatus: "COMPLETED",
      paymenttype: "RECURRING",
      currencycode: "CAD",
      paymentId: response?.paymentDetails?.orderID,
      paymentRequestSent: JSON.stringify(request),
      paymentRequestReceived: JSON.stringify(response),
    };
  } 
  else if(paymentType === "cancel_subscription"){
    return {
      customId: generateCustomId(userData?.userId, currentSubscription?.planId),
      userId: userData?.userId,
      planId: Number(currentSubscription?.planId),
      paypalSubscriptionId: getCurrentIdToBeCancelled(currentSubscription),
      cancellationDateTime: new Date(convertToCanadaTime(new Date())).toISOString(),
      subscriber: {
        profileName:
          userData?.[userDetailField]?.firstName +
          " " +
          userData?.[userDetailField]?.lastName,
        phoneId: userData?.[userDetailField]?.phoneNumber,
        emailId: userData?.[userDetailField]?.emailId,
      },
      applicationContext: {
        brandName: "Appraisal Land",
        locale: "en-US",
        userAction: "SUBSCRIBE_NOW",
        returnUrl: "https://appraisal-eta.vercel.app/my-plans",
        cancelUrl: "https://appraisal-eta.vercel.app/my-plans",
      },
      paymentSource: {
        source: "N.A.",
      },
      paymentStatus: "COMPLETED",
      paymenttype: "RECURRING",
      currencycode: "CAD",
      paymentId: "N.A.",
      paymentRequestSent: JSON.stringify(request),
      paymentRequestReceived: "N.A.",
      subscriptionStatus: "CANCELLED",

    }
  }
  else {
    throw new Error("Invalid type provided. Use 'oneTime' or 'subscription'.");
  }
};

module.exports = {
  getNextDate,
  generateRequestPayload,
  generateResponsePayload,
  getCurrentIdToBeCancelled
};
