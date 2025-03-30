import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import BrokerageHelpdesk from "../components/dashboard/brokerage-helpdesk";

const index = () => {
  return (
    <>
      <Seo pageTitle="Brokerage Helpdesk" />
      <BrokerageHelpdesk />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
