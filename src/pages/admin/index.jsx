import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraiserDashboard from '../../components/dashboard-admin/appraiser-dashboard';

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Dashboard" />
      <AppraiserDashboard />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
