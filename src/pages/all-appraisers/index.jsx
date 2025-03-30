import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraiseProperties from "../../components/dashboard/all-appraisers";

const index = () => {
  return (
    <>
      <Seo pageTitle="All Sub Appraisers" />
      <AppraiseProperties />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
