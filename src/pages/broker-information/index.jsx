import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import BrokerInformation from "../../components/dashboard-admin/broker-information";

const index = () => {
  return (
    <>
      <Seo pageTitle="Broker Information" />
      <BrokerInformation />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
