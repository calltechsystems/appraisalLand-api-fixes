import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MyProperties from "../../components/dashboard-admin/property-quotes";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  const { Id } = router.query;
  return (
    <>
      <Seo pageTitle="Properties Bids" />
      <MyProperties  propertyId={Id}/>
    </>
  );
};

export default Index;
