import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../layout/AdminLayout";
import api from "../../../api/axios";
import InstanceHeader from "./components/InstanceHeader";
import StudentList from "./components/StudentList";
import CourseSwitcher from "../CourseSwitcher";

const CourseInstanceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstance();
  }, [id]);

  const fetchInstance = async () => {
    try {
      const { data } = await api.get(`/admin/course-instances/${id}`);
      setInstance(data);
    } catch (err) {
      console.error("FETCH INSTANCE ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading course instance...</div>
      </AdminLayout>
    );
  }

  if (!instance) {
    return (
      <AdminLayout>
        <div>Course instance not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
       <div className="flex justify-between items-center mb-6">
  <h1 className="text-xl font-semibold">Course Instance Details</h1>
   <CourseSwitcher />
</div>
     
      <div className="space-y-6">
        <InstanceHeader instance={instance} onBack={() => navigate(-1)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold mb-4">Course Information</h3>

              <Info label="Course" value={instance.courseTemplate?.name} />
              <Info label="Grade" value={instance.grade} />
              <Info label="Section" value={instance.section} />
              <Info label="Academic Year" value={instance.academicYear} />
              <Info
                label="Teacher"
                value={instance.teacher?.name || "Not assigned"}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <StudentList students={instance.students || []} />
          </div>
         

        </div>
      </div>
    </AdminLayout>
  );
};

const Info = ({ label, value }) => (
  <div className="flex justify-between text-sm py-1">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default CourseInstanceDetail;
