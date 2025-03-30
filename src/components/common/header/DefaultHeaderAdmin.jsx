import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderMenuContent from "./HeaderMenuContent_01";
import Image from "next/image";

const Header = ({ userData }) => {
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 95) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  return (
    <header
      className={`header-nav menu_style_home_one style2 navbar-scrolltofixed stricky main-menu  ${
        navbar ? "stricky-fixed " : ""
      }`}
    >
      <div className="container-fluid p0">
        {/* <!-- Menu Toggle btn--> */}
        <Link href="/" className="navbar_brand float-start dn-smd">
          <Image
            width={40}
            height={45}
            className="logo1 img-fluid"
            style={{ marginTop: "15px" }}
            src="/assets/images/logo_new.png"
            alt="header-logo2.png"
          />
          <Image
            width={40}
            height={45}
            className="logo2 img-fluid"
            style={{ marginTop: "15px" }}
            src="/assets/images/logo_new.png"
            alt="header-logo2.png"
          />
          <span style={{ marginTop: "25px" }}>Appraisal Land</span>
        </Link>
        {/* site logo brand */}

        <nav>
          {/* <HeaderMenuContent userData={userData} /> */}
        </nav>
        {/* End .navbar */}
      </div>
    </header>
    // {/* <!-- /.theme-main-menu --> */}
  );
};

export default Header;
