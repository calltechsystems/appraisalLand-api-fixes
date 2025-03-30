import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AssignedCompletedProperties from "../../components/dashboard/assigned-completed-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Assigned Completed Properties" />
      <AssignedCompletedProperties />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
