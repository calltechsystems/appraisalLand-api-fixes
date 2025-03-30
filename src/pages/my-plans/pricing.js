import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { encryptionData } from "../../utils/dataEncryption";
import axios from "axios";
import toast from "react-hot-toast";

const Pricing = ({
  isPlan,
  hideButton,
  selectedId,
  setModalOpen,
  data,
  topupData,
  setData,
  currentSubscription,
  setcurrentSubscription,
  setPrice,
  planData,
  canUpgrade,
  userDetailField,
}) => {
  let userData = {};
  const [selectedPackage, setSelectedPackage] = useState({});

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [disable, setDisable] = useState(false);

  // const [currentActivePlan, setCurrentActivePlan] = useState({});
  const [selectedPlanId, setSelectedPlanId] = useState(-1);
  const [selectedTopUp, setSelectedTopUp] = useState(-1);
  const [filteredData, setFilteredData] = useState([]);
  const [type, setType] = useState(1);
  useEffect(() => {
    userData = JSON.parse(localStorage.getItem("user"));
    const Packages = userData.userSubscription?.$values;
    const len = Packages?.length;
    setSelectedPackage(Packages?.length > 0 ? Packages[len - 1] : {});
  }, []);

  const selectedIdStyle = selectedId ? selectedId : "2";

  const selectPackageHandler = (id, title, price, type, item) => {
    setModalOpen(true);
    setPrice({
      id: id,
      title: title,
      price: price,
      type: type,
      item,
      paypalPlanId: item?.payPalProductId || "",
    });
  };

  const topUpHandler = (id, data) => {
    setSelectedPlanId(id);
    setModalOpen(true);
    let updatedData = {
      id: data?.id,
      title: data?.topupDescription,
      price: data?.topUpAmount,
      properties: data?.noOfProperties,
      type: "topup",
      data,
    };

    setPrice(updatedData);
    setSelectedTopUp(updatedData);
  };

  const setPlan = (planId, type) => {
    setSelectedPlanId(planId);
    setType(type);
    if (String(type) === "2" || String(type) === "3" || String(type) === "4") {
      const selectedTopUp = type == 3 ? topupData[0] : topupData[1];
      setModalOpen(true);
      let data = {
        id: selectedTopUp?.id,
        title: selectedTopUp?.topupDescription,
        price: selectedTopUp?.topUpAmount,
        properties: selectedTopUp?.noOfProperties,
        type: "",
        selectedTopUp,
      };

      if (String(type) === "2") {
        data.type = "cancel_plan";
      } else {
        data.type = "topup";
      }

      setPrice(data);
      if (String(type) === "3") {
        setSelectedTopUp(selectedTopUp);
      } else if (String(type) === "4") {
        setSelectedTopUp(selectedTopUp);
      }
    }
  };

  const closeCancelHandler = () => {
    setSelectedPlanId(-1);
    setType(1);
    setOpenCancelModal(false);
    window.location.reload();
  };

  const cancelPackageHandler = () => {
    setDisable(true);

    const userData = JSON.parse(localStorage.getItem("user"));

    if (String(type) === "2") {
      window.location.reload();
    } else if (String(type) === "3" || String(type) === "4") {
      const payload = {
        TopUpId: selectedTopUp.id,
        UserId: userData.userId,
      };

      toast.loading("Adding the top-up !!");
      const encryptedBody = encryptionData(payload);
      axios
        .post("/api/addTopUp", encryptedBody)
        .then((res) => {
          toast.success("Successfully added the top - up!");
        })
        .catch((err) => {
          toast.error("Try Again !!");
        });

      window.location.reload();
    }
    window.location.reload();
  };

  // useEffect(() => {
  //   let requiredPlan = [];
  //   data.map((plan, index) => {
  //     const planName = String(plan.planName)
  //       .toLowerCase()
  //       .includes(String(currentSubscription?.planName).toLowerCase());
  //     const amount =
  //       String(
  //         plan?.monthlyAmount === null ? plan.yearlyAmount : plan.monthlyAmount
  //       ) === String(currentSubscription?.planAmount);
  //     const totalPropeerties =
  //       String(plan.noOfProperties) ===
  //       String(currentSubscription?.noOfProperties);

  //     if (planName) {
  //       requiredPlan.push(plan);
  //     }
  //   });

  //   setCurrentActivePlan(requiredPlan[requiredPlan.length - 1]);
  // }, [currentSubscription, data]);
  // console.log("plan is", currentSubscription);
  useEffect(() => {
    const seelctivePlanDetails = data?.filter(
      (plan) => plan.id == currentSubscription?.planId
    );
    if (seelctivePlanDetails.length > 0) {
      const tempDetails = seelctivePlanDetails[0];
      const amount =
        tempDetails?.planValidity == 30
          ? tempDetails?.monthlyAmount
          : tempDetails?.yearlyAmount;
      setcurrentSubscription({
        ...currentSubscription,
        amount: amount,
        planAmount: amount,
        planName: tempDetails?.planName,
        monthlyAmount: tempDetails?.monthlyAmount,
        yearlyAmount: tempDetails?.yearlyAmount,
        noOfProperties: tempDetails?.noOfProperties,
        payPalProductId: tempDetails?.payPalProductId,
        description: tempDetails?.description,
      });
    }
  }, [data]);

  useEffect(() => {
    let Monthly = [],
      Yearly = [];
    data?.map((row, index) => {
      if (row.monthlyAmount !== null) {
        Monthly.push(row);
      } else {
        Yearly.push(row);
      }
    });

    if (String(isPlan) === "1") {
      setFilteredData(Monthly);
    } else {
      setFilteredData(Yearly);
    }
  }, [isPlan, data]);

  return (
    <>
      {filteredData?.map((item, idx) => (
        <div className="col-sm-4 col-md-4 my_plan_pricing_header" key={item.id}>
          <div
            className={`pricing_table  ${
              String(selectedIdStyle) === String(item.id) ? "pricing_table" : ""
            }
            ${true ? "active-selected-plan" : ""}
            `}
          >
            <div
              className={`${
                currentSubscription?.planId === item.id
                  ? "active-selected-plan"
                  : ""
              }
`}
            >
              <div className="pricing_header">
                <div className="price">{item.planName}</div>

                {String(selectedIdStyle) === String(item.id) ? (
                  <div
                    className="p-1 fw-bold"
                    style={{
                      visibility: "hidden",
                      backgroundColor: "white",
                      borderRadius: "4px",
                      fontSize: "19px",
                      color: "#2e008b",
                    }}
                  >
                    Recommended Plan{" "}
                  </div>
                ) : (
                  <div
                    className="p-1 fw-bold"
                    style={{
                      visibility: "hidden",
                      backgroundColor: "white",
                      borderRadius: "4px",
                      fontSize: "19px",
                      color: "#2e008b",
                    }}
                  >
                    Recommended Plan{" "}
                  </div>
                )}
              </div>
              <div className="pricing_content">
                <ul className="mb0">
                  <li key={idx}>{item.noOfProperties} Properties Quotes</li>
                  <li>{item.planValidity} Days Validity</li>
                  {/* {item?.monthlyAmount > 0 ? (
                    <li>30 Days Validity</li>
                  ) : (
                    <li>365 Days Validity</li>
                  )} */}
                </ul>
                <div className="pricing_header">
                  <h2 className="text-dark">
                    $
                    {isPlan === 1
                      ? item.monthlyAmount - item.discount
                      : item.yearlyAmount - item.discount}
                  </h2>
                </div>
              </div>
              {!hideButton && !currentSubscription?.$id && (
                <div
                  className="pricing_footer"
                  onClick={() =>
                    selectPackageHandler(
                      item.id,
                      item.description,
                      isPlan === 1
                        ? item.monthlyAmount - item.discount
                        : item.yearlyAmount - item.discount,
                      "plan",
                      item
                    )
                  }
                >
                  <a className={`btn btn-color_01 w-100`} href="#">
                    {currentSubscription?.$id ? "Change Plan" : "Get Started"}
                  </a>
                </div>
              )}

              {!hideButton &&
                currentSubscription &&
                String(currentSubscription.planId) !== String(item.id) &&
                (currentSubscription?.$id ? (
                  <button
                    disabled={!canUpgrade}
                    // className="btn btn-color_01 w-100"
                    className={`${
                      !canUpgrade
                        ? "btn btn-disabled w-100"
                        : "btn w-100 btn-color_01"
                    }`}
                    onClick={() =>
                      selectPackageHandler(
                        item.id,
                        item.description,
                        isPlan === 1
                          ? item.monthlyAmount - item.discount
                          : item.yearlyAmount - item.discount,
                        "upgrade_plan",
                        item
                      )
                    }
                  >
                    Change Plan
                  </button>
                ) : (
                  ""
                ))}
              {!hideButton &&
                String(currentSubscription?.planId) === String(item.id) && (
                  <select
                    style={{
                      padding: "",
                      borderColor: "black",
                      borderWidth: "2px",
                    }}
                    className="pricing_footer btn btn-color_01 form-select"
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue === "cancel") {
                        setPlan(item.id, 2);
                      } else {
                        const selectedTopUp = topupData?.find(
                          (topUp) => topUp.$id == selectedValue
                        );
                        if (selectedTopUp) {
                          topUpHandler(item.id, selectedTopUp);
                        }
                      }
                    }}
                  >
                    <option value="">Add Top Up / Cancel Subscription</option>
                    {topupData?.map((topUp) => (
                      <option key={topUp.$id} value={topUp.$id}>
                        Add {topUp.noOfProperties} Properties ($
                        {topUp.topUpAmount})
                      </option>
                    ))}
                    {currentSubscription?.payPalSubscriptionStatus ==
                    "Cancel" ? (
                      ""
                    ) : (
                      <option value="cancel">Cancel Subscription</option>
                    )}
                  </select>
                )}
            </div>
          </div>
        </div>
      ))}

      {openCancelModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="row">
              <div className="col-lg-12">
                <Link href="/" className="">
                  <Image
                    width={50}
                    height={45}
                    className="logo1 img-fluid"
                    style={{ marginTop: "-20px" }}
                    src="/assets/images/Appraisal_Land_Logo.png"
                    alt="header-logo2.png"
                  />
                  <span
                    style={{
                      color: "#2e008b",
                      fontWeight: "bold",
                      fontSize: "24px",
                      // marginTop: "20px",
                    }}
                  >
                    Appraisal
                  </span>
                  <span
                    style={{
                      color: "#97d700",
                      fontWeight: "bold",
                      fontSize: "24px",
                      // marginTop: "20px",
                    }}
                  >
                    {" "}
                    Land
                  </span>
                </Link>
              </div>
            </div>
            <h2 className="text-center mt-3" style={{ color: "#2e008b" }}>
              {String(type) === "2"
                ? "Subscription Cancellation"
                : String(type) === "3"
                ? ` Add On ${topupData[0]?.noOfProperties} Properties`
                : ""}
            </h2>
            <div className="mb-2" style={{ border: "2px solid #97d700" }}></div>
            <p className="fs-5 text-center text-dark mt-4">
              {String(type) === "2"
                ? "Are you sure you want to cancel this subscription?"
                : String(type) === "3"
                ? `Are you sure you want add ${topupData[0]?.noOfProperties} properties to your existing plan ?`
                : ""}{" "}
            </p>

            <div
              className="mb-3 mt-4"
              style={{ border: "2px solid #97d700" }}
            ></div>
            <div className="col-lg-12 text-center">
              <button
                disabled={disable}
                className="btn w-25 btn-color m-1"
                onClick={closeCancelHandler}
              >
                Cancel
              </button>
              <button
                disabled={disable}
                className="btn w-25 btn-color"
                onClick={
                  String(type) === "3" || String(type) === "4"
                    ? () =>
                        selectPackageHandler(
                          selectedTopUp.id,
                          selectedTopUp.topupDescription,
                          selectedTopUp.topUpAmount,
                          "topup",
                          selectedTopUp
                        )
                    : cancelPackageHandler
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Pricing;
