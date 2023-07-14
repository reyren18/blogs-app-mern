import formatISO9075 from "date-fns/fp/formatISO9075";
import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const { id } = useParams();
  const { userInfo } = useContext(UserContext);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [showTick, setShowTick] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const newScrollPercentage = (scrollTop / windowHeight) * 100;
    setScrollPercentage(newScrollPercentage);

    if (newScrollPercentage >= 100) {
      setShowTick(true);
    } else {
      setShowTick(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((res) => {
      res.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, []);

  if (!postInfo) {
    return "No Post Here";
  }

 

  return (
    <div className="single-post">
      <h1 className="post-title">{postInfo.title}</h1>
      <div className="post-details">
        <span className="author">by {postInfo.author.username}</span>
        <time className="upload-time">
          {formatISO9075(new Date(postInfo.createdAt))}
        </time>
      </div>
      <hr className="separator" />
      <div className="image-container">
        <img
          src={`http://localhost:4000/${postInfo.photo}`}
          alt="Post"
          className="post-image"
        />
          {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </Link>
        </div>
      )}
      </div>
      <div className="post-content">
        <div dangerouslySetInnerHTML={{ __html: postInfo.content }}></div>
      </div>
      
        <Link to="/" className="back-to-home">Back to Home</Link>
        <div className="scroll-indicator">
        <div className="scroll-indicator-bar" style={{ width: `${scrollPercentage}%` }} />
        {showTick && <div className="tick-mark" />}
      </div>
      </div>

  );
};

export default PostPage;
