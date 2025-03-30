import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import MembershipBroker from "../components/membership-broker";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Broker Membership" />
      <MembershipBroker />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
