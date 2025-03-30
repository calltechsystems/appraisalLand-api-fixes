import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderMenuContent from "./HeaderMenuContentAdmin";
import Image from "next/image";

const Header = ({ profileCount, setProfileCount, userData }) => {
  const [navbar, setNavbar] = useState(false);

  const changeBackground = ({ hide }) => {
    if (window.scrollY >= 95) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };
  console.log(profileCount);

  const [userInfo, setUserInfo] = useState(userData || {});

  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.getItem("user")));

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
        <Link href="#" className="navbar_brand float-start dn-smd">
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
          <span>Appraisal Land</span>
        </Link>
        {/* site logo brand */}

        <nav>
          <HeaderMenuContent />
        </nav>
        {/* End .navbar */}
      </div>
    </header>
    // {/* <!-- /.theme-main-menu --> */}
  );
};

export default Header;
