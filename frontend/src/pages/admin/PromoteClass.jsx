import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";

const PromoteClass = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [failedStudents, setFailedStudents] = useState([]);

  const [formData, setFormData] = useState({
    newAcademicYear: "",
    newGrade: "",
    newSection: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Fetch active classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await api.get("/admin/classrooms");
        // Only show active classes for promotion
        setClasses(data.filter((cls) => cls.status === "active"));
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  // 🔹 Fetch students with averages when class selected
  const handleClassSelect = async (classId) => {
    setSelectedClass(classId);
    setFailedStudents([]);

    if (!classId) {
      setStudents([]);
      return;
    }

    try {
      setLoading(true);
      // Calling the updated controller that calculates averages
      const { data } = await api.get(`/admin/classrooms/${classId}/students-with-averages`);
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      // Fallback if the new route isn't set up yet
      alert("Ensure you have added the students-with-averages route to your backend.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFailStudent = (studentId) => {
    setFailedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handlePromote = async () => {
    if (!selectedClass) return alert("Select class first");
    if (!formData.newAcademicYear || !formData.newGrade) {
      return alert("Please fill in the new academic year and grade.");
    }

    try {
      setLoading(true);
      await api.post("/admin/promote-class", {
        oldClassId: selectedClass,
        newAcademicYear: formData.newAcademicYear,
        newGrade: formData.newGrade,
        newSection: formData.newSection,
        failedStudentIds: failedStudents,
      });

      alert("Promotion successful!");
      // Reset state
      setSelectedClass("");
      setStudents([]);
      setFailedStudents([]);
      setFormData({ newAcademicYear: "", newGrade: "", newSection: "" });
      
      // Refresh class list to remove the archived one
      const { data } = await api.get("/admin/classrooms");
      setClasses(data.filter((cls) => cls.status === "active"));
    } catch (error) {
      alert(error.response?.data?.message || "Promotion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          Promote Class
        </h2>

        {/* 🔹 Select Class */}
        <div className="mb-6 bg-white p-4 rounded shadow-sm border">
          <label className="block font-semibold text-gray-700 mb-2">Select Active Class</label>
          <select
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedClass}
            onChange={(e) => handleClassSelect(e.target.value)}
          >
            <option value="">-- Select Class to Promote --</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.grade} - {cls.section} ({cls.academicYear})
              </option>
            ))}
          </select>
        </div>

        {selectedClass && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 🔹 New Academic Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded border border-blue-100">
              <div>
                <label className="text-xs font-bold text-blue-700 uppercase">New Academic Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2025-2026"
                  className="w-full border p-2 rounded mt-1"
                  value={formData.newAcademicYear}
                  onChange={(e) => setFormData({ ...formData, newAcademicYear: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-blue-700 uppercase">New Grade</label>
                <input
                  type="text"
                  placeholder="e.g. Grade 10"
                  className="w-full border p-2 rounded mt-1"
                  value={formData.newGrade}
                  onChange={(e) => setFormData({ ...formData, newGrade: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-blue-700 uppercase">New Section</label>
                <input
                  type="text"
                  placeholder="e.g. A"
                  className="w-full border p-2 rounded mt-1"
                  value={formData.newSection}
                  onChange={(e) => setFormData({ ...formData, newSection: e.target.value })}
                />
              </div>
            </div>

            {/* 🔹 Students List with Averages */}
            <div className="bg-white border rounded shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-700">Student Performance & Promotion</h3>
                <span className="text-xs text-gray-500">Check "Repeat" to keep student in current grade</span>
              </div>

              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-gray-600 text-xs uppercase sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3 text-center">Yearly Average</th>
                      <th className="px-4 py-3 text-right">Repeat?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="3" className="p-10 text-center text-gray-400">Loading student data...</td></tr>
                    ) : students.length === 0 ? (
                      <tr><td colSpan="3" className="p-10 text-center text-gray-400">No students found in this class.</td></tr>
                    ) : (
                      students.map((student) => {
                        const isFailing = parseFloat(student.finalAverage) < 50;
                        return (
                          <tr key={student._id} className={`border-b last:border-0 hover:bg-gray-50 ${isFailing ? 'bg-red-50' : ''}`}>
                            <td className="px-4 py-3 font-medium">{student.name}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`font-bold px-2 py-1 rounded text-sm ${isFailing ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'}`}>
                                {student.finalAverage}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <input
                                type="checkbox"
                                className="w-5 h-5 accent-red-600 cursor-pointer"
                                checked={failedStudents.includes(student._id)}
                                onChange={() => toggleFailStudent(student._id)}
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handlePromote}
                disabled={loading || students.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-3 rounded shadow-lg disabled:opacity-50 transition-all"
              >
                {loading ? "Processing Promotion..." : "Finalize Promotion"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PromoteClass;