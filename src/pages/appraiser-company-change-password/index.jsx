import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraiserCompanyChangePassword from "../../components/dashboard/appraiser-company-change-password";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Company Change Password" />
      <AppraiserCompanyChangePassword />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
