import React from "react";
import { Link, Element, scroller } from "react-scroll";
import {
  FaUser,
  FaSignInAlt,
  FaUserEdit,
  FaBuilding,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";
// import styles from "./UserGuide.module.css";

const sections = [
  { id: "register", title: "Registering an Account", icon: <FaUser /> },
  { id: "login", title: "Logging In", icon: <FaSignInAlt /> },
  { id: "updateProfile", title: "Updating Your Profile", icon: <FaUserEdit /> },
  {
    id: "viewProperties",
    title: "Viewing and Searching Properties",
    icon: <FaBuilding />,
  },
  { id: "settings", title: "Account Settings", icon: <FaCog /> },
  { id: "support", title: "Contacting Support", icon: <FaQuestionCircle /> },
];

const UserGuide = () => {
  const scrollToTop = () => {
    scroller.scrollTo("top", { smooth: true, duration: 500 });
  };

  return (
    <div className="userGuide">
      <div className="sidebar_userguide">
        <h2>Table of Contents</h2>
        {sections.map((section) => (
          <Link
            key={section.id}
            to={section.id}
            smooth={true}
            duration={500}
            className="sidebarLink"
            activeClass="activeLink"
          >
            {section.icon} {section.title}
          </Link>
        ))}
        <button className="scrollTop" onClick={scrollToTop}>
          Back to Top
        </button>
      </div>

      <div className="content">
        <h1>User Guide</h1>
        <Element name="top" />

        {sections.map((section) => (
          <Element
            name={section.id}
            key={section.id}
            className="section_userguide"
          >
            <h2>
              {section.icon} {section.title}
            </h2>
            <p>
              Here are step-by-step instructions for{" "}
              {section.title.toLowerCase()}.
            </p>
            {/* Add detailed instructions and screenshots as needed */}
          </Element>
        ))}
      </div>
    </div>
  );
};

export default UserGuide;
