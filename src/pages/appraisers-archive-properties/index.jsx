import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraisersArchiveProperties from "../../components/dashboard-admin/appraisers-archive-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraisers Archive Properties" />
      <AppraisersArchiveProperties />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
