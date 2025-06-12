# mbogiwood_backend/films/serializers.py

from rest_framework import serializers
from .models import Film
from accounts.serializers import CustomUserSerializer # Import CustomUserSerializer to represent the creator

class FilmSerializer(serializers.ModelSerializer):
    # Nested serializer for the content_creator to show relevant user details
    # read_only=True means this field won't be used for creating/updating the Film via this serializer
    # but will be included when fetching a Film.
    # It will display the username, email, is_content_creator from the CustomUserSerializer.
    content_creator = CustomUserSerializer(read_only=True)

    class Meta:
        model = Film
        fields = [
            'id', 'title', 'description', 'genre', 'director', 'release_year',
            'price', 'poster_image_url', 'video_file_url', 'approval_status',
            'is_active', 'created_at', 'updated_at', 'content_creator'
        ]
        read_only_fields = ['id', 'approval_status', 'created_at', 'updated_at']
