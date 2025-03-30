import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import BrokerageProfile from "../../components/dashboard/brokerage-profile";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Brokerage Profile" />
      <BrokerageProfile />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
