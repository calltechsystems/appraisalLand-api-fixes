import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MortgageBrokerDashboard from "../../components/dashboard-admin/mortgage-broker-dashboard";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Broker Dashboard" />
      <MortgageBrokerDashboard />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
