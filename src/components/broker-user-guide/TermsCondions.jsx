import Link from "next/link";
import Image from "next/image";

const TermsCondions = () => {
  // const termsContent = [
  //   {
  //     id: 1,
  //     title: "Step 1",
  //     text1: `Description `,
  //     text2: `To be discussed`,
  //   },
  //   // {
  //   //   id: 2,
  //   //   title: "Step 2. Address Validation",
  //   //   text1: `Address validation begins after the Broker submits the property. Address validation services are provided by our company for properties. We ensure that the property addresses provided are accurate and up to date by utilizing advanced technology and reliable data sources. We cross-reference the address details against comprehensive databases during the validation process to ensure their accuracy. `,
  //   //   text2: `To be discussed`,
  //   // },
  //   // {
  //   //   id: 3,
  //   //   title: "Step 3. Appraisers provide Quotes",
  //   //   text1: `Once the address has been validated, our certified appraiser will be able to provide a quote for the property appraisal. The appraisal quote will be based on various factors, including the property's location, size, condition, features, and market trends. During the appraisal process, the appraiser will conduct a thorough inspection of the property and gather relevant data. They will analyse comparable properties, market conditions, and other factors to determine the fair market value of the property.  `,
  //   //   text2: `To be discussed`,
  //   // },
  //   // {
  //   //   id: 4,
  //   //   title: "Step 5. Quote available to broker",
  //   //   text1: `We give the broker the best quote after verifying the appraiser's estimate and being certain of its accuracy. We gather all the relevant data for the verified quote, including the property's specifics, the appraisal report, and any supporting records. The objective is to offer the broker the best quote based on the verified appraisal. A smooth and successful transaction will be facilitated by open and honest communication with all parties involved.  `,

  //   //   text2: `To be discussed`,
  //   // },
  //   // {
  //   //   id: 5,
  //   //   title: "Step 4. Validate quote",
  //   //   text1: `Once the appraiser has provided us with a quote for the property, we validate it by verifying the accuracy of the property description used by the appraiser to make the appraisal. This may entail physically inspecting the property to ensure that it matches the appraiser's description. We verify the appraiser's use of appropriate appraisal methodologies and techniques, as well as recent sales of comparable properties in the area to compare the appraiser's valuation with market trends.`,
  //   //   text2: `To be discussed`,
  //   // },
  //   // {
  //   //   id: 2,
  //   //   title: "Step 6. Broker selects the appraiser",
  //   //   text1: `Once we have provided the validated quote to the broker, it is likely that the broker will choose to move forward with the appraiser who provided the quote. The validation process helps ensure the accuracy and reliability of the quote, making it a trusted and preferred choice for the broker. `,
  //   //   text2: `To be discussed`,
  //   // },
  // ];

  // const navigationList = [
  //   { id: 1, routeLink: "#", name: "Welcome Text" },
  //   { id: 2, routeLink: "#", name: "Our Terms" },
  //   { id: 3, routeLink: "#", name: "Conditions" },
  //   { id: 4, routeLink: "#", name: "Your Privacy" },
  //   { id: 5, routeLink: "#", name: "Informations We Collect" },
  // ];

  return (
    <div className="row">
      {/* <div className="col-lg-4 col-xl-4">
        <div className="terms_condition_widget">
          <div className="widget_list">
            <Image
              width={461}
              height={359}
              priority
              className="w100 cover"
              src="/assets/images/service/flowchart.png"
              alt="1.jpg"
            />
          </div>
        </div>
      </div> */}
      <div className="col-lg-12 col-xl-12">
        <div className="terms_condition_grid mt-1">
          <div className="grids mb30">
            <h4></h4>
            <p>
              This guide will help you navigate through each step of our portal,
              from registration to managing your profile and accessing property
              details.
            </p>
          </div>

          {/* {termsContent.map((item) => (
            <div className="grids mb30" key={item.id}>
              <h4>{item.title}</h4>
              <p className="mb20">{item.text1}</p>
              <p>{item.text2}</p>
            </div>
          ))} */}
          <button className=" btn btn-color">
            {" "}
            <Link
              href="assets/images/Broker User Guide_v0.5.pdf"
              target="_blank"
              className="text-light"
            >
              Download pdf
            </Link>
          </button>
        </div>
        {/* <div className="about_thumb terms_condition_grid">
          {" "}
          <Image
            width={461}
            height={479}
            priority
            className="w100 cover mb-5"
            src="/assets/images/service/flowchart.png"
            alt="1.jpg"
          />
          {termsContent.map((item) => (
            <div className="grids mb30" key={item.id}>
              <h4>{item.title}</h4>
              <p className="mb20">{item.text1}</p>
            </div>
          ))}
        </div> */}
      </div>
      {/* End .col */}
    </div>
  );
};

export default TermsCondions;
