import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AllBrokers from "../../components/dashboard/all-brokers";

const index = () => {
  return (
    <>
      <Seo pageTitle="All Sub Brokers" />
      <AllBrokers />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
