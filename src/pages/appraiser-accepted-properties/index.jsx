import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import BidingHistory from "../../components/dashboard/appraiser-accepted-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Accepted Properties" />
      <BidingHistory />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
