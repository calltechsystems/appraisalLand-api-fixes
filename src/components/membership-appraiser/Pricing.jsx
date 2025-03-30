import { useEffect } from "react";

const Pricing = ({
  isPlan,
  hideButton,
  selectedId,
  setModalOpen,
  selectedplan,
  data,
  setPrice,
}) => {
  console.log(selectedplan, isPlan);
  // let userData = {};
  // useEffect(() => {
  //   userData = JSON.parse(localStorage.getItem("user"));
  // }, []);
  const pricingContentForMonthly = [
    {
      id: 1,
      price: "11",
      title: "Lite",
      features: ["30 Days Validity", "No Roll Over", "Limited Support"],
    },
    {
      id: 2,
      price: "19",
      title: "Pro",
      features: ["30 Days Validity", "Partial Roll Over", "Enhanced Support"],
    },
    {
      id: 3,
      price: "35",
      title: "Ultimate",
      features: ["30 Days Validity", "Unlimited Roll Over", "Complete Support"],
    },
  ];

  const pricingContentForYearly = [
    {
      id: 1,
      price: "132",
      title: "Lite",
      features: ["365 Days Validity", "Partial Roll Over", "Limited Support"],
    },
    {
      id: 2,
      price: "228",
      title: "Pro",
      features: ["365 Days Validity", "Partial Roll Over", "Complete Support"],
    },
    {
      id: 3,
      price: "420",
      title: "Ultimate",
      features: [
        "365 Days Validity",
        "Unlimited Roll Over",
        "Complete Support",
      ],
    },
  ];

  const selectedIdStyle = selectedId ? selectedId : "2";
  const content =
    isPlan === 1 ? pricingContentForMonthly : pricingContentForYearly;

  const selectPackageHandler = (id, title, price) => {
    setModalOpen(true);
    console.log(price);
    setPrice({
      id: id,
      title: title,
      price: price,
    });
  };
  return (
    <>
      {data?.map((item, idx) => (
        <div
          className="col-sm-4 col-md-4 my_plan_pricing_header mb-5"
          key={item.id}
        >
          <div
            className={`pricing_table  ${
              String(selectedIdStyle) === String(item.id) ? "pricing_table" : ""
            }`}
          >
            <div className="pricing_header">
              <div className="price">{item.planName}</div>
              {/* {String(selectedIdStyle) === String(item.id) ? (
                <div
                  className="p-1 fw-bold"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "4px",
                    fontSize: "19px",
                    color: "#2e008b",
                  }}
                >
                  Recommended Plan{" "}
                </div>
              ) : (
                <div
                  className="p-1 fw-bold"
                  style={{
                    visibility: "hidden",
                    backgroundColor: "white",
                    borderRadius: "4px",
                    fontSize: "19px",
                    color: "#2e008b",
                  }}
                >
                  Recommended Plan{" "}
                </div>
              )} */}
            </div>
            <div className="pricing_content">
              <ul className="mb0">
                <li key={idx}>{item.noOfProperties} Properties Appraisal</li>
                {/* {content[idx]?.features?.map((val, i) => (
                  <li key={i}>{val}</li>
                ))} */}
              </ul>
              <div className="pricing_header">
                <h2 className="" style={{ color: "#2e008b" }}>
                  $
                  {selectedplan === "Monthly"
                    ? item.monthlyAmount - item.discount
                    : item.yearlyAmount - item.discount}
                </h2>
              </div>
            </div>
            {!hideButton && (
              <div
                className="pricing_footer"
                onClick={() =>
                  selectPackageHandler(
                    item.id,
                    item.description,
                    isPlan === "Monthly"
                      ? item.monthlyAmount - item.discount
                      : item.yearlyAmount - item.discount
                  )
                }
                // onClick={
                //   userData
                //     ? ""
                //     : () => selectPackageHandler(item.title, item.price)
                // }
              >
                <a
                  className={`btn btn-color_1 btn-block w-100`}
                  href="#"
                  // href={userData ? "/my-plans" : "#"}
                >
                  {selectedId !== item.id
                    ? !selectedId
                      ? "Get Started"
                      : "Change Plan"
                    : "Upgrade"}
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default Pricing;
