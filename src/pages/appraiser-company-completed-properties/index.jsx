import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import BidingHistory from "../../components/dashboard/appraiser-company-completed-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Completed Orders" />
      <BidingHistory />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
