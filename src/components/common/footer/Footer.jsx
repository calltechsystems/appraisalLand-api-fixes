import Link from "next/link";
import Social from "./Social";
// import SubscribeForm from "./SubscribeForm";

const Footer = () => {
  return (
    <>
      <div className="col-sm-6 col-md-6 col-lg-3 col-xl-3 pr0 pl0">
        <div className="footer_about_widget">
          <h4>About Appraisal Land</h4>
          <p className="text-light">
            We are an Ontario-based business working with brokers and appraisers
            to provide services in the real estate sector.
          </p>
        </div>
      </div>
      {/* End .col */}

      <div className="col-sm-6 col-md-6 col-lg-3 col-xl-3">
        <div className="footer_qlink_widget">
          <h4>Quick Links</h4>
          <ul className="list-unstyled">
            <li>
              <Link href="/about-us" className="text-light">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-light">
                Terms & Conditions
              </Link>
            </li>
            {/* <li className="text-light">
              <Link href="/">User&apos;s Guide</Link>
            </li> */}
            <li>
              <Link href="/contact" className="text-light">
                Support Center
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-light">
                FAQ&apos;s
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* End .col */}

      <div className="col-sm-6 col-md-6 col-lg-3 col-xl-3">
        <div className="footer_contact_widget">
          <h4>Contact Us</h4>
          <ul className="list-unstyled">
            <li>
              <a className="text-light">
                123 Main Street
              </a>
            </li>
            <li>
              <a className="text-light">
                Brampton, LX23Y2, Ontario
              </a>
            </li>
            <li>
              <Link href="mailto:info@appraisalLand.ca" className="text-light">
              <span className="flaticon-envelope p-1"></span>
                info@appraisalLand.ca
              </Link>
            </li>
            <li>
              {/* <a href="tel:+13020001111" className="text-light"> */}
              <a className="text-light">
              <span className="flaticon-telephone p-1"></span>
                +1 302-000-1111
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* End .col */}

      <div className="col-sm-6 col-md-6 col-lg-3 col-xl-3">
        <div className="footer_social_widget">
          <h4>Follow us</h4>
          <ul className="mb30">
            <Social />
          </ul>
          {/* <h4>Subscribe</h4>
          <SubscribeForm /> */}
        </div>
      </div>
    </>
  );
};

export default Footer;
