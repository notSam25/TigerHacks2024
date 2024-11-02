# project urls.py
from django.urls import path, include

urlpatterns = [
    path('', include('nutrition_api.urls')),
]