import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import ManageMortgageBroker from "../../components/dashboard-admin/manage-mortgage-broker";

const index = () => {
  return (
    <>
      <Seo pageTitle="Manage Mortgage Brokers" />
      <ManageMortgageBroker />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
