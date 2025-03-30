import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const HeaderMenuContent = ({ float = "", hide, isListing }) => {
  const logout = () => {
    localStorage.removeItem("user");
    route.push("/login");
  };
  const route = useRouter();

  const { t } = useTranslation("common");

  const userData = JSON.parse(localStorage.getItem("user"));
  const [hovered, setHovered] = useState(false);

  const [about, setAbout] = useState(false);

  const [plan, setPlan] = useState(false);

  const [login, setLogin] = useState(false);

  const [logout_01, setLogout_01] = useState(false);

  const [insight, setInsight] = useState(false);

  const home = [
    {
      id: 1,
      name: "Home 1",
      routerPath: "/",
    },
  ];

  const listing = [
    {
      id: 5,
      title: "Agent View",
      items: [
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
  ];

  const blog = [
    { id: 1, name: "FR", routerPath: "#" },
    { id: 2, name: "EN", routerPath: "#" },
    // { id: 3, name: "GEM", routerPath: "#" },
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
    classname = "ace-responsive-menu text-end d-lg-block d-none";
  } else {
    classname =
      "ace-responsive-menu text-end d-lg-block d-none text-end-01 ul_01";
  }

  const handleInsightClick = () => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (userInfo.userType === 1 || userInfo.userType === 6) {
      route.push("/my-dashboard");
    } else if (userInfo.userType === 2) {
      route.push("/brokerage-dashboard");
    } else if (userInfo.userType === 7) {
      route.push("/appraiser-company-dashboard-admin");
    } else if (userInfo.userType === 4) {
      route.push("/appraiser-company-dashboard");
    } else {
      route.push("/appraiser-dashboard");
    }
  };

  return (
    <div onMouseLeave={() => setPlan()}>
      <div onMouseLeave={() => setInsight()}>
        <div onMouseLeave={() => setLogin()}>
          <div onMouseLeave={() => setHovered()}>
            <ul
              id="respMenu"
              className={classname}
              data-menu-style="horizontal"
              onMouseLeave={() => setAbout()}
            >
              <li className="dropitem" onMouseOver={() => setHovered()}>
                <Link
                  href="/"
                  className={
                    home.some((page) => page.routerPath === route.pathname)
                      ? "ui-active"
                      : undefined
                  }
                  onMouseOver={() => setAbout()}
                  onMouseEnter={() => setPlan()}
                >
                  <span
                    className="title text-info-01 cool-link menuitem"
                    onMouseOver={() => setInsight()}
                    onMouseEnter={() => setLogin()}
                  >
                    {t("Home")}
                  </span>
                  {/* <span className="arrow"></span> */}
                </Link>
              </li>
              {/* End .dropitem */}
              <li
                className="last"
                onMouseOver={() => setLogin()}
                onMouseEnter={() => setAbout()}
              >
                <Link
                  href="/about-us"
                  onMouseEnter={() => setHovered()}
                  className={route.pathname === "#" ? "ui-active" : undefined}
                >
                  <span
                    className="text-info-01 cool-link menuitem"
                    onMouseOver={() => setInsight(!insight)}
                    onMouseEnter={() => setPlan()}
                  >
                    About Us
                  </span>
                </Link>
                {insight ? (
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
                      right: "-750px",
                      width: "1300px",
                      margin: "-16px",
                      height: "225px",
                      backgroundColor: "#fff",
                      color: "#333",
                      borderTopColor: "#2e008b",
                      borderTopWidth: "4px",
                      borderTopStyle: "solid",
                      // display: "flex",
                      // flexDirection: "row",
                      // justifyContent: "center",
                      marginTop: "5px",
                    }}
                  >
                    <div className="row">
                      {/* <div className="col-lg-2"></div> */}
                      <div className="col-lg-3 text-end">
                        <div className="row">
                          <div className="col-lg-8 m-5 fw-bold" style={{}}>
                            <Link href="/">
                              <Image
                                width={160}
                                height={125}
                                className="logo2"
                                // style={{ marginRight: "10px" }}
                                src="/assets/images/service/image001.png"
                                alt="header-logo2.png"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-lg-3"
                        style={{ backgroundColor: "#f6f5f7" }}
                      >
                        <div className="row">
                          <div className="col-lg-12 mt-4 fw-bold text-center">
                            <Link href="/about-us">
                              <button className="btn btn2 w-75 btn-color">
                                Who We Are
                              </button>
                            </Link>
                            <br />
                            <Link href="/how-we-work">
                              {/* <button className=" mt-3 fw-bold cool-link menuitem"> */}
                              <button className="mt-3 btn btn2 w-75 btn-color">
                                How We Work
                              </button>
                            </Link>
                            <br />
                            <Link href="/events">
                              <button className="mt-3 btn btn2 w-75 btn-color">
                                Events
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <div className="row text-center">
                          <div className="col-lg-12 m-3 fw-bold">
                            <Link href="/">
                              <Image
                                width={190}
                                height={125}
                                className="logo2 img-fluid mt-3"
                                // style={{ marginRight: "10px" }}
                                src="/assets/images/service/house_.png"
                                alt="header-logo2.png"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-lg-3 text-center"
                        style={{ backgroundColor: "" }}
                      >
                        <div className="row text-center">
                          <div className="col-lg-10 m-5 fw-bold">
                            <span>
                              Ready to see Appraisal Land help you make more
                              money at record speed?
                            </span>
                            <br />
                            <Link href="/sign-up">
                              <button className="btn btn2 w-50 btn-color">
                                Register
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-lg-1"></div> */}
                    </div>
                  </div>
                ) : null}
              </li>
              {/* End .dropitem */}
              <li
                className="dropitem"
                onMouseOver={() => setAbout()}
                onMouseEnter={() => setLogin()}
              >
                <Link
                  href="/broker-user-guide"
                  onMouseOver={() => setInsight()}
                >
                  <span
                    className="title text-info-01 cool-link menuitem"
                    onMouseOver={() => setHovered(!hovered)}
                    onMouseEnter={() => setPlan()}
                    // onMouseLeave={() => setLogin()}
                    // onMouseLeave={() => setHovered()}
                  >
                    Why Choose Us
                  </span>
                  {/* <span
                    className="arrow text-info-01"
                    style={{ marginLeft: "-5px" }}
                  ></span> */}
                </Link>
                {/* <!-- Level Two--> */}
                {hovered ? (
                  <div
                    className=""
                    style={{
                      width: "100%",
                      background: "red",
                      // opacity: isHovered ? 1 : 0,  Show content when hovered
                      transition: "opacity 0.3s ease", // Add transition for the opacity property
                      position: "absolute",
                      top: "100%",
                      left: "-550px",
                      // right: "-500px",
                      width: "1300px",
                      margin: "-16px",
                      height: "220px",
                      backgroundColor: "#fff",
                      color: "#333",
                      borderTopColor: "#2e008b",
                      borderTopWidth: "4px",
                      borderTopStyle: "solid",
                      // display: "flex",
                      // flexDirection: "row",
                      // justifyContent: "center",
                      marginTop: "5px",
                    }}
                  >
                    <div className="row">
                      {/* <div className="col-lg-2"></div> */}
                      <div
                        className="col-lg-3 text-center"
                        style={{ backgroundColor: "" }}
                      >
                        <div className="row">
                          <div className="col-lg-8 m-5 fw-bold">
                            <span>
                              Ready to see Appraisal Land help you make more
                              money at record speed?
                            </span>
                            <br />
                            <Link href="/sign-up">
                              <button className="btn w-50 btn-color">
                                Register
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2 text-start">
                        <div className="row">
                          <div className="col-lg-12 fw-bold">
                            <Link href="/">
                              <Image
                                width={190}
                                height={125}
                                className="logo2 img-fluid mt-5"
                                // style={{ marginRight: "10px" }}
                                src="/assets/images/about/home-inspector-checks-condition-house-writes-report-flat-illustration_2175-8129.png"
                                alt="header-logo2.png"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-lg-4"
                        style={{ backgroundColor: "#f6f5f7" }}
                      >
                        <div className="row">
                          <div className="col-lg-12 mt-4"></div>
                          <div className="col-lg-12 mb-2">
                            <Link href="/appraiser-user-guide">
                              <button className="btn w-100 btn-color">
                                For Appraiser
                              </button>
                            </Link>
                          </div>
                          <div className="col-lg-12 mb-2">
                            <Link href="/broker-user-guide">
                              <button className="btn w-100 btn-color">
                                For Mortgage Broker
                              </button>
                            </Link>
                          </div>
                          <div className="col-lg-12 mb-2">
                            <Link href="/appraiser-company-user-guide">
                              <button className="btn w-100 btn-color">
                                For Appraiser Company
                              </button>
                            </Link>
                          </div>
                          <div className="col-lg-12 mb-3">
                            <Link href="/brokerage-company-user-guide">
                              <button className="btn w-100 btn-color">
                                For Mortgage Brokerage
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2 text-start">
                        <div className="row">
                          <div className="col-lg-12 fw-bold" style={{marginLeft:"50px"}}>
                            <Link href="/">
                              <Image
                                width={160}
                                height={125}
                                className="logo2 img-fluid mt-5"
                                // style={{ marginRight: "10px" }}
                                src="/assets/images/about/house-mortgage-property-inspection-audit-icon-graphic-home-real-estate-deal-review-assessment_101884-2246.png"
                                alt="header-logo2.png"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* <div className="col-lg-1"></div> */}
                    </div>
                  </div>
                ) : null}
              </li>
              {/* End .dropitem */}
              <li
                className="dropitem"
                onMouseOver={() => setHovered()}
                onMouseEnter={() => setLogin()}
              >
                <Link
                  href={
                    userData
                      ? userData.userType === 1 || userData.userType === 6
                        ? "/my-dashboard"
                        : userData.userType === 2
                        ? "/brokerage-dashboard"
                        : userData.userType === 7
                        ? "/appraiser-company-dashboard-admin"
                        : userData.userType === 4
                        ? "/appraiser-company-dashboard"
                        : "/appraiser-dashboard"
                      : "#"
                  }
                  onMouseEnter={() => setPlan()}
                >
                  <span
                    className="title text-info-01 cool-link cool-link menuitem"
                    onMouseOver={() => setAbout(!about)}
                    onMouseEnter={() => setInsight()}
                    // onMouseLeave={() => setAbout()}
                    // onMouseLeave={() => setLogin()}
                  >
                    Dashboard
                  </span>{" "}
                  {/* <span className="arrow text-info-01 ml"></span> */}
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
                      right: "-450px",
                      width: "1300px",
                      margin: "-16px",
                      height: "220px",
                      backgroundColor: "#fff",
                      color: "#333",
                      borderTopColor: "#2e008b",
                      borderTopWidth: "4px",
                      borderTopStyle: "solid",
                      // display: "flex",
                      // flexDirection: "row",
                      // justifyContent: "center",
                      marginTop: "5px",
                    }}
                  >
                    <div className="row">
                      {/* <div className="col-lg-2"></div> */}
                      <div
                        className="col-lg-3 text-center"
                        style={{ backgroundColor: "" }}
                      >
                        <div className="row">
                          <div className="col-lg-8 m-5 fw-bold">
                            <span style={{ lineHeight: "1.9" }}>
                              Revolutionize Your Experience : Conquer the real
                              estate business with{" "}
                              {/* <span className="text-color fw-bold"> */}
                              Appraisal Land
                              {/* </span> */}.
                            </span>
                            <br />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 text-center">
                        <div className="row">
                          <div className="col-lg-10 m-4 fw-bold" style={{}}>
                            <Link href="/">
                              <Image
                                width={160}
                                height={125}
                                className="logo2 img-fluid"
                                // style={{ marginRight: "10px" }}
                                src="/assets/images/service/p.jpg"
                                alt="header-logo2.png"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-lg-3 text-center"
                        style={{ backgroundColor: "#f6f5f7" }}
                      >
                        <div className="row">
                          <div className="col-lg-12 mt-5 fw-bold">
                            <span>
                              {/* To accessing your dashboard <br /> by click on it. */}
                              To access your dashboard <br /> by clicking on it
                            </span>
                            <br />
                            <button
                              className="btn btn2 w-50 btn-color"
                              onClick={handleInsightClick}
                            >
                              Insights
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 text-end">
                        <div className="row">
                          <div
                            className="col-lg-12 m-3 fw-bold"
                            style={{ marginLeft: "-30px" }}
                          >
                            <Link href="/">
                              <Image
                                width={190}
                                height={125}
                                className="logo2 img-fluid mt-3"
                                // style={{ marginRight: "10px" }}
                                src="/assets/images/service/22.jpg"
                                alt="header-logo2.png"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-lg-1"></div> */}
                    </div>
                  </div>
                ) : null}
              </li>
              {/* End .dropitem */}
              <li
                className="last"
                onMouseOver={() => setHovered()}
                onMouseEnter={() => setInsight()}
              >
                <Link
                  href="/membership-broker"
                  onMouseOver={() => setAbout()}
                  className={
                    route.pathname === "/membership-broker" ? "ui-active" : undefined
                  }
                >
                  <span
                    className="text-info-01 cool-link menuitem"
                    onMouseOver={() => setPlan(!plan)}
                    onMouseEnter={() => setLogin()}
                    // onMouseOver={() => setAbout()}
                    // onMouseEnter={() => setLogin()}
                  >
                    Subscription
                  </span>
                </Link>
                {plan ? (
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
                      right: "-380px",
                      width: "1400px",
                      margin: "-16px",
                      height: "220px",
                      backgroundColor: "#fff",
                      color: "#333",
                      borderTopColor: "#2e008b",
                      borderTopWidth: "4px",
                      borderTopStyle: "solid",
                      // display: "flex",
                      // flexDirection: "row",
                      // justifyContent: "center",
                      marginTop: "5px",
                    }}
                  >
                    <div className="row">
                      {/* <div className="col-lg-2"></div> */}
                      <div
                        className="col-lg-3 text-center"
                        style={{ backgroundColor: "" }}
                      >
                        <div className="row">
                          <div className="col-lg-10 m-5 fw-bold">
                            <span style={{ lineHeight: "1.9" }}>
                              Experience our platform to the fullest by becoming
                              a subscriber on{" "}
                              <span className="text-color fw-bold">
                                Appraisal Land
                              </span>
                              .
                            </span>
                            <br />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3 text-end">
                        <div className="row">
                          <div
                            className="col-lg-12 m-3 fw-bold"
                            style={{ marginLeft: "-30px" }}
                          >
                            <Link href="/">
                              <Image
                                width={190}
                                height={125}
                                className="logo2 img-fluid mt-1"
                                src="/assets/images/home/man-pencil-fills-out-questionnaire-260nw-2052001217.png"
                                alt="header-logo2.png"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div
                        className="col-lg-3 text-end"
                        style={{ backgroundColor: "#f6f5f7" }}
                      >
                        <div className="row">
                          {/* <div className="col-lg-12 mt-4"></div> */}
                          <div className="col-lg-12 mb-2 mt-4">
                            <Link href="/membership-appraiser">
                              <button className="btn w-100 btn-color">
                                For Appraiser
                              </button>
                            </Link>
                          </div>
                          <div className="col-lg-12 mb-2">
                            <Link href="/membership-broker">
                              <button className="btn w-100 btn-color">
                                For Mortgage Broker
                              </button>
                            </Link>
                          </div>
                          <div className="col-lg-12 mb-2">
                            <Link href="/membership-appraiser-company">
                              <button className="btn w-100 btn-color">
                                For Appraiser Company
                              </button>
                            </Link>
                          </div>
                          <div className="col-lg-12 mb-3">
                            <Link href="/membership-brokerage-company">
                              <button className="btn w-100 btn-color">
                                For Mortgage Brokerage
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 text-center">
                        <div className="row">
                          <div className="col-lg-6 m-4 fw-bold" style={{}}>
                            <Link href="/">
                              <Image
                                width={160}
                                height={125}
                                className="logo2 img-fluid"
                                // style={{ marginRight: "10px" }}
                                src="/assets/images/home/99.jpg"
                                alt="header-logo2.png"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* <div className="col-lg-1"></div> */}
                    </div>
                  </div>
                ) : null}
              </li>
              {/* End .dropitem */}
              <li
                className="dropitem"
                onMouseEnter={() => setHovered()}
                onMouseOver={() => setAbout()}
              >
                <Link
                  href="/login"
                  onMouseOver={() => setInsight()}
                  className={
                    pages.some((page) => page.routerPath === route.pathname)
                      ? "ui-active"
                      : undefined
                  }
                >
                  <span
                    className="btn text-color-01 flaticon-user"
                    style={{ visibility: "hidden" }}
                  ></span>
                  {userData ? (
                    <span
                      className=" dn-lg text-info-01 cool-link menuitem"
                      style={{ marginLeft: "-35px" }}
                      // onMouseOver={() => setLogin(!login)}
                      // onMouseLeave={() => setLogin()}
                      onMouseEnter={() => setPlan()}
                      onClick={userData ? logout : ""}
                    >
                      Logout
                      {/* {userData ? "logout" : "login"} */}
                    </span>
                  ) : (
                    <span
                      className=" dn-lg text-info-01 cool-link menuitem"
                      style={{ marginLeft: "-35px" }}
                      onMouseOver={() => setLogin(!login)}
                      // onMouseLeave={() => setLogin()}
                      onMouseEnter={() => setPlan()}
                      // onClick={userData ? logout : ""}
                    >
                      Login
                      {/* {userData ? "logout" : "login"} */}
                    </span>
                  )}
                </Link>

                {login ? (
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
                      right: "-250px",
                      width: "1300px",
                      margin: "-16px",
                      height: "222px",
                      backgroundColor: "#fff",
                      color: "#333",
                      borderTopColor: "#2e008b",
                      borderTopWidth: "4px",
                      borderTopStyle: "solid",
                      // display: "flex",
                      // flexDirection: "row",
                      // justifyContent: "center",
                      marginTop: "0px",
                    }}
                  >
                    <div className="row">
                      {/* <div className="col-lg-2"></div> */}
                      <div className="col-lg-2">
                        <div className="row">
                          <div className="col-lg-12 m-4 fw-bold" style={{}}>
                            <Link href="/">
                              <Image
                                width={160}
                                height={125}
                                className="logo2 img-fluid mt-5"
                                // style={{ marginRight: "10px" }}
                                src="/assets/images/service/333.jpg"
                                alt="header-logo2.png"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-lg-3 text-center"
                        style={{ backgroundColor: "#f6f5f7" }}
                      >
                        <div className="row text-end">
                          <div className="col-lg-12 mt-5 fw-bold">
                            <span>
                              Ready to see Appraisal Land help you make more
                              money at record speed?
                            </span>
                            <br />
                            <Link href="/sign-up">
                              <button className="btn btn2 w-50 btn-color">
                                Register
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 text-center">
                        <div className="row">
                          <div className="col-lg-12 m-4 fw-bold">
                            <Link href="/">
                              <Image
                                width={190}
                                height={125}
                                className="logo2 img-fluid mt-2"
                                // style={{ marginRight: "10px" }}
                                src="/assets/images/service/222.jpg"
                                alt="header-logo2.png"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-lg-3 text-center"
                        style={{ backgroundColor: "#f6f5f7" }}
                      >
                        <div className="row">
                          <div className="col-lg-12 mt-1 fw-bold">
                            <Link href="/login">
                              <button className="btn btn2 w-100 btn-color">
                                Admin
                              </button>
                            </Link>
                            <Link href="/login">
                              <button className="btn btn2 w-100 btn-color mt-1">
                                Appraiser Company
                              </button>
                            </Link>
                            <Link href="/login">
                              <button className="btn btn2 w-100 btn-color mt-1">
                                Appraiser Individual
                              </button>
                            </Link>
                            <Link href="/login">
                              <button className="btn btn2 w-100 btn-color mt-1">
                                Mortgage Brokerage
                              </button>
                            </Link>
                            <Link href="/login">
                              <button className="btn btn2 w-100 btn-color mt-1 mb-2">
                                Mortgage Broker
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-1"></div>
                    </div>
                    {/* <h1>hiiiii</h1> */}
                  </div>
                ) : null}
              </li>
              {/* <li
                className="dropitem"
                onMouseEnter={() => setInsight()}
                onMouseOver={() => setAbout()}
              >
                <Link
                  href="#"
                  className={
                    blog.some((page) => page.routerPath === route.pathname)
                      ? "ui-active"
                      : undefined
                  }
                >
                  <span
                    className="title cool-link menuitem"
                    onMouseOver={() => setLogin()}
                    onMouseEnter={() => setHovered()}
                  >
                    En
                  </span>
                  <span className="arrow" style={{ marginLeft: "-5px" }}></span>
                </Link>
                <ul className="sub-menu" style={{ fontWeight: "bold" }}>
                  {blog.map((item) => (
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
              </li>{" "} */}
              <li
                className={`list-inline-item add_listing ${float}`}
                style={{ padding: "0px" }}
                onMouseOver={() => setLogin()}
                onMouseEnter={() => setInsight()}
              >
                <Link
                  href="/contact"
                  onMouseOver={() => setAbout()}
                  onMouseEnter={() => setHovered()}
                >
                  <span className="fs-13"></span>
                  <span
                    className="fs-13 text-light"
                    onMouseEnter={() => setPlan()}
                  >
                    {" "}
                    GET IN TOUCH
                  </span>
                </Link>
              </li>
              {/* End .dropitem */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderMenuContent;
