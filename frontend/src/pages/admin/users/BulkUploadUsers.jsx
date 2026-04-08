import { useState, useContext } from "react";
import Papa from "papaparse";
import api from "../../../api/axios";
import { AuthContext } from "../../../context/AuthContext";

const BulkUploadUsers = () => {
  const { token } = useContext(AuthContext);

  const [parsedData, setParsedData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processData(results.data);
      },
    });
  };

  const processData = (data) => {
    const cleaned = [];
    const errs = [];

    data.forEach((row, index) => {
      const user = {
        name: row.name?.trim(),
        fatherName: row.fatherName?.trim(),
        grandFatherName: row.grandFatherName?.trim(),
        email: row.email?.trim(),
        grade: row.grade?.trim(),
        section: row.section?.trim()?.toUpperCase(),
        parentName: row.parentName?.trim(),
        parentEmail: row.parentEmail?.trim(),
        parentPhone: row.parentPhone?.trim(),
      };

      if (!user.name || !user.email) {
        errs.push({ row: index + 1, message: "Missing name or email" });
      }

      if (!user.grade || !user.section) {
        errs.push({ row: index + 1, message: "Missing grade/section" });
      }

      cleaned.push(user);
    });

    setParsedData(cleaned);
    setPreviewData(cleaned);
    setErrors(errs);
  };

  const handleUpload = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await api.post(
        "/auth/bulk-register",
        { users: parsedData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Bulk Upload Students</h3>

      <input type="file" accept=".csv" onChange={handleFileChange} />

      {/* ERRORS */}
      {errors.length > 0 && (
        <div className="bg-red-50 p-3 mt-4 rounded">
          <h4 className="text-red-600 font-semibold">Errors</h4>
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-red-500">
              Row {e.row}: {e.message}
            </p>
          ))}
        </div>
      )}

      {/* PREVIEW */}
      {previewData.length > 0 && (
        <div className="mt-4 border rounded max-h-96 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Grade</th>
                <th>Section</th>
                <th>Parent</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((u, i) => (
                <tr key={i} className="border-t">
                  <td>{i + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.grade}</td>
                  <td>{u.section}</td>
                  <td>{u.parentName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleUpload}
        disabled={loading || errors.length > 0}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload Users"}
      </button>

      {/* RESULT */}
      {result && (
        <div className="mt-4 bg-green-50 p-3 rounded">
          <p>✅ Success: {result.successCount}</p>
          <p>❌ Failed: {result.failedCount}</p>

          {result.errors.map((e, i) => (
            <p key={i} className="text-red-500 text-sm">
              Row {e.row}: {e.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default BulkUploadUsers;