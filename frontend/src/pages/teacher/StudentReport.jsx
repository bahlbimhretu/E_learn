import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../layout/Layout";
import api from "../../api/axios";

const StudentReport = () => {
  const { studentId } = useParams();
  const [report, setReport] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    const res = await api.get(`/homeroom/student/${studentId}/report`);
    setReport(res.data);

    // compute totals and averages
    const subjects = res.data.subjects || [];
    const semester1Total = subjects.reduce((sum, s) => sum + (s.semester1 || 0), 0);
    const semester2Total = subjects.reduce((sum, s) => sum + (s.semester2 || 0), 0);
    const finalYearTotal = subjects.reduce((sum, s) => sum + (s.finalAverage || 0), 0);

    const semester1Average = subjects.length ? semester1Total / subjects.length : 0;
    const semester2Average = subjects.length ? semester2Total / subjects.length : 0;
    const finalYearAverage = subjects.length ? finalYearTotal / subjects.length : 0;

    setData({
      totals: {
        semester1Total,
        semester2Total,
        finalYearTotal,
        semester1Average,
        semester2Average,
        finalYearAverage,
      },
    });
  };

  if (!report) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-bold">{report.student.name}</h2>
          <p className="text-gray-500">
            Grade {report.student.grade} {report.student.section}
          </p>
        </div>

        {/* OVERALL AVERAGE */}
        <div className="bg-blue-50 border p-5 rounded-xl">
          <p className="text-sm text-gray-600">Overall Average</p>
          <p className="text-3xl font-bold">{report.overallAverage}%</p>
        </div>

        {/* SUBJECT TABLE */}
        <div className="bg-white rounded-xl shadow border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Sem 1</th>
                <th className="p-3 text-left">Sem 2</th>
                <th className="p-3 text-left">Final</th>
              </tr>
            </thead>

            <tbody>
              {report.subjects.map((s, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{s.subject}</td>
                  <td className="p-3">{s.semester1}</td>
                  <td className="p-3">{s.semester2}</td>
                  <td className="p-3 font-semibold">{s.finalAverage}%</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td>Total</td>
                <td>{data?.totals?.semester1Total ?? 0}</td>
                <td>{data?.totals?.semester2Total ?? 0}</td>
                <td>{data?.totals?.finalYearTotal?.toFixed(1) ?? "0.0"}%</td>
              </tr>
              <tr className="bg-blue-50 font-bold">
                <td>Average</td>
                <td>{data?.totals?.semester1Average?.toFixed(1) ?? "0.0"}%</td>
                <td>{data?.totals?.semester2Average?.toFixed(1) ?? "0.0"}%</td>
                <td>{data?.totals?.finalYearAverage?.toFixed(1) ?? "0.0"}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default StudentReport;
