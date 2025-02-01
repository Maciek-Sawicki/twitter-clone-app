import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { fetchUserProfile, toggleFollowUser } from "../store/slices/userProfileSlice";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.userProfile);
  const { user } = useSelector((state: RootState) => state.auth); // Zalogowany użytkownik

  useEffect(() => {
    if (username) {
      dispatch(fetchUserProfile(username));
    }
  }, [dispatch, username]);

  const handleFollowToggle = () => {
    if (profile) {
      dispatch(toggleFollowUser(profile._id));
    }
  };

  // 🔥 Sprawdzenie, czy zalogowany użytkownik znajduje się w followers danego profilu
  const isFollowing = profile?.followers.includes(user?._id || "");

  if (loading) return <p>Ładowanie profilu...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="user-profile">
      <div className="cover-image" style={{ backgroundImage: `url(${profile?.coverImage || "/default-cover.jpg"})` }}></div>
      <div className="profile-info">
        <img src={profile?.profilePicture || "/default-avatar.png"} alt={profile?.username} className="profile-pic" />
        <h2>{profile?.fullName}</h2>
        <p>@{profile?.username}</p>
        <p>{profile?.bio}</p>

        <button onClick={handleFollowToggle} className={isFollowing ? "unfollow-btn" : "follow-btn"}>
          {isFollowing ? "Obserwujesz" : "Obserwuj"}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
