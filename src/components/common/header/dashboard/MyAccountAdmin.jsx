import Link from "next/link";
import { useRouter } from "next/router";
import { isSinglePageActive } from "../../../../utils/daynamicNavigation";
import Image from "next/image";
// import { getSession } from "next-iron-session";

const MyAccount = ({ user, userData }) => {
  const profileMenuItems = [
    // { id: 1, name: "Profile", ruterPath: "/brokerage-profile" },
    // { id: 2, name: " My Message", ruterPath: "/my-message" },
    // { id: 3, name: " My Favourite", ruterPath: "/my-favourites" },
    // {
    //   id: 4,
    //   name: "Change Password ",
    //   ruterPath: "/admin-change-password",
    // },
    { id: 1, name: "Log out", ruterPath: "/login" },
  ];
  const route = useRouter();
  return (
    <>
      <div className="user_set_header">
        <Image
          width={45}
          height={45}
          className="float-start"
          src={
            userData?.brokerage_Details?.profileImage ||
            "/assets/images/team/a2.jpg"
          }
          alt="e1.png"
        />
        <p>
          <span className="address fw-bold fs-5 text-dark">Admin</span>
          {user?.email}
          <br />
          <span className="address fs-6 text-dark">admin@appraisalland.ca</span>
        </p>
      </div>
      {/* End user_set_header */}

      <div className="user_setting_content">
        {profileMenuItems.map((item) => (
          <Link
            href={item.ruterPath}
            key={item.id}
            className="dropdown-item"
            style={
              isSinglePageActive(`${item.ruterPath}`, route.pathname)
                ? { color: "#ff5a5f" }
                : undefined
            }
          >
            {item.name}
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
