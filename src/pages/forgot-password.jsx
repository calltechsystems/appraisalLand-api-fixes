import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import Forgot from "../components/forgot"; 

const index = () => {
  return (
    <>
      <Seo pageTitle="Forgot" />
      <Forgot />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
