from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Note(models.Model):
    """
    Note model for storing user notes with title, content, and timestamps.
    Each note is associated with a specific user through a foreign key relationship.
    """
    # Title field with maximum length of 200 characters as specified in requirements
    title = models.CharField(max_length=200)
    
    # Content field using TextField for unlimited text storage
    content = models.TextField()
    
    # Auto-generated timestamp when note is created (auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Foreign key relationship to User model with CASCADE delete
    # related_name='notes' allows accessing user's notes via user.notes.all()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    
    class Meta:
        # Order notes by creation date (newest first) using negative sign
        ordering = ['-created_at']
    
    def __str__(self):
        """String representation of the Note object returns the title"""
        return self.title