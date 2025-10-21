from django.urls import path
from .views import (
    CategoryListCreate,
    EconometricCourseListCreate,
    LearningCourseListCreate,
    LessonListCreate,
    EnrollmentCreate,
    EnrollmentList,
    EconometricCourseDetail,
    LearningCourseDetail,
    EconometricCourseEnrollView,   # ✅ important
    LearningCourseEnrollView,      # ✅ important
    EconometricCourseAddView,
    LearningCourseAddView,
    EconometricCourseUpdateView,
    LearningCourseUpdateView,
    EconometricCourseDelete,
    LearningCourseDelete,
    CategoryCreateAPIView,
    CategoryUpdateAPIView,
    CategoryDeleteAPIView
)

urlpatterns = [
    path("categories/", CategoryListCreate.as_view()),
    path("econometric/", EconometricCourseListCreate.as_view()),
    path("econometric/add/", EconometricCourseAddView.as_view()),
    path("econometric/<int:pk>/update/", EconometricCourseUpdateView.as_view()),
    path("econometric/<int:pk>/delete/", EconometricCourseDelete.as_view()),
    path("econometric/<int:pk>/", EconometricCourseDetail.as_view()),

    # ✅ Enroll route for econometric courses
    path("econometric/<int:pk>/enroll/", EconometricCourseEnrollView.as_view()),

    path("learning/", LearningCourseListCreate.as_view()),
    path("learning/add/", LearningCourseAddView.as_view()),
    path("learning/<int:pk>/update/", LearningCourseUpdateView.as_view()),
    path("learning/<int:pk>/delete/", LearningCourseDelete.as_view()),
    path("learning/<int:pk>/", LearningCourseDetail.as_view()),

    # ✅ Enroll route for learning courses
    path("learning/<int:pk>/enroll/", LearningCourseEnrollView.as_view()),

    path("lessons/", LessonListCreate.as_view()),
    path("enroll/", EnrollmentCreate.as_view()),
    path("enrollments/", EnrollmentList.as_view()),

     path("categories/add/", CategoryCreateAPIView.as_view(), name="category-add"),
    path("categories/<int:pk>/update/", CategoryUpdateAPIView.as_view(), name="category-update"),
    path("categories/<int:pk>/delete/", CategoryDeleteAPIView.as_view(), name="category-delete"),
]
