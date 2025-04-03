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
    { id: 1, name: "Profile", ruterPath: "/brokerage-profile" },
    // { id: 2, name: " My Message", ruterPath: "/my-message" },
    // { id: 3, name: " My Favourite", ruterPath: "/my-favourites" },
    {
      id: 2,
      name: "Change Password ",
      ruterPath: "/brokerage-company-change-password",
    },
    { id: 5, name: "Log out", ruterPath: "/login", onClick: { logout } },
  ];

  const [profileValue, setProfileValue] = useState(0);
  useEffect(() => {
    let count = 0;
    if (userData?.userType === 1) {
      if (userData.brokerDetail.firstName) {
        count = count + 1;
      }
      if (userData.brokerDetail.middleName) {
        count = count + 1;
      }
      if (userData.brokerDetail.lastName) {
        count = count + 1;
      }
      if (userData.brokerDetail.licenseNo != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.adressLine1 != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.adressLine2 != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.area != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.assistantFirstName != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.assistantPhoneNumber != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.brokerageName != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.city != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.companyName != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.mortageBrokerLicNo != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.mortageBrokerageLicNo != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.phoneNumber != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.profileImage != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.state != null) {
        count = count + 1;
      }
      if (userData.brokerDetail.zipCode != null) {
        count = count + 1;
      }

      const change = (count / 18) * 100;
      console.log(change);
      setProfileValue(change);
    } else if (userData?.userType === 2) {
      if (userData.brokerageDetail.firstName) {
        count = count + 1;
      }
      if (userData.brokerageDetail.middleName) {
        count = count + 1;
      }
      if (userData.brokerageDetail.lastName) {
        count = count + 1;
      }
      if (userData.brokerageDetail.licenseNo != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.adressLine1 != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.adressLine2 != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.area != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.assistantFirstName != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.assistantPhoneNumber != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.brokerageName != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.city != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.companyName != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.mortageBrokerLicNo != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.mortageBrokerageLicNo != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.phoneNumber != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.profileImage != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.state != null) {
        count = count + 1;
      }
      if (userData.brokerageDetail.zipCode != null) {
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
            userData?.brokerageDetail?.profileImage
              ? userData.brokerageDetail?.profileImage
              : `/assets/images/home/placeholder_01.jpg`
          }
          alt="e1.png"
        />
        <p>
          {userData?.brokerageDetail?.firstName
            ? `${userData.brokerageDetail?.firstName} ${userData?.brokerageDetail?.lastName}`
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
