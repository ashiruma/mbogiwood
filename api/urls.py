# mbogiwood_backend/mbogiwood_api/urls.py

# ... other imports ...

urlpatterns = [
    # ... existing paths (root redirect, two_factor, admin, api-auth) ...

    path('api/accounts/', include('accounts.urls')),   # Your custom accounts API endpoints
    path('api/films/', include('films.urls')),       # <--- ADD THIS LINE FOR FILM APIs

    # ... password reset views ...
]
