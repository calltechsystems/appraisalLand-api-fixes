import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import ManageAppraiserCompany from "../../components/dashboard-admin/manage-appraiser-company";

const index = () => {
  return (
    <>
      <Seo pageTitle="Manage Appraiser Company" />
      <ManageAppraiserCompany />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
