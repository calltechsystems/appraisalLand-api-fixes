import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import HowWeWork from "../components/broker-user-guide";

const index = () => {
  return (
    <>
      <Seo pageTitle="Broker User Guide" />
      <HowWeWork />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
