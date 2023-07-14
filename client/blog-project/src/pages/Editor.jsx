import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
  ],
};

const Editor = ({ value, onChange, className }) => {
  return (
    <ReactQuill
      modules={modules}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
};

export default Editor;
