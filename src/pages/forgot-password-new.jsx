import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import ForgotNew from "../components/forgot-new"; 

const index = () => {
  return (
    <>
      <Seo pageTitle="Forgot Password" />
      <ForgotNew />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
