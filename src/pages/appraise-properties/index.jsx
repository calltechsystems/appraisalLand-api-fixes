import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraiseProperties from "../../components/dashboard/appraised-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraised Properties" />
      <AppraiseProperties />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
