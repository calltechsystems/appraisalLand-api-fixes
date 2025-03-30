"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import axios from "axios";
import Exemple from "./Exemple";
const TableData = ({
  userData,
  open,
  start,
  openModalBroker,
  end,
  close,
  userNameSearch,
  statusSearch,
  allAppraisers,
  setAllAppraisers,
  setUserNameSearch,
  setStatusSearch,
  searchInput,
  filterQuery,
  onHoldHandler,
  onCancelHandler,
  properties,
  setPropertyId,
  setPropValue,
  refresh,
  setBids,
  allBids,
  setRefresh,
  setOpenPlanModal,
  setViewPlanData,
  setModalIsPopupOpen,
  archievePropertyHandler,
  setCurrentProperty,
  setProperties,
  setFilterQuery,
  setSearchInput,
  setModalIsOpenError,
  setErrorMessage,
  setModalOpen,
  setIsCancelProperty,
  setIsHoldProperty,
  setOpenViewBrokerageModal,
  setSelectedBrokerage
}) => {
  const [rerender, setRerender] = useState(false);

  const deletePropertyHandler = (id) => {
    const data = JSON.parse(localStorage.getItem("user"));

    axios
      .delete("/api/deleteBrokerPropertyById", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          propertyId: id,
        },
      })
      .then((res) => {
        setRerender(true);
      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  };

  return (
    <>
      {
        <Exemple
          userData={userData}
          open={open}
          filterQuery={filterQuery}
          setPropValue={setPropValue}
          setPropertyId={setPropertyId}
          close={close}
          setViewPlanData={setViewPlanData}
          setOpenPlanModal={setOpenPlanModal}
          setProperties={setProperties}
          properties={properties}
          statusSearch={statusSearch}
          userNameSearch={userNameSearch}
          openModalBroker={openModalBroker}
          setRefresh={setRefresh}
          refresh={refresh}
          allAppraisers={allAppraisers}
          setStatusSearch={setStatusSearch}
          setUserNameSearch={setUserNameSearch}
          setAllAppraisers={setAllAppraisers}
          searchInput={searchInput}
          setModalIsOpenError={setModalIsOpenError}
          setErrorMessage={setErrorMessage}
          deletePropertyHandler={deletePropertyHandler}
          setModalIsPopupOpen={setModalIsPopupOpen}
          setCurrentProperty={setCurrentProperty}
          archievePropertyHandler={archievePropertyHandler}
          start={start}
          end={end}
          allBids={allBids}
                          setBids={setBids}
          onHoldHandler={onHoldHandler}
          onCancelHandler={onCancelHandler}
          setFilterQuery={setFilterQuery}
          setSearchInput={setSearchInput}
          setModalOpen={setModalOpen}
          setIsCancelProperty={setIsCancelProperty}
          setIsHoldProperty={setIsHoldProperty}
          setOpenViewBrokerageModal={setOpenViewBrokerageModal}
          setSelectedBrokerage={setSelectedBrokerage}
        />
      }
    </>
  );
};

export default TableData;
