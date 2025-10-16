from django.contrib import admin
from .models import Category, CourseEconometricModel, CourseLearningModule, Lesson, Enrollment

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)

@admin.register(CourseEconometricModel)
class EconometricCourseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "price", "access")
    list_filter = ("category", "access", "type")

@admin.register(CourseLearningModule)
class LearningCourseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "price", "access")
    list_filter = ("category", "access", "type")

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "econometric_course", "learning_course")
    search_fields = ("title",)

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("id", "student", "econometric_course", "learning_course", "date_enrolled")
    list_filter = ("date_enrolled",)