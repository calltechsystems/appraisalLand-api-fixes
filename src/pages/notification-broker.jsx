import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import NotificationBroker from "../components/dashboard/notification-broker";

const index = () => {
  return (
    <>
      <Seo pageTitle="Broker Notifications" />
      <NotificationBroker />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
