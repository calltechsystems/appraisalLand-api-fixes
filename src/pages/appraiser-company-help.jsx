import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import AppraiserCompanyHelpdesk from "../components/dashboard/appraiser-company-helpdesk";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Company Helpdesk" />
      <AppraiserCompanyHelpdesk />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
