import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import AppraiserWishlist from "../../components/dashboard/appraiser-wishlisted/index";

const index = () => {
  return (
    <>
      <Seo pageTitle="Appraiser Wishlisted" />
      <AppraiserWishlist />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
