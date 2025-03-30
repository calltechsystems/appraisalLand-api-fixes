import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import BrokerChangePassword from "../../components/dashboard/broker-change-password";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Change Password" />
      <BrokerChangePassword />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
