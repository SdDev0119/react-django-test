from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

# Create a router for ViewSet-based views
# DefaultRouter automatically creates URL patterns for CRUD operations
router = DefaultRouter()
# Register the NoteViewSet with the router
# This creates the following URL patterns:
# - GET/POST /notes/ (list/create notes)
# - GET/PUT/PATCH/DELETE /notes/{id}/ (retrieve/update/delete specific note)
router.register(r'notes', views.NoteViewSet, basename='note')

urlpatterns = [
    # JWT Authentication endpoints
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User registration endpoint
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    
    # Test endpoint for authentication verification
    path('test/', views.testEndPoint, name='test'),
    
    # API routes listing endpoint
    path('routes/', views.getRoutes, name='get_routes'),
    
    # Include all router-generated URLs (notes CRUD operations)
    path('', include(router.urls)),
]