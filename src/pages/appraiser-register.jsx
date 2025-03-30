import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import SignUp from "../components/appraiser-register";

const index = () => {
  return (
    <>
      <Seo pageTitle="Add the Appraiser" />
      <SignUp />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
