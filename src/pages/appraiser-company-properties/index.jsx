import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraiserCompanyProperties from "../../components/dashboard-admin/appraiser-company-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Company Properties" />
      <AppraiserCompanyProperties />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
