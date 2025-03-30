import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderMenuContent from "./HeaderMenuContent_02";
import Image from "next/image";

const Header = ({  }) => {
  const [navbar, setNavbar] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("user") ) || {})
  },[]);

  const changeBackground = ({ hide }) => {
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
            src="/assets/images/Appraisal_Land_Logo.png"
            alt="Appraisal_Land_Logo.png"
          />
          <Image
            width={40}
            height={45}
            className="logo2 img-fluid"
            src="/assets/images/Appraisal_Land_Logo.png"
            alt="Appraisal_Land_Logo.png"
          />
          <span>Appraisal Link</span>
        </Link>
        {/* site logo brand */}

        <nav>
          <HeaderMenuContent hide={false} userData={userData} />
        </nav>
        {/* End .navbar */}
      </div>
    </header>
    // {/* <!-- /.theme-main-menu --> */}
  );
};

export default Header;
