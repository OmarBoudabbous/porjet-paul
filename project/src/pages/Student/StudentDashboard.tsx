import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { coursesAPI } from "../../api/courses";
import { Course, Enrollment } from "../../types";
import CourseCard from "../../components/UI/CourseCard";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Navbar from "../../components/Layout/Navbar";
import { BookOpen } from "lucide-react";
import { useEnroll } from "../../hooks/useEnroll";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { enroll, enrollingId } = useEnroll();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesData, enrollmentsData] = await Promise.all([
        coursesAPI.getAllCourses(),
        coursesAPI.getEnrollments(),
      ]);
      console.log("✅ Courses data:", coursesData);
      console.log("✅ Enrollments data:", enrollmentsData);
      setAllCourses(coursesData);
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const isCourseEnrolled = (course: Course): boolean => {
    if (!enrollments || enrollments.length === 0) return false;

    // Vérifie en fonction du type de cours
    if (course.course_type === "econometric") {
      return enrollments.some((enr) => enr.econometric_course === course.id);
    } else if (course.course_type === "learning") {
      return enrollments.some((enr) => enr.learning_course === course.id);
    }

    console.log("Enrollments:", enrollments);
    console.log("Courses:", allCourses);
    return false;
  };

  const handleEnroll = async (course: Course) => {
    const success = await enroll(course.id, course.course_type);
    if (success) await loadData();
  };

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
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-xl opacity-90">
              Continue your learning journey with our courses
            </p>
          </div>
        </div>

        {/* Courses */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>

          {allCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses.map((course) => {
                const enrolled = isCourseEnrolled(course);
                const uniqueKey = `${course.course_type}-${course.id}`; // ✅ clé unique réelle

                return (
                  <div key={uniqueKey} className="relative">
                    <CourseCard
                      course={course}
                      isEnrolled={enrolled}
                      onEnroll={() => handleEnroll(course)}
                      onView={() => navigate(`/student/courses/${course.id}`)}
                    />

                    {enrollingId === course.id && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                        <span className="text-sm text-gray-700">
                          Enrolling...
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No courses available
              </h3>
              <p className="text-gray-500">Check back later for new courses!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
