from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('me/', views.current_user, name='current-user'),
    path('profile/', views.user_profile, name='profile'),
    path('delete/', views.delete_user, name='delete-user'),
    path('<int:user_id>/', views.user_detail, name='user-detail'),
    path('', views.user_list, name='user-list'),
]
