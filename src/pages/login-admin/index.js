import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import Login from "../../components/login-admin";

const index = () => {
  return (
    <>
      <Seo pageTitle="Admin Login" />
      <Login  />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });