import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Auth pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Student pages
import StudentDashboard from './pages/Student/StudentDashboard';
import LearningCoursesPage from './pages/Student/LearningCoursesPage';
import EconometricCoursesPage from './pages/Student/EconometricCoursesPage';
import StudentProfile from './pages/Student/StudentProfile';
import CourseDetail from './pages/Courses/CourseDetail';  // ✅ ajouté ici

// Instructor pages
import InstructorDashboard from './pages/Instructor/InstructorDashboard';
import ManageCourses from './pages/Instructor/ManageCourses';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === 'student' ? '/student' : '/instructor'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Student routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/courses/econometric"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <EconometricCoursesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/courses/learning"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LearningCoursesPage />
          </ProtectedRoute>
        }
      />
      {/* ✅ Nouvelle route pour le détail d’un cours */}
      <Route
        path="/student/courses/:id"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <CourseDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      {/* Instructor routes */}
      <Route
        path="/instructor"
        element={
          <ProtectedRoute allowedRoles={['instructor']}>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/courses/manage"
        element={
          <ProtectedRoute allowedRoles={['instructor']}>
            <ManageCourses />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
