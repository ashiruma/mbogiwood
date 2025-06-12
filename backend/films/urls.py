# mbogiwood_backend/films/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('approved/', views.ApprovedFilmListView.as_view(), name='approved-films-list'),
    path('create/', views.FilmCreateView.as_view(), name='film-create'),
    path('my-films/', views.CreatorFilmListView.as_view(), name='creator-films-list'),
]
