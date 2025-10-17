from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
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
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


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


# 🎓 Econometric Course Enroll
class EconometricCourseEnrollView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EnrollmentSerializer

    def post(self, request, pk):
        course = get_object_or_404(CourseEconometricModel, pk=pk)
        enrollment, created = Enrollment.objects.get_or_create(
            student=request.user,
            econometric_course=course,
        )
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_200_OK)


# 🎓 Learning Course Enroll
class LearningCourseEnrollView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EnrollmentSerializer

    def post(self, request, pk):
        course = get_object_or_404(CourseLearningModule, pk=pk)
        enrollment, created = Enrollment.objects.get_or_create(
            student=request.user,
            learning_course=course,
        )
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_200_OK)


# 🎟 Enrollment List (list student's enrollments)
class EnrollmentList(generics.ListAPIView):
    """
    Returns the list of courses that the authenticated student is enrolled in.
    """
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # 🔍 Log d'information (utile pour debug en dev)
        print(f"👤 User connected → ID: {user.id}, Username: {user.username}")

        # 🎯 Récupère uniquement les inscriptions du user connecté
        enrollments = Enrollment.objects.filter(student_id=user.id)

        # 🧾 Debug facultatif : afficher les IDs des cours liés
        if enrollments.exists():
            print("📘 Enrollments found:",
                  list(enrollments.values("id", "econometric_course_id", "learning_course_id")))
        else:
            print("⚠️ No enrollments found for this user.")

        return enrollments


# 🎟 Enrollment (manual creation via API)
class EnrollmentCreate(generics.CreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


# 📘 Single course detail
class EconometricCourseDetail(generics.RetrieveAPIView):
    queryset = CourseEconometricModel.objects.all()
    serializer_class = EconometricCourseSerializer


class LearningCourseDetail(generics.RetrieveAPIView):
    queryset = CourseLearningModule.objects.all()
    serializer_class = LearningCourseSerializer
