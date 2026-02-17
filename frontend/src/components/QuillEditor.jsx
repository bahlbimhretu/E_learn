import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        const html = editorRef.current.querySelector(".ql-editor").innerHTML;
        onChange(html);
      });
    }
  }, [onChange]);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value]);

  return <div ref={editorRef} style={{ minHeight: "200px" }} />;
};

export default QuillEditor;
