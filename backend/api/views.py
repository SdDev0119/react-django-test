from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from api.serializer import MyTokenObtainPairSerializer, RegisterSerializer, NoteSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets
from .models import Note
import json

# Create your views here.


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT token view that uses our custom serializer.
    This view handles user login and returns JWT tokens with custom claims.
    """
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """
    User registration view that allows anyone to create a new account.
    Uses the RegisterSerializer for validation and user creation.
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,)  # Allow unauthenticated access for registration
    serializer_class = RegisterSerializer


class NoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling all CRUD operations on Note model.
    Provides endpoints for:
    - GET /notes/ (list all user's notes)
    - POST /notes/ (create new note)
    - GET /notes/{id}/ (retrieve specific note)
    - PUT /notes/{id}/ (update specific note)
    - DELETE /notes/{id}/ (delete specific note)
    """
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]  # Require authentication for all operations
    
    def get_queryset(self):
        """
        Override to return only notes belonging to the current authenticated user.
        This ensures users can only see and modify their own notes.
        """
        return Note.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """
        Override to automatically set the current user as the note owner.
        Called when creating a new note via POST request.
        """
        serializer.save(user=self.request.user)


@api_view(['GET'])
def getRoutes(request):
    """
    API endpoint that returns a list of available routes.
    Useful for API documentation and frontend development.
    """
    routes = [
        '/api/token/',           # JWT token obtain (login)
        '/api/register/',        # User registration
        '/api/token/refresh/',   # JWT token refresh
        '/api/test/',           # Test endpoint for authentication
        '/api/notes/',          # Notes list and create
        '/api/notes/<int:pk>/', # Individual note operations
    ]
    return Response(routes)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    """
    Test endpoint for verifying JWT authentication is working.
    Supports both GET and POST requests with different responses.
    Used for development and testing purposes.
    """
    if request.method == 'GET':
        # Simple GET response with user information
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        try:
            # Parse JSON body from POST request
            body = request.body.decode('utf-8')
            data = json.loads(body)
            
            # Validate that 'text' field is present
            if 'text' not in data:
                return Response("Invalid JSON data", status.HTTP_400_BAD_REQUEST)
            
            text = data.get('text')
            data = f'Congratulation your API just responded to POST request with text: {text}'
            return Response({'response': data}, status=status.HTTP_200_OK)
            
        except json.JSONDecodeError:
            # Handle invalid JSON data
            return Response("Invalid JSON data", status.HTTP_400_BAD_REQUEST)
    
    # Fallback for unsupported methods
    return Response("Invalid JSON data", status.HTTP_400_BAD_REQUEST)