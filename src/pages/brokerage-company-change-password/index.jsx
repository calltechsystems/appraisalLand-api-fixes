import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import BrokerageCompanyChangePassword from "../../components/dashboard/brokerage-company-change-password";

const index = () => {
  return (
    <>
      <Seo pageTitle="Brokerage Company Change Password" />
      <BrokerageCompanyChangePassword />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
