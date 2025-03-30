import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import BrokerageCompletedProperties from "../../components/dashboard/brokerage-completed-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Brokerage Completed Properties" />
      <BrokerageCompletedProperties />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
