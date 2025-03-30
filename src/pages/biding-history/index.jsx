import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import BidingHistory from "../../components/dashboard/biding-history";

const index = () => {
  return (
    <>
      <Seo pageTitle="Biding History" />
      <BidingHistory />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
