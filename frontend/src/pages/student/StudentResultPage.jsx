import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import { Loader2, Calendar, Award, BookOpen, GraduationCap } from "lucide-react";

const StudentResultPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  // 1. Fetch available academic years on mount
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await api.get("/student/results/years");
        if (res.data && res.data.length > 0) {
          setAvailableYears(res.data);
          setSelectedYear(res.data[0]); // Set default to latest year
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching academic years:", error);
        setLoading(false);
      }
    };
    fetchYears();
  }, []);

  // 2. Fetch results whenever the selected year changes
  useEffect(() => {
    if (!selectedYear) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/student/results?academicYear=${selectedYear}`);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedYear]);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* 🔹 Top Navigation & Selection Bar */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Academic Transcript</h2>
              <p className="text-gray-500 text-sm">View and track your semester performance</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <Calendar className="w-5 h-5 text-gray-400 ml-2" />
            <span className="text-sm font-semibold text-gray-600">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent border-none focus:ring-0 font-bold text-blue-700 cursor-pointer pr-8"
            >
              {availableYears.length > 0 ? (
                availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))
              ) : (
                <option value="">No years found</option>
              )}
            </select>
          </div>
        </div>

        {/* 🔹 Main Content Area */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-80 space-y-4">
            <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
            <p className="text-gray-500 animate-pulse">Loading academic records...</p>
          </div>
        ) : !data || data.subjects.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No Results Found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-2">
              We couldn't find any recorded grades for the academic year <strong>{selectedYear}</strong>.
            </p>
          </div>
        ) : (
          <>
            {/* 🔹 Student Profile Summary */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg rounded-xl p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Student Name</p>
                  <h2 className="text-2xl font-bold uppercase tracking-tight">{data.student.name}</h2>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Enrolled Grade</p>
                  <p className="text-xl font-semibold">
                    {data.student.grade} <span className="text-blue-200">|</span> Section {data.student.section}
                  </p>
                </div>
              </div>
            </div>

            {/* 🔹 Subject Performance Table */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold text-gray-700">Detailed Subject Scores</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Sem 1</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Sem 2</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider text-blue-600">Year Total</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Average</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.subjects.map((sub, index) => (
                      <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{sub.subjectName}</td>
                        <td className="px-6 py-4 text-center text-gray-500 text-sm">{sub.subjectCode}</td>
                        <td className="px-6 py-4 text-center font-medium">{sub.semester1Total}</td>
                        <td className="px-6 py-4 text-center font-medium">{sub.semester2Total}</td>
                        <td className="px-6 py-4 text-center font-bold text-blue-700">{sub.yearTotal}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            sub.yearAverage >= 50 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {sub.yearAverage.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 🔹 Analytics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-xs font-bold uppercase mb-2">Subjects Tracked</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-gray-800">{data.summary.totalSubjects}</span>
                  <span className="text-gray-400 mb-1 text-sm font-medium">Courses</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-xs font-bold uppercase mb-2">Cumulative Points</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-blue-600">{data.summary.grandTotal}</span>
                  <span className="text-gray-400 mb-1 text-sm font-medium">Total Marks</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-b-green-500 border border-gray-100">
                <p className="text-gray-400 text-xs font-bold uppercase mb-2">Final Average</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-green-600">{data.summary.overallAverage.toFixed(2)}%</span>
                  <div className="w-12 h-2 bg-gray-100 rounded-full mb-2 overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${data.summary.overallAverage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default StudentResultPage;