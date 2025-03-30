import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import BrokersCompletedProperties from "../../components/dashboard/brokers-completed-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Brokers Completed Properties" />
      <BrokersCompletedProperties />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
