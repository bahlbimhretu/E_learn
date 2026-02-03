import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";
import { Search, Eye } from "lucide-react";

import { useNavigate } from "react-router-dom";



const GRADES = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const SECTIONS = ["A", "B", "C", "D"];

const Students = () => {
  const [students, setStudents] = useState([]);
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!grade) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/admin/students", {
          params: {
            grade,
            section: section || undefined,
            search: search || undefined,
            page,
            limit: 10,
          },
        });

        setStudents(data.students);
        setTotalPages(data.meta.totalPages);
      } catch (err) {
        console.error("FETCH STUDENTS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [grade, section, search, page]);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          className="border px-3 py-2 rounded"
          value={grade}
          onChange={(e) => {
            setGrade(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Select Grade</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={section}
          onChange={(e) => {
            setSection(e.target.value);
            setPage(1);
          }}
          disabled={!grade}
        >
          <option value="">All Sections</option>
          {SECTIONS.map((s) => (
            <option key={s} value={s}>
              Section {s}
            </option>
          ))}
        </select>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search student..."
            className="border pl-8 pr-3 py-2 rounded"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            disabled={!grade}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Grade</th>
              <th className="p-3 text-left">Section</th>
              <th className="p-3 text-left">Guardian</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && students.length === 0 && grade && (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No students found
                </td>
              </tr>
            )}

            {students.map((student) => (
              <tr key={student._id} className="border-t">
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.studentProfile.grade}</td>
                <td className="p-3">{student.studentProfile.section}</td>
                <td className="p-3">
                  {student.studentProfile.guardian?.name || "—"}
                </td>
                <td className="p-3 capitalize">{student.status}</td>
                <td className="p-3">
                 <button
  onClick={() => navigate(`/admin/students/${student._id}`)}
  className="text-blue-600 hover:underline flex items-center gap-1"
>
  <Eye size={16} />
  View
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Drawer */}
      {selectedStudent && (
  <StudentDetailsDrawer
    studentId={selectedStudent._id}
    onClose={() => setSelectedStudent(null)}
  />
)}

    </>
  );
};

export default Students;
