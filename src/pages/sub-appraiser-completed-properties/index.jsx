import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import SubAppraiserCompletedProperties from "../../components/dashboard/sub-appraiser-completed-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Completed  Orders" />
      <SubAppraiserCompletedProperties />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
