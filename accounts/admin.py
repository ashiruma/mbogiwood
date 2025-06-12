# mbogiwood_backend/accounts/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin # Import UserAdmin for base functionality
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Add 'is_content_creator' and 'is_film_viewer' to fieldsets and list_display
    # to make them visible and editable in the admin.

    # fieldsets control the layout of the edit form in admin
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('is_content_creator', 'is_film_viewer', )}),
    )

    # list_display controls what columns are shown in the list view of users
    list_display = (
        'username', 'email', 'is_staff', 'is_active',
        'is_content_creator', 'is_film_viewer' # Add custom fields to list view
    )

    # list_filter allows filtering in the sidebar
    list_filter = (
        'is_staff', 'is_active', 'is_content_creator', 'is_film_viewer'
    )

    # search_fields allows searching by these fields
    search_fields = ('username', 'email')

    # Add any other customizations as needed.
