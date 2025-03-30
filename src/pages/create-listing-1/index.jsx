import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import CreateListing from "../../components/dashboard/create-listing-1";

const index = () => {
  return (
    <>
      <Seo pageTitle="Create Listing" />
      <CreateListing />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
