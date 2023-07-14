/* eslint-disable react/prop-types */
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({ title, summary, photo, createdAt, author, _id }) {
  // Generate random light color
  const randomColor = getRandomLightColor();

  function getRandomLightColor() {
    // Generate random RGB values within the light color range
    const min = 200; // Minimum value for R, G, B
    const max = 255; // Maximum value for R, G, B
    const r = Math.floor(Math.random() * (max - min + 1)) + min;
    const g = Math.floor(Math.random() * (max - min + 1)) + min;
    const b = Math.floor(Math.random() * (max - min + 1)) + min;
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Check if the summary exceeds 15 words
  const summaryWords = summary.split(" ");
  const isLongSummary = summaryWords.length > 15;

  // Trim the summary to 15 words
  const trimmedSummary = summaryWords.slice(0, 15).join(" ");

  return (
    <div className="post" style={{ backgroundColor: randomColor }}>
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={"http://localhost:4000/" + photo} className="post-image" alt="Post" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2 className="post-title">{title}</h2>
        </Link>
        <p className="post-info">
          <span className="author">{author.username}</span> |{" "}
          <span className="upload-time">{formatISO9075(new Date(createdAt))}</span>
        </p>
        <p className="post-description">
          {isLongSummary ? trimmedSummary + "..." : summary}
          {isLongSummary && (
            <Link to={`/post/${_id}`} className="read-more">
              ...{" "}
              <span className="read-more-link">
                Read More
              </span>
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}
