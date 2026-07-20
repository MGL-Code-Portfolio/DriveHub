from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model, authenticate, login as django_login, logout as django_logout
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        django_login(request, user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    login_input = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')

    if not login_input or not password:
        return Response({'error': 'Please provide both credentials.'}, status=status.HTTP_400_BAD_REQUEST)

    username = login_input
    if '@' in login_input:
        try:
            user_obj = User.objects.get(email=login_input)
            username = user_obj.username
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(request, username=username, password=password)

    if user is not None:
        if not user.is_active:
            return Response({'error': 'This account has been deactivated.'}, status=status.HTTP_403_FORBIDDEN)

        django_login(request, user)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    django_logout(request)
    return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request):
    user = request.user
    django_logout(request)
    user.delete()
    return Response({"message": "Account deleted successfully."}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
    search = request.query_params.get('search', '')
    users = User.objects.exclude(pk=request.user.pk)
    if search:
        users = users.filter(username__icontains=search) | users.filter(first_name__icontains=search)
    users = users[:20]
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    serializer = UserSerializer(user)
    return Response(serializer.data)