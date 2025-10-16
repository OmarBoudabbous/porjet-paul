export interface User {
  id: number;
  email: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  affiliation?: string | null;
  country?: string | null;
  phone?: string | null;
  role: 'student' | 'instructor';
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  image?: string;
  price: number;
  category: number;
  type: 'Static' | 'Dynamic';
  access: 'Free' | 'Paid';
}

export interface Category {
  id: number;
  name: string;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  econometric_course?: number;
  learning_course?: number;
}

export interface Enrollment {
  id: number;
  student: number;
  econometric_course?: number;
  learning_course?: number;
  date_enrolled: string;
}