import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import LibraryDashboard from "../pages/library/LibraryDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import CoursesList from "../pages/courses/CoursesList";
import AddCourse from "../pages/courses/AddCourse";
import EditCourse from "../pages/courses/EditCourse";
import LessonsList from "../pages/lessons/LessonsList";
import AddLesson from "../pages/lessons/AddLesson";
import UploadMaterial from "../pages/materials/UploadMaterial";
import CourseDetails from "../pages/courses/CourseDetails";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import UserManagement from "../pages/admin/UserManagement";
import RegisterUser from "../pages/admin/users/AddUser";
import AdminRoute from "../routes/AdminRoute";
import AdminLayout from "../layout/AdminLayout";
import Students from "../pages/admin/Students";
import Teachers from "../pages/admin/Teachers";
import AdminStudentDetails from "../pages/admin/AdminStudentDetails";
import AdminCourses from "../pages/admin/courses/AdminCourses";
//import AdminCourses from "../pages/admin/AdminCourses";
import CourseTemplateForm from "../pages/admin/courses/CourseTemplateForm";
import CourseInstanceList from "../pages/admin/courseInstances/CourseInstanceList";
import CourseInstanceForm from "../pages/admin/courseInstances/CourseInstanceForm";
import CourseInstanceDetail from "../pages/admin/courseInstances/CourseInstanceDetail";
import AdminAnnouncements from "../pages/admin/announcement/Announcement.jsx";
import AdminAnnouncementDetails from "../pages/admin/announcement/AdminAnnouncementDetails.jsx";
import ClassManager from "../pages/admin/ClassManager.jsx";
import CourseInstanceDetails from "../pages/teacher/CourseInstanceDetails.jsx";
import MyCourseInstances from "../pages/teacher/MyCourseInstances.jsx";
import MyCourses from "../pages/student/MyCourses.jsx";
import StudentCourseDetails from "../pages/student/StudentCourseDetails.jsx";
import StudentAnnouncements from "../pages/student/StudentAnnouncements.jsx";
import NewQuestion from "../pages/lessons/NewQuestion.jsx";
import StudentExerciseQuiz from "../pages/student/StudentQuiz.jsx";
import MarksPage from "../pages/teacher/MarksPage.jsx";
 import TeacherAnnouncements from "../pages/teacher/TeacherAnnouncements.jsx";
 import ParentDashboard from "../pages/dashboard/parentDashboard.jsx";
  import ParentResults from "../pages/parent/ParentResults.jsx";
import ParentAnnouncements from "../pages/materials/ParentAnnouncements.jsx";
import TeacherCreateAssignment from "../pages/teacher/TeacherCreateAssignment.jsx";
import TeacherSubmissionsPage from "../pages/teacher/TeacherSubmissionsPage.jsx";
import HomeroomAttendance from "../pages/teacher/HomeroomAttendance.jsx";
import MonthlyAttendanceReport from "../pages/teacher/MonthlyAttendanceReport.jsx";
import HomeroomMessages from "../pages/teacher/HomeroomMessages.jsx";
import ParentInbox from "../pages/parent/ParentInbox.jsx";
import HomeroomPerformance from "../pages/teacher/HomeroomPerformance.jsx";
import StudentReport from "../pages/teacher/StudentReport.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
       <Route path="/admin/users" element={<UserManagement />} />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student", "teacher", "admin", "library-admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/parent"
  element={
    <ProtectedRoute allowedRoles={["parent"]}>
      <ParentDashboard />
    </ProtectedRoute>
  }
/>
<Route path="/parent/results" 
element={
  <ProtectedRoute allowedRoles={["parent"]}>
<ParentResults />
</ProtectedRoute>
} />
<Route path="/parent/announcements" 
element={
  <ProtectedRoute allowedRoles={["parent"]}>
<ParentAnnouncements />
</ProtectedRoute>}
 />
 import ParentInbox from "../pages/parent/ParentInbox";

<Route
  path="/parent/inbox"
  element={
  <ProtectedRoute allowedRoles={["parent"]}>
  <ParentInbox />
  </ProtectedRoute>
  }
/>

<Route
  path="/teacher/courses/:courseId/lessons/:lessonId/assignments/create"
  element=
  {
   <ProtectedRoute allowedRoles={["teacher"]}>
  <TeacherCreateAssignment />
</ProtectedRoute>
  }
/>
<Route
  path="/teacher/homeroom/attendance/:classId"
  element={
    <ProtectedRoute allowedRoles={["teacher"]}>
      <HomeroomAttendance />
    </ProtectedRoute>
  }
/>
<Route
  path="/teacher/homeroom/performance"
  element={
  <ProtectedRoute allowedRoles={["teacher"]}>
  <HomeroomPerformance />
  </ProtectedRoute>
  }
/>

<Route
  path="/homeroom/attendance/report/:classId"
  element={
  <ProtectedRoute allowedRoles={["teacher"]}>
  <MonthlyAttendanceReport />
  </ProtectedRoute>
  }
/>
<Route
  path="/teacher/homeroom/messages/:classId"
  element={
  <ProtectedRoute allowedRoles={["teacher"]}>
  <HomeroomMessages />
  </ProtectedRoute>
  }
/>
<Route
  path="/teacher/homeroom/student/:studentId"
  element={
  <ProtectedRoute allowedRoles={["teacher"]}>
  <StudentReport />
  </ProtectedRoute>
  }
