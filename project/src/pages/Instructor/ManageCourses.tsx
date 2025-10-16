import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../../api/courses';
import { Course, Category, Lesson } from '../../types';
import Navbar from '../../components/Layout/Navbar';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { Plus, Edit, Trash2, BookOpen, Users } from 'lucide-react';

const ManageCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'categories' | 'lessons'>('courses');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    price: '',
    is_free: false,
    category: '',
    image: null as File | null
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesData, categoriesData] = await Promise.all([
        coursesAPI.getAllCourses(),
        coursesAPI.getCategories()
      ]);
      setCourses(coursesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', courseForm.title);
      formData.append('description', courseForm.description);
      formData.append('is_free', courseForm.is_free.toString());
      if (!courseForm.is_free && courseForm.price) {
        formData.append('price', courseForm.price);
      }
      if (courseForm.category) {
        formData.append('category', courseForm.category);
      }
      if (courseForm.image) {
        formData.append('image', courseForm.image);
      }

      await coursesAPI.createCourse(formData);
      setShowCreateForm(false);
      setCourseForm({ title: '', description: '', price: '', is_free: false, category: '', image: null });
      await loadData();
    } catch (error: any) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await coursesAPI.createCategory(categoryForm);
      setShowCreateForm(false);
      setCategoryForm({ name: '', description: '' });
      await loadData();
    } catch (error: any) {
      console.error('Error creating category:', error);
      alert('Failed to create category');
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await coursesAPI.deleteCourse(courseId);
      await loadData();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await coursesAPI.deleteCategory(categoryId);
      await loadData();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
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

  const renderCourseForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Course</h3>
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={courseForm.title}
              onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={courseForm.description}
              onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={courseForm.category}
              onChange={(e) => setCourseForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={courseForm.is_free}
                onChange={(e) => setCourseForm(prev => ({ ...prev, is_free: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Free Course</span>
            </label>
          </div>

          {!courseForm.is_free && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={courseForm.price}
                onChange={(e) => setCourseForm(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCourseForm(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Course
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderCategoryForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Category</h3>
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={categoryForm.name}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={categoryForm.description}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Category
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Manage Content</h1>
            <p className="text-gray-600 mt-2">Create and manage your courses, categories, and lessons.</p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'courses', label: 'Courses', icon: BookOpen },
                  { id: 'categories', label: 'Categories', icon: Users },
                  { id: 'lessons', label: 'Lessons', icon: Edit },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="p-6">
              {activeTab === 'courses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Your Courses</h2>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Course</span>
                    </button>
                  </div>

                  {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.map(course => (
                        <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-800 mb-2">{course.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                          <div className="flex items-center justify-between text-sm mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              course.is_free 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {course.is_free ? 'Free' : `$${course.price}`}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1">
                              <Edit className="h-3 w-3" />
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteCourse(course.id)}
                              className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors flex items-center justify-center space-x-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses yet</h3>
                      <p className="text-gray-500 mb-6">Create your first course to get started.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'categories' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Category</span>
                    </button>
                  </div>

                  {categories.length > 0 ? (
                    <div className="space-y-4">
                      {categories.map(category => (
                        <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-grow">
                              <h3 className="font-semibold text-gray-800 mb-2">{category.name}</h3>
                              <p className="text-gray-600 text-sm">{category.description}</p>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center space-x-1">
                                <Edit className="h-3 w-3" />
                                <span>Edit</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteCategory(category.id)}
                                className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors flex items-center space-x-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No categories yet</h3>
                      <p className="text-gray-500 mb-6">Create categories to organize your courses.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'lessons' && (
                <div className="text-center py-12">
                  <Edit className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Lesson Management</h3>
                  <p className="text-gray-500">Select a course to manage its lessons.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forms */}
      {showCreateForm && activeTab === 'courses' && renderCourseForm()}
      {showCreateForm && activeTab === 'categories' && renderCategoryForm()}
    </>
  );
};

export default ManageCourses;