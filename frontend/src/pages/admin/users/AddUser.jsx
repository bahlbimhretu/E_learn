import { useState, useContext, useEffect } from "react";
import api from "../../../api/axios";
import { AuthContext } from "../../../context/AuthContext";

const AddUser = () => {
  const { token } = useContext(AuthContext);

  const initialState = {
    name: "",
    fatherName: "",
    grandFatherName: "",
    email: "",
    password: "",
    role: "student",

    student: {
      classRoom: "",
      academicYear: "",
    },

    teacher: {
      specialization: "",
      educationLevel: "",
      employmentType: "",
    },

    parent: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  };

  const [formData, setFormData] = useState(initialState);
  const [classRooms, setClassRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // LOAD CLASSROOMS
  // =========================
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get("/classrooms");
        setClassRooms(res.data);
      } catch (err) {
        console.error("Failed to load classrooms");
      }
    };

    fetchClasses();
  }, []);

  // =========================
  // HANDLE COMMON INPUTS
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // =========================
  // HANDLE NESTED INPUTS
  // =========================
  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // =========================
  // SUBMIT FORM
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = { ...formData };

      // Clean payload based on role
      if (payload.role !== "student") {
        delete payload.student;
        delete payload.parent;
      }

      if (payload.role !== "teacher") {
        delete payload.teacher;
      }

      await api.post("/auth/register", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("User created successfully ✅");
      setFormData(initialState);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const { role } = formData;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow border">
      <h2 className="text-2xl font-bold mb-4">Add New User</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* COMMON FIELDS */}
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="input" required />
        <input name="fatherName" placeholder="Father Name" value={formData.fatherName} onChange={handleChange} className="input" required />
        <input name="grandFatherName" placeholder="Grandfather Name" value={formData.grandFatherName} onChange={handleChange} className="input" required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input" required />
        <input name="password" type="password" placeholder="Temporary Password" value={formData.password} onChange={handleChange} className="input" required />

        <select name="role" value={role} onChange={handleChange} className="input">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
          <option value="admin">Admin</option>
        </select>

        {/* STUDENT */}
        {role === "student" && (
          <>
            <h3 className="font-semibold">Student Details</h3>

            {/* CLASS SELECTOR */}
<select
  className="input"
  required
  value={formData.student.classRoom}
  onChange={(e) => {
    const selectedId = e.target.value;
    const selectedClass = classRooms.find(c => c._id === selectedId);

    handleNestedChange("student", "classRoom", selectedId);
    handleNestedChange("student", "academicYear", selectedClass?.academicYear || "");
  }}
>
  <option value="">Select Class</option>
  {classRooms.map((cls) => (
    <option key={cls._id} value={cls._id}>
      Grade {cls.grade} - {cls.section}
    </option>
  ))}
</select>

           <input
  className="input bg-gray-100"
  value={formData.student.academicYear}
  placeholder="Academic Year"
  readOnly
/>

            <hr />

            <h3 className="font-semibold">Parent Details</h3>

            <input placeholder="Parent Full Name" className="input" required
              value={formData.parent.name}
              onChange={(e) => handleNestedChange("parent", "name", e.target.value)}
            />

            <input placeholder="Parent Email" type="email" className="input" required
              value={formData.parent.email}
              onChange={(e) => handleNestedChange("parent", "email", e.target.value)}
            />

            <input placeholder="Parent Phone" className="input" required
              value={formData.parent.phone}
              onChange={(e) => handleNestedChange("parent", "phone", e.target.value)}
            />

            <input placeholder="Parent Temporary Password" type="password" className="input" required
              value={formData.parent.password}
              onChange={(e) => handleNestedChange("parent", "password", e.target.value)}
            />
          </>
        )}

        {/* TEACHER */}
        {role === "teacher" && (
          <>
            <h3 className="font-semibold">Teacher Details</h3>

            <input placeholder="Specialization" className="input"
              value={formData.teacher.specialization}
              onChange={(e) => handleNestedChange("teacher", "specialization", e.target.value)}
            />

            <input placeholder="Education Level" className="input"
              value={formData.teacher.educationLevel}
              onChange={(e) => handleNestedChange("teacher", "educationLevel", e.target.value)}
            />

            <select className="input"
              value={formData.teacher.employmentType}
              onChange={(e) => handleNestedChange("teacher", "employmentType", e.target.value)}
            >
              <option value="">Employment Type</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
            </select>
          </>
        )}

        {/* PARENT ONLY */}
        {role === "parent" && (
          <>
            <h3 className="font-semibold">Parent Details</h3>
            <input placeholder="Phone" className="input"
              value={formData.parent.phone}
              onChange={(e) => handleNestedChange("parent", "phone", e.target.value)}
            />
          </>
        )}

        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg">
          {loading ? "Creating..." : "Create User"}
        </button>

      </form>
    </div>
  );
};

export default AddUser;