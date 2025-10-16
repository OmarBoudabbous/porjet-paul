import React from 'react';
import { Course } from '../../types';
import { getMediaUrl } from '../../api/axios';
import { BookOpen, DollarSign, Users } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  onEnroll?: (courseId: number) => void;
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
  const handleAction = () => {
    if (isEnrolled || course.is_free) {
      onView?.(course.id);
    } else if (onEnroll) {
      onEnroll(course.id);
    }
  };

  const getActionButton = () => {
    if (isEnrolled) {
      return (
        <button
          onClick={handleAction}
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <BookOpen className="h-4 w-4" />
          <span>Continue Learning</span>
        </button>
      );
    }

    if (course.is_free) {
      return (
        <button
          onClick={handleAction}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <BookOpen className="h-4 w-4" />
          <span>View Course</span>
        </button>
      );
    }

    if (showEnrollButton) {
      return (
        <button
          onClick={handleAction}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Users className="h-4 w-4" />
          <span>Enroll Now</span>
        </button>
      );
    }

    return (
      <div className="w-full text-center text-gray-500 py-2">
        <span className="text-sm">Enrollment required</span>
      </div>
    );
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
            <div className="flex items-center space-x-1 text-green-600 font-semibold">
              <DollarSign className="h-4 w-4" />
              <span>${course.price}</span>
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
        
        <div className="space-y-3">
          {getActionButton()}
          
          {isEnrolled && (
            <div className="flex items-center justify-center space-x-1 text-green-600 text-sm">
              <Users className="h-4 w-4" />
              <span>Enrolled</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;