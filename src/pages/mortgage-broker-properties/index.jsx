import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MortgageBrokerProperties from "../../components/dashboard-admin/mortgage-broker-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Broker Properties" />
      <MortgageBrokerProperties />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
