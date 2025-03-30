import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderMenuContent from "./HeaderMenuContent";
import Image from "next/image";

const Header = () => {
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
            style={{marginTop:"30px"}}
            src="/assets/images/logo_new.png"
            alt="header-logo2.png"
          />
          <Image
            width={40}
            height={45}
            style={{margin:'6px'}}
            className="logo2 img-fluid"
            src="/assets/images/logo_new.png"
            alt="header-logo2.png"
          />
          <span>Appraisal Land</span>
        </Link>
        {/* site logo brand */}

        <nav>
          <HeaderMenuContent   />
        </nav>
        {/* End .navbar */}
      </div>
    
    </header>
    // {/* <!-- /.theme-main-menu --> */}
  );
};

export default Header;
