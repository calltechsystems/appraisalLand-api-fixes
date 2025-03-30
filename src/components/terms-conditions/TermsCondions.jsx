import Link from "next/link";

const TermsCondions = () => {
  const termsContent = [
    {
      id: 1,
      title: "Privacy Policy",
      text1: `To be discussed`,
      text2: `To be discussed`,
    },
    {
      id: 2,
      title: "Our Terms",
      text1: `To be discussed`,
      text2: `To be discussed`,
    },
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
      <div className="col-lg-8 col-xl-8">
        <div className="terms_condition_grid">
          {termsContent.map((item) => (
            <div className="grids mb30" key={item.id}>
              <h4>{item.title}</h4>
              <p className="mb20">{item.text1}</p>
              <p>{item.text2}</p>
            </div>
          ))}
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