/>
// Inside your Routes in App.jsx
<Route 
  path="/teacher/assignments/:assignmentId/submissions" 
  element={
  <ProtectedRoute allowedRoles={["teacher"]}>
  <TeacherSubmissionsPage />
</ProtectedRoute>
} />

<Route
  path="/admin/register"
  element={
    <AdminRoute>
      <AdminLayout>
        <RegisterUser />
      </AdminLayout>
    </AdminRoute>
  }
/>
        <Route
  path="/admin/students/:id"
  element={<AdminStudentDetails />}
/>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
       

<Route 
path="/admin/classes" 
element={
  <ProtectedRoute allowedRoles={["admin"]}>
<ClassManager />
  </ProtectedRoute>}
 />
      <Route
  path="/student/exercise-quiz/:quizId"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentExerciseQuiz />
    </ProtectedRoute>
  }
/>


        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher", "admin"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/library"
          element={
            <ProtectedRoute allowedRoles={["library-admin", "admin"]}>
              <LibraryDashboard />
            </ProtectedRoute>
          }
        />
       <Route
  path="/admin/course-templates/new"
  element={
    <AdminRoute>
      <CourseTemplateForm />
    </AdminRoute>
  }
/>
<Route
  path="/admin/course-templates/:id"
  element={
    <AdminRoute>
      <CourseTemplateForm />
    </AdminRoute>
  }
/>




        <Route
  path="/admin/courses"
  element={
    <AdminRoute>
        <AdminCourses />
    </AdminRoute>
  }
/>

      <Route path="/courses" element={
  <ProtectedRoute allowedRoles={["admin", "teacher"]}>
    <CoursesList />
  </ProtectedRoute>
} />

<Route path="/courses/new" element={
  <ProtectedRoute allowedRoles={["admin", "teacher"]}>
    <AddCourse />
  </ProtectedRoute>
} />
<Route path="register" element={<RegisterUser />} />
<Route path="/courses/edit/:id" element={
  <ProtectedRoute allowedRoles={["admin", "teacher"]}>
    <EditCourse />
  </ProtectedRoute>
} />
<Route
  path="/teacher/courses/:courseId/lessons"
  element={
    <ProtectedRoute allowedRoles={["teacher", "admin"]}>
      <LessonsList />
    </ProtectedRoute>
  }
/>
<Route
  path="/teacher/quizzes/:quizId/questions/new"
  element={
    <ProtectedRoute allowedRoles={["teacher", "admin"]}>
      <NewQuestion />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/users/students"
  element={
    <AdminRoute>
      <AdminLayout>
        <Students />
      </AdminLayout>
    </AdminRoute>
  }
/>

    <Route
  path="/teacher/courses/:courseId/lessons/:lessonId/materials/upload"
  element={
    <ProtectedRoute allowedRoles={["teacher", "admin"]}>
      <UploadMaterial />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/announcements"
  element={
    <ProtectedRoute allowedRoles={["student", "teacher", "parent"]}>
      <StudentAnnouncements />
    </ProtectedRoute>
  }
/>
<Route
  path="/teacher/announcements"
  element={
    <ProtectedRoute roles={["teacher", "admin"]}>
      <TeacherAnnouncements />
    </ProtectedRoute>
  }
/>


    <Route
  path="/teacher/courses/:courseId/lessons/new"
  element={
    <ProtectedRoute allowedRoles={["teacher", "admin"]}>
      <AddLesson />
    </ProtectedRoute>
  }
/>

    <Route
  path="/courses/:id"
  element={
    <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
      <CourseDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/teacher/course/:courseId/marks"
  element={ <ProtectedRoute allowedRoles={["teacher"]}>
  <MarksPage />
</ProtectedRoute>
  }
/>

// Added routes for course instances
<Route
  path="/admin/course-instances"  
  element={
    <AdminRoute>
      <CourseInstanceList />
    </AdminRoute>
  }
/>



<Route
  path="/admin/course-instances/new"
  element={
    <AdminRoute>
      <CourseInstanceForm />
    </AdminRoute>
  }
/>

<Route
  path="/admin/course-instances/:id"
  element={
    <AdminRoute>
      <CourseInstanceDetail />
    </AdminRoute>
  }
/>

<Route
  path="/admin/course-instances/:id/edit"
  element={
    <AdminRoute>
      <CourseInstanceForm />
    </AdminRoute>
  }
/>
 <Route path="/admin/announcements" element={ <AdminRoute>
          <AdminLayout>
            <AdminAnnouncements />
          </AdminLayout>
        </AdminRoute>
      }
    />

//student course instance routes
<Route path="/my-courses" element={<MyCourses />} />
//<Route path="/my-courses/:id" element={<StudentCourseDetails />} />

// Inside Routes
<Route 
  path="/admin/announcements/:id" 
  element={
    <AdminRoute>
      <AdminLayout>
        <AdminAnnouncementDetails />
      </AdminLayout>
    </AdminRoute>
  } 
/>
<Route path="/teacher/course-instances" element={
  <MyCourseInstances />} />
<Route path="/teacher/course-instances/:id" element={<CourseInstanceDetails />} />

<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
<Route path="/admin/teachers" element={<Teachers />} />


        {/* Fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}


