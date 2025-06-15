from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Note


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer that adds additional user information to the token payload.
    Extends the default TokenObtainPairSerializer to include username and email in JWT claims.
    """
    @classmethod
    def get_token(cls, user):
        # Get the default token from parent class
        token = super().get_token(user)

        # Add custom claims to the JWT token
        token['username'] = user.username
        token['email'] = user.email
        # Additional custom claims can be added here

        return token


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration with password confirmation validation.
    Handles user creation with username and password fields.
    """
    # Password field with write-only access and Django's built-in password validation
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    
    # Password confirmation field for validation
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2')

    def validate(self, attrs):
        """
        Custom validation to ensure password and password2 fields match.
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        """
        Create a new user with the validated data.
        Uses Django's built-in set_password method for proper password hashing.
        """
        user = User.objects.create(
            username=validated_data['username']
        )

        # Use set_password to properly hash the password
        user.set_password(validated_data['password'])
        user.save()

        return user


class NoteSerializer(serializers.ModelSerializer):
    """
    Serializer for the Note model with user relationship handling.
    Provides CRUD operations for notes with proper user association.
    """
    # Display username instead of user ID in responses (read-only)
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Note
        # Include all relevant fields in the serialization
        fields = ['id', 'title', 'content', 'created_at', 'user']
        # Make certain fields read-only (auto-generated or system-managed)
        read_only_fields = ['id', 'created_at', 'user']
    
    def create(self, validated_data):
        """
        Override create method to automatically associate the note with the current user.
        The user is obtained from the request context.
        """
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)