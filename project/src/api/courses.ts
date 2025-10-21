import apiClient from './axios';
import { Course, Category, Lesson, Enrollment } from '../types';

const BASE_URL = "http://127.0.0.1:8000/api/courses/";

export const coursesAPI = {

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get('/courses/categories/');
    return response.data;
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

    // ✅ On ajoute manuellement un champ course_type pour les distinguer
    const ecoWithType = econometric.map((c) => ({
      ...c,
      course_type: "econometric",
    }));

    const learnWithType = learning.map((c) => ({
      ...c,
      course_type: "learning",
    }));

    return [...ecoWithType, ...learnWithType];
  },


  async createCourse(data: FormData): Promise<Course> {
    const response = await apiClient.post('/courses/econometric/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async createEconometricCourse(data: FormData): Promise<Course> {
    const response = await apiClient.post('/courses/econometric/add/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async createCourseLearning(data: FormData): Promise<Course> {
    const response = await apiClient.post('/courses/learning/add/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
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
  async enrollInCourse(
    courseId: number,
    type: "econometric" | "learning",
    payload: Record<string, any> = {}
  ): Promise<Enrollment> {
    // Example: /courses/econometric/{id}/enroll/ or /courses/learning/{id}/enroll/
    const endpoint =
      type === "econometric"
        ? `/courses/econometric/${courseId}/enroll/`
        : `/courses/learning/${courseId}/enroll/`;

    const response = await apiClient.post(endpoint, payload);
    return response.data;
  },

  async updateEconometricCourse(id: number, data: FormData): Promise<Course> {
    const response = await apiClient.put(`/courses/econometric/${id}/update/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async updateLearningCourse(id: number, data: FormData): Promise<Course> {
    const response = await apiClient.put(`/courses/learning/${id}/update/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  // 🔹 Delete an Econometric course
  async deleteEconometricCourse(id: number): Promise<void> {
    await apiClient.delete(`/courses/econometric/${id}/delete/`);
  },

  // 🔹 Delete a Learning course
  async deleteLearningCourse(id: number): Promise<void> {
    await apiClient.delete(`/courses/learning/${id}/delete/`);
  },
  createCategory: async (data: { name: string; description: string }) => {
    const response = await apiClient.post('/courses/categories/add/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ✅ Update category
  updateCategory: async (id: number, data: { name: string; description: string }) => {
    const response = await apiClient.put(`/courses/categories/${id}/update/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ✅ Delete category
  deleteCategory: async (id: number) => {
    await apiClient.delete(`/courses/categories/${id}/delete/`);
  },

};

