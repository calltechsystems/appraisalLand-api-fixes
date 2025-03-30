import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraiserProfile from "../../components/dashboard/appraiser-profile";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Profile" />
      <AppraiserProfile />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
