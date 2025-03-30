import dynamic from "next/dynamic";
import Seo from "../../components/common/seo";
import MyPlans from "./plans";
import { useEffect, useState } from "react";
import Modal from "./Modal";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [price, setPrice] = useState({
    title : "Basic",
    price : 0
  });

  
  const [userData , setUserData] = useState({});
  useEffect(()=>{
    const fetchData = ()=>{
      const data =  (JSON.parse(localStorage.getItem("user"))) ;
      if(data)
       setUserData(data);
    }
    fetchData();
  },[]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <>
      <Seo pageTitle="Top-Up" />
      <MyPlans setModalOpen={setModalOpen} setPrice={setPrice} userData={userData} modalOpen={modalOpen}/>
      <Modal modalOpen={modalOpen} closeModal={closeModal} price={price}/>
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });