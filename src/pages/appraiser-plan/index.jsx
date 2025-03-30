import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraiserPlan from "../../components/dashboard-admin/appraiser-plan";

const index = () => {
  return (
    <>
      <Seo pageTitle="Apraiser Plans" />
      <AppraiserPlan />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
