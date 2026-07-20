from django.urls import path
from . import views

urlpatterns = [
    path('conversations/', views.conversation_list, name='conversation-list'),
    path('conversations/<int:conversation_id>/', views.chat_messages, name='chat-messages'),
    path('message/<int:message_id>/delete/', views.delete_message, name='delete-message'),
]