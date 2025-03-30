import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLength } from "../../../features/properties/propertiesSlice";
// import properties from "../../../data/properties";
import Image from "next/image";

const FeaturedItem = ({setModalOpen}) => {
  // const [data, setData] = useState([]);
  const plan = [
    {
      id: 1,
      price: "13000",
      type: "Lite Plan",
      title: "$11",
      location: `1421 San Pedro
  St, Los Angeles, CA 900015`,
      saleTag: ["Featured", "For Sale"],
      garages: "yes",
      itemDetails: [
        {
          name: "5 Properties Appraisal",
          // number: "1",
        },
        {
          name: "30 Days Validity",
          // number: "1",
        },
        {
          name: "No Roll Over",
          // number: "8280",
        },
        {
          name: "Limited Support"
        }
      ],
      posterAvatar: "/assets/images/property/pposter1.png",
      posterName: "Ali Tufan",
      postedYear: "1 year ago",
      imgList: [
        "/assets/images/property/2.jpg",
        "/assets/images/property/3.jpg",
        "/assets/images/property/4.jpg",
        "/assets/images/property/5.jpg",
        "/assets/images/property/6.jpg",
        "/assets/images/property/7.jpg",
      ],
      imgList2: [
        "/assets/images/property/ls2.jpg",
        "/assets/images/property/ls3.jpg",
        "/assets/images/property/ls4.jpg",
        "/assets/images/property/ls5.jpg",
      ],
      built: "2013",
      amenities: "air-conditioning",
      featured: "sale",
      created_at: 1667181268893,
    },
    {
      id: 2,
      img: "/assets/images/property/fp2.jpg",
      price: "14000",
      type: "Pro Plan",
      title: "$19",
      location: `1421 San Pedro
  St, Los Angeles, CA 900015`,
      saleTag: ["Featured", "For Rent"],
      garages: "no",
      itemDetails: [
        {
          name: "20 Properties Appraisal",
          // number: "1",
        },
        {
          name: "30 Days Validity",
          // number: "1",
        },
        {
          name: "Partial Roll Over",
          // number: "8280",
        },
        {
          name: "Enhance Support"
        }
      ],
      posterAvatar: "/assets/images/property/pposter2.png",
      posterName: "Ali Tufan",
      postedYear: "1 year ago",
      imgList: [
        "/assets/images/property/2.jpg",
        "/assets/images/property/3.jpg",
        "/assets/images/property/4.jpg",
        "/assets/images/property/5.jpg",
        "/assets/images/property/6.jpg",
        "/assets/images/property/7.jpg",
      ],
      imgList2: [
        "/assets/images/property/ls2.jpg",
        "/assets/images/property/ls3.jpg",
        "/assets/images/property/ls4.jpg",
        "/assets/images/property/ls5.jpg",
      ],
      built: "2014",
      amenities: "barbeque",
      featured: "rent",
      created_at: 1667181256361,
    },
    {
      id: 3,
      img: "/assets/images/property/fp3.jpg",
      price: "13000",
      type: "Ultimate Plan",
      title: "$35",
      location: `1421 San Pedro
  St, Los Angeles, CA 900015`,
      saleTag: ["Featured", "For Rent"],
      garages: "others",
      itemDetails: [
        {
          name: "50 Properties Appraisal",
          // number: "1",
        },
        {
          name: "30 Days Validity",
          // number: "1",
        },
        {
          name: "Unlimited Roll Over",
          // number: "8280",
        },
        {
          name: "Complete Support"
        }
      ],
      posterAvatar: "/assets/images/property/pposter3.png",
      posterName: "Ali Tufan",
      postedYear: "1 year ago",
      imgList: [
        "/assets/images/property/2.jpg",
        "/assets/images/property/3.jpg",
        "/assets/images/property/4.jpg",
        "/assets/images/property/5.jpg",
        "/assets/images/property/6.jpg",
        "/assets/images/property/7.jpg",
      ],
      imgList2: [
        "/assets/images/property/ls2.jpg",
        "/assets/images/property/ls3.jpg",
        "/assets/images/property/ls4.jpg",
        "/assets/images/property/ls5.jpg",
      ],
      built: "2015",
      amenities: "gym",
      featured: "sale",
      created_at: 1667181247152,
    },
  ];
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
    item.title.toLowerCase().includes(keyword?.toLowerCase());

  // location handler
  const locationHandler = (item) => {
    return item.location.toLowerCase().includes(location.toLowerCase());
  };

  // status handler
  const statusHandler = (item) =>
    item.type.toLowerCase().includes(status.toLowerCase());

  // properties handler
  const propertiesHandler = (item) =>
    item.type.toLowerCase().includes(propertyType.toLowerCase());

  // price handler
  const priceHandler = (item) =>
    item.price < price?.max && item.price > price?.min;

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

  // status handler
  let content = plan
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
    ?.filter(featuredHandler)
    .map((item) => (
      <div className="col-md-4" key={item.id}>
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
              <ul className="tag mb0">
                {item.saleTag.map((val, i) => (
                  <li className="list-inline-item" key={i}>
                    <a href="#">{val}</a>
                  </li>
                ))}
              </ul>
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

              <Link
                href={`/listing-details-v1/${item.id}`}
                className="fp_price"
              >
                ${item.price}
                <small>/mo</small>
              </Link>
            </div>
          </div>
          <div className="details">
            <div className="tc_content">
              <p className="text-thm" style={{fontSize:'20px', fontWeight:'bold'}}>{item.type}</p>
              <h3>
                <Link href={`/listing-details-v1/${item.id}`} className="fw-bold">
                  {item.title}
                </Link>
              </h3>
              {/* <p>
                <span className="flaticon-placeholder"></span>
                {item.location}
              </p> */}

              <ul className="prop_details mb0">
                {item.itemDetails.map((val, i) => (
                  <li className="" key={i}>
                    <a href="#">
                      {val.name}
                    </a>
                  </li>
                ))}
              </ul>
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
                {/* <li className="list-inline-item" style={{ width: "50%" }}>
                  <Link href="/agent-v1">{item.posterName}</Link>
                  <a href="#">Remove</a>
                </li> */}
              </ul>
              {/* <div className="fp_pdate float-end">{item.postedYear}</div> */}
              <div className="fp_pdate float-end mt-1 fw-bold" onClick={() => setModalOpen()}>
                <a href="#" className="text-color">
                  Edit Plan
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
    dispatch(addLength(content.length));
  }, [dispatch, content]);
  return <>{content}</>;
};

export default FeaturedItem;
