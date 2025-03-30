import Link from "next/link";
import { useRouter } from "next/router";
import {
  isParentPageActive,
  isSinglePageActive,
} from "../../../../utils/daynamicNavigation";
import Image from "next/image";
import { useEffect, useState } from "react";

const SidebarMenu = () => {
  const route = useRouter();
  let userData = {};
  const [isAppraiserByCompany, setIsAppraiserByCompany] = useState(false);
  const [hasActivePlans, setHasActivePlans] = useState(false);

  useEffect(() => {
    userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.appraiser_Details?.companyId) {
      setIsAppraiserByCompany(true);
    }

    // Check if the user has active plans
    const userActivePlans = userData?.userSubscription?.$values || [];
    // console.log("plans", userActivePlans);
    if (userData?.userType === 5) {
      console.log("Not applicable for this user type.", userData);
      setHasActivePlans(true);
      return;
    }
    setHasActivePlans(userActivePlans.length > 0);
  }, []);

  const myProperties = [
    { id: 1, name: "General Elements", route: "/my-properties" },
    { id: 2, name: "Advanced Elements", route: "/my-properties" },
    { id: 3, name: "Editors", route: "/my-properties" },
  ];

  const manageAccountTag = [
    {
      id: 1,
      name: "Add / Modify Subscription",
      route: "/add-subscription",
      icon: "flaticon-money-bag",
    },
    {
      id: 2,
      name: "Transaction History",
      route: "/subscription-hisotry",
      icon: "flaticon-invoice",
    },
    {
      id: 3,
      name: "Help desk",
      route: "/appraiser-helpdesk",
      icon: "flaticon-telephone",
    },
    {
      id: 4,
      name: "Contact Us",
      route: "mailto:patelshubhendra@gmail.com",
      icon: "flaticon-envelope",
    },
  ];

  const appraiserProperties = [
    {
      id: 2,
      name: "Wishlist",
      route: "/my-appraiser-properties",
      icon: "flaticon-box",
    },
    {
      id: 2,
      name: "Quote Transactions",
      route: "/biding-history",
      icon: "flaticon-box",
    },
    // { id: 3, name: "Editors", route: "/my-properties" },
  ];

  const reviews = [
    { id: 1, name: "My Reviews", route: "/my-review" },
    { id: 2, name: "Visitor Reviews", route: "/my-review" },
  ];
  const manageAccount = [
    // {
    //   id: 1,
    //   name: "Package",
    //   route: "/my-plans",
    //   icon: "flaticon-box",
    // },
    {
      id: 2,
      name: "Transactions",
      route: "/my-package",
      icon: "flaticon-box",
    },
    // { id: 3, name: "Logout", route: "/login", icon: "flaticon-logout" },
  ];

  return (
    <>
      <ul className="sidebar-menu">
        <li
          className="sidebar_header header"
          style={{ backgroundColor: "white" }}
        >
          <Link href="/">
            <Image
              width={60}
              height={45}
              className="logo1 img-fluid"
              src="/assets/images/Appraisal_Land_Logo.png"
              alt="header-logo2.png"
            />
            <span
              style={{
                color: "#2e008b",
                marginTop: "35px",
                marginLeft: "-10px",
              }}
            >
              Appraisal{" "}
            </span>
            &nbsp;
            <span
              style={{
                color: "#97d700",
                marginTop: "35px",
                paddingLeft: "5px",
              }}
            >
              {" "}
              Land
            </span>
          </Link>
        </li>
        {/* End header */}

        <li className="title">
          {/* <span>Main</span> */}
          <ul>
            <li
              className={`treeview ${
                isSinglePageActive("/appraiser-dashboard", route.pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/appraiser-dashboard">
                <i className="flaticon-box"></i>
                <span>Dashboard</span>
              </Link>
            </li>

            <li
              className={`treeview ${
                hasActivePlans
                  ? isSinglePageActive("/appraise-properties", route.pathname)
                    ? "active"
                    : ""
                  : "disabled"
              }`}
            >
              {hasActivePlans ? (
                <Link href="/appraise-properties">
                  <i className="flaticon-home"></i>
                  <span>Appraise Properties</span>
                </Link>
              ) : (
                <a>
                  <i className="flaticon-home"></i>
                  <span>Appraise Properties</span>
                </a>
              )}
            </li>

            {!isAppraiserByCompany ? (
              <li
                className={`treeview ${
                  hasActivePlans
                    ? isSinglePageActive(
                        "/my-appraiser-properties",
                        route.pathname
                      )
                      ? "active"
                      : ""
                    : "disabled"
                }`}
              >
                {hasActivePlans ? (
                  <Link href="/my-appraiser-properties">
                    <i className="flaticon-box"></i>
                    <span>Wishlist</span>
                  </Link>
                ) : (
                  <a>
                    <i className="flaticon-box"></i>
                    <span>Wishlist</span>
                  </a>
                )}
              </li>
            ) : (
              ""
            )}

            {!isAppraiserByCompany ? (
              <li
                className={`treeview ${
                  hasActivePlans
                    ? isSinglePageActive("/biding-history", route.pathname)
                      ? "active"
                      : ""
                    : "disabled"
                }`}
              >
                {hasActivePlans ? (
                  <Link href="/biding-history">
                    <i className="flaticon-building"></i>
                    <span>Quote History</span>
                  </Link>
                ) : (
                  <a>
                    <i className="flaticon-building"></i>
                    <span>Quote History</span>
                  </a>
                )}
              </li>
            ) : (
              ""
            )}
          </ul>
        </li>

        <li className="title">
          <span>Manage Properties</span>
          <ul>
            {!isAppraiserByCompany ? (
              <li
                className={`treeview ${
                  hasActivePlans
                    ? isSinglePageActive(
                        "/appraiser-archive-property",
                        route.pathname
                      )
                      ? "active"
                      : ""
                    : "disabled"
                }`}
              >
                {hasActivePlans ? (
                  <Link href="/appraiser-archive-property">
                    <i className="flaticon-home"></i>
                    <span>Archive Properties</span>
                  </Link>
                ) : (
                  <a>
                    <i className="flaticon-home"></i>
                    <span>Archive Properties</span>
                  </a>
                )}
              </li>
            ) : (
              ""
            )}

            {!isAppraiserByCompany ? (
              <li
                className={`treeview ${
                  hasActivePlans
                    ? isSinglePageActive(
                        "/appraiser-accepted-properties",
                        route.pathname
                      )
                      ? "active"
                      : ""
                    : "disabled"
                }`}
              >
                {hasActivePlans ? (
                  <Link href="/appraiser-accepted-properties">
                    <i className="flaticon-building"></i>
                    <span>Accepted Properties</span>
                  </Link>
                ) : (
                  <a>
                    <i className="flaticon-building"></i>
                    <span>Accepted Properties</span>
                  </a>
                )}
              </li>
            ) : (
              ""
            )}

            {isAppraiserByCompany ? (
              <li
                className={`treeview ${
                  hasActivePlans
                    ? isSinglePageActive(
                        "/sub-appraiser-completed-properties",
                        route.pathname
                      )
                      ? "active"
                      : ""
                    : "disabled"
                }`}
              >
                {hasActivePlans ? (
                  <Link href="/sub-appraiser-completed-properties">
                    <i className="flaticon-building"></i>
                    <span>Completed Properties</span>
                  </Link>
                ) : (
                  <a>
                    <i className="flaticon-building"></i>
                    <span>Completed Properties</span>
                  </a>
                )}
              </li>
            ) : (
              ""
            )}

            {!isAppraiserByCompany ? (
              <li
                className={`treeview ${
                  hasActivePlans
                    ? isSinglePageActive(
                        "/appraiser-completed-properties",
                        route.pathname
                      )
                      ? "active"
                      : ""
                    : "disabled"
                }`}
              >
                {hasActivePlans ? (
                  <Link href="/appraiser-completed-properties">
                    <i className="flaticon-building"></i>
                    <span>Completed Properties</span>
                  </Link>
                ) : (
                  <a>
                    <i className="flaticon-building"></i>
                    <span>Completed Properties</span>
                  </a>
                )}
              </li>
            ) : (
              ""
            )}
          </ul>
        </li>
        <li className="title">
          <span>Manage Account</span>
          {!isAppraiserByCompany ? (
            <ul>
              {manageAccountTag.map((item) => (
                <li
                  className={`${
                    isSinglePageActive(item.route, route.pathname)
                      ? "active"
                      : !hasActivePlans && item.id === 2
                      ? "disabled"
                      : ""
                  }`}
                  key={item.id}
                >
                  {!hasActivePlans && item.id === 2 ? (
                    <a
                      style={{
                        color: "#999",
                        cursor: "not-allowed",
                        opacity: "0.6",
                      }}
                    >
                      <i className={item.icon}></i> <span>{item.name}</span>
                    </a>
                  ) : (
                    <Link href={item.route}>
                      <i className={item.icon}></i> <span>{item.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            ""
          )}
        </li>
        {!isAppraiserByCompany ? (
          ""
        ) : (
          <li className="link-hover sidebar-menu">
            <Link href="/appraiser-helpdesk">
              <i className="flaticon-envelope"></i>
              <span>Help Desk</span>
            </Link>
          </li>
        )}
        {!isAppraiserByCompany ? (
          ""
        ) : (
          <li className="link-hover sidebar-menu">
            <Link href="mailto:patelshubhendra@gmail.com">
              <i className="flaticon-envelope"></i>
              <span>Contact Us</span>
            </Link>
          </li>
        )}
      </ul>
    </>
  );
};

export default SidebarMenu;
