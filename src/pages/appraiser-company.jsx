import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import AppraiserCompany from "../components/appraiser-company";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Company" />
      <AppraiserCompany />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
