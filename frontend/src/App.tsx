import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './layouts/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Departments from './pages/Departments'
import Attendance from './pages/Attendance'
import Timetable from './pages/Timetable'
import Subjects from './pages/Subjects'
import Classes from './pages/Classes'
import Calendar from './pages/Calendar'
import MarksAndResults from './pages/MarksAndResults'
import AttendancePercentage from './pages/AttendancePercentage'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="departments" element={<Departments />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="classes" element={<Classes />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="marks-and-results" element={<MarksAndResults />} />
            <Route path="attendance-percentage" element={<AttendancePercentage />} />
            <Route path="settings" element={
              <ProtectedRoute requiredPermission="view_settings">
                <Settings />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
