# mbogiwood_backend/films/admin.py

from django.contrib import admin
from .models import Film, Order, Payout

@admin.register(Film)
class FilmAdmin(admin.ModelAdmin):
    list_display = ('title', 'content_creator', 'price', 'approval_status', 'is_active', 'created_at')
    list_filter = ('approval_status', 'is_active', 'genre', 'release_year')
    search_fields = ('title', 'description', 'director', 'content_creator__username')
    raw_id_fields = ('content_creator',)
    actions = ['make_approved', 'make_pending', 'make_rejected', 'is_active', 'is_inactive']

    def make_approved(self, request, queryset):
        queryset.update(approval_status='approved', is_active=True)
    make_approved.short_description = "Mark selected films as Approved and Active"

    def make_pending(self, request, queryset):
        queryset.update(approval_status='pending', is_active=False)
    make_pending.short_description = "Mark selected films as Pending and Inactive"

    def make_rejected(self, request, queryset):
        queryset.update(approval_status='rejected', is_active=False)
    make_rejected.short_description = "Mark selected films as Rejected and Inactive"

    def make_active(self, request, queryset):
        queryset.update(is_active=True)
    make_active.short_description = "Activate selected films"

    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)
    make_inactive.short_description = "Deactivate selected films"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'buyer', 'film', 'amount', 'commission_amount', 'payment_method', 'payment_status', 'created_at')
    list_filter = ('payment_method', 'payment_status', 'created_at')
    search_fields = ('buyer__username', 'film__title', 'transaction_id')
    raw_id_fields = ('buyer', 'film')
    readonly_fields = ('commission_amount',)


@admin.register(Payout)
class PayoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'content_creator', 'amount_due', 'amount_paid', 'payout_method', 'status', 'payout_date')
    list_filter = ('payout_method', 'status', 'payout_date')
    search_fields = ('content_creator__username', 'transaction_id')
    raw_id_fields = ('content_creator',)
    actions = ['mark_completed', 'mark_pending']

    def mark_completed(self, request, queryset):
        queryset.update(status='completed', amount_paid=models.F('amount_due'))
    mark_completed.short_description = "Mark selected payouts as Completed"

    def mark_pending(self, request, queryset):
        queryset.update(status='pending', amount_paid=None)
    mark_pending.short_description = "Mark selected payouts as Pending"
