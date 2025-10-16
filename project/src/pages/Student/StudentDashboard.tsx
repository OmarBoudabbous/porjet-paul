import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { coursesAPI } from '../../api/courses';
import { Course, Enrollment } from '../../types';
import CourseCard from '../../components/UI/CourseCard';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Navbar from '../../components/Layout/Navbar';
import { BookOpen, TrendingUp, Clock, Award } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesData, enrollmentsData] = await Promise.all([
        coursesAPI.getAllCourses(),
        coursesAPI.getEnrollments()
      ]);
      setAllCourses(coursesData);
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: number) => {
    if (enrolling) return;

    setEnrolling(courseId);
    try {
      await coursesAPI.enrollInCourse(courseId);
      await loadData(); // Reload to update enrollments
    } catch (error: any) {
      console.error('Enrollment error:', error);
      alert(error.response?.data?.detail || 'Failed to enroll in course');
    } finally {
      setEnrolling(null);
    }
  };

  const handleViewCourse = (courseId: number) => {
    navigate(`/student/courses/${courseId}`);
  };

  const isEnrolled = (courseId: number) => {
    return enrollments.some(enrollment => enrollment.course === courseId);
  };

  const enrolledCourses = allCourses.filter(course => isEnrolled(course.id));
  const availableCourses = allCourses.filter(course => !isEnrolled(course.id));

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-xl opacity-90">
                Continue your learning journey with our economics courses
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{enrolledCourses.length}</h3>
              <p className="text-gray-600">Enrolled Courses</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{availableCourses.length}</h3>
              <p className="text-gray-600">Available Courses</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">0</h3>
              <p className="text-gray-600">Hours Completed</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">0</h3>
              <p className="text-gray-600">Certificates</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Enrolled Courses */}
          {enrolledCourses.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isEnrolled={true}
                    onView={handleViewCourse}
                    showEnrollButton={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Available Courses */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {enrolledCourses.length > 0 ? 'Discover More Courses' : 'Available Courses'}
            </h2>
            {availableCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCourses.map(course => (
                  <div key={course.id} className="relative">
                    <CourseCard
                      course={course}
                      isEnrolled={false}
                      onEnroll={handleEnroll}
                      onView={handleViewCourse}
                      showEnrollButton={true}
                    />
                    {enrolling === course.id && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 rounded-xl flex items-center justify-center">
                        <LoadingSpinner size="md" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses available</h3>
                <p className="text-gray-500">Check back later for new courses!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;