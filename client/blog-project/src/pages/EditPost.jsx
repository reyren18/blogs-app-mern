import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "./Editor";

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((res) => {
      res.json().then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      });
    });
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (file?.[0]) {
      data.set("file", file?.[0]);
    }
    const response = await fetch(`http://localhost:4000/post/${id}`, {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <form action="" className="create" onSubmit={handleEdit}>
      <input
        type="title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="create-input"
      />
      <input
        type="summary"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="create-input"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files)}
        className="create-input"
      />
      <Editor value={content} onChange={setContent} className="create-editor" />
      <button className="create-button">Update Post</button>
    </form>
  );
};

export default EditPost;
