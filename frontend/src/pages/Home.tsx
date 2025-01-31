import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginSvg from "../assets/Login.svg";
import "../styles/Home.css";

const Home = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="home-container">
      <h1>Wellcome in the best social media app!</h1>
      <img src={LoginSvg} alt="Welcome" className="home-image" />
      {!user && (
        <div className="button-group">
          <button onClick={() => navigate("/login")}>Log in</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      )}
    </div>
  );
};

export default Home;

//     return (
//         <div>
//           <h1>Strona główna</h1>
//           {safePosts.length === 0 ? <p>Brak postów</p> : safePosts.map((post) => (
//             <div key={post._id} className="card">
//               <h3>@{post.postedBy.username}</h3>
//               <p>{post.text}</p>
//               <p>❤️ {post.likes.length}</p>
//               <p>💬 {post.comments.length} komentarzy</p>
//             </div>
//           ))}
//         </div>
//       );
//     };