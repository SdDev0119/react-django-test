from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Note


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email
        # Additional custom claims can be added here

        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
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