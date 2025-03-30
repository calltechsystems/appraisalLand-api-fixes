import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import BrokersArchiveProperties from "../../components/dashboard-admin/brokers-archive-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Mortgage Brokers Archive Properties" />
      <BrokersArchiveProperties />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
