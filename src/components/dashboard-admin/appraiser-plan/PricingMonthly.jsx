import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLength } from "../../../features/properties/propertiesSlice";
// import properties from "../../../data/properties";
import Image from "next/image";

const FeaturedItem = ({ setEditPlan, editPlan, setModalOpen, data }) => {
  // const [data, setData] = useState([]);

  const {} = useSelector((state) => state.properties);
  const { statusType, featured, isGridOrList } = useSelector(
    (state) => state.filter
  );

  const dispatch = useDispatch();

  const openEditPlanModal = (plan) => {
    setEditPlan(plan);
    setModalOpen(true);
  };

  // status handler
  let content = data?.map((item) => (
    <div className="col-md-4" key={item.id}>
      <div className="pricing_table">
        <div className="details">
          <div className="tc_content" style={{ textAlign: "center" }}>
            <p
              className="text-thm mb-4"
              style={{ fontSize: "23px", fontWeight: "bold", color: "" }}
            >
              {item.type}
            </p>
            <h1>
              <Link href={``} className="fw-bold">
                {item.planName}
              </Link>
            </h1>

            <ul className="mb-4 mt-4">
              <li className="mb-2">
                <span className="fs-6 text-dark">
                  {item.noOfProperties} Properties Appraisal
                </span>
              </li>
              <li>
                <span className="fs-6 text-dark">30 Days Validity</span>
              </li>
            </ul>
            <h2 className="mb-5">
              <Link href={``} className="fw-bold">
                $ {item.monthlyAmount}
              </Link>
            </h2>
            {/* <ul className=" mb0">
              {data?.map((val, i) => (
                <li className="" key={i}>
                  <a href="#">{val.name}</a>
                </li>
              ))}
            </ul> */}
          </div>

          <div className="fp_footer text-center">
            <div
              className="fp_pdate float-center"
              onClick={() => openEditPlanModal(item)}
            >
              <a href="#" className="btn btn-color_01 w-100">
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
