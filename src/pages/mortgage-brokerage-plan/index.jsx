import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MortgageBrokeragePlan from "../../components/dashboard-admin/mortgage-brokerage-plan";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Brokerage Plans" />
      <MortgageBrokeragePlan />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
