import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchSuggestedUsers, toggleFollowUser } from "../store/slices/suggestedUsersSlice";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/avatar.png";
import "../styles/SuggestedUsers.css";

const SuggestedUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state: RootState) => state.suggestedUsers);

  useEffect(() => {
    dispatch(fetchSuggestedUsers());
  }, [dispatch]);

  const handleFollowToggle = (userId: string) => {
    dispatch(toggleFollowUser(userId));
  };

  return (
    <div className="suggested-users">
      <h3>Who to follow</h3>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {users.map((user) => (
          <li key={user._id} className="suggested-user">
            <div className="suggested-user-info" onClick={() => navigate(`/profile/${user.username}`)}>
              <img src={user.profilePicture || defaultAvatar} alt={user.username} className="profile-pic" />
              <div>
                <strong>{user.fullName}</strong>
                <p>@{user.username}</p>
              </div>
            </div>
            <button onClick={() => handleFollowToggle(user._id)}>
              {user.isFollowing ? "Following" : "Follow"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedUsers;