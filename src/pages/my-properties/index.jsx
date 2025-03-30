import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MyProperties from "../../components/dashboard/my-properties-new";

const index = () => {
  return (
    <>
      <Seo pageTitle="My Properties" />
      <MyProperties />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
