import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import AppraiserHelpdesk from "../components/dashboard/appraiser-helpdesk";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Helpdesk" />
      <AppraiserHelpdesk />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
