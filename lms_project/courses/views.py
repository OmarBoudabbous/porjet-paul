from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Category, CourseEconometricModel, CourseLearningModule, Lesson, Enrollment
from .serializers import (
    CategorySerializer, EconometricCourseSerializer, LearningCourseSerializer,
    CourseEconometricSerializer, CourseLearningSerializer,
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

class EconometricCourseAddView(generics.CreateAPIView):
    queryset = CourseEconometricModel.objects.all()
    serializer_class = CourseEconometricSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Optionally you could link to instructor later
        serializer.save()


# 🟩 Learning Course Add (POST)
class LearningCourseAddView(generics.CreateAPIView):
    queryset = CourseLearningModule.objects.all()
    serializer_class = CourseLearningSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Optionally link instructor here too
        serializer.save()


class EconometricCourseAddView(generics.CreateAPIView):
    """Instructor can create new Econometric Courses"""
    queryset = CourseEconometricModel.objects.all()
    serializer_class = EconometricCourseSerializer
    permission_classes = [permissions.IsAuthenticated]  # or [permissions.IsAdminUser] if restricted

    def perform_create(self, serializer):
        serializer.save()  # later you can link instructor=user if needed

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("❌ Validation errors:", serializer.errors)  # 👈 Debug line
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LearningCourseAddView(generics.CreateAPIView):
    """Instructor can create new Learning Courses"""
    queryset = CourseLearningModule.objects.all()
    serializer_class = LearningCourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EconometricCourseUpdateView(generics.UpdateAPIView):
    queryset = CourseEconometricModel.objects.all()
    serializer_class = CourseEconometricSerializer
    permission_classes = [permissions.IsAuthenticated]

# ✅ Update learning course
class LearningCourseUpdateView(generics.UpdateAPIView):
    queryset = CourseLearningModule.objects.all()
    serializer_class = CourseLearningSerializer
    permission_classes = [permissions.IsAuthenticated]


class EconometricCourseDelete(generics.DestroyAPIView):
    queryset = CourseEconometricModel.objects.all()
    serializer_class = CourseEconometricSerializer

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Econometric course deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# 🗑 Learning course delete
class LearningCourseDelete(generics.DestroyAPIView):
    queryset = CourseLearningModule.objects.all()
    serializer_class = CourseLearningSerializer

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Learning course deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class CategoryCreateAPIView(generics.GenericAPIView):
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ UPDATE CATEGORY
class CategoryUpdateAPIView(generics.UpdateAPIView):
    def put(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ DELETE CATEGORY
class CategoryDeleteAPIView(generics.DestroyAPIView):
    def delete(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

        category.delete()
        return Response({"message": "Category deleted successfully"}, status=status.HTTP_204_NO_CONTENT)