import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import MembershipAppraiser from "../components/membership-appraiser";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Membership" />
      <MembershipAppraiser />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
