import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import MembershipBrokerageCompany from "../components/membership-brokerage-company";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Brokerage Membership" />
      <MembershipBrokerageCompany />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
