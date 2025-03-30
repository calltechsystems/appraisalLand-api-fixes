import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import MortgageBroker from "../components/mortgage-broker";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Broker" />
      <MortgageBroker />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
