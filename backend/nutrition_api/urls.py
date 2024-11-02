# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/nutrition/', views.NutritionFacts, name='nutrition'),
]