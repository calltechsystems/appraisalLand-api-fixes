import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MyCompletedProperties from "../../components/dashboard/my-completed-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="My Completed Properties" />
      <MyCompletedProperties />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
