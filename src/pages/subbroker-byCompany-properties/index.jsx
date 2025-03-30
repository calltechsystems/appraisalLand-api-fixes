import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import SubBrokerProperties from "../../components/dashboard-admin/subbroker-by-company-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Sub Broker Properties" />
      <SubBrokerProperties />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
