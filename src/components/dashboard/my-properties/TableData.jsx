"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Exemple from "./Exemple";
const TableData = ({userData , open ,close , properties, setProperties, setModalIsOpenError,setErrorMessage}) => {
  console.log(properties)

  const [Id,setId] = useState(-1);

  const [rerender , setRerender] = useState(false);
 
  const [data , setData] = useState([]);

  let theadConent = [
    "Property Title",
    "Date",
    "Status",
    "Bids",
    "Action",
  ];

  // useEffect(()=>{
    
   

  //   const data = (JSON.parse(localStorage.getItem("user")));

  //   const payload = {
  //     token : userData.token
  //   };


  //   toast.loading("Getting properties...");
  //   axios
  //     .get("/api/getPropertiesById",
  //      {
  //       headers: {
  //         Authorization:`Bearer ${data?.token}`,
  //         "Content-Type":"application/json"
  //       },
  //       params : {
  //         userId : data?.userId
  //       }
  //     })
  //     .then((res) => {
   
  //       toast.dismiss();
        
  //       setProperties(res.data.data.property.$values);
  //       setRerender(false);
  //     })
  //     .catch((err) => {
  //       toast.dismiss();
  //       toast.error(err?.response?.data?.error);
  //     });
  // },[rerender]);
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true, // Use 12-hour format
    };
  
    const formattedDate = new Date(dateString).toLocaleString('en-US', options);
  
    return formattedDate;
  };

  useEffect(()=>{
    setData(properties);
  },[properties]);
  const deletePropertyHandler = (id)=>{

    const data = (JSON.parse(localStorage.getItem("user")));
    
    axios
      .delete("/api/deleteBrokerPropertyById",
       {
        headers: {
          Authorization:`Bearer ${data?.token}`,
          "Content-Type":"application/json"
        },
        params: {
          propertyId : id
        }
        
      })
      .then((res) => {
       setRerender(true);

      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  }

  const toggleDropdownDiv = (item)=>{
  };

  let tbodyContent = data?.map((item,key) => (
    <>
    <tr key={item.id}>
      <td scope="row">
       {/* <div className="feat_property list favorite_page style2" >
          {/*<div className="thumb">
            <Image
              width={150}
              height={220}
              className="img-whp cover"
              src={item.img}
              alt="fp1.jpg"
            />
            <div className="thmb_cntnt">
              <ul className="tag mb0">
                <li className="list-inline-item">
                  <a href="#">For Rent</a>
                </li>
              </ul>
            </div>
         </div> */}
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
            <Link href={`/create-listing/${item.propertyId}`} >
              <span className="flaticon-view"></span>
            </Link>
          </li>
          <li 
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Edit"
          >
            <Link href={`/create-listing/${item.propertyId}`} >
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
            <button style={{border:"none",backgroundColor:"white"}} onClick={()=>open(item)}><Link href="#">
              <span className="flaticon-garbage"></span>
            </Link></button>
          </li>
        </ul>  
      </td>
      {/* End td */}
    </tr>
    { Id === key ?<tr>property data </tr>:""}
    </>
  ));

  console.log(data);

  return (
    <>
    {data && (<Exemple 
    userData={userData}
    open={open}
    close={close}
    setProperties={setProperties}
    properties={data}
    setModalIsOpenError = {setModalIsOpenError}
    setErrorMessage = {setErrorMessage}
    deletePropertyHandler = {deletePropertyHandler}
    />)}
    </>
  );
};

export default TableData;
