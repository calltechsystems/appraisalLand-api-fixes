import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import BrokerageDashboard from "../../components/dashboard/brokerage-dashboard";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Brokerage Dashboard" />
      <BrokerageDashboard />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
