import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraiserChangePassword from "../../components/dashboard/appraiser-change-password";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Change Password" />
      <AppraiserChangePassword />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
