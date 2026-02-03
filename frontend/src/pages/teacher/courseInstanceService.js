import api from "../../api/axios.js";

// Get all course instances assigned to the logged-in teacher
export const fetchMyCourseInstances = async () => {
  const { data } = await api.get("/courses/teacher/course-instances");
  return data;
};

export const fetchMyCourseInstanceById = async (id) => {
  const { data } = await api.get(`/courses/teacher/course-instances/${id}`);
  return data;
};