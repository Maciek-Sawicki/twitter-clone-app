import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likePost, commentPost } from "../store/slices/postSlice";
import { AppDispatch, RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/avatar.png";
import "../styles/Post.css";

interface PostProps {
  post: {
    _id: string;
    text: string;
    createdAt: string;
    postedBy: {
      _id: string;
      username: string;
      fullName: string;
      profilePicture?: string;
    };
    likes: string[];
    comments: {
      _id: string;
      text: string;
      user?: {
        _id: string;
        username: string;
      };
    }[];
  };
}

const Post = ({ post }: PostProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const isLiked = post.likes.includes(user?._id || "");
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  const handleLikePost = () => {
    dispatch(likePost(post._id));
  };

  const handleCommentChange = (postId: string, text: string) => {
    setCommentText((prev) => ({ ...prev, [postId]: text }));
  };

  const handleCommentPost = async (postId: string) => {
    if (!commentText[postId]?.trim()) { return; }
    try {
      const action = await dispatch(commentPost({ postId, text: commentText[postId] }));
      if (commentPost.fulfilled.match(action)) {
        setCommentText((prev) => {
          return { ...prev, [postId]: "" };
        });
      } else {
        console.error("Error:", action.error);
      }
      } catch (error) {
        console.error("Error:", error);
    }
  };

  const goToUserProfile = (username: string) => {
    if (user?.username === username) {
      navigate("/profile"); 
    } else {
      navigate(`/profile/${username}`); 
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="profile-link" onClick={() => goToUserProfile(post.postedBy.username)}>
          <img src={post.postedBy.profilePicture || defaultAvatar} alt="Avatar" className="avatar" />
          <div className="user-info">
            <h3>{post.postedBy.fullName}</h3>
            <p>@{post.postedBy.username}</p>
          </div>
        </div>
        <p>{new Date(post.createdAt).toLocaleString('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <p className="post-text">{post.text}</p>
      <div className="post-actions">
        <button onClick={handleLikePost} className={`like-btn ${isLiked ? "liked" : ""}`}>
          {isLiked ? "❤️ Liked" : "Like"} 
        </button>
        <button disabled className="comment-btn">
          🤍 {post.likes.length}
        </button>
        <button disabled className="comment-btn">
          💬 {post.comments.length}
        </button>
      </div>
      <div className="comment-section">
        <div className="comment-add">
            <textarea
              value={commentText[post._id] || ""}
              onChange={(e) => handleCommentChange(post._id, e.target.value)}
              placeholder="Add comment..."
              rows={4}
              wrap="hard"
            />
            <div className="comment-add-actions">
              <button onClick={() => handleCommentPost(post._id)}>Comment</button>
            </div>
          </div>
          {post.comments.length > 0 && (
          <div className="comments">
          {post.comments.map((c) => (
            <p className="comment" key={c._id}>
              <strong className="comment-user" onClick={() => goToUserProfile(c.user?.username || "")}>
                @{c.user?.username}
              </strong> 
              {": "}{c.text}
            </p>
          ))}
        </div>
          )}
      </div>
    </div>
  );
};

export default Post;
