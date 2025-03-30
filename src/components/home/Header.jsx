import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderMenuContent from "../common/header/HeaderMenuContent";
import Image from "next/image";

const Header = () => {
  const [navbar, setNavbar] = useState(false);
  const [isListing, setListing] = useState(true);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const changeBackground = () => {
      if (window.scrollY >= 95) {
        setListing(false);
        setNavbar(true);
      } 
      else {
        setListing(true);
        setNavbar(false);
      }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);


  
  const menuStyle = {
    width: '200px', // Initial width
    transition: 'width 0.3s ease', // Add transition for the width property
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '10px',
    position: 'relative', // Required for nested content
    borderColor:"black"
  };

  const contentStyle = {
    opacity: isHovered ? 1 : 0, // Show content when hovered
    transition: 'opacity 0.3s ease', // Add transition for the opacity property
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '1160px',
    height:'80px',
    backgroundColor: '#fff',
    color: '#333',
    padding: '10px',
    borderColor:"black",
    borderWidth:"6px",
    borderStyle:"solid"
  };

  return (
    <header
      className = {`header-nav menu_style_home_one navbar-scrolltofixed stricky main-menu home-logo-header ${
        navbar ? "stricky-fixed " : ""
      }`}
    >
      {isListing && (
        <div
          style={{ backgroundColor: "white", color: "black", width: "100%" }}
        >

          <Link href="/" className="navbar_brand float-start dn-smd">
            <Image
              width={40}
              height={45}
              className="logo1 contain"
              src="/assets/images/logo_new.png"
              alt="header-logo.png"
            />
            <Image
              width={40}
              height={45}
              className="logo2 contain"
              src="/assets/images/logo_new.png"
              alt="header-logo2.png"
            />
            <span className="text-dark">Appraisal Link</span>
          </Link>

          <nav>
            <HeaderMenuContent  hide={false} isListing={isListing}/>
          </nav>
        </div>
      )}
      <div className="container-fluid p0">

        {!isListing && ( <Link href="/" className="navbar_brand float-start dn-smd">
          <Image
            width={40}
            height={45}
            className="logo1 contain"
            src="/assets/images/logo_new.png"
            alt="header-logo.png"
          />
          <Image
            width={40}
            height={45}
            className="logo2 contain"
            src="/assets/images/logo_new.png"
            alt="header-logo2.png"
          />
          <span>Appraisal Link</span>
        </Link>)}
        <nav>
          <HeaderMenuContent hide={true} isListing={!isListing}/>
        </nav>
      </div>
    </header>
  );
};

export default Header;
