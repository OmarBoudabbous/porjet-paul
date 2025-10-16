from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserProfile, StudentProfile, InstructorProfile

# 🛠 Custom admin for UserProfile (so we see it nicely)
class CustomUserAdmin(UserAdmin):
    model = UserProfile
    list_display = ("id", "email", "firstName", "lastName", "is_staff", "is_superuser")
    list_filter = ("is_staff", "is_superuser", "country")
    search_fields = ("email", "firstName", "lastName")
    ordering = ("email",)

    # Replace "username" fields with our email + extra fields
    fieldsets = (
        (None, {"fields": ("email", "password", "firstName", "middleName", "lastName", "phone", "affiliation", "country")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email", "password1", "password2", "firstName", "middleName", "lastName", "phone", "affiliation", "country", "is_staff", "is_active"
                ),
            },
        ),
    )


# Register models in Admin
admin.site.register(UserProfile, CustomUserAdmin)
admin.site.register(StudentProfile)
admin.site.register(InstructorProfile)