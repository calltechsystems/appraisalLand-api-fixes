import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import ManageMortgageBrokerage from "../../components/dashboard-admin/manage-mortgage-brokerage";

const index = () => {
  return (
    <>
      <Seo pageTitle="Manage Mortgage Brokerage" />
      <ManageMortgageBrokerage />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
