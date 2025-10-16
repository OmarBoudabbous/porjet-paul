from django.urls import path
from .views import (
    CategoryListCreate, EconometricCourseListCreate, LearningCourseListCreate,
    LessonListCreate, EnrollmentCreate, EnrollmentList,EconometricCourseDetail, LearningCourseDetail
)

urlpatterns = [
    path("categories/", CategoryListCreate.as_view()),
    path("econometric/", EconometricCourseListCreate.as_view()),
    path("econometric/<int:pk>/", EconometricCourseDetail.as_view()),   # 👈 detail
    path("learning/", LearningCourseListCreate.as_view()),
    path("learning/<int:pk>/", LearningCourseDetail.as_view()),         # 👈 detail
    path("lessons/", LessonListCreate.as_view()),
    path("enroll/", EnrollmentCreate.as_view()),
    path("enrollments/", EnrollmentList.as_view()),
]