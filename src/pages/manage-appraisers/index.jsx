import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import ManageAppraisers from "../../components/dashboard-admin/manage-appraisers";

const index = () => {
  return (
    <>
      <Seo pageTitle="Manage Appraisers" />
      <ManageAppraisers />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
