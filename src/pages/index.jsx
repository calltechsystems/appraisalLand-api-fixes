import dynamic from "next/dynamic";
import Seo from "../components/common/seo";
import HomeMain from "../components/home";
import { Toaster } from "react-hot-toast";

const index = () => {
  return (
    <>
      <Seo pageTitle="Homepage" />
      {/* <Toaster> */}
      <HomeMain />
      {/* </Toaster> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
