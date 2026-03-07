import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import { Loader2, Calendar, Award, BookOpen, GraduationCap } from "lucide-react";

const StudentResultPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await api.get("/student/results/years");

        if (res.data?.length) {
          setAvailableYears(res.data);
          setSelectedYear(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching academic years:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, []);

  useEffect(() => {
    if (!selectedYear) return;

    const fetchResults = async () => {
      setLoading(true);

      try {
        const res = await api.get(`/student/results?academicYear=${selectedYear}`);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedYear]);

  // 🔹 Semester totals
  const sem1Total =
    data?.subjects?.reduce((sum, s) => sum + (s.semester1Total || 0), 0) || 0;

  const sem2Total =
    data?.subjects?.reduce((sum, s) => sum + (s.semester2Total || 0), 0) || 0;

  // 🔹 Year Total rule you requested
  const yearTotal = (sem1Total + sem2Total) / 2;

  return (
    <Layout>
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 flex justify-between items-center">

          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Academic Transcript
              </h2>
              <p className="text-gray-500 text-sm">
                View and track your semester performance
              </p>
            </div>
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">

            <Calendar className="w-5 h-5 text-gray-400" />

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent font-bold text-blue-700 cursor-pointer"
            >
              {availableYears.map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>

          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
          </div>
        ) : !data?.subjects?.length ? (

          <div className="bg-white shadow rounded-xl p-16 text-center">
            <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              No results found for <strong>{selectedYear}</strong>
            </p>
          </div>

        ) : (
          <>
            {/* STUDENT INFO */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6">
              <div className="flex justify-between">

                <div>
                  <p className="text-xs uppercase text-blue-200">
                    Student Name
                  </p>
                  <h2 className="text-2xl font-bold uppercase">
                    {data?.student?.name}
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-xs uppercase text-blue-200">
                    Grade
                  </p>
                  <p className="text-xl font-semibold">
                    {data?.student?.grade} | Section {data?.student?.section}
                  </p>
                </div>

              </div>
            </div>

            {/* SUBJECT TABLE */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden border">

              <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold text-gray-700">
                  Detailed Subject Scores
                </h3>
              </div>

              <div className="overflow-x-auto">

                <table className="min-w-full divide-y divide-gray-200">

                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">
                        Code
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">
                        Sem 1
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">
                        Sem 2
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">

                    {data.subjects.map((sub, i) => (
                      <tr key={i} className="hover:bg-blue-50">

                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {sub.subjectName}
                        </td>

                        <td className="text-center text-gray-500">
                          {sub.subjectCode}
                        </td>

                        <td className="text-center font-medium">
                          {sub.semester1Total}
                        </td>

                        <td className="text-center font-medium">
                          {sub.semester2Total}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                  {/* TOTAL ROWS */}
                  <tfoot className="bg-gray-50 font-bold">

                    <tr>
                      <td colSpan="2" className="px-6 py-3 text-right">
                        Semester Total
                      </td>

                      <td className="text-center">{sem1Total}</td>
                      <td className="text-center">{sem2Total}</td>
                    </tr>

                    <tr>
                      <td colSpan="3" className="px-6 py-3 text-right">
                        Year Total
                      </td>

                      <td className="text-center text-blue-700">
                        {yearTotal.toFixed(2)}
                      </td>
                    </tr>

                  </tfoot>

                </table>

              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default StudentResultPage;