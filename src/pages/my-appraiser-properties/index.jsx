import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MyAppraiserProperties from "../../components/dashboard/my-appraiser-properties/index"

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser properties" />
      <MyAppraiserProperties />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
