import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import BrokeragePropertiesBid from "../../components/dashboard/brokerage-properties-bid";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  const { Id } = router.query;
  console.log(Id);
  return (
    <>
      <Seo pageTitle="Properties Bids" />
      <BrokeragePropertiesBid propertyId={Id} />
    </>
  );
};

export default Index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
