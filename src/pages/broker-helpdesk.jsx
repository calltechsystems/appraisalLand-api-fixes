import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import BrokerHelpdesk from "../components/dashboard/broker-helpdesk";

const index = () => {
  return (
    <>
      <Seo pageTitle="Broker Helpdesk" />
      <BrokerHelpdesk />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
