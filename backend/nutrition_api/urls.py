from django.contrib import admin
from django.urls import path
from .views import (
    test
)


urlpatterns = [
    path("nutrition/", view=test.as_view(), name="test"),
]