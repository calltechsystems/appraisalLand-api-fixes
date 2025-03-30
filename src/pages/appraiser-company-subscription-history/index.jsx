import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MyPackage from "../../components/dashboard/appraiser-company-subscription-history";

const index = () => {
  return (
    <>
      <Seo pageTitle="Plans" />
      <MyPackage />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
