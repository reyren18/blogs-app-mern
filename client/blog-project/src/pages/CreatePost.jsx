import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "./Editor";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [file, setFile] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", file[0]);

    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  };

  if (redirect === true) {
    return <Navigate to={"/"} />;
  }

  return (
    <form action="" className="create" onSubmit={handleCreate}>
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
      <button className="create-button">Create Post</button>
    </form>
  );
};

export default CreatePost;
