import React, { useState, useEffect } from "react";
import { coursesAPI } from "../../api/courses";
import { Course, Category } from "../../types";
import Navbar from "../../components/Layout/Navbar";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import { Plus, Edit, Trash2, BookOpen, Users } from "lucide-react";

const ManageCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "courses" | "categories" | "lessons"
  >("courses");

  // Create modals
  const [showEconometricModal, setShowEconometricModal] = useState(false);
  const [showLearningModal, setShowLearningModal] = useState(false);

  // Edit modals
  const [showEditEconometricModal, setShowEditEconometricModal] =
    useState(false);
  const [showEditLearningModal, setShowEditLearningModal] = useState(false);

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);

  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await coursesAPI.createCategory(categoryForm);
      setShowCategoryModal(false);
      setCategoryForm({ name: "", description: "" });
      await loadData();
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category");
    }
  };

  // 🔹 OUVRIR MODAL ÉDITION
  const handleEditCategory = (cat: any) => {
    setCategoryToEdit(cat); // saves the ID and all details
    setCategoryForm({
      name: cat.name || "",
      description: cat.description || "",
    });
    setShowEditCategoryModal(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryToEdit?.id) {
      alert("No category selected for update");
      return;
    }

    try {
      await coursesAPI.updateCategory(categoryToEdit.id, categoryForm);
      await loadData();
      setShowEditCategoryModal(false);
      setCategoryToEdit(null);
      setCategoryForm({ name: "", description: "" });
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category");
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await coursesAPI.deleteCategory(categoryToDelete.id);
      setShowDeleteCategoryModal(false);
      setCategoryToDelete(null);
      await loadData();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const initialCourseForm = {
    title: "",
    description: "",
    price: "",
    is_free: false,
    type: "Static",
    category: "",
    image: null as File | null,
  };

  const [econometricForm, setEconometricForm] = useState(initialCourseForm);
  const [learningForm, setLearningForm] = useState(initialCourseForm);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  // ✅ Load Data
  const loadData = async () => {
    try {
      const [ecoCourses, learnCourses, catData] = await Promise.all([
        coursesAPI.getEconometricCourses(),
        coursesAPI.getLearningCourses(),
        coursesAPI.getCategories(),
      ]);

      const ecoWithType = ecoCourses.map((c) => ({
        ...c,
        course_type: "econometric",
      }));
      const learnWithType = learnCourses.map((c) => ({
        ...c,
        course_type: "learning",
      }));

      setCourses([...ecoWithType, ...learnWithType]);
      setCategories(catData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create Course
  const handleCreateCourse = async (
    e: React.FormEvent,
    form: typeof initialCourseForm,
    type: "econometric" | "learning"
  ) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("type", form.type);
      formData.append("access", form.is_free ? "Free" : "Paid");
      formData.append("is_free", form.is_free.toString());
      if (!form.is_free && form.price) formData.append("price", form.price);
      if (form.category) formData.append("category", form.category);
      if (form.image) formData.append("image", form.image);

      if (type === "econometric") {
        await coursesAPI.createEconometricCourse(formData);
        setShowEconometricModal(false);
        setEconometricForm(initialCourseForm);
      } else {
        await coursesAPI.createCourseLearning(formData);
        setShowLearningModal(false);
        setLearningForm(initialCourseForm);
      }

      await loadData();
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course");
    }
  };

  // ✅ Update Course
  const handleUpdateCourse = async (
    e: React.FormEvent,
    form: typeof initialCourseForm,
    type: "econometric" | "learning"
  ) => {
    e.preventDefault();
    if (!editingCourse) return;

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("type", form.type);
      formData.append("access", form.is_free ? "Free" : "Paid");
      formData.append("is_free", form.is_free.toString());
      if (!form.is_free && form.price) formData.append("price", form.price);
      if (form.category) formData.append("category", form.category);
      if (form.image) formData.append("image", form.image);

      if (type === "econometric") {
        await coursesAPI.updateEconometricCourse(editingCourse.id, formData);
        setShowEditEconometricModal(false);
      } else {
        await coursesAPI.updateLearningCourse(editingCourse.id, formData);
        setShowEditLearningModal(false);
      }

      setEditingCourse(null);
      await loadData();
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course");
    }
  };

  // ✅ Delete Course (Dynamic)
  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      if (courseToDelete.course_type === "econometric") {
        await coursesAPI.deleteEconometricCourse(courseToDelete.id);
      } else {
        await coursesAPI.deleteLearningCourse(courseToDelete.id);
      }
      setShowDeleteModal(false);
      setCourseToDelete(null);
      await loadData();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course");
    }
  };

  const handleDeleteCategory = (category: any) => {
    setCategoryToDelete(category);
    setShowDeleteCategoryModal(true);
  };

  // 🔹 Reusable Course Form
  const renderCourseForm = (
    formState: typeof initialCourseForm,
    setFormState: React.Dispatch<
      React.SetStateAction<typeof initialCourseForm>
    >,
    onSubmit: (e: React.FormEvent) => void,
    onCancel: () => void,
    title: string
  ) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={formState.title}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              value={formState.description}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formState.category}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formState.is_free}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    is_free: e.target.checked,
                  }))
                }
              />
              <span>Free Course</span>
            </label>
          </div>

          {!formState.is_free && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                value={formState.price}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, price: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Manage Content</h1>
            <p className="text-gray-600">
              Manage your Courses, Categories and Lessons
            </p>
          </div>

          {/* TABS */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: "courses", label: "Courses", icon: BookOpen },
                  { id: "categories", label: "Categories", icon: Users },
                  { id: "lessons", label: "Lessons", icon: Edit },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* TAB CONTENT */}
            <div className="p-6">
              {/* COURSES TAB */}
              {activeTab === "courses" && (
                <>
                  <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-semibold">Courses</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowEconometricModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Econometric</span>
                      </button>
                      <button
                        onClick={() => setShowLearningModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Learning</span>
                      </button>
                    </div>
                  </div>

                  {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.map((course) => (
                        <div
                          key={course.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <h3 className="font-semibold text-gray-800 mb-2">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex items-center justify-between text-sm mb-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                course.is_free
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {course.is_free ? "Free" : `$${course.price}`}
                            </span>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingCourse(course);
                                const form = {
                                  title: course.title,
                                  description: course.description,
                                  price: course.price?.toString() || "",
                                  is_free: course.access === "Free",
                                  type: course.type || "Static",
                                  category: course.category?.toString() || "",
                                  image: null,
                                };
                                if (course.course_type === "econometric") {
                                  setEconometricForm(form);
                                  setShowEditEconometricModal(true);
                                } else {
                                  setLearningForm(form);
                                  setShowEditLearningModal(true);
                                }
                              }}
                              className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200"
                            >
                              <Edit className="h-3 w-3 inline-block mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setCourseToDelete(course);
                                setShowDeleteModal(true);
                              }}
                              className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200"
                            >
                              <Trash2 className="h-3 w-3 inline-block mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      No courses found
                    </div>
                  )}
                </>
              )}

              {/* CATEGORIES TAB */}
              {activeTab === "categories" && (
                <>
                  <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-semibold">Categories</h2>
                    <button
                      onClick={() => setShowCategoryModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Category</span>
                    </button>
                  </div>

                  {categories.length > 0 ? (
                    <div className="space-y-4">
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          className="border border-gray-200 rounded-lg p-4 flex justify-between"
                        >
                          <div>
                            <h3 className="font-semibold">{cat.name}</h3>
                            <p className="text-gray-600 text-sm">
                              {cat.description}
                            </p>
                          </div>
                          <div className="flex gap-5">
                            <button
                              onClick={() => handleEditCategory(cat)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      No categories found
                    </div>
                  )}
                </>
              )}

              {/* LESSONS TAB */}
              {activeTab === "lessons" && (
                <div className="text-center py-12 text-gray-500">
                  <Edit className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  Lesson management will be available soon.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium text-red-600">
                {courseToDelete?.title}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex space-x-3 pt-3">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCourseToDelete(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modals */}
      {showEconometricModal &&
        renderCourseForm(
          econometricForm,
          setEconometricForm,
          (e) => handleCreateCourse(e, econometricForm, "econometric"),
          () => setShowEconometricModal(false),
          "Create Econometric Course"
        )}
      {showLearningModal &&
        renderCourseForm(
          learningForm,
          setLearningForm,
          (e) => handleCreateCourse(e, learningForm, "learning"),
          () => setShowLearningModal(false),
          "Create Learning Course"
        )}

      {/* Edit Modals */}
      {showEditEconometricModal &&
        renderCourseForm(
          econometricForm,
          setEconometricForm,
          (e) => handleUpdateCourse(e, econometricForm, "econometric"),
          () => {
            setEditingCourse(null);
            setShowEditEconometricModal(false);
          },
          `Edit Econometric Course: ${editingCourse?.title || ""}`
        )}
      {showEditLearningModal &&
        renderCourseForm(
          learningForm,
          setLearningForm,
          (e) => handleUpdateCourse(e, learningForm, "learning"),
          () => {
            setEditingCourse(null);
            setShowEditLearningModal(false);
          },
          `Edit Learning Course: ${editingCourse?.title || ""}`
        )}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Add category
            </h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Edit Category
            </h3>
            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditCategoryModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeleteCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Yes, Delete
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">
                {categoryToDelete?.name}
              </span>{" "}
              ? This action is irreversible.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmDeleteCategory}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteCategoryModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageCourses;
