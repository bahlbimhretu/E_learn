import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";

const AdminStudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchStudent = async () => {
      try {
        const { data } = await api.get(`/admin/students/${id}`);
        setStudent(data);
      } catch (err) {
        console.error("FETCH STUDENT ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) return <AdminLayout>Loading...</AdminLayout>;
  if (!student) return <AdminLayout>Student not found</AdminLayout>;
  const handleStatusChange = async (e) => {
  const newStatus = e.target.value;

  try {
    // optimistic UI update
    setStudent((prev) => ({
      ...prev,
      status: newStatus,
    }));

    await api.patch(`/admin/students/${student._id}/status`, {
      status: newStatus,
    });
  } catch (err) {
    console.error("STATUS UPDATE ERROR", err);

    // rollback if API fails
    setStudent((prev) => ({
      ...prev,
      status: student.status,
    }));
  }
};

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <p className="text-gray-500">
            {student.status} • {student.studentProfile.grade}-{student.studentProfile.section}
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="border px-4 py-2 rounded"
        >
          ← Back
        </button>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Student Information">
            <Info label="Student ID" value={student._id} />
            <Info label="Status" value={student.status} />
            <Info label="Email" value={student.email || "—"} />
          </Section>

          <Section title="Academic Information">
            <Info label="Grade" value={student.studentProfile.grade} />
            <Info label="Section" value={student.studentProfile.section} />
          </Section>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <Section title="Guardian">
            <Info
              label="Name"
              value={student.studentProfile.guardian?.name || "Not assigned"}
            />
            <Info
              label="Phone"
              value={student.studentProfile.guardian?.parentProfile?.phone || "—"}
            />
           

          </Section>

          <Section title="Actions">
  <div className="space-y-2">
    <label className="text-sm text-gray-500">Change Status</label>
    <select
      value={student.status}
      onChange={handleStatusChange}
      className="border px-3 py-2 rounded w-full"
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="graduated">Graduated</option>
      <option value="suspended">Suspended</option>
    </select>
  </div>

  <button className="w-full border py-2 rounded mt-3">
    Promote / Transfer
  </button>

  <button className="w-full border py-2 rounded text-red-600">
    Suspend Student
  </button>
</Section>

        </div>
      </div>
    </AdminLayout>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white rounded shadow p-4">
    <h3 className="font-semibold mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default AdminStudentDetails;
