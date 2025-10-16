from rest_framework import generics, permissions
from .models import Category, CourseEconometricModel, CourseLearningModule, Lesson, Enrollment
from .serializers import (
    CategorySerializer, EconometricCourseSerializer, LearningCourseSerializer,
    LessonSerializer, EnrollmentSerializer
)

# 🏷 Categories


class CategoryListCreate(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]  # Only admin

# 📊 Econometric Courses


class EconometricCourseListCreate(generics.ListCreateAPIView):
    queryset = CourseEconometricModel.objects.all()
    serializer_class = EconometricCourseSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            # Only Instructors/Admins create
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]  # Anyone can view

# 🎟 Enrollment List (list student's enrollments)
class EnrollmentList(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "studentprofile"):
            return Enrollment.objects.filter(student=user.studentprofile)
        # Instructor (or users without StudentProfile) → returns nothing instead of 500
        return Enrollment.objects.none()
    
    
# 📚 Learning Modules
class LearningCourseListCreate(generics.ListCreateAPIView):
    queryset = CourseLearningModule.objects.all()
    serializer_class = LearningCourseSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

# 📖 Lessons


class LessonListCreate(generics.ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

# 🎟 Enrollment (student subscribes to course)


class EnrollmentCreate(generics.CreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user.studentprofile)



# Single course detail
class EconometricCourseDetail(generics.RetrieveAPIView):
    queryset = CourseEconometricModel.objects.all()
    serializer_class = EconometricCourseSerializer

class LearningCourseDetail(generics.RetrieveAPIView):
    queryset = CourseLearningModule.objects.all()
    serializer_class = LearningCourseSerializer