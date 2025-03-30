import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const HeaderMenuContent = ({ float = "", hide, isListing }) => {
  const route = useRouter();

  const [hovered, setHovered] = useState(false);

  const [about, setAbout] = useState(false);

  // const [isHovered, setIsHovered] = useState(false);

  // const handleMouseEnter = () => {
  //   setIsHovered(true);
  // };

  // const handleMouseLeave = () => {
  //   setIsHovered(false);
  // };

  // const menuStyle = {
  //   // width: '200px',  Initial width
  //   transition: "width 0.3s ease", // Add transition for the width property
  //   position: "relative",
  // };

  // const contentStyle = {
  //   opacity: isHovered ? 1 : 0, // Show content when hovered
  //   transition: "opacity 0.3s ease", // Add transition for the opacity property
  //   position: "absolute",
  //   top: "100%",
  //   left: "-460px",
  //   width: "1580px",
  //   margin: "-16px",
  //   height: "80px",
  //   backgroundColor: "#fff",
  //   color: "#333",
  //   borderTopColor: "#2e008b",
  //   borderTopWidth: "6px",
  //   borderTopStyle: "solid",
  //   display: "flex",
  //   flexDirection: "row",
  //   justifyContent: "center",
  // };

  // const contentStyle_01 = {
  //   opacity: isHovered ? 1 : 0, // Show content when hovered
  //   transition: "opacity 0.3s ease", // Add transition for the opacity property
  //   position: "absolute",
  //   top: "100%",
  //   left: "-460px",
  //   width: "1580px",
  //   margin: "-16px",
  //   height: "180px",
  //   backgroundColor: "#fff",
  //   color: "#333",
  //   borderTopColor: "#2e008b",
  //   borderTopWidth: "6px",
  //   borderTopStyle: "solid",
  //   display: "flex",
  //   flexDirection: "row",
  //   justifyContent: "center",
  // };

  const home = [
    {
      id: 1,
      name: "Home 1",
      routerPath: "/",
    },
    // { id: 2, name: "Home 2", routerPath: "/home-2" },
    // {
    //   id: 3,
    //   name: "Home 3",
    //   routerPath: "/home-3",
    // },
    // { id: 4, name: "Home 4", routerPath: "/home-4" },
    // { id: 5, name: "Home 5", routerPath: "/home-5" },
    // { id: 6, name: "Home 6", routerPath: "/home-6" },
    // { id: 7, name: "Home 7", routerPath: "/home-7" },
    // { id: 8, name: "Home 8", routerPath: "/home-8" },
    // { id: 9, name: "Home 9", routerPath: "/home-9" },
    // { id: 10, name: "Home 10", routerPath: "/home-10" },
  ];

  const listing = [
    {
      id: 5,
      title: "Agent View",
      items: [
        {
          name: "Agent View",
          routerPath: "/agent-v1",
        },
        {
          name: "Agent V1",
          routerPath: "/agent-v1",
        },
        {
          name: "Agent V2",
          routerPath: "/agent-v2",
        },
        {
          name: "Agent Details",
          routerPath: "/agent-details",
        },
      ],
    },
    {
      id: 6,
      title: "Agencies View",
      items: [
        {
          name: "Agencies View",
          routerPath: "/agency-v1",
        },
        {
          name: "Agencies V1",
          routerPath: "/agency-v1",
        },
        {
          name: "Agencies V2",
          routerPath: "/agency-v2",
        },
        {
          name: "Agencies Details",
          routerPath: "/agency-details",
        },
      ],
    },
    {
      id: 5,
      title: "Agent View",
      items: [
        {
          name: "Agent View",
          routerPath: "/agent-v1",
        },
        {
          name: "Agent V1",
          routerPath: "/agent-v1",
        },
        {
          name: "Agent V2",
          routerPath: "/agent-v2",
        },
        {
          name: "Agent Details",
          routerPath: "/agent-details",
        },
      ],
    },
    {
      id: 6,
      title: "Agencies View",
      items: [
        {
          name: "Agencies View",
          routerPath: "/agency-v1",
        },
        {
          name: "Agencies V1",
          routerPath: "/agency-v1",
        },
        {
          name: "Agencies V2",
          routerPath: "/agency-v2",
        },
        {
          name: "Agencies Details",
          routerPath: "/agency-details",
        },
      ],
    },
  ];

  const property = [
    {
      id: 1,
      title: "User Admin",
      items: [
        {
          name: "Dashboard",
          routerPath: "/my-dashboard",
        },
        {
          name: "My Properties",
          routerPath: "/my-properties",
        },
        {
          name: "My Message",
          routerPath: "/my-message",
        },
        {
          name: "My Review",
          routerPath: "/my-review",
        },
        {
          name: "My Favourites",
          routerPath: "/my-favourites",
        },
        {
          name: "My Profile",
          routerPath: "/my-profile",
        },
        {
          name: "My Package",
          routerPath: "/my-package",
        },
        {
          name: "My Saved Search",
          routerPath: "/my-saved-search",
        },
        {
          name: "Add Property",
          routerPath: "/create-listing",
        },
      ],
    },
    {
      id: 2,
      title: "Listing Single",
      items: [
        {
          name: "Single V1",
          routerPath: "/listing-details-v1",
        },
        {
          name: "Single V2",
          routerPath: "/listing-details-v2",
        },
        {
          name: "Single V3",
          routerPath: "/listing-details-v3",
        },
        {
          name: "Single V4",
          routerPath: "/listing-details-v4",
        },
      ],
    },
    {
      id: 1,
      title: "User Admin",
      items: [
        {
          name: "Dashboard",
          routerPath: "/my-dashboard",
        },
        {
          name: "My Properties",
          routerPath: "/my-properties",
        },
        {
          name: "My Message",
          routerPath: "/my-message",
        },
        {
          name: "My Review",
          routerPath: "/my-review",
        },
        {
          name: "My Favourites",
          routerPath: "/my-favourites",
        },
        {
          name: "My Profile",
          routerPath: "/my-profile",
        },
        {
          name: "My Package",
          routerPath: "/my-package",
        },
        {
          name: "My Saved Search",
          routerPath: "/my-saved-search",
        },
        {
          name: "Add Property",
          routerPath: "/create-listing",
        },
      ],
    },
  ];

  const blog = [
    { id: 1, name: "Blog List 1", routerPath: "/blog-list-1" },
    { id: 2, name: "Blog List 2", routerPath: "/blog-list-2" },
    { id: 3, name: "Blog List 3", routerPath: "/blog-list-3" },
    {
      id: 4,
      name: "Blog Details",
      routerPath: "/blog-details",
    },
  ];

  const pages = [
    { id: 1, name: "About Us", routerPath: "/about-us" },
    { id: 2, name: "Gallery", routerPath: "/gallery" },
    { id: 3, name: "Faq", routerPath: "/faq" },
    { id: 4, name: "LogIn", routerPath: "/login" },
    { id: 5, name: "Compare", routerPath: "/compare" },
    { id: 6, name: "Membership", routerPath: "/membership" },

    { id: 7, name: "Register", routerPath: "/register" },
    { id: 8, name: "Service", routerPath: "/service" },
    { id: 9, name: "404 Page", routerPath: "/404" },
    { id: 10, name: "Terms & Conditions", routerPath: "/terms" },
  ];

  const user = [
    { id: 1, name: "Mortgage Broker", routerPath: "/login" },
    { id: 2, name: "Mortgage Brokerage", routerPath: "/login" },
    { id: 3, name: "Appraiser", routerPath: "/login" },
    { id: 4, name: "Appraiser Company", routerPath: "/login" },
  ];

  let classname = "";
  if (hide) {
    classname = "ace-responsive-menu text-end d-lg-block d-none bg-back";
  } else {
    classname =
      "ace-responsive-menu d-lg-block d-none text-end-01 ul_01 submenu border-bottom";
  }

  return (
    <div onMouseLeave={() => setHovered()}>
      <ul
        id="respMenu"
        className={classname}
        data-menu-style="horizontal"
        onMouseLeave={() => setAbout()}
      >
        {hide && (
          <li className="dropitem">
            <Link
              href="/"
              className={
                home.some((page) => page.routerPath === route.pathname)
                  ? "ui-active"
                  : undefined
              }
            >
              <span className="title text-info-01">Home</span>
              {/* <span className="arrow"></span> */}
            </Link>
            {/* <!-- Level Two--> */}

            {/* <ul className="sub-menu ">
          {home.map((item) => (
            <li key={item.id}>
              <Link
                href={item.routerPath}
                className={
                  route.pathname === item.routerPath ? "ui-active" : undefined
                }
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul> */}
          </li>
        )}
        {/* End .dropitem */}

        {hide && (
          <li
            className="dropitem"

            //   style={menuStyle}
            //   onMouseEnter={handleMouseEnter}
            //   onMouseLeave={handleMouseLeave}
          >
            <Link href="/choose-us ">
              <span
                className="title text-info-01"
                onMouseOver={() => setHovered(!hovered)}

                // onMouseLeave={() => setHovered()}
              >
                Why Choose Us
              </span>
              <span className="arrow text-info-01"></span>
            </Link>
            {/* <!-- Level Two--> */}
            {hovered ? (
              <div
                className=""
                style={{
                  width: "100%",
                  background: "red",
                  opacity: hovered ? 1 : 0, //Show content when hovered
                  transition: "opacity 0.3s ease", // Add transition for the opacity property
                  position: "absolute",
                  top: "100%",
                  left: "-400px",
                  width: "1420px",
                  margin: "-16px",
                  height: "215px",
                  backgroundColor: "#fff",
                  color: "#333",
                  borderTopColor: "#2e008b",
                  borderTopWidth: "2px",
                  borderTopStyle: "solid",
                  // display: "flex",
                  // flexDirection: "row",
                  // justifyContent: "center",
                  marginTop: "15px",
                }}
              >
                <div className="row">
                  <div className="col-lg-3 text-center">
                    <div className="row">
                      <div className="col-lg-12 mt-4">
                        {/* <Link href="/">
                          <Image
                            width={40}
                            height={45}
                            className="logo2 img-fluid"
                            style={{ marginRight: "10px" }}
                            src="/assets/images/logo_new.png"
                            alt="header-logo2.png"
                          />
                          <span
                            className="fw-bold"
                            style={{ fontSize: "19px", color: "black" }}
                          >
                            <span></span>Appraisal Link
                          </span>
                        </Link> */}
                      </div>
                      <div className="col-lg-12 mt-4 mb-2">
                        <button className="btn btn2 w-50 btn-color">
                          For Brokers
                        </button>
                      </div>
                      <div className="col-lg-12 mb-2">
                        <button className="btn btn2 w-50 btn-color">
                          For Appraiser
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 text-center">
                    <div className="row">
                      <div className="col-lg-8 m-5 fw-bold">
                        <span>Mortgage Broker</span>
                        <br />
                        <span>Mortgage Broker</span>
                        <br />
                        <span>Mortgage Broker</span>
                        <br />
                        <span>Mortgage Broker</span>
                        <br />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 text-center">
                    <div className="row">
                      <div className="col-lg-8 m-5 fw-bold" style={{}}>
                        <span>Mortgage Broker</span>
                        <br />
                        <span>Mortgage Broker</span>
                        <br />
                        <span>Mortgage Broker</span>
                        <br />
                        <span>Mortgage Broker</span>
                        <br />
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-3 text-center"
                    style={{ backgroundColor: "#c2c2c2" }}
                  >
                    <div className="row">
                      <div className="col-lg-8 m-5 fw-bold">
                        <span>
                          Ready to see Appraisal Land help make you more money
                          at record speed?
                        </span>
                        <br />
                        <Link href="/register">
                          <button className="btn btn2 w-50 btn-color">
                            Register
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <h1>hiiiii</h1> */}
              </div>
            ) : null}
          </li>
        )}
        {/* End .dropitem */}

        {hide && (
          <li
            className="dropitem"
            // style={menuStyle}
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
          >
            <Link href="#">
              <span
                className="title text-info-01"
                onMouseOver={() => setAbout(!about)}
                onMouseLeave={() => setHovered()}
                // onMouseLeave={() => setAbout()}
              >
                Insights
              </span>{" "}
              <span className="arrow text-info-01"></span>
            </Link>

            {about ? (
              <div
                className=""
                style={{
                  width: "100%",
                  background: "red",
                  // opacity: isHovered ? 1 : 0,  Show content when hovered
                  transition: "opacity 0.3s ease", // Add transition for the opacity property
                  position: "absolute",
                  top: "100%",
                  // left: "20px",
                  right: "-690px",
                  width: "1420px",
                  margin: "-16px",
                  height: "225px",
                  backgroundColor: "#fff",
                  color: "#333",
                  borderTopColor: "#2e008b",
                  borderTopWidth: "2px",
                  borderTopStyle: "solid",
                  // display: "flex",
                  // flexDirection: "row",
                  // justifyContent: "center",
                  marginTop: "15px",
                }}
              >
                <div className="row">
                  <div className="col-lg-3 text-center">
                    <div className="row">
                      <div className="col-lg-12 mt-4">
                        {/* <Link href="/">
                          <Image
                            width={40}
                            height={45}
                            className="logo2 img-fluid"
                            style={{ marginRight: "10px" }}
                            src="/assets/images/logo_new.png"
                            alt="header-logo2.png"
                          />
                          <span
                            className="fw-bold"
                            style={{ fontSize: "19px", color: "black" }}
                          >
                            Appraisal Link
                          </span>
                        </Link> */}
                      </div>
                      <div className="col-lg-12 mt-4 mb-2">
                        <button className="btn btn2 w-50 btn-color">
                          For Brokers
                        </button>
                      </div>
                      <div className="col-lg-12 mb-2">
                        <button className="btn btn2 w-50 btn-color">
                          For Appraiser
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 text-end">
                    <div className="row">
                      <div className="col-lg-12 m-4 fw-bold">
                        <Link href="/">
                          <Image
                            width={190}
                            height={125}
                            className="logo2 img-fluid mt-3"
                            // style={{ marginRight: "10px" }}
                            src="/assets/images/about/home-inspector-checks-condition-house-writes-report-flat-illustration_2175-8129.png"
                            alt="header-logo2.png"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 text-center">
                    <div className="row">
                      <div className="col-lg-6 m-5 fw-bold" style={{}}>
                        <Link href="/">
                          <Image
                            width={160}
                            height={125}
                            className="logo2 img-fluid"
                            // style={{ marginRight: "10px" }}
                            src="/assets/images/about/house-mortgage-property-inspection-audit-icon-graphic-home-real-estate-deal-review-assessment_101884-2246.png"
                            alt="header-logo2.png"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-3 text-center"
                    style={{ backgroundColor: "#c2c2c2" }}
                  >
                    <div className="row">
                      <div className="col-lg-8 m-5 fw-bold">
                        <span style={{ lineHeight: "1.9" }}>
                          Revolutionize Your Frieght Experience : conquer the
                          real estate buisness with{" "}
                          <span className="text-color fw-bold">
                            Appraisal Land
                          </span>
                          .
                        </span>
                        <br />
                        {/* <button className="btn btn2 w-50 btn-color">
                          Register
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
                {/* <h1>hiiiii</h1> */}
              </div>
            ) : null}
          </li>
        )}
        {/* End .dropitem */}

        {/* <li className="dropitem">
          <Link
            href="/gallery"
            className={
              pages.some((page) => page.routerPath === route.pathname)
                ? "ui-active"
                : undefined
            }
          >
            <span className="title text-info">Media</span>
            <span className="arrow text-info"></span>
          </Link>
          <ul className="sub-menu ">
          {pages.map((item) => (
            <li key={item.id}>
              <Link
                href={item.routerPath}
                className={
                  route.pathname === item.routerPath ? "ui-active" : undefined
                }
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        </li> */}

        {/* <li className="last">
        <Link
          href="/gallery"
          className={route.pathname === "/gallery" ? "ui-active" : undefined}
        >
          Team
        </Link>
      </li> */}
        {/* End .dropitem */}

        {/* <li className="dropitem">
        <Link
          href="#"
          className={
            blog.some(
              (page) =>
                page.routerPath === route.pathname ||
                page.routerPath + "/[id]" === route.pathname
            )
              ? "ui-active"
              : undefined
          }
        >
          <span className="title">Blog</span>
          <span className="arrow"></span>
        </Link>
        <ul className="sub-menu ">
          {blog.map((item) => (
            <li key={item.id}>
              <Link
                href={item.routerPath}
                className={
                  route.pathname === item.routerPath ||
                  item.routerPath + "/[id]" === route.pathname
                    ? "ui-active"
                    : undefined
                }
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </li> */}
        {hide && (
          <li className="last">
            <Link
              href="/membership"
              className={
                route.pathname === "/membership" ? "ui-active" : undefined
              }
            >
              <span className="text-info-01">Subscription</span>
            </Link>
          </li>
        )}
        {/* End .dropitem */}

        {hide && (
          <li className="last">
            <Link
              href="/about-us"
              className={
                route.pathname === "/contact" ? "ui-active" : undefined
              }
            >
              <span className="text-info-01">About Us</span>
            </Link>
          </li>
        )}
        {/* End .dropitem */}

        {/* {hide && (
          <li
            className="last"
            style={{
              backgroundColor: "blue",
              borderRadius: "5px",
              padding: "0px",
            }}
          >
            <Link
              href="/contact"
              className={
                route.pathname === "/contact" ? "ui-active" : undefined
              }
            >
              <span className="text-info-01">Get In Touch</span>
            </Link>
          </li>
        )} */}
        {/* End .dropitem */}

        {/* {hide && (
          <li className={`list-inline-item list_s ${float}`}>
            <Link
              href="#"
              className="btn text-color flaticon-user"
              data-bs-toggle="modal"
              data-bs-target=".bd-example-modal-lg"
            >
              <span className="dn-lg text-info-01">Login</span>
            </Link>
          </li>
        )} */}
        {/* End .dropitem */}

        {hide && (
          <li className="dropitem">
            <Link
              href="#"
              className={
                pages.some((page) => page.routerPath === route.pathname)
                  ? "ui-active"
                  : undefined
              }
            >
              <span className="btn text-color-01 flaticon-user"></span>
              <span className=" dn-lg text-info-01">Login</span>
              <span className="arrow text-info-01"></span>
            </Link>
            <ul className="sub-menu ">
              {user.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.routerPath}
                    className={
                      route.pathname === item.routerPath
                        ? "ui-active"
                        : undefined
                    }
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        )}

        {isListing && (
          <li className={`list-inline-item add_listing ${float}`}>
            <Link href="/contact">
              <span className="fs-13"></span>
              <span className="dn-lg fs-13"> GET IN TOUCH</span>
            </Link>
          </li>
        )}
        {/* End .dropitem */}
      </ul>
    </div>
  );
};

export default HeaderMenuContent;
