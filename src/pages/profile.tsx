import { useSession } from "next-auth/react";
import React from "react";

const Profile = () => {
  const { data: sessionData } = useSession();
  return <div>Profile</div>;
};

export default Profile;
