from django.urls import path
from . import views

urlpatterns = [
    path('friends/', views.friendship_list, name='friendship-list'),
    path('friends/<int:friendship_id>/', views.manage_friendship, name='manage-friendship'),
]