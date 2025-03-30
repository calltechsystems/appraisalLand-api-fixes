import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MyProperties from "../../components/dashboard/my-property-bids";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  const { Id } = router.query;
  console.log(Id)
  return (
    <>
      <Seo pageTitle="Properties Bids" />
      <MyProperties  propertyId={Id}/>
    </>
  );
};

export default Index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
