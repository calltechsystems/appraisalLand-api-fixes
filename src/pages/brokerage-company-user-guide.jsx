import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import HowWeWork from "../components/brokerage-company-user-guide";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser User Guide" />
      <HowWeWork />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
