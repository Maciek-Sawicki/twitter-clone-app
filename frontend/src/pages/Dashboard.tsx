import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts, fetchFollowingPosts, createPost} from "../store/slices/postSlice";
import { AppDispatch, RootState } from "../store/store";
import Post from "../components/Post";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, followingPosts, loading, error } = useSelector((state: RootState) => state.posts);
  const [tab, setTab] = useState<"all" | "following">("all");
  const [newPost, setNewPost] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchAllPosts());
    dispatch(fetchFollowingPosts());
  }, [dispatch]);

  const displayedPosts = tab === "all" ? posts : followingPosts;

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    await dispatch(createPost(newPost));
    setNewPost("");
  };
  
  return (
    <div className="dashboard-container">
      <h1>Hello {user?.username}!</h1>
      <div className="tabs">
        <button className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>
          All Posts
        </button>
        <button className={tab === "following" ? "active" : ""} onClick={() => setTab("following")}>
          Following
        </button>
      </div>
      <div className="create-post">
        <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Whats on your mind?"
            rows={4}
            wrap="hard"
        />
        <div className="button-container">
          <button onClick={handleCreatePost} disabled={loading}>Post</button>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : displayedPosts.length === 0 ? (
        <p>No posts to show</p>
      ) : (
        displayedPosts.map((post, index) => (
          <Post key={`${post._id}-${index}`} post={post} />
      )))}
    </div>
  );
  
};

export default Dashboard;
