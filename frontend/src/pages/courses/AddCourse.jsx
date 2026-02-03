// src/components/AddCourse.jsx
import { useState } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const AddCourse = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setThumbnail(null);
      setPreviewUrl("");
      return;
    }
    // optional: validate size/type
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file.");
      return;
    }
    setErrorMsg("");
    setThumbnail(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      // IMPORTANT: don't set Content-Type header; axios/browser will set boundary
      const response = await api.post("/courses", formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percent);
          }
        },
        // If your api axios instance sets default headers that break multipart,
        // override them here by deleting Content-Type or setting to undefined:
        headers: {
          // do not set 'Content-Type' here
        },
      });

      // if response ok, redirect
      window.location.href = "/courses";
    } catch (err) {
      console.error("Create error:", err);
      // if axios error, show server response if available
      if (err.response) {
        console.error("Server response:", err.response.data);
        setErrorMsg(err.response.data.message || JSON.stringify(err.response.data));
      } else {
        setErrorMsg(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Add Course</h1>

      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-96">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Course title"
          className="border p-2 w-full mb-3"
          required
        />

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="border p-2 w-full mb-3"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 w-full mb-3"
        ></textarea>

        <label className="block mb-2">Thumbnail (image)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="border p-2 w-full mb-3"
        />

        {previewUrl && (
          <div className="mb-3">
            <img src={previewUrl} alt="preview" className="w-full h-48 object-cover rounded" />
          </div>
        )}

        {progress > 0 && progress < 100 && (
          <div className="mb-3">Uploading: {progress}%</div>
        )}

        {errorMsg && <div className="text-red-600 mb-3">{errorMsg}</div>}

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${loading ? "opacity-60" : ""}`}
        >
          {loading ? "Uploading..." : "Save Course"}
        </button>
      </form>
    </Layout>
  );
};

export default AddCourse;
