import "react-pro-sidebar/dist/css/styles.css";
import {
  ProSidebar,
  SidebarHeader,
  SidebarFooter,
  Menu,
  MenuItem,
  SubMenu,
  SidebarContent,
} from "react-pro-sidebar";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  isParentPageActive,
  isSinglePageActive,
} from "../../../utils/daynamicNavigation";
import Image from "next/image";

const SidebarMenu = () => {
  const route = useRouter();

  const myProperties = [
    { id: 1, name: "General Elements", route: "/my-properties" },
    { id: 2, name: "Advanced Elements", route: "/my-properties" },
    { id: 3, name: "Editors", route: "/my-properties" },
  ];
  const reviews = [
    { id: 1, name: "My Reviews", route: "/my-review" },
    { id: 2, name: "Visitor Reviews", route: "/my-review" },
  ];
  const manageAccount = [
    {
      id: 1,
      name: "Profile",
      route: "/my-profile",
      icon: "flaticon-user",
    },
    {
      id: 2,
      name: "Change Password",
      route: "/broker-change-password",
      icon: "flaticon-box",
    },
    { id: 3, name: "Logout", route: "/login", icon: "flaticon-logout" },
  ];

  return (
    <>
      <ProSidebar>
        <ul className="sidebar-menu">
          <SidebarHeader>
            <div className="sidebar-header">
              <Link href="/" className="sidebar-header-inner">
                <Image
                  width={60}
                  height={45}
                  className="nav_logo_img img-fluid mt20"
                  src="/assets/images/Appraisal_Land_Logo.png"
                  alt="header-logo.png"
                />
                {/* <span className="brand-text">Appraisal Land</span> */}
                <span
                  className="brand-text"
                  style={{
                    marginTop: "35px",
                    color: "#2e008b",
                    marginLeft: "-25px",
                  }}
                >
                  Appraisal
                </span>
                <span
                  className="brand-text"
                  style={{
                    marginTop: "35px",
                    color: "#97d700",
                    paddingLeft: "5px",
                  }}
                >
                  Land
                </span>
              </Link>
              {/* End .logo */}

              <div
                className="fix-icon"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                <span className="flaticon-close"></span>
              </div>
              {/* Mobile Menu close icon */}
            </div>

            {/* End logo */}
          </SidebarHeader>

          {/* <li className="sidebar_header header">
            <Link href="/">
              <Image
                width={40}
                height={45}
                src="/assets/images/logo_new.png"
                alt="header-logo2.png"
              />
              <span>Appraisal Link</span>
            </Link>
          </li> */}
          {/* End header */}

          <li className="title">
            <span>Main</span>
            <ul>
              <li
                className={`treeview ${
                  isSinglePageActive("/my-dashboard", route.pathname)
                    ? "active"
                    : ""
                }`}
              >
                <Link href="/my-dashboard">
                  <i className="flaticon-layers"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li
                className={`treeview ${
                  isSinglePageActive("/my-properties", route.pathname)
                    ? "active"
                    : ""
                }`}
              >
                <Link href="/my-properties">
                  <i className="flaticon-home"></i>
                  <span>My Properties</span>
                </Link>
              </li>
              <li
                className={`treeview ${
                  isSinglePageActive("/create-listing", route.pathname)
                    ? "active"
                    : ""
                }`}
              >
                <Link href="/create-listing">
                  <i className="flaticon-plus"></i>
                  <span>Add New Property</span>
                </Link>
              </li>
              <li
                className={`treeview ${
                  isSinglePageActive("/archive-property", route.pathname)
                    ? "active"
                    : ""
                }`}
              >
                <Link href="/archive-property">
                  <i className="flaticon-home"></i>
                  <span>Archived Properties</span>
                </Link>
              </li>
              <li
                className={`treeview ${
                  isSinglePageActive("/my-plans", route.pathname)
                    ? "active"
                    : ""
                }`}
              >
                <Link href="/my-plans">
                  <i className="flaticon-pdf"></i>
                  <span> Packages</span>
                </Link>
              </li>
              {/* <li
              className={`treeview ${
                    isParentPageActive("/my-package", route.pathname) ? "active" : ""
                  }`}
                >
                <Link href="/my-package">
                <i className="flaticon-home"></i>
                <span>Transactions</span>
              </Link>
                </li> */}
            </ul>
          </li>

          <li
            className={`treeview ${
              isSinglePageActive("/my-package", route.pathname) ? "active" : ""
            }`}
          >
            <Link href="/my-package">
              <i className="flaticon-envelope"></i>
              <span> Transactions</span>
            </Link>
          </li>

          {/* End Main */}

          {/* <li className="title">
          <span >Manage Appraise Properties</span>
          <ul>
            <li
              className={`treeview ${
                isParentPageActive(myProperties, route.pathname) ? "active" : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#my-property">
                <i className="flaticon-home"></i> <span>My Properties</span>
                </a>
            </li>*/}
          {/* <i className="fa fa-angle-down pull-right"></i>*/}

          {/*<ul className="treeview-menu collapse" id="my-property">
                {myProperties.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
                </ul>*/}

          {/* end properties */}

          {/* <li
              className={`treeview ${
                isParentPageActive(reviews, route.pathname) ? "active" : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#review">
                <i className="flaticon-chat"></i>
                <span>Reviews</span>
                <i className="fa fa-angle-down pull-right"></i>
              </a>
              <ul className="treeview-menu collapse" id="review">
                {reviews.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li> */}
          {/* End Review */}

          {/* <li
              className={`treeview ${
                isSinglePageActive("/my-favourites", route.pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-favourites">
                <i className="flaticon-magnifying-glass"></i>
                <span> My Favorites</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/my-saved-search", route.pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-saved-search">
                <i className="flaticon-magnifying-glass"></i>
                <span> Saved Search</span>
              </Link>
            </li> */}
          {/*</ul>
          </li>*/}
          {/* End manage listing */}

          <li className="title">
            <span>Manage Account</span>
            <ul>
              {manageAccount.map((item) => (
                <li
                  className={
                    isSinglePageActive(item.route, route.pathname)
                      ? "active"
                      : ""
                  }
                  key={item.id}
                >
                  <Link href={item.route}>
                    <i className={item.icon}></i> <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </ProSidebar>
    </>
  );
};

export default SidebarMenu;
