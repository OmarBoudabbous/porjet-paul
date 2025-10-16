import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI } from '../../api/courses';
import { Course, Lesson, Enrollment } from '../../types';
import { getMediaUrl } from '../../api/axios';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Navbar from '../../components/Layout/Navbar';
import { BookOpen, Play, Lock, Users, DollarSign, ArrowLeft } from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const courseId = parseInt(id || '0');
  
  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    try {
      const [allCourses, allEnrollments] = await Promise.all([
        coursesAPI.getAllCourses(),
        coursesAPI.getEnrollments()
      ]);
      
      const foundCourse = allCourses.find(c => c.id === courseId);
      if (!foundCourse) {
        navigate('/student');
        return;
      }
      
      setCourse(foundCourse);
      setEnrollments(allEnrollments);
      
      // Load lessons if enrolled or free course
      const isEnrolled = allEnrollments.some(enrollment => enrollment.course === courseId);
      if (isEnrolled || foundCourse.is_free) {
        const lessonsData = await coursesAPI.getLessons(courseId);
        setLessons(lessonsData.sort((a, b) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = enrollments.some(enrollment => enrollment.course === courseId);
  const canViewContent = isEnrolled || course?.is_free;

  const handleEnroll = async () => {
    if (!course || enrolling) return;
    
    setEnrolling(true);
    try {
      await coursesAPI.enrollInCourse(course.id);
      await loadCourseData(); // Reload to get lessons
    } catch (error: any) {
      console.error('Enrollment error:', error);
      alert(error.response?.data?.detail || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
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

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h2>
            <button
              onClick={() => navigate('/student')}
              className="text-blue-600 hover:text-blue-500"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Course Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              onClick={() => navigate('/student')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {course.title}
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                  {course.description}
                </p>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  {course.is_free ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                      Free Course
                    </span>
                  ) : (
                    <div className="flex items-center space-x-1 text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4" />
                      <span>${course.price}</span>
                    </div>
                  )}
                  
                  {isEnrolled && (
                    <div className="flex items-center space-x-1 text-blue-600">
                      <Users className="h-4 w-4" />
                      <span>Enrolled</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {course.image && (
                    <div className="aspect-video bg-gray-200">
                      <img
                        src={getMediaUrl(course.image)}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {!canViewContent && !course.is_free && (
                      <button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {enrolling ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Users className="h-4 w-4" />
                            <span>Enroll Now</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {canViewContent && (
                      <div className="text-center text-green-600">
                        <Users className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-medium">You have access to this course</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">Course Content</h2>
            </div>
            
            <div className="p-6">
              {!canViewContent ? (
                <div className="text-center py-12">
                  <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Course Content Locked
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Enroll in this course to access all lessons and materials.
                  </p>
                  {!course.is_free && (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 mx-auto disabled:opacity-50"
                    >
                      {enrolling ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Users className="h-4 w-4" />
                          <span>Enroll Now - ${course.price}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ) : lessons.length > 0 ? (
                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                              {lesson.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {lesson.content.substring(0, 150)}...
                            </p>
                            {lesson.video_url && (
                              <div className="mt-2">
                                <a
                                  href={lesson.video_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-500 text-sm"
                                >
                                  <Play className="h-4 w-4" />
                                  <span>Watch Video</span>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Lessons Available
                  </h3>
                  <p className="text-gray-500">
                    The instructor hasn't added any lessons yet. Check back later!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;