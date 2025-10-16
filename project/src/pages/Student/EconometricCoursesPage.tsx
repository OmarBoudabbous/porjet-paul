import React, { useEffect, useState } from 'react';
import { coursesAPI } from '../../api/courses';
import { Course } from '../../types';

const EconometricCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await coursesAPI.getEconometricCourses();
      setCourses(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Econometric Courses</h1>
      {courses.map((c) => (
        <div key={c.id} className="p-4 border rounded mb-2">
          {c.title}
        </div>
      ))}
    </div>
  );
};

export default EconometricCoursesPage;