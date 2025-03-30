import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MyPackage from "../../components/dashboard/subscription-history";

const index = () => {
  return (
    <>
      <Seo pageTitle="Subscription History" />
      <MyPackage />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
