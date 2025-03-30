import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MyPlans from "./plans";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import OneTimePaymentModal from "../../components/common/paypalGateway/OneTimePaymentModal";
import SubscriptionModal from "../../components/common/paypalGateway/SubscriptionModal";
import CancelSubscriptionModal from "../../components/common/paypalGateway/CancelSubscriptionModal";
import ReviseSubscriptionModal from "../../components/common/paypalGateway/ReviseSubscriptionModal";
import NoPlanModal from "../../components/common/NoPlanModal/page";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const [currentSubscription, setcurrentSubscription] = useState({});
  const [price, setPrice] = useState({
    title: "Basic",
    price: 0,
    type: "plan",
    item: {},
  });

  const [canUpgrade, setCanUpgrade] = useState(true);
  const [userDetailField, setUserDetailsField] = useState("broker_Details");
  const [userData, setUserData] = useState({});

  const [isSubscriptionDetailsEmpty, setIsSubscriptionDetailsEmpty] =
    useState(false);

  // useEffect(() => {
  //   const userData = JSON.parse(localStorage.getItem("user"));
  //   axios
  //     .get("/api/getBrokerTransactions", {
  //       headers: {
  //         Authorization: `Bearer ${userData?.token}`,
  //         "Content-Type": "application/json",
  //       },
  //       params: {
  //         userId: userData?.userId,
  //       },
  //     })
  //     .then((res) => {
  //       toast.dismiss();

  //       let tempSub = res.data.data.result.$values;

  //       let newPlan = {};
  //       tempSub?.map((plan, index) => {
  //         const isAccordingToDate =
  //           new Date(plan.startDate) <= new Date() &&
  //           new Date(plan?.endDate) >= new Date();
  //         const isNormalPlan =
  //           String(plan.planName).toLowerCase().includes("lite") ||
  //           String(plan.planName).toLowerCase().includes("pro") ||
  //           String(plan.planName).toLowerCase().includes("ultimate");
  //         if (isAccordingToDate && isNormalPlan) {
  //           newPlan = plan;
  //         }
  //       });
  //       setcurrentSubscription(newPlan);
  //       setRerender(false);
  //     })
  //     .catch((err) => {
  //       toast.dismiss();
  //     });
  // }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const onCloseHandler = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      <Seo pageTitle="My Plans" />
      {isSubscriptionDetailsEmpty ? (
        <NoPlanModal onCloseHandler={onCloseHandler} />
      ) : (
        <>
          <MyPlans
            currentSubscription={currentSubscription}
            setModalOpen={setModalOpen}
            setPrice={setPrice}
            userData={userData}
            modalOpen={modalOpen}
            setcurrentSubscription={setcurrentSubscription}
            setCanUpgrade={setCanUpgrade}
            canUpgrade={canUpgrade}
            userDetailField={userDetailField}
            setIsSubscriptionDetailsEmpty={setIsSubscriptionDetailsEmpty}
          />
          {price?.type == "plan" ? (
            <SubscriptionModal
              currentSubscription={currentSubscription}
              modalOpen={modalOpen}
              closeModal={closeModal}
              price={price}
              userDetailField={userDetailField}
            />
          ) : price?.type == "cancel_plan" ? (
            <CancelSubscriptionModal
              currentSubscription={currentSubscription}
              modalOpen={modalOpen}
              closeModal={closeModal}
              price={price}
              userDetailField={userDetailField}
            />
          ) : price?.type == "upgrade_plan" ? (
            <ReviseSubscriptionModal
              currentSubscription={currentSubscription}
              modalOpen={modalOpen}
              closeModal={closeModal}
              price={price}
              userDetailField={userDetailField}
            />
          ) : (
            <OneTimePaymentModal
              currentSubscription={currentSubscription}
              modalOpen={modalOpen}
              closeModal={closeModal}
              price={price}
              userDetailField={userDetailField}
            />
          )}
        </>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
