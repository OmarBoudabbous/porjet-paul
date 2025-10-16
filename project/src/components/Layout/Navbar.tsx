import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, BookOpen, User, Home } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const getDashboardLink = () => {
    return user.role === 'student' ? '/student' : '/instructor';
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to={getDashboardLink()} className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">EconLMS</span>
            </Link>

            <div className="hidden md:flex space-x-6">
              <Link
                to={getDashboardLink()}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              {user.role === 'student' && (
                <>
                  <Link
                    to="/student/courses/econometric"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Econometric Courses
                  </Link>
                  <Link
                    to="/student/courses/learning"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Learning Courses
                  </Link>
                  <Link
                    to="/student/profile"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Profile
                  </Link>
                </>
              )}

              {user.role === 'instructor' && (
                <Link
                  to="/instructor/courses/manage"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Manage Courses
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;