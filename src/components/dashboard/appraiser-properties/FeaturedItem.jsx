import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLength } from "../../../features/properties/propertiesSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { encryptionData } from "../../../utils/dataEncryption";
import TableData from "./TableData";

const FeaturedItem = ({ setModalOpen , close , setLowRangeBid , setPropertyId }) => {
  const [data, setData] = useState([]);
  let userdata = {};
  
  useEffect(()=>{
    userdata = JSON.parse(localStorage.getItem("user"));
  },[]);

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
    item.community.toLowerCase().includes(keyword?.toLowerCase())||
    item.city.toLowerCase().includes(keyword?.toLowerCase())||
    item.area.toLowerCase().includes(keyword?.toLowerCase())||
    item.typeOfBuilding.toLowerCase().includes(keyword?.toLowerCase())||
    item.state.toLowerCase().includes(keyword?.toLowerCase())||
    item.streetNumber.toLowerCase().includes(keyword?.toLowerCase())||
    item.streetName.toLowerCase().includes(keyword?.toLowerCase());


  // location handler
  const locationHandler = (item) => {
    item.city.toLowerCase().includes(keyword?.toLowerCase())||
    item.area.toLowerCase().includes(keyword?.toLowerCase())||
    item.state.toLowerCase().includes(keyword?.toLowerCase())||
    item.streetNumber.toLowerCase().includes(keyword?.toLowerCase())||
    item.streetName.toLowerCase().includes(keyword?.toLowerCase());
  };

  // status handler
  const statusHandler = (item) =>
  item.community.toLowerCase().includes(keyword?.toLowerCase())||
  item.typeOfBuilding.toLowerCase().includes(keyword?.toLowerCase());

  // properties handler
  const propertiesHandler = (item) =>
  item.community.toLowerCase().includes(keyword?.toLowerCase())||
  item.typeOfBuilding.toLowerCase().includes(keyword?.toLowerCase());

  // price handler
  const priceHandler = (item) =>
    item.bidLowerRange < price?.max && item.bidUpperRange > price?.min;

  // bathroom handler
  const bathroomHandler = (item) => {
    if (bathrooms !== "") {
      return item.itemDetails[1].number == bathrooms;
    }
    return true;
  };

  // bedroom handler
  const bedroomHandler = (item) => {
    if (bedrooms !== "") {
      return item.itemDetails[0].number == bedrooms;
    }
    return true;
  };

  // garages handler
  const garagesHandler = (item) =>
    garages !== ""
      ? item.garages?.toLowerCase().includes(garages.toLowerCase())
      : true;

  // built years handler
  const builtYearsHandler = (item) =>
    yearBuilt !== "" ? item?.built == yearBuilt : true;

  // area handler
  const areaHandler = (item) => {
    if (area.min !== 0 && area.max !== 0) {
      if (area.min !== "" && area.max !== "") {
        return (
          parseInt(item.itemDetails[2].number) > area.min &&
          parseInt(item.itemDetails[2].number) < area.max
        );
      }
    }
    return true;
  };

  // advanced option handler
  const advanceHandler = (item) => {
    if (amenities.length !== 0) {
      return amenities.find((item2) =>
        item2.toLowerCase().includes(item.amenities.toLowerCase())
      );
    }
    return true;
  };

  const onWishlistHandler = (id) =>{

    

    const userData = JSON.parse(localStorage.getItem("user"));

    const formData = {
      userId : userData.userId,
      propertyId : id,
      token : userData.token
    }

    const payload = encryptionData(formData);

    toast.loading("Setting this property into your wishlist");
    axios.post("/api/addToWishlist",payload)
    .then((res) => {
      toast.dismiss();
      toast.success("Successfully added !!! ");
     console.log(res);
     
    })
    .catch((err) => {
      toast.dismiss();
      toast.error(err?.response?.data?.error);
    });
    
  }

  // status filter
  const statusTypeHandler = (a, b) => {
    if (statusType === "recent") {
      return a.created_at + b.created_at;
    } else if (statusType === "old") {
      return a.created_at - b.created_at;
    } else if (statusType === "all-status") {
      return a.created_at + b.created_at;
    }
  };

  // featured handler
  const featuredHandler = (item) => {
    if (featured !== "") {
      if (featured === "featured-all") {
        return item;
      }
      return item.featured === featured;
    }
    return true;
  };

  const participateHandler = (val , id)=>{
    setLowRangeBid(val);
    setPropertyId(id);
    setModalOpen();
  }

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));

    toast.loading("Getting properties...");
    axios
      .get("/api/getAllListedProperties", {
        headers: {
          Authorization: `Bearer ${data?.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        toast.dismiss();
        console.log(res.data.data.properties.$values);
        setData(res.data.data.properties.$values);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err?.response?.data?.error);
      });
  }, []);

  // status handler
  {
    /*let content = properties
    ?.slice(0, 9)
    ?.filter(keywordHandler)
    ?.filter(locationHandler)
    ?.filter(statusHandler)
    ?.filter(propertiesHandler)
    ?.filter(priceHandler)
    ?.filter(bathroomHandler)
    ?.filter(bedroomHandler)
    ?.filter(garagesHandler)
    ?.filter(builtYearsHandler)
    ?.filter(areaHandler)
    ?.filter(advanceHandler)
    ?.sort(statusTypeHandler)
?.filter(featuredHandler)*/
  }
  let content = data?.slice(0, 9)?.filter(keywordHandler)?.map((item) => (
    <div className="col-md-6" key={item._id}>
      <div className="feat_property home7 style4">
        <div className="thumb">
          {/* <Image
              width={342}
              height={220}
              className="img-whp w-100 h-100 cover"
              src={item.img}
              alt="fp1.jpg"
            /> */}
          <div className="thmb_cntnt">
            <ul className="icon mb0">
              <li className="list-inline-item">
                <a href="#">
                  <span className="flaticon-transfer-1"></span>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#">
                  <span className="flaticon-heart"></span>
                </a>
              </li>
            </ul>

            <Link href={`/listing-details-v1/${item._id}`} className="fp_price">
              ${item.bidLowerRange}
              <small>/mo</small>
            </Link>
          </div>
        </div>
        <div className="details">
          <div className="tc_content">
            <p className="text-thm">{item.typeOfBuilding}</p>
            <h4>
              <Link href={`/listing-details-v1/${item.id}`}>
                {item.streetName} {item.streetNumber}
              </Link>
            </h4>
            <p>
              <span className="flaticon-placeholder"></span>
              {item.area} {item.city} {item.state} {item.zipCode}
            </p>

            {/* <ul className="prop_details mb0">
                {item.itemDetails.map((val, i) => (
                  <li className="list-inline-item" key={i}>
                    <a href="#">
                      {val.name}: {val.number}
                    </a>
                  </li>
                ))}
              </ul>*/}
          </div>
          {/* End .tc_content */}

          <div className="fp_footer">
            <ul className="fp_meta float-start mb0">
              <li className="list-inline-item">
                {/* <Link href="/agent-v1">
                    <Image
                      width={40}
                      height={40}
                      src={item.posterAvatar}
                      alt="pposter1.png"
                    />
                  </Link> */}
              </li>
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
                <button onClick={()=>onWishlistHandler(item.propertyId)}>
                  <span className="flaticon-heart text-color "></span>
                </button>
              </li>
            </ul>
            {/* <div className="fp_pdate float-end">{item.postedYear}</div> */}
            <div
              className="fp_pdate float-end mt-1 fw-bold"
              onClick={()=>participateHandler(item.bidLowerRange , item.propertyId)}
            >
              <a href="#" className="text-color">
                Participate Bid
              </a>
            </div>
          </div>
          {/* End .fp_footer */}
        </div>
      </div>
    </div>
  ));

  // add length of filter items

  useEffect(() => {
    dispatch(addLength(data.length));
  }, [dispatch, data]);
  return <><TableData userData={userdata} open={setModalOpen} close={close} onWishlistHandler={onWishlistHandler} participateHandler={participateHandler} properties={data} setProperties={setData}/></>;
};

export default FeaturedItem;
