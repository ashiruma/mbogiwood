# mbogiwood_backend/films/serializers.py

from rest_framework import serializers
from .models import Film
from accounts.serializers import CustomUserSerializer

class FilmSerializer(serializers.ModelSerializer):
    content_creator = CustomUserSerializer(read_only=True)

    class Meta:
        model = Film
        fields = [
            'id', 'title', 'description', 'genre', 'director', 'release_year',
            'price', 'poster_image_url', 'video_file_url', 'approval_status',
            'is_active', 'created_at', 'updated_at', 'content_creator'
        ]
        read_only_fields = ['id', 'approval_status', 'created_at', 'updated_at']
