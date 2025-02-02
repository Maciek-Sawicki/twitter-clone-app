import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { fetchUserProfile, toggleFollowUser } from "../store/slices/userProfileSlice";
import { fetchUserPosts } from "../store/slices/postSlice";
import Post from "../components/Post";
import "../styles/UserProfile.css";
import defaultAvatar from "../assets/avatar.png";
import defaultCover from "../assets/cover.jpg";

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.userProfile);
  const { user } = useSelector((state: RootState) => state.auth); // Zalogowany użytkownik
  const { userPosts, loading: postsLoading } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    if (username) {
      dispatch(fetchUserProfile(username));
      dispatch(fetchUserPosts(username));
    }
  }, [dispatch, username]);

  const handleFollowToggle = () => {
    if (profile) {
      dispatch(toggleFollowUser(profile._id));
    }
  };

  const isFollowing = profile?.followers.includes(user?._id || "");

  if (loading) return <p className="loading-text">Loading profile...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="user-profile">
      <div className="cover-container">
        <img src={profile?.coverImage || defaultCover} alt="Cover" className="cover-image" />
      </div>
      <div className="profile-info">
        <div className="avatar-container">
          <img src={profile?.profilePicture || defaultAvatar} alt={profile?.username} className="user-pic" />
        </div>
        <div className="user-details">
          <h2>{profile?.fullName}</h2>
          <p className="username">@{profile?.username}</p>
          <p className="bio">{profile?.bio || "No bio"}</p>
        </div>

        {profile?._id !== user?._id && (
          <button onClick={handleFollowToggle} className={`follow-btn ${isFollowing ? "unfollow-btn" : ""}`}>
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>
      <div className="user-posts">
        <h3>User's posts</h3>
        {postsLoading ? (
          <p className="loading-text">Loading posts...</p>
        ) : userPosts.length > 0 ? (
          userPosts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p className="no-posts">No posts</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
