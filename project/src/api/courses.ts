import apiClient from './axios';
import { Course, Category, Lesson, Enrollment } from '../types';

export const coursesAPI = {
  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get('/courses/categories/');
    return response.data;
  },

  async createCategory(data: { name: string; description: string }): Promise<Category> {
    const response = await apiClient.post('/courses/categories/', data);
    return response.data;
  },

  async updateCategory(id: number, data: { name: string; description: string }): Promise<Category> {
    const response = await apiClient.put(`/courses/categories/${id}/`, data);
    return response.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/courses/categories/${id}/`);
  },

  // Econometric Courses
  async getEconometricCourses(): Promise<Course[]> {
    const response = await apiClient.get('/courses/econometric/');
    return response.data;
  },

  // Learning Courses
  async getLearningCourses(): Promise<Course[]> {
    const response = await apiClient.get('/courses/learning/');
    return response.data;
  },

  // All courses (combined)
  async getAllCourses(): Promise<Course[]> {
    const [econometric, learning] = await Promise.all([
      this.getEconometricCourses(),
      this.getLearningCourses(),
    ]);
    return [...econometric, ...learning];
  },

  async createCourse(data: FormData): Promise<Course> {
    const response = await apiClient.post('/courses/econometric/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateCourse(id: number, data: FormData): Promise<Course> {
    const response = await apiClient.put(`/courses/econometric/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteCourse(id: number): Promise<void> {
    await apiClient.delete(`/courses/econometric/${id}/`);
  },

  // Lessons
  async getLessons(courseId: number): Promise<Lesson[]> {
    const response = await apiClient.get(`/courses/lessons/?course=${courseId}`);
    return response.data;
  },

  async createLesson(data: {
    title: string;
    content: string;
    video_url?: string;
    course: number;
    order: number;
  }): Promise<Lesson> {
    const response = await apiClient.post('/courses/lessons/', data);
    return response.data;
  },

  async updateLesson(id: number, data: {
    title: string;
    content: string;
    video_url?: string;
    order: number;
  }): Promise<Lesson> {
    const response = await apiClient.put(`/courses/lessons/${id}/`, data);
    return response.data;
  },

  async deleteLesson(id: number): Promise<void> {
    await apiClient.delete(`/courses/lessons/${id}/`);
  },

  // Enrollment
  async enrollInCourse(courseId: number): Promise<Enrollment> {
    const response = await apiClient.post('/courses/enroll/', {
      course: courseId,
    });
    return response.data;
  },

  async getEnrollments(): Promise<Enrollment[]> {
    const response = await apiClient.get('/courses/enrollments/');
    return response.data;
  },
  
  async getEconometricCourse(id: number): Promise<Course> {
    const response = await apiClient.get(`/courses/econometric/${id}/`);
    return response.data;
  },

  async getLearningCourse(id: number): Promise<Course> {
    const response = await apiClient.get(`/courses/learning/${id}/`);
    return response.data;
  },
};

