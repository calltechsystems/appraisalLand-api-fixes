import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraiserProperties from "../../components/dashboard-admin/appraiser-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser  Properties" />
      <AppraiserProperties />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
