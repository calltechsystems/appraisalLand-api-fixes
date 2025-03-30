import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MortgageBrokerPlan from "../../components/dashboard-admin/mortgage-broker-plan";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Broker Plans" />
      <MortgageBrokerPlan />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
