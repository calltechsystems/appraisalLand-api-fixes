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

  const content =
    isPlan === 1 ? pricingContentForMonthly : pricingContentForYearly;

  // Filter data to include items with id 0, 1, or 2
  const filteredData = data.filter((item) => item.id >= 13 && item.id <= 18);

  const selectPackageHandler = (id, title, price) => {
    setModalOpen(true);
    setPrice({ id, title, price });
  };

  return (
    <>
      {filteredData.length > 0 ? (
        filteredData.map((item) => (
          <div
            className="col-sm-4 col-md-4 my_plan_pricing_header mb-5"
            key={item.id}
          >
            <div
              className={`pricing_table ${
                String(selectedId) === String(item.id) ? "pricing_table" : ""
              }`}
            >
              <div className="pricing_header">
                <div className="price">{item.planName}</div>
              </div>
              <div className="pricing_content">
                <ul className="mb0">
                  <li>{item.noOfProperties} Properties Appraisal</li>
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
                >
                  <a className="btn btn-color_1 btn-block w-100" href="#">
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
        ))
      ) : (
        <p>No data found for the selected range.</p>
      )}
    </>
  );
};

export default Pricing;
