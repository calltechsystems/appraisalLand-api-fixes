import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import BrokerageProperties from "../../components/dashboard/brokerage-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Brokerage Properties" />
      <BrokerageProperties />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
