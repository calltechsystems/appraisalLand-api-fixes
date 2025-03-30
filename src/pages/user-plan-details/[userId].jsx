import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Seo from "../../components/common/seo";
import PlanDetails from "../../components/dashboard-admin/user-plan-details";

const Index = () => {
  const router = useRouter();
  const { userId } = router.query;

  return (
    <>
      <Seo pageTitle="User Plan Details" />
        <PlanDetails userId={userId}/>
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
