// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { likePost, commentPost, fetchAllPosts } from "../store/slices/postSlice";
// import { AppDispatch, RootState } from "../store/store";

// interface PostProps {
//   post: {
//     _id: string;
//     text: string;
//     postedBy: {
//       _id: string;
//       username: string;
//       profilePicture?: string;
//     };
//     likes: string[];
//     comments: {
//       _id: string;
//       text: string;
//       user?: {
//         _id: string;
//         username: string;
//       };
//     }[];
//   };
// }

// const Post = ({ post }: PostProps) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { user } = useSelector((state: RootState) => state.auth);

//   // 🔥 **Obsługa polubień**
//   const handleLikePost = () => {
//     dispatch(likePost(post._id));
//   };

//   const isLiked = post.likes.includes(user?._id || "");

//   // 🔥 **Obsługa komentarzy - niezależne inputy dla każdego posta**
//   const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

//   const handleCommentChange = (postId: string, text: string) => {
//     setCommentText((prev) => ({ ...prev, [postId]: text }));
//   };
  
//   const handleCommentPost = async (postId: string) => {
//     if (!commentText[postId]?.trim()) return; // ✅ Pobieramy tekst z inputa
  
//     await dispatch(commentPost({ postId, text: commentText[postId] }));
//     dispatch(fetchAllPosts()); // 🔥 Po dodaniu komentarza ponownie pobieramy posty!
  
//     setCommentText((prev) => ({ ...prev, [postId]: "" })); // ✅ Czyścimy input tylko dla tego posta
//   };
  
//   console.log("Komentarze dla posta:", post._id, post.comments);

  

//   return (
//     <div className="post-card">
//       {/* 🔥 Wyświetlanie autora postu */}
//       <div className="post-header">
//         <img src={post.postedBy.profilePicture || "/default-avatar.png"} alt="Avatar" className="avatar" />
//         <h3>@{post.postedBy.username}</h3>
//       </div>

//       {/* 🔥 Treść posta */}
//       <p>{post.text}</p>

//       {/* 🔥 Polubienia */}
//       <p>
//         ❤️ {post.likes.length} 
//         <button onClick={handleLikePost} className={isLiked ? "liked" : ""}>
//           {isLiked ? "💔 Unlike" : "❤️ Like"}
//         </button>
//       </p>

//       {/* 🔥 Komentarze */}
//       <div className="comment-section">
//       <input 
//         type="text" 
//         value={commentText[post._id] || ""} 
//         onChange={(e) => handleCommentChange(post._id, e.target.value)} 
//         placeholder="Dodaj komentarz..."
//       />
//       <button onClick={() => handleCommentPost(post._id)}>💬 Skomentuj</button>
//       {post.comments.length > 0 && (
//   <div className="comments">
//     {post.comments.map((comment) => (
//       <p key={comment._id}>
//         <strong>@{comment.user?.username}:</strong> {comment.text} {/* ✅ Teraz wyświetlamy poprawny komentarz */}
//       </p>
//     ))}
//   </div>
// )}


//       </div>
//     </div>
//   );
// };

// export default Post;


import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likePost, commentPost } from "../store/slices/postSlice";
import { AppDispatch, RootState } from "../store/store";
import "../styles/Post.css";

interface PostProps {
  post: {
    _id: string;
    text: string;
    postedBy: {
      _id: string;
      username: string;
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
  const { user } = useSelector((state: RootState) => state.auth);

  // 🔥 Obsługa polubień
  const handleLikePost = () => {
    dispatch(likePost(post._id));
  };

  const isLiked = post.likes.includes(user?._id || "");

  // 🔥 Obsługa komentarzy
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  const handleCommentChange = (postId: string, text: string) => {
    setCommentText((prev) => ({ ...prev, [postId]: text }));
  };

//   const handleCommentPost = async (postId: string) => {
//     if (!commentText[postId]?.trim()) return;
//     await dispatch(commentPost({ postId, text: commentText[postId] }));
//     setCommentText((prev) => ({ ...prev, [postId]: "" }));
//   };

const handleCommentPost = async (postId: string) => {
    console.log("🔥 Rozpoczynamy dodawanie komentarza dla postId:", postId);
    console.log("📌 Aktualny stan `commentText` przed wysłaniem:", commentText);
  
    if (!commentText[postId]?.trim()) {
      console.warn("⚠️ Komentarz jest pusty lub nie istnieje, przerwano wysyłanie.");
      return;
    }
  
    console.log("🚀 Wysyłanie komentarza do Redux:", {
      postId,
      text: commentText[postId]
    });
  
    try {
    //   const action = await dispatch(commentPost({ postId, text: commentText[postId] }));
    //   console.log("✅ Odpowiedź Redux (fulfilled/rejected):", action);

    const action = await dispatch(commentPost({ postId, text: commentText[postId] }));
    console.log("✅ Odpowiedź Redux (fulfilled/rejected):", action);
    console.log("🔍 Czy akcja zakończyła się sukcesem?", commentPost.fulfilled.match(action));

  
      if (commentPost.fulfilled.match(action)) {
        console.log("🎉 Komentarz został dodany do Redux:", action.payload);
  
        setCommentText((prev) => {
          console.log("🔄 Resetowanie pola komentarza dla postId:", postId);
          return { ...prev, [postId]: "" };
        });
  
      } else {
        console.error("❌ Błąd podczas dodawania komentarza:", action.payload);
      }
  
    } catch (error) {
      console.error("🔥 Wystąpił błąd podczas wysyłania komentarza:", error);
    }
  };
  


  return (
    <div className="post">
      <div className="post-header">
        <img src={post.postedBy.profilePicture || "/default-avatar.png"} alt="Avatar" className="avatar" />
        <h3>@{post.postedBy.username}</h3>
      </div>

      <p className="post-text">{post.text}</p>

      <div className="post-actions">
        <button onClick={handleLikePost} className={isLiked ? "liked" : ""}>
          {isLiked ? "💔 Unlike" : "❤️ Like"} {post.likes.length}
        </button>

        <button className="comment-btn">
          💬 {post.comments.length}
        </button>
      </div>

      {/* Komentarze */}
      <div className="comment-section">
      <div className="comment-add">
  <textarea
    value={commentText[post._id] || ""}
    onChange={(e) => handleCommentChange(post._id, e.target.value)}
    placeholder="Dodaj komentarz..."
  />
  <button onClick={() => handleCommentPost(post._id)}>Skomentuj</button>
</div>
        {post.comments.length > 0 && (
          <div className="comments">
            {post.comments.map((c) => (
              <p key={c._id}><strong>@{c.user?.username}:</strong> {c.text}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
