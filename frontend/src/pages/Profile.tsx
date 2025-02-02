import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchUser } from "../store/slices/authSlice";
import { fetchUserPosts } from "../store/slices/postSlice";
import Post from "../components/Post";
import "../styles/UserProfile.css";
import defaultAvatar from "../assets/avatar.png";
import defaultCover from "../assets/cover.jpg";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const { userPosts, loading: postsLoading } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(fetchUser());
    if (user) {
      dispatch(fetchUserPosts(user.username));
    }
  }, [dispatch, user?.username]);

  if (loading) return <p className="loading-text">Loading profile...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="user-profile">
      <div className="cover-container">
        <img src={defaultCover} alt="Cover" className="cover-image" />
      </div>
      <div className="profile-info">
        <div className="avatar-container">
          <img src={user?.profilePicture || defaultAvatar} alt={user?.username} className="user-pic" />
        </div>
        <div className="user-details">
          <h2>{user?.fullName}</h2>
          <p className="username">@{user?.username}</p>
          <p className="bio">{ "No bio yet"}</p>
        </div>

        <button disabled onClick={() => navigate("/settings")} className="edit-profile-btn">
          Edit Profile
        </button>
      </div>
      <div className="user-posts">
        <h3>Your Posts</h3>
        {postsLoading ? (
          <p className="loading-text">Loading posts...</p>
        ) : userPosts.length > 0 ? (
          userPosts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p className="no-posts">You haven't posted anything yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
