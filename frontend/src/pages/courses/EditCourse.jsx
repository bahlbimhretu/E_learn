import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import { useParams } from "react-router-dom";

const EditCourse = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    const res = await api.get(`/courses/${id}`);
    setTitle(res.data.title);
    setCategory(res.data.category);
    setDescription(res.data.description);
  };

  const submit = async (e) => {
    e.preventDefault();

    await api.put(`/courses/${id}`, { title, category, description });
    window.location.href = "/courses";
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>

      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-96">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-3"
        ></textarea>

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Update Course
        </button>
      </form>
    </Layout>
  );
};

export default EditCourse;
