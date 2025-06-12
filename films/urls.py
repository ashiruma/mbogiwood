# mbogiwood_backend/films/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('approved/', views.ApprovedFilmListView.as_view(), name='approved-films-list'),
    path('create/', views.FilmCreateView.as_view(), name='film-create'),
    path('my-films/', views.CreatorFilmListView.as_view(), name='creator-films-list'),
    # We can add detail views (retrieve, update, delete) later
    # path('<int:pk>/', views.FilmDetailView.as_view(), name='film-detail'),
    # path('<int:pk>/update/', views.FilmUpdateView.as_view(), name='film-update'),
    # path('<int:pk>/delete/', views.FilmDeleteView.as_view(), name='film-delete'),
]
