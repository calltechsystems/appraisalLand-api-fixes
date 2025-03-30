import Link from "next/link";
import { useRouter } from "next/router";
import {
  isParentPageActive,
  isSinglePageActive,
} from "../../../../utils/daynamicNavigation";
import Image from "next/image";

const SidebarMenu = () => {
  const route = useRouter();

  const userManagement = [
    { id: 1, name: "Appraiser Company", route: "/manage-appraiser-company" },
    { id: 2, name: "Appraiser Individual", route: "/manage-appraisers" },
    { id: 3, name: "Mortgage Brokerage", route: "/manage-mortgage-brokerage" },
    { id: 4, name: "Mortgage Broker", route: "/manage-mortgage-broker" },
  ];
  const appraisersInformation = [
    {
      id: 1,
      name: "Appraiser Company",
      route: "/appraiser-company-properties",
    },
    {
      id: 2,
      name: "Sub Appraiser",
      route: "/subappraiser-byCompany-properties",
    },
    { id: 3, name: "Appraiser Individual", route: "/appraiser-properties" },
    // { id: 3, name: "Archive", route: "/appraisers-archive-properties" },
  ];
  const brokersInformation = [
    {
      id: 1,
      name: "Mortgage Brokerage",
      route: "/mortgage-brokerage-properties",
    },
    {
      id: 2,
      name: "Sub Broker",
      route: "/subbroker-byCompany-properties",
    },
    { id: 3, name: "Mortgage Broker", route: "/mortgage-broker-properties" },
    // { id: 3, name: "Archive", route: "/mortgage-brokers-archive-properties" },
  ];

  const manageSubscriptionPlan = [
    { id: 1, name: "Appraiser Company", route: "/appraiser-company-plan" },
    { id: 2, name: "Appraiser Individual", route: "/appraiser-plan" },
    { id: 3, name: "Mortgage Brokerage", route: "/mortgage-brokerage-plan" },
    { id: 4, name: "Mortgage Broker", route: "/mortgage-broker-plan" },
    { id: 5, name: "Add Topup Properties", route: "/add-topup-properties" },
  ];

  const dashboard = [
    {
      id: 1,
      name: "Appraiser Company",
      route: "/appraiser-company-dashboard-admin",
    },
    {
      id: 2,
      name: "Appraiser Individual",
      route: "/appraiser-dashboard-admin",
    },
    {
      id: 3,
      name: "Mortgage Brokerage",
      route: "/mortgage-brokerage-dashboard",
    },
    { id: 4, name: "Mortgage Broker", route: "/mortgage-broker-dashboard" },
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

  const isMenuActive = (menuItems) => {
    return menuItems.some((item) => item.route == route.pathname);
  };

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
                isParentPageActive(dashboard, route.pathname) ? "" : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#my-property_1">
                <i className="fa fa-dashboard"></i>{" "}
                <span>Dashboards</span>
                <i className="fa fa-angle-down pull-right"></i>
              </a>
              <ul
                className={`treeview-menu collapse ${
                  isMenuActive(dashboard) ? "show" : ""
                }`}
                id="my-property_1"
              >
                {dashboard.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* end properties */}
            <li
              className={`treeview ${
                isParentPageActive(appraisersInformation, route.pathname)
                  ? ""
                  : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#my-property_2">
                <i className="fa fa-info-circle"></i>{" "}
                <span>Appraisers Properties Info</span>
                <i className="fa fa-angle-down pull-right"></i>
              </a>
              <ul
                className={`treeview-menu collapse ${
                  isMenuActive(appraisersInformation) ? "show" : ""
                }`}
                id="my-property_2"
              >
                {appraisersInformation.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* end properties */}

            <li
              className={`treeview ${
                isParentPageActive(brokersInformation, route.pathname) ? "" : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#my-property_3">
                <i className="fa fa-info-circle"></i>{" "}
                <span>Brokers Properties Info</span>
                <i className="fa fa-angle-down pull-right"></i>
              </a>
              <ul
                className={`treeview-menu collapse ${
                  isMenuActive(brokersInformation) ? "show" : ""
                }`}
                id="my-property_3"
              >
                {brokersInformation.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* end properties */}

            <li
              className={`treeview ${
                isParentPageActive(manageSubscriptionPlan, route.pathname)
                  ? ""
                  : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#my-property_4">
                <i className="fa fa-dollar"></i>{" "}
                <span>Manage Subscription Plans</span>
                <i className="fa fa-angle-down pull-right"></i>
              </a>
              <ul
                className={`treeview-menu collapse ${
                  isMenuActive(manageSubscriptionPlan) ? "show" : ""
                }`}
                id="my-property_4"
              >
                {manageSubscriptionPlan.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li
              className={`treeview ${
                isParentPageActive(userManagement, route.pathname) ? "" : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#my-property">
                <i className="fa fa-users"></i> <span>Users Management</span>
                <i className="fa fa-angle-down pull-right"></i>
              </a>
              <ul
                className={`treeview-menu collapse ${
                  isMenuActive(userManagement) ? "show" : ""
                }`}
                id="my-property"
              >
                {userManagement.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* end properties */}

            {/* <li
              className={`treeview ${
                isSinglePageActive("/add-topup-properties", route.pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/add-topup-properties">
                <i className="flaticon-plus"></i>
                <span>Add Topup Properties</span>
              </Link>
            </li> */}
          </ul>
        </li>
      </ul>
    </>
  );
};

export default SidebarMenu;
