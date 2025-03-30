import Image from "next/image";
import PopupVideo from "../common/PopupVideo";

const OurMission = () => {
  const missionContent = [
    {
      id: 1,
      icon: "flaticon-user",
      number: "1222",
      meta: "Customers to date",
    },
    {
      id: 2,
      icon: "flaticon-home",
      number: "652",
      meta: "In home sales",
    },
    {
      id: 3,
      icon: "flaticon-transfer",
      number: "$47",
      meta: "Appraised Properties",
    },
  ];

  return (
    <>
      <div className="col-lg-8 col-xl-7">
        <div className="about_content">
          <p className="large">
            We are a company headquartered in Ontario, collaborating with
            brokers and appraisers to offer services within the real estate
            industry.
          </p>
          <p>
            Our mission is to deliver property appraisal services in the most
            efficient, compliant, and reliable manner possible. Our objective is
            to nurture our relationships by ensuring timely communication,
            fostering strong collaboration with stakeholders, and proactively
            addressing concerns with a solution-oriented, analytical approach.
          </p>
          <ul className="ab_counting">
            {missionContent.map((item) => (
              <li className="list-inline-item" key={item.id}>
                <div className="about_counting">
                  <div className="icon">
                    <span className={`${item.icon}`}></span>
                  </div>
                  <div className="details">
                    <h3>{item.number}</h3>
                    <p>{item.meta}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="col-lg-4 col-xl-5">
        <div className="about_thumb">
          <Image
            width={461}
            height={309}
            priority
            className="w100 cover"
            src="/assets/images/service/10.png"
            alt="1.jpg"
          />
          <PopupVideo />
        </div>
      </div>
    </>
  );
};

export default OurMission;
