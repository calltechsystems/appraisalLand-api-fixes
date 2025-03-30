import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraiserCompanyProfile from "../../components/dashboard/appraiser-company-profile";

const index = () => {
  return (
    <>
      <Seo pageTitle="Profile" />
      <AppraiserCompanyProfile />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
