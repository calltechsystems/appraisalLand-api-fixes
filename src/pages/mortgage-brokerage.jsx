import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import MortgageBrokerage from "../components/mortgage-brokerage";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Brokerage" />
      <MortgageBrokerage />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
