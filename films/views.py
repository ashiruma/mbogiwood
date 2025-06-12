# mbogiwood_backend/films/views.py

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Film
from .serializers import FilmSerializer
from accounts.models import CustomUser # Import CustomUser to check roles

# --- API View to List All Approved Films (for FilmViewers/Public) ---
class ApprovedFilmListView(generics.ListAPIView):
    serializer_class = FilmSerializer
    permission_classes = [permissions.AllowAny] # Anyone can view approved films

    def get_queryset(self):
        # Only return films that are approved and active
        return Film.objects.filter(approval_status='approved', is_active=True)

# --- API View to Create a New Film (for ContentCreators) ---
class FilmCreateView(generics.CreateAPIView):
    serializer_class = FilmSerializer
    permission_classes = [permissions.IsAuthenticated] # Only logged-in users can create films

    def perform_create(self, serializer):
        # Set the content_creator of the film to the currently logged-in user
        # Ensure only actual content creators can upload films
        if not self.request.user.is_content_creator:
            raise permissions.PermissionDenied("You must be a Content Creator to upload films.")
        serializer.save(content_creator=self.request.user)

# --- API View to List Films by the Authenticated Content Creator ---
class CreatorFilmListView(generics.ListAPIView):
    serializer_class = FilmSerializer
    permission_classes = [permissions.IsAuthenticated] # Only logged-in users can view their films

    def get_queryset(self):
        # Only return films uploaded by the current logged-in user
        if not self.request.user.is_authenticated:
            return Film.objects.none() # Return empty queryset if not authenticated
        return Film.objects.filter(content_creator=self.request.user)
