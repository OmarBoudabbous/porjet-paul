import React, { useState } from "react";
import { Course } from "../../types";
import { getMediaUrl } from "../../api/axios";
import { BookOpen, DollarSign, Users } from "lucide-react";

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  onEnroll?: (courseId: number) => Promise<void> | void;
  onView?: (courseId: number) => void;
  showEnrollButton?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isEnrolled = false,
  onEnroll,
  onView,
  showEnrollButton = true,
}) => {
  // état local pour refléter l’inscription instantanément
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (!onEnroll) return;
    setLoading(true);
    try {
      await onEnroll(course.id);
      setEnrolled(true); // ✅ inscrit instantanément
    } catch (err) {
      console.error("Enroll failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = () => {
    onView?.(course.id);
  };
  console.log(
    "🧩 CourseCard rendered:",
    course.title,
    "course ID",
    course.id,
    "isEnrolled:",
    isEnrolled
  );

  const getActionButtons = () => {
    if (enrolled || course.is_free) {
      return (
        <button
          onClick={handleView}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <BookOpen className="h-4 w-4" />
          <span>View Course</span>
        </button>
      );
    }

    if (showEnrollButton) {
      return (
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleView}
            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>Preview Course</span>
          </button>
          <button
            onClick={handleEnroll}
            disabled={loading}
            className={`w-full ${
              loading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
            } text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2`}
          >
            <Users className="h-4 w-4" />
            <span>{loading ? "Enrolling..." : "Enroll Now"}</span>
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video bg-gray-200 overflow-hidden">
        {course.image ? (
          <img
            src={getMediaUrl(course.image)}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
            {course.title}
          </h3>
          {!course.is_free && (
            <div className="flex items-center space-x-0 text-green-600 font-semibold">
              <DollarSign className="h-4 w-4" />
              <span>{course.price}</span>
            </div>
          )}
          {course.is_free && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
              Free
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>

        <div className="space-y-3">{getActionButtons()}</div>
      </div>
    </div>
  );
};

export default CourseCard;
