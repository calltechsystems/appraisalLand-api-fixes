import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraiserCompanyPlan from "../../components/dashboard-admin/appraiser-company-plan";

const index = () => {
  return (
    <>
      <Seo pageTitle="Plans" />
      <AppraiserCompanyPlan />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
