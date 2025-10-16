from django.contrib import admin
from django.urls import path, include
from django.conf import settings            # ✅ Import settings
from django.conf.urls.static import static  # ✅ Import static for serving media

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/courses/", include("courses.urls")),
]

# serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)