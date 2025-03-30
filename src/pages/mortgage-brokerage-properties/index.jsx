import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MortgageBrokerageProperties from "../../components/dashboard-admin/mortgage-brokerage-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Brokerage Properties" />
      <MortgageBrokerageProperties />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
