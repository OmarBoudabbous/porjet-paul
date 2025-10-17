import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { coursesAPI } from "../../api/courses";
import { Course, Enrollment } from "../../types";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Navbar from "../../components/Layout/Navbar";
import WelcomeBanner from "../../components/Layout/WelcomeBanner";
import CourseCard from "../../components/UI/CourseCard";
import { useAuth } from "../../context/AuthContext";
import { BookOpen } from "lucide-react";
import { useEnroll } from "../../hooks/useEnroll";

const EconometricCoursesPage: React.FC = () => {
  const [econometricCourses, setEconometricCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { enroll, enrollingId } = useEnroll();

  // ✅ Charger les cours + les inscriptions
  useEffect(() => {
    const loadData = async () => {
      try {
        const [courses, userEnrollments] = await Promise.all([
          coursesAPI.getEconometricCourses(),
          coursesAPI.getEnrollments(),
        ]);
        setEconometricCourses(courses);
        setEnrollments(userEnrollments);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ✅ Fonction pour vérifier si l'utilisateur est inscrit à un cours
  const isCourseEnrolled = (courseId: number): boolean => {
    return enrollments.some(
      (enr) => enr.econometric_course === courseId
    );
  };

  const handleViewCourse = (courseId: number) => {
    navigate(`/student/courses/${courseId}`);
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
        <WelcomeBanner user={user} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Econometric Courses
            </h2>

            {econometricCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {econometricCourses.map((course) => {
                  const enrolled = isCourseEnrolled(course.id);

                  return (
                    <div key={`econometric-${course.id}`} className="relative">
                      <CourseCard
                        course={course}
                        isEnrolled={enrolled}
                        onEnroll={() => enroll(course.id, "econometric")}
                        onView={() => handleViewCourse(course.id)}
                        showEnrollButton={!enrolled}
                      />

                      {enrollingId === course.id && (
                        <div className="absolute inset-0 bg-white bg-opacity-70 rounded-xl flex items-center justify-center">
                          <LoadingSpinner size="md" />
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
                <p className="text-gray-500">
                  Check back later for new courses!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EconometricCoursesPage;
