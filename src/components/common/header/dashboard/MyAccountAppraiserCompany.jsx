import Link from "next/link";
import Router, { useRouter } from "next/router";
import { isSinglePageActive } from "../../../../utils/daynamicNavigation";
import Image from "next/image";
import CircularIcon from "./CircularIcon";
import { use, useEffect } from "react";
import { useState } from "react";

const MyAccount = ({ user, profileCount, setProfile, userData }) => {
  const logout = () => {
    localStorage.removeItem("user");
    route.push("/login");
  };
  const profileMenuItems = [
    { id: 1, name: "Profile", ruterPath: "/appraiser-company-profile" },
    // { id: 2, name: " My Message", ruterPath: "/my-message" },
    // { id: 3, name: " My Favourite", ruterPath: "/my-favourites" },
    {
      id: 2,
      name: "Change Password ",
      ruterPath: "/appraiser-company-change-password",
    },
    { id: 5, name: "Log out", ruterPath: "/login", onClick: { logout } },
  ];

  const [profileValue, setProfileValue] = useState(0);
  useEffect(() => {
    let count = 0;
    if (userData?.userType === 1) {
      if (userData.broker_Details.firstName) {
        count = count + 1;
      }
      if (userData.broker_Details.middleName) {
        count = count + 1;
      }
      if (userData.broker_Details.lastName) {
        count = count + 1;
      }
      if (userData.broker_Details.licenseNo != null) {
        count = count + 1;
      }
      if (userData.broker_Details.adressLine1 != null) {
        count = count + 1;
      }
      if (userData.broker_Details.adressLine2 != null) {
        count = count + 1;
      }
      if (userData.broker_Details.area != null) {
        count = count + 1;
      }
      if (userData.broker_Details.assistantFirstName != null) {
        count = count + 1;
      }
      if (userData.broker_Details.assistantPhoneNumber != null) {
        count = count + 1;
      }
      if (userData.broker_Details.brokerageName != null) {
        count = count + 1;
      }
      if (userData.broker_Details.city != null) {
        count = count + 1;
      }
      if (userData.broker_Details.companyName != null) {
        count = count + 1;
      }
      if (userData.broker_Details.mortageBrokerLicNo != null) {
        count = count + 1;
      }
      if (userData.broker_Details.mortageBrokerageLicNo != null) {
        count = count + 1;
      }
      if (userData.broker_Details.phoneNumber != null) {
        count = count + 1;
      }
      if (userData.broker_Details.profileImage != null) {
        count = count + 1;
      }
      if (userData.broker_Details.state != null) {
        count = count + 1;
      }
      if (userData.broker_Details.zipCode != null) {
        count = count + 1;
      }

      const change = (count / 18) * 100;
      console.log(change);
      setProfileValue(change);
    } else if (userData?.userType === 2) {
      if (userData.brokerage_Details.firstName) {
        count = count + 1;
      }
      if (userData.brokerage_Details.middleName) {
        count = count + 1;
      }
      if (userData.brokerage_Details.lastName) {
        count = count + 1;
      }
      if (userData.brokerage_Details.licenseNo != null) {
        count = count + 1;
      }
      if (userData.brokerage_Details.adressLine1 != null) {
        count = count + 1;
      }
      if (userData.brokerage_Details.adressLine2 != null) {
        count = count + 1;
      }
      if (userData.brokerage_Details.area != null) {
        count = count + 1;
      }
      if (userData.brokerage_Details.assistantFirstName != null) {
        count = count + 1;
      }
      if (userData.brokerage_Details.assistantPhoneNumber != null) {
        count = count + 1;
      }
      if (userData.brokerage_Details.brokerageName != null) {
        count = count + 1;
      }
      if (userData.brokerage_Details.city != null) {
        count = count + 1;
      }
      if (userData.brokerage_Details.companyName != null) {
        count = count + 1;
      }
      if (userData.brokerage_Details.mortageBrokerLicNo != null) {
        count = count + 1;
      }
      if (userData.brokerage_Details.mortageBrokerageLicNo != null) {
        count = count + 1;
      }
      if (userData.brokerage_Details.phoneNumber != null) {
        count = count + 1;
      }
      if (userData.brokerage_Details.profileImage != null) {
        count = count + 1;
      }
      if (userData.brokerage_Details.state != null) {
        count = count + 1;
      }
      if (userData.brokerage_Details.zipCode != null) {
        count = count + 1;
      }

      const change = (count / 18) * 100;
      setProfileValue(change);
    }
  }, []);
  const route = useRouter();

  return (
    <>
      <div className="user_set_header">
        <Image
          width={40}
          height={40}
          className="float-center mb-1"
          src={
            userData?.appraiserCompany_Datails?.profileImage
              ? userData.appraiserCompany_Datails?.profileImage
              : "/assets/images/home/placeholder_01.jpg"
          }
          alt="e1.png"
        />
        <p>
          {userData?.appraiserCompany_Datails
            ? `${userData?.appraiserCompany_Datails?.firstName} ${userData?.appraiserCompany_Datails?.lastName}`
            : "Name"}
          <br />
          <span className="address">
            {userData?.userEmail ? userData.userEmail : "xyz@gmail.com"}
          </span>
        </p>
      </div>
      {/* End user_set_header */}

      <div className="user_setting_content">
        {profileMenuItems.map((item) => (
          <Link
            href={item.ruterPath}
            key={item.id}
            className="dropdown-item link-hover"
            style={
              isSinglePageActive(`${item.ruterPath}`, route.pathname)
                ? { color: "#ff5a5f" }
                : undefined
            }
          >
            {item.id === 5 ? (
              <span style={{ color: "#2e008b" }} onClick={logout}>
                Logout
              </span>
            ) : (
              <div className="row">
                <div className="col-lg-6">{item.name}</div>
                {/* <div
                  className="col-lg-6"
                  style={{
                    marginBottom: "-80px",
                    marginTop: "-25px",
                    paddingLeft: "20px",
                  }}
                >
                  {item.id === 1 && <CircularIcon percentage={profileValue} />}
                </div> */}
              </div>
            )}
          </Link>
        ))}
      </div>
    </>
  );
};

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   return {
//     props: {
//       user: session?.user || null,
//     },
//   };
// }

export default MyAccount;
