import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import ArchiveProperty from "../../components/dashboard/archive-property";

const index = () => {
  return (
    <>
      <Seo pageTitle="Archive  Properties" />
      <ArchiveProperty />
    </>
  );
};

export default index;
// export default dynamic(() => Promise.resolve(index), { ssr: false });
