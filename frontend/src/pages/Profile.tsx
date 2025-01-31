import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <h1>User's profile</h1>
      <p>Name: {user?.fullName}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
};

export default Profile;
