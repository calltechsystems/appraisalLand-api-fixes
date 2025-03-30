import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import ChooseUs from "../components/choose-us";

const index = () => {
  return (
    <>
      <Seo pageTitle="Why Choose Us" />
      <ChooseUs/>
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
