"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Exemple from "./Exemple";
import { useDispatch, useSelector } from "react-redux";
const TableData = ({
  userData,
  setWishlistedProperties,
  setIsStatusModal,
  open,
  setFilterQuery,
  searchInput,
  filterQuery,
  setSearchInput,
  start,
  end,
  close,
  onWishlistHandler,
  setStartLoading,
  setUpdatedCode,
  openModalBroker,
  participateHandler,
  setModalIsPopupOpen,
  setCurrentProperty,
  properties,
  setProperties,
  setErrorMessage,
  setModalIsOpenError,
  setRefresh,
  refresh,
}) => {
  let userInfo = {};
  const [Id, setId] = useState(-1);

  const [rerender, setRerender] = useState(false);

  const [data, setData] = useState([]);

  const {
    keyword,
    location,
    status,
    propertyType,
    price,
    bathrooms,
    bedrooms,
    garages,
    yearBuilt,
    area,
    amenities,
  } = useSelector((state) => state.properties);
  const { statusType, featured, isGridOrList } = useSelector(
    (state) => state.filter
  );

  const dispatch = useDispatch();

  // keyword filter
  const keywordHandler = (item) =>
    item.community.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.city.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.area.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.typeOfBuilding.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.state.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.streetNumber.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.streetName.toLowerCase().includes(keyword?.toLowerCase());

  // location handler
  const locationHandler = (item) => {
    item.city.toLowerCase().includes(keyword?.toLowerCase()) ||
      item.area.toLowerCase().includes(keyword?.toLowerCase()) ||
      item.state.toLowerCase().includes(keyword?.toLowerCase()) ||
      item.streetNumber.toLowerCase().includes(keyword?.toLowerCase()) ||
      item.streetName.toLowerCase().includes(keyword?.toLowerCase());
  };

  // status handler
  const statusHandler = (item) =>
    item.community.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.typeOfBuilding.toLowerCase().includes(keyword?.toLowerCase());

  // properties handler
  const propertiesHandler = (item) =>
    item.community.toLowerCase().includes(keyword?.toLowerCase()) ||
    item.typeOfBuilding.toLowerCase().includes(keyword?.toLowerCase());

  // price handler
  const priceHandler = (item) =>
    item.bidLowerRange < price?.max && item.bidUpperRange > price?.min;

  let theadConent = ["Property Title", "Date", "Urgency", "Bids", "Action"];

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));

    const payload = {
      token: userData.token,
    };

    axios
      .get("/api/getAllListedProperties", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
        params: {
          userId: data?.userId,
        },
      })
      .then((res) => {
        toast.dismiss();
        setProperties(res.data.data.properties.$values);
        setRerender(false);
      })
      .catch((err) => {
        toast.dismiss();
        setErrorMessage(err?.response?.data?.error);
        setModalIsOpenError(true);
      });
  }, [rerender]);
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);

    return formattedDate;
  };

  useEffect(() => {
    setData(properties);
  }, [properties]);
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
        setErrorMessage(err.response.data.error);
        setModalIsOpenError(true);
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
          <span className="status_tag badge">
            {item?.urgency === 1
              ? "Low"
              : item?.urgency === 2
              ? "Medium"
              : "High"}
          </span>
        </td>
        {/* End td */}

        <td>2,345</td>
        {/* End td */}

        <td>
          <ul className="view_edit_delete_list mb0">
            <li
              className="list-inline-item"
              style={{
                width: "30px",
                border: "1px solid black",
                textAlign: "center",
                borderRadius: "5px",
              }}
            >
              {/* <Link href="/agent-v1">{item.posterName}</Link> */}
              <button onClick={() => onWishlistHandler(item.propertyId)}>
                <span className="flaticon-heart text-color "></span>
              </button>
            </li>
          </ul>

          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
          >
            <div
              className="fp_pdate float-end mt-1 fw-bold"
              onClick={() =>
                participateHandler(item.bidLowerRange, item.propertyId)
              }
            >
              <a href="#" className="text-color">
                Provide Qoute
              </a>
            </div>
          </li>
        </td>
      </tr>
      {Id === key ? <tr>property data </tr> : ""}
    </>
  ));

  return (
    <>
      {data && (
        <Exemple
          userData={userData}
          open={open}
          close={close}
          setProperties={setProperties}
          properties={data}
          setRefresh={setRefresh}
          refresh={refresh}
          setModalIsOpenError={setModalIsOpenError}
          setErrorMessage={setErrorMessage}
          deletePropertyHandler={deletePropertyHandler}
          onWishlistHandler={onWishlistHandler}
          participateHandler={participateHandler}
          setWishlistedProperties={setWishlistedProperties}
          setUpdatedCode={setUpdatedCode}
          filterQuery={filterQuery}
          searchInput={searchInput}
          setStartLoading={setStartLoading}
          setFilterQuery={setFilterQuery}
          setCurrentProperty={setCurrentProperty}
          setSearchInput={setSearchInput}
          openModalBroker={openModalBroker}
          setIsStatusModal={setIsStatusModal}
          setModalIsPopupOpen={setModalIsPopupOpen}
          start={start}
          end={end}
        />
      )}
    </>
  );
};

export default TableData;
