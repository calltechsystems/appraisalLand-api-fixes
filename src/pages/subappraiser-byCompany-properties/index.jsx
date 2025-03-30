import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import SubAppraiserProperties from "../../components/dashboard-admin/subappraiser-by-company-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Sub Appraiser Properties" />
      <SubAppraiserProperties />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
