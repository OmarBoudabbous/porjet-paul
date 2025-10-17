from django.db import models
from users.models import StudentProfile
from django.conf import settings

# 📂 Category


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# 🔑 Choices
COURSE_TYPE = (
    ("Static", "Static"),   # maybe self-paced
    ("Dynamic", "Dynamic"),  # maybe interactive/live
)

COURSE_ACCESS = (
    ("Free", "Free"),
    ("Paid", "Paid"),
)


# 🎓 Abstract Base - avoids duplication
class BaseCourse(models.Model):
    # Change from URLField to ImageField:
    image = models.ImageField(
        upload_to='course_images/', blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    # 👀 Use DIFFERENT related_name so Django doesn’t complain
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    type = models.CharField(max_length=20, choices=COURSE_TYPE)
    access = models.CharField(max_length=20, choices=COURSE_ACCESS)

    class Meta:
        abstract = True

    def __str__(self):
        return self.title


# 📊 Econometric course
class CourseEconometricModel(BaseCourse):
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="econometric_courses"
    )


# 📚 Learning Module
class CourseLearningModule(BaseCourse):
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="learning_courses"
    )


# 📖 Lesson
class Lesson(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()

    econometric_course = models.ForeignKey(
        CourseEconometricModel, null=True, blank=True, on_delete=models.CASCADE, related_name="lessons"
    )
    learning_course = models.ForeignKey(
        CourseLearningModule, null=True, blank=True, on_delete=models.CASCADE, related_name="lessons"
    )

    def __str__(self):
        return self.title


# 🎟 Enrollment
class Enrollment(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    econometric_course = models.ForeignKey(
        "courses.CourseEconometricModel",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="enrollments",
    )
    learning_course = models.ForeignKey(
        "courses.CourseLearningModule",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="enrollments",
    )
    date_enrolled = models.DateTimeField(auto_now_add=True)
    is_paid = models.BooleanField(default=False)  # ← for future paid bookings

    def __str__(self):
        return f"{self.student} enrolled in {self.econometric_course or self.learning_course}"
