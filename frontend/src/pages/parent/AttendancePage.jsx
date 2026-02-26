import { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { CheckCircle, Clock, XCircle, AlertCircle, Loader2, Calendar } from "lucide-react";

const ParentAttendance = () => {
  const { user } = useContext(AuthContext);

  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔹 State for Monthly Filter (Default to current month)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // e.g., "2026-02"

  // 1. Fetch children (Your working logic)
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const { data } = await api.get("/parent/children");
        setChildren(data);
        if (data.length > 0) setSelectedChild(data[0]);
      } catch (err) {
        console.error("Error fetching children", err);
      }
    };
    fetchChildren();
  }, []);

  // 2. Fetch attendance based on Child and Month
  useEffect(() => {
    if (!selectedChild) return;

    const fetchAttendance = async () => {
      try {
        setLoading(true);
        // We filter the records on the frontend in this example for performance, 
        // but you can also send selectedMonth to the backend if preferred.
        const { data } = await api.get(`/attendance/parent/${selectedChild._id}`);
        setAttendance(data);
      } catch (err) {
        console.error("Error fetching attendance", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedChild]);

  // 3. Filter Attendance by Month
  const filteredAttendance = attendance.filter(record => 
    record.date && record.date.startsWith(selectedMonth)
  );

  // 4. Calculate Stats for the Selected Month
  const stats = {
    present: filteredAttendance.filter(r => r.status === 'PRESENT').length,
    absent: filteredAttendance.filter(r => r.status === 'ABSENT').length,
    late: filteredAttendance.filter(r => r.status === 'LATE').length,
    excused: filteredAttendance.filter(r => r.status === 'EXCUSED').length,
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Attendance Analysis</h2>
            <p className="text-gray-500 text-sm">Detailed tracking for {selectedChild?.name}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Child Selector */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Student</span>
              <select
                value={selectedChild?._id}
                onChange={(e) => setSelectedChild(children.find(c => c._id === e.target.value))}
                className="border rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
              >
                {children.map(child => <option key={child._id} value={child._id}>{child.name}</option>)}
              </select>
            </div>

            {/* Monthly Filter */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Month</span>
              <input 
                type="month" 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" /></div>
        ) : (
          <>
            {/* Monthly Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatBox label="Present" count={stats.present} color="text-green-600" bg="bg-green-50" icon={<CheckCircle size={16}/>} />
              <StatBox label="Absent" count={stats.absent} color="text-red-600" bg="bg-red-50" icon={<XCircle size={16}/>} />
              <StatBox label="Late" count={stats.late} color="text-yellow-600" bg="bg-yellow-50" icon={<Clock size={16}/>} />
              <StatBox label="Excused" count={stats.excused} color="text-blue-600" bg="bg-blue-50" icon={<AlertCircle size={16}/>} />
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-700 text-sm">Records for {new Date(selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <span className="text-xs text-gray-400 font-medium">{filteredAttendance.length} Total Sessions</span>
              </div>
              <div className="divide-y">
                {filteredAttendance.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">
                    <Calendar className="mx-auto mb-2 opacity-20" size={40} />
                    <p>No attendance records found for this month.</p>
                  </div>
                ) : (
                  filteredAttendance.map((record) => (
                    <AttendanceRow key={record.id} record={record} />
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

// --- Helper Components ---

const StatBox = ({ label, count, color, bg, icon }) => (
  <div className={`${bg} p-5 rounded-2xl border border-white/50 shadow-sm flex flex-col`}>
    <div className={`flex items-center gap-2 ${color} mb-1`}>
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className={`text-2xl font-black ${color}`}>{count}</span>
  </div>
);

const AttendanceRow = ({ record }) => {
  const statusStyles = {
    PRESENT: "bg-green-50 text-green-700 border-green-200",
    ABSENT: "bg-red-50 text-red-700 border-red-200",
    LATE: "bg-yellow-50 text-yellow-700 border-yellow-200",
    EXCUSED: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="text-center min-w-[45px]">
          <p className="text-xs font-bold text-gray-400 uppercase">
            {new Date(record.date).toLocaleString('default', { weekday: 'short' })}
          </p>
          <p className="text-lg font-black text-gray-800 leading-none">
            {new Date(record.date).getDate()}
          </p>
        </div>
        <div className="h-8 w-[1px] bg-gray-100"></div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
            {record.type} {record.period && `• Period ${record.period}`}
          </p>
          {record.remark ? (
            <p className="text-xs text-gray-600 italic">"{record.remark}"</p>
          ) : (
            <p className="text-xs text-gray-500">Standard Session</p>
          )}
        </div>
      </div>
      <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase ${statusStyles[record.status]}`}>
        {record.status}
      </span>
    </div>
  );
};

export default ParentAttendance;