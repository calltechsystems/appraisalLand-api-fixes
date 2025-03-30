import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AddTopupProperties from "../../components/dashboard-admin/add-topup-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Add Topup Properties" />
      <AddTopupProperties />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
