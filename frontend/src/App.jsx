import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/admin/Dashboard'
import Instructors from './pages/admin/Instructors'
import Courses from './pages/admin/Courses'
import AddCourse from './pages/admin/AddCourse'
import AddLecture from './pages/admin/AddLecture'

// Placeholder
const InstructorDashboard = () => <div><h1>Instructor Dashboard</h1></div>

// Protected Route
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/" />
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="admin"><Dashboard /></ProtectedRoute>
        } />
        <Route path="/admin/instructors" element={
          <ProtectedRoute allowedRole="admin"><Instructors /></ProtectedRoute>
        } />
        <Route path="/admin/courses" element={
          <ProtectedRoute allowedRole="admin"><Courses /></ProtectedRoute>
        } />
        <Route path="/admin/add-course" element={
          <ProtectedRoute allowedRole="admin"><AddCourse /></ProtectedRoute>
        } />
        <Route path="/admin/add-lecture" element={
          <ProtectedRoute allowedRole="admin"><AddLecture /></ProtectedRoute>
        } />

        {/* Instructor Routes */}
        <Route path="/instructor/dashboard" element={
          <ProtectedRoute allowedRole="instructor"><InstructorDashboard /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App