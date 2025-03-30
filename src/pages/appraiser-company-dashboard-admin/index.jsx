import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraiserCompanyDashboard from "../../components/dashboard-admin/appraiser-company-dashboard";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Company Dashboard" />
      <AppraiserCompanyDashboard />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
