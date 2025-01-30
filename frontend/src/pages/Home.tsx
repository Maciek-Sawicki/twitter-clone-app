import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../store/slices/postSlice";
import { RootState, AppDispatch } from "../store/store";

const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { posts, loading, error } = useSelector((state: RootState) => state.posts);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const safePosts = Array.isArray(posts) ? posts : [];

    return (
        <div>
          <h1>Strona główna</h1>
          {safePosts.length === 0 ? <p>Brak postów</p> : safePosts.map((post) => (
            <div key={post._id} className="card">
              <h3>@{post.postedBy.username}</h3>
              <p>{post.text}</p>
              <p>❤️ {post.likes.length}</p>
              <p>💬 {post.comments.length} komentarzy</p>
            </div>
          ))}
        </div>
      );
    };

export default Home;