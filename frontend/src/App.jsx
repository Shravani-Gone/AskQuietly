import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import StudentRegister from './pages/StudentRegister'
import TeacherRegister from './pages/TeacherRegister'
import StudentSubjects from './pages/StudentSubjects'
import StudentUnits from './pages/StudentUnits'
import StudentUnit from './pages/StudentUnit'
import StudentProfile from './pages/StudentProfile'
import StudentHelp from './pages/StudentHelp'
import TeacherSubjects from './pages/TeacherSubjects'
import TeacherUnits from './pages/TeacherUnits'
import TeacherUnit from './pages/TeacherUnit'
import TeacherQuestion from './pages/TeacherQuestion'
import TeacherProfile from './pages/TeacherProfile'
import TeacherHelp from './pages/TeacherHelp'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'linear-gradient(160deg,#7C3AED,#a855f7,#EC4899)' }}>
      <div style={{ width:36, height:36, border:'3px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    </div>
  )
  if (!user) return <Navigate to="/" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/student" element={<StudentRegister />} />
      <Route path="/register/teacher" element={<TeacherRegister />} />

      <Route path="/student" element={<ProtectedRoute role="student"><StudentSubjects /></ProtectedRoute>} />
      <Route path="/student/units/:subjectId" element={<ProtectedRoute role="student"><StudentUnits /></ProtectedRoute>} />
      <Route path="/student/unit/:unitId" element={<ProtectedRoute role="student"><StudentUnit /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/help" element={<ProtectedRoute role="student"><StudentHelp /></ProtectedRoute>} />

      <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherSubjects /></ProtectedRoute>} />
      <Route path="/teacher/units/:subjectId" element={<ProtectedRoute role="teacher"><TeacherUnits /></ProtectedRoute>} />
      <Route path="/teacher/unit/:unitId" element={<ProtectedRoute role="teacher"><TeacherUnit /></ProtectedRoute>} />
      <Route path="/teacher/question/:questionId" element={<ProtectedRoute role="teacher"><TeacherQuestion /></ProtectedRoute>} />
      <Route path="/teacher/profile" element={<ProtectedRoute role="teacher"><TeacherProfile /></ProtectedRoute>} />
      <Route path="/teacher/help" element={<ProtectedRoute role="teacher"><TeacherHelp /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}