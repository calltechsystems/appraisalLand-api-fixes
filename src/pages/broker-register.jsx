import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import SignUp from "../components/broker-register";

const index = () => {
  return (
    <>
      <Seo pageTitle="Add the Broker" />
      <SignUp />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
