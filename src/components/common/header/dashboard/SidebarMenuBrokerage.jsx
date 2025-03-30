import Link from "next/link";
import { useRouter } from "next/router";
import {
  isParentPageActive,
  isSinglePageActive,
} from "../../../../utils/daynamicNavigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useModal } from "../../../../context/ModalContext";

const SidebarMenu = ({}) => {
  const { setIsModalOpen } = useModal();
  const route = useRouter();
  const [hasActivePlans, setHasActivePlans] = useState(false);
  const [userData, setUserData] = useState(null);
  const planLimit = userData?.planLimitExceed;
  console.log("plan limit", planLimit);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUserData(userData);
    // Check if the user has active plans
    const userActivePlans = userData?.userSubscription?.$values || [];
    // // console.log("plans", userActivePlans);
    // if (userData?.userType === 6) {
    //   console.log("Not applicable for this user type.", userData);
    //   setHasActivePlans(true);
    //   return;
    // }
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
      name: "Add / Modify Subscriptions",
      route: "/brokerage-plans",
      icon: "flaticon-money-bag",
    },
    {
      id: 2,
      name: "Transaction History",
      route: "/brokerage-subscription-history",
      icon: "flaticon-invoice",
    },

    {
      id: 3,
      name: "Help desk",
      route: "/brokerage-helpdesk",
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
          <ul>
            <li
              className={`treeview ${
                isSinglePageActive("/brokerage-dashboard", route.pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/brokerage-dashboard">
                <i className="flaticon-home"></i>
                <span>Dashboard</span>
              </Link>
            </li>

            <li
              className={`treeview ${
                hasActivePlans
                  ? isSinglePageActive("/brokerage-properties", route.pathname)
                    ? "active"
                    : ""
                  : "disabled"
              }`}
            >
              {hasActivePlans ? (
                <Link href="/brokerage-properties">
                  <i className="flaticon-home"></i>
                  <span>My Properties</span>
                </Link>
              ) : (
                <a>
                  <i className="flaticon-home"></i>
                  <span>My Properties</span>
                </a>
              )}
            </li>

            <li
              className={`treeview ${
                hasActivePlans
                  ? isSinglePageActive("/brokers-properties", route.pathname)
                    ? "active"
                    : ""
                  : "disabled"
              }`}
            >
              {hasActivePlans ? (
                <Link href="/brokers-properties">
                  <i className="flaticon-building"></i>
                  <span>Brokers Properties</span>
                </Link>
              ) : (
                <a>
                  <i className="flaticon-building"></i>
                  <span>Brokers Properties</span>
                </a>
              )}
            </li>

            {userData?.planLimitExceed === 1 ? (
              <li>
                <Link
                  href="#"
                  className=""
                  onClick={(e) => {
                    e.preventDefault();
                    setIsModalOpen(true); // Open modal globally
                  }}
                >
                  <i className="flaticon-plus"></i>
                  <span>Add New Property</span>
                </Link>
              </li>
            ) : (
              <li
                className={`treeview ${
                  hasActivePlans
                    ? isSinglePageActive("/create-listing-1", route.pathname)
                      ? "active"
                      : ""
                    : "disabled"
                }`}
              >
                {hasActivePlans ? (
                  <Link href="/create-listing-1">
                    <i className="flaticon-plus"></i>
                    <span>Add New Property</span>
                  </Link>
                ) : (
                  <a>
                    <i className="flaticon-plus"></i>
                    <span>Add New Property</span>
                  </a>
                )}
              </li>
            )}
          </ul>
        </li>

        <li className="title">
          <span>Manage Properties</span>
          <ul>
            <li
              className={`treeview ${
                hasActivePlans
                  ? isSinglePageActive(
                      "/brokerage-archive-properties",
                      route.pathname
                    )
                    ? "active"
                    : ""
                  : "disabled"
              }`}
            >
              {hasActivePlans ? (
                <Link href="/brokerage-archive-properties">
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

            <li
              className={`treeview ${
                hasActivePlans
                  ? isSinglePageActive(
                      "/brokerage-completed-properties",
                      route.pathname
                    )
                    ? "active"
                    : ""
                  : "disabled"
              }`}
            >
              {hasActivePlans ? (
                <Link href="/brokerage-completed-properties">
                  <i className="flaticon-building"></i>
                  <span>My Completed Properties</span>
                </Link>
              ) : (
                <a>
                  <i className="flaticon-building"></i>
                  <span>My Completed Properties</span>
                </a>
              )}
            </li>

            <li
              className={`treeview ${
                hasActivePlans
                  ? isSinglePageActive(
                      "/brokers-completed-properties",
                      route.pathname
                    )
                    ? "active"
                    : ""
                  : "disabled"
              }`}
            >
              {hasActivePlans ? (
                <Link href="/brokers-completed-properties">
                  <i className="flaticon-building"></i>
                  <span>Brokers Completed Properties</span>
                </Link>
              ) : (
                <a>
                  <i className="flaticon-building"></i>
                  <span>Brokers Completed Properties</span>
                </a>
              )}
            </li>
          </ul>
        </li>
        <li className="title">
          <span>Manage Brokers</span>
          <ul>
            <li
              className={`treeview ${
                hasActivePlans
                  ? isSinglePageActive("/all-brokers", route.pathname)
                    ? "active"
                    : ""
                  : "disabled"
              }`}
            >
              {hasActivePlans ? (
                <Link href="/all-brokers">
                  <i className="flaticon-building"></i>
                  <span>Broker Add/View</span>
                </Link>
              ) : (
                <a>
                  <i className="flaticon-building"></i>
                  <span>Broker Add/View</span>
                </a>
              )}
            </li>
          </ul>
        </li>

        <li className="title">
          <span>Manage Account</span>
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
        </li>
        {/* <li className="link-hover sidebar-menu">
          <Link href="mailto:patelshubhendra@gmail.com">
            <i className="flaticon-envelope"></i>
            <span>Contact Us</span>
          </Link>
        </li> */}
      </ul>
    </>
  );
};

export default SidebarMenu;
