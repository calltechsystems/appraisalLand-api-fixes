import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MortgageBrokerageDashboard from "../../components/dashboard-admin/mortgage-brokerage-dashboard";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Brokerage Dashboard" />
      <MortgageBrokerageDashboard />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
