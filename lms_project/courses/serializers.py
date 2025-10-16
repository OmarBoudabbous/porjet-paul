from rest_framework import serializers
from .models import Category, CourseEconometricModel, CourseLearningModule, Lesson, Enrollment

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class EconometricCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEconometricModel
        fields = "__all__"


class LearningCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseLearningModule
        fields = "__all__"


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = "__all__"


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"