import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import Events from "../components/events";

const index = () => {
  return (
    <>
      <Seo pageTitle="Events" />
      <Events />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
