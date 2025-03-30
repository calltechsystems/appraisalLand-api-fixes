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
}) => {

  const [Id, setId] = useState(-1);

  const [rerender, setRerender] = useState(false);

  const [data, setData] = useState([]);

  let theadConent = ["Property Title", "Date", "Status", "Bids", "Action"];

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);

    return formattedDate;
  };

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

  const toggleDropdownDiv = (item) => {};

  let tbodyContent = data?.map((item, key) => (
    <>
      <tr key={item.id}>
        <td scope="row">
          <div className="details">
            <div className="tc_content">
              <h4>{item.title}</h4>
              <p>
                <span className="flaticon-placeholder"></span>
                {item.area} {item.city} {item.state} zipCode-{item.zipCode}
              </p>
              <Link className="fp_price text-thm" href="#">
                ${item.bidLowerRange} - ${item.bidUpperRange}
                <small>/estimated</small>
              </Link>
            </div>
          </div>
        </td>
        {/* End td */}

        <td>{formatDate(item?.addedDatetime)}</td>
        {/* End td */}

        <td>
          <span className="status_tag badge">Pending</span>
        </td>
        {/* End td */}

        <td>2,345</td>
        {/* End td */}

        <td>
          <ul className="view_edit_delete_list mb0">
            <li
              className="list-inline-item"
              data-toggle="tooltip"
              data-placement="top"
              title="View"
            >
              <Link href={`/create-listing/${item.propertyId}`}>
                <span className="flaticon-view"></span>
              </Link>
            </li>
            <li
              className="list-inline-item"
              data-toggle="tooltip"
              data-placement="top"
              title="Edit"
            >
              <Link href={`/create-listing/${item.propertyId}`}>
                <span className="flaticon-edit"></span>
              </Link>
            </li>
            {/* End li */}

            <li
              className="list-inline-item"
              data-toggle="tooltip"
              data-placement="top"
              title="Delete"
            >
              <button
                style={{ border: "none", backgroundColor: "white" }}
                onClick={() => open(item)}
              >
                <Link href="#">
                  <span className="flaticon-garbage"></span>
                </Link>
              </button>
            </li>
          </ul>
        </td>
        {/* End td */}
      </tr>
      {Id === key ? <tr>property data </tr> : ""}
    </>
  ));

  console.log(data);

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
        />
      }
    </>
  );
};

export default TableData;
