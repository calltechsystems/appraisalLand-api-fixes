import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraiserWishlist from "../../components/dashboard/appraiser-company-wishlisted-properties";

const index = () => {
  return (
    <>
      <Seo pageTitle="Wishlisted Properties" />
      <AppraiserWishlist />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
