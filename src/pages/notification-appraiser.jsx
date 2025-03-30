import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import NotificationAppraiser from "../components/dashboard/notification-appraiser";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Notifications" />
      <NotificationAppraiser />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
