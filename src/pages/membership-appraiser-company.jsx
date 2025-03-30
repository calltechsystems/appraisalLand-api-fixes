import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import MembershipAppraiserCompany from "../components/membership-appraiser-company";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Company Membership" />
      <MembershipAppraiserCompany />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
