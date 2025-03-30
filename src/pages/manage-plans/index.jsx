import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import ManagePlans from "../../components/dashboard-admin/manage-plans";

const index = () => {
  return (
    <>
      <Seo pageTitle="Manage Plans" />
      <ManagePlans />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
