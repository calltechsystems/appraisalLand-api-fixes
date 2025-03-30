import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import BrokersProperties from "../../components/dashboard/brokers-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Brokers Properties" />
      <BrokersProperties />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
