from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import StudentProfile, InstructorProfile

UserProfile = get_user_model()

# ➤ Register serializer
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "id", "firstName", "middleName", "lastName", "affiliation",
            "country", "email", "phone", "password"
        ]

    def create(self, validated_data):
        user = UserProfile.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            firstName=validated_data.get("firstName", ""),
            middleName=validated_data.get("middleName", ""),
            lastName=validated_data.get("lastName", ""),
            affiliation=validated_data.get("affiliation", ""),
            country=validated_data.get("country", ""),
            phone=validated_data.get("phone", ""),
        )
        return user


# ➤ Profile serializer (with role field)
class UserProfileSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "email",
            "firstName",
            "middleName",
            "lastName",
            "affiliation",
            "country",
            "phone",
            "role",   # 👈 IMPORTANT
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def get_role(self, obj):
        # if this user has an instructor profile → instructor
        if hasattr(obj, "instructorprofile"):
            return "instructor"
        # otherwise every registered user is student
        return "student"