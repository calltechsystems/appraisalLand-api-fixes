import Link from "next/link";
import Image from "next/image";

const TermsCondions = () => {
  const termsContent = [
    {
      id: 1,
      title: "Mortgage Brokerage",
      text1: `A mortgage brokerage is a specialized firm that helps borrowers secure mortgage loans. Mortgage brokers act as intermediaries between borrowers and lenders, working with a variety of lenders to find the best mortgage option for each client. They provide personalized guidance and advice to help borrowers choose the most appropriate mortgage loan for their specific financial needs and goals, such as finding the lowest interest rate and most favorable terms. Mortgage brokers also handle the mortgage application process, collecting necessary documents, and liaising with the lender to ensure a smooth and timely closing. Mortgage brokers are paid via commission, which can come from either the borrower or the lender. By working with a mortgage brokerage, borrowers can save considerable time and effort compared to finding and negotiating with lenders themselves. Moreover, they can benefit from the broker's extensive knowledge of the mortgage market and its regulations, which can help them navigate complex situations and find favorable deals. `,
    },
    // {
    //   id: 2,
    //   title: "Our Terms",
    //   text1: `To be discussed`,
    //   text2: `To be discussed`,
    // },
  ];

  const navigationList = [
    { id: 1, routeLink: "#", name: "Welcome Text" },
    { id: 2, routeLink: "#", name: "Our Terms" },
    { id: 3, routeLink: "#", name: "Conditions" },
    { id: 4, routeLink: "#", name: "Your Privacy" },
    { id: 5, routeLink: "#", name: "Informations We Collect" },
  ];

  return (
    <div className="row">
      <div className="col-lg-12 col-xl-12">
        <div className="row terms_condition_grid">
          <div className="col-lg-7">
            {termsContent.map((item) => (
              <div className="grids mb30" key={item.id}>
                <h4>{item.title}</h4>
                <p className="mb20">{item.text1}</p>
                <Link href="/register" className="my_profile_setting_input">
                  <button className="btn btn2 mb-3">Register</button>
                </Link>
                {/* <p>{item.text2}</p> */}
              </div>
            ))}
          </div>
          <div className="col-lg-5">
            <Image
              width={440}
              height={400}
              className="location-finder"
              style={{ marginLeft: "5%" }}
              src="/assets/images/service/p.jpg"
              alt="location"
            />
          </div>
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-lg-4 col-xl-4">
      <div className="terms_condition_widget">
        <h4 className="title">Navigation</h4>
        <div className="widget_list">
          <ul className="list_details">
            {navigationList.map((list) => (
              <li key={list.id}>
                <Link href={list.routeLink}>
                  <i className="fa fa-caret-right mr10"></i>
                  {list.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div> */}
    </div>
  );
};

export default TermsCondions;
