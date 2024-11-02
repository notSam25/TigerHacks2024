from django.contrib import admin
from django.urls import path, include

API_VERSION = "v1"

urlpatterns = [
    path("admin/", admin.site.urls),
    path(f"api/{API_VERSION}/", include("nutrition_api.urls")),
]
