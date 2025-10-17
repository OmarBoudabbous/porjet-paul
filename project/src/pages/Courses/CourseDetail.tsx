import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { coursesAPI } from "../../api/courses";
import { useAuth } from "../../context/AuthContext";
import { Course, Enrollment } from "../../types";
import Navbar from "../../components/Layout/Navbar";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import { useEnroll } from "../../hooks/useEnroll";
import { DollarSign, BookOpen, CheckCircle } from "lucide-react";

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { enroll, enrollingId } = useEnroll();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);

      // On récupère toutes les inscriptions du user
      const [econometricCourses, learningCourses, enrollmentsData] = await Promise.all([
        coursesAPI.getEconometricCourses(),
        coursesAPI.getLearningCourses(),
        coursesAPI.getEnrollments(),
      ]);

      // Fusion des deux types de cours
      const allCourses = [...econometricCourses, ...learningCourses];
      const found = allCourses.find((c) => c.id === parseInt(id));
      setCourse(found || null);
      setEnrollments(enrollmentsData);

      if (found) {
        const enrolled = enrollmentsData.some(
          (e) => e.econometric_course === found.id || e.learning_course === found.id
        );
        setIsEnrolled(enrolled);
      }
    } catch (error) {
      console.error("Error loading course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;
    const type = course.course_type as "econometric" | "learning";
    await enroll(course.id, type);
    await loadCourse(); // recharge pour maj état
  };

  if (loading || !course) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="relative h-64 md:h-96">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {course.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <DollarSign className="text-green-600" />
              <span className="text-xl font-semibold text-gray-800">
                {course.access === "Free" ? "Free" : `${course.price} €`}
              </span>
            </div>

            <div className="mt-8">
              {isEnrolled ? (
                <button
                  onClick={() => alert("🚀 Course started! (future feature)")}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Start Course
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrollingId === course.id}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-purple-700 flex items-center gap-2 disabled:opacity-60"
                >
                  <BookOpen className="h-5 w-5" />
                  {enrollingId === course.id ? "Enrolling..." : "Enroll Now"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;

