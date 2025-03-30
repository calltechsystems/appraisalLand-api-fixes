import Link from "next/link";

const UserGuide_01 = () => {
  const termsContent = [
    {
      id: 1,
      title: "1. HOW TO SIGN UP?",
      text1: `The following describes the registration process for appraisal land. A valid email address is required for successful registration on the portal. Please make sure to follow the outlined steps.`,
      text2: `Nullam this is a link nibh facilisis, at malesuada orci congue.
      Nullam tempus sollicitudin cursus. Nulla elit mauris, volutpat eu
      varius malesuada, pulvinar eu ligula. Ut et adipiscing erat.
      Curabitur adipiscing erat vel libero tempus congue. Nam pharetra
      interdum vestibulum. Aenean gravida mi non aliquet porttitor.
      Praesent dapibus, nisi a faucibus tincidunt, quam dolor
      condimentum metus, in convallis libero ligula ut`,
    },
    {
      id: 2,
      title: "Our Terms",
      text1: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
      mollis et sem sed sollicitudin. Donec non odio neque. Aliquam
      hendrerit sollicitudin purus, quis rutrum mi accumsan nec. Quisque
      bibendum orci ac nibh facilisis, at malesuada orci congue. Nullam
      tempus sollicitudin cursus. Ut et adipiscing erat. Curabitur this
      is a text link libero tempus congue.`,
      text2: `Duis mattis laoreet neque, et ornare neque sollicitudin at. Proin
      sagittis dolor sed mi elementum pretium. Donec et justo ante.
      Vivamus egestas sodales est, eu rhoncus urna semper eu. Cum sociis
      natoque penatibus et magnis dis parturient montes, nascetur
      ridiculus mus. Integer tristique elit lobortis purus bibendum,
      quis dictum metus mattis. Phasellus posuere felis sed eros
      porttitor mattis. Curabitur massa magna, tempor in blandit id,
      porta in ligula. Aliquam laoreet nisl massa, at interdum mauris
      sollicitudin et.`,
    },
    {
      id: 3,
      title: "Privacy Policy",
      text1: `Curabitur massa magna, tempor in blandit id, porta in ligula.
      Aliquam laoreet nisl massa, at interdum mauris sollicitudin et.
      Mauris risus lectus, tristique at nisl at, pharetra tristique
      enim.`,
      text2: `Nullam this is a link nibh facilisis, at malesuada orci congue.
      Nullam tempus sollicitudin cursus. Nulla elit mauris, volutpat eu
      varius malesuada, pulvinar eu ligula. Ut et adipiscing erat.
      Curabitur adipiscing erat vel libero tempus congue. Nam pharetra
      interdum vestibulum. Aenean gravida mi non aliquet porttitor.
      Praesent dapibus, nisi a faucibus tincidunt, quam dolor
      condimentum metus, in convallis libero ligula ut`,
    },
  ];

  const navigationList = [
    { id: 1, routeLink: "#", name: "1. HOW TO SIGN UP?" },
    { id: 2, routeLink: "#", name: "2. HOW TO LOG-IN?" },
    { id: 3, routeLink: "#", name: "3. HOW TO UPDATE PROFILE?" },
    { id: 4, routeLink: "#", name: "4. PROPERTY INFORMATION" },
    { id: 5, routeLink: "#", name: "5. MANAGE ACCOUNT" },
  ];

  return (
    <div className="row">
      <div className="col-lg-8 col-xl-8">
        {/* <div className="terms_condition_grid">
          {termsContent.map((item) => (
            <div className="grids mb30" key={item.id}>
              <p className="mb30">
                This guide will help you navigate through each step of our
                portal, from registration to managing your profile and accessing
                property details.
              </p>
              <h4>{item.title}</h4>
              <p className="mb20">{item.text1}</p>
              <p>{item.text2}</p>
            </div>
          ))}
        </div> */}

        <div className="terms_condition_grid">
          <p className="mb30">
            This guide will help you navigate through each step of our portal,
            from registration to managing your profile and accessing property
            details.
          </p>

          <div className="mb-4">
            <h4>1. HOW TO SIGN UP ?</h4>
            <p>
              The following describes the registration process for appraisal
              land. A valid email address is required for successful
              registration on the portal. Please make sure to follow the
              outlined steps.
            </p>
            <h5 htmlFor="">Sign-up to your account</h5>
            <ul className="list_details">
              <li style={{ color: "black", fontSize: "15px" }}>
                <i className="fa fa-caret-right mr10"></i>Choose User Type
              </li>
              <li style={{ color: "black", fontSize: "15px" }}>
                <i className="fa fa-caret-right mr10"></i>Email Address
              </li>
              <li style={{ color: "black", fontSize: "15px" }}>
                <i className="fa fa-caret-right mr10"></i>Create a Secure
                Password
              </li>
              <li style={{ color: "black", fontSize: "15px" }}>
                <i className="fa fa-caret-right mr10"></i>Re-enter Password
              </li>
              <li style={{ color: "black", fontSize: "15px" }}>
                <i className="fa fa-caret-right mr10"></i>Enter Captcha
              </li>
              <li style={{ color: "black", fontSize: "15px" }}>
                <i className="fa fa-caret-right mr10"></i>Accept Terms and
                Privacy Policy
              </li>
              <li style={{ color: "black", fontSize: "15px" }}>
                <i className="fa fa-caret-right mr10"></i>Sign Up
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h4>2.HOW TO LOG-IN ?</h4>
            <p>Go to log-in option on the Appraisal Land portal</p>
            <ul className="list_details">
              <li style={{ color: "black", fontSize: "15px" }}>
                <i className="fa fa-caret-right mr10"></i>Email address
              </li>
              <li style={{ color: "black", fontSize: "15px" }}>
                <i className="fa fa-caret-right mr10"></i>Password
              </li>
              <li style={{ color: "black", fontSize: "15px" }}>
                <i className="fa fa-caret-right mr10"></i>Captcha
              </li>
              <li style={{ color: "black", fontSize: "15px" }}>
                <i className="fa fa-caret-right mr10"></i>Remember Me
              </li>
              <li style={{ color: "black", fontSize: "15px" }}>
                <i className="fa fa-caret-right mr10"></i>Login
              </li>
            </ul>
          </div>

          <div>
            <button className=" btn btn-color">
              {" "}
              <Link
                href="assets/images/Broker User Guide_v0.5.pdf"
                target="_blank"
                className="text-light"
              >
                <i className="fa fa-download mr10"></i> Download pdf
              </Link>
            </button>
          </div>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-4 col-xl-4">
        <div className="terms_condition_widget">
          <h4 className="title">Navigation for Mortgage Broker</h4>
          <div className="widget_list">
            <ul className="list_details">
              {navigationList.map((list) => (
                <li key={list.id}>
                  <Link href="">
                    <i className="fa fa-caret-right mr10"></i>
                    {list.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h5>For More Info download pdf below link.</h5>
            <button className=" btn btn-color">
              {" "}
              <Link
                href="assets/images/Broker User Guide_v0.5.pdf"
                target="_blank"
                className="text-light"
              >
                <i className="fa fa-download mr10"></i> Download pdf
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide_01;
