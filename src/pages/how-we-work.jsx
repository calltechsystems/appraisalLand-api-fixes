import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import HowWeWork from "../components/how-we-work";

const index = () => {
  return (
    <>
      <Seo pageTitle="How We Work" />
      <HowWeWork />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
