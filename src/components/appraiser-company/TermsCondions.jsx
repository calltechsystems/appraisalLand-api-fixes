import Link from "next/link";
import Image from "next/image";

const TermsCondions = () => {
  const termsContent = [
    {
      id: 1,
      title: "Appraiser Company",
      text1: `An appraisal company is a business that specializes in providing valuation services for various assets, such as real estate, machinery, intellectual property, or commercial entities. These companies employ certified appraisers who are trained in assessing the worth or value of different types of assets. The services offered by an appraisal company can include conducting inspections, compiling data and research, analyzing market trends, and preparing comprehensive appraisal reports. They work with individuals, businesses, financial institutions, government agencies, and other entities that require accurate and independent valuations for purposes such as buying or selling assets, obtaining loans or insurance, tax assessments, estate planning, or legal proceedings. Appraisal companies play a crucial role in providing objective and reliable appraisal services to support informed decision-making. `,
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
                <Link href="/sign-up" className="my_profile_setting_input">
                  <button className="btn btn2 mb-3">Register</button>
                </Link>
                {/* <p>{item.text2}</p> */}
              </div>
            ))}
          </div>
          <div className="col-lg-5">
            <Image
              width={420}
              height={350}
              className="location-finder"
              style={{ marginLeft: "5%" }}
              src="/assets/images/service/t.jpg"
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
