import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import Appraiser from "../components/appraiser";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser" />
      <Appraiser />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
