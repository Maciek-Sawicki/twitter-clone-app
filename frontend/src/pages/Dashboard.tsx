import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts, fetchFollowingPosts, createPost, likePost, commentPost } from "../store/slices/postSlice";
import { AppDispatch, RootState } from "../store/store";
import Post from "../components/Post";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { posts, followingPosts, loading, error } = useSelector((state: RootState) => state.posts);
  const [tab, setTab] = useState<"all" | "following">("all");
  const [newPost, setNewPost] = useState("");
  const [comment, setComment] = useState("");

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
      <h1>Dashboard</h1>
  
      {/* 🔥 Zakładki do przełączania między "Wszystkie" i "Obserwowani" */}
      <div className="tabs">
        <button className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>
          Wszystkie posty
        </button>
        <button className={tab === "following" ? "active" : ""} onClick={() => setTab("following")}>
          Obserwowani
        </button>
      </div>
  
      {/* 🔥 Formularz do dodawania nowego postu */}
      <div className="create-post">
        <input
          type="text"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Co masz na myśli?"
        />
        <button onClick={handleCreatePost} disabled={loading}>Dodaj post</button>
      </div>
  
      {/* 🔥 Wyświetlanie postów */}
      {loading ? (
        <p>Ładowanie...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : displayedPosts.length === 0 ? (
        <p>Brak postów.</p>
      ) : (
        displayedPosts.map((post, index) => (
          <Post key={`${post._id}-${index}`} post={post} />
      )))}
    </div>
  );
  
};

export default Dashboard;
