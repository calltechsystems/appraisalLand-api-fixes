import Link from "next/link";
import Image from "next/image";

const TermsCondions = () => {
  const termsContent = [
    {
      id: 1,
      title: "Mortgage Broker",
      text1: `A mortgage broker is a professional who assists borrowers in securing mortgage loans. They act as intermediaries between borrowers and lenders, helping borrowers find the best mortgage options available to them. Mortgage brokers have access to a wide range of lenders and loan products, allowing them to shop around on behalf of the borrower and negotiate favorable terms, rates, and conditions. They guide borrowers through the entire mortgage process, from initial application to closing, and help simplify the complex paperwork and documentation requirements. Ultimately, the goal of a mortgage broker is to assist borrowers in obtaining a mortgage loan that fits their financial needs and goals. `,
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
              width={420}
              height={330}
              className="location-finder"
              style={{ marginLeft: "5%" }}
              src="/assets/images/service/n.jpg"
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
