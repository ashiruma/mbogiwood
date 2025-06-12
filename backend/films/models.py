# mbogiwood_backend/films/models.py

from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from django.utils import timezone
import uuid

class Film(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    genre = models.CharField(max_length=100)
    director = models.CharField(max_length=255)
    release_year = models.IntegerField(validators=[MinValueValidator(1900)])
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    content_creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='films_uploaded',
        limit_choices_to={'is_content_creator': True}
    )
    poster_image_url = models.URLField(max_length=500, blank=True, null=True)
    video_file_url = models.URLField(max_length=500, blank=True, null=True)
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    approval_status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending',
        help_text='KFCB approval status.'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, help_text='Is this film publicly available?')

    def __str__(self):
        return f"{self.title} ({self.release_year})"

    class Meta:
        ordering = ['-created_at']

class Order(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('stripe', 'Stripe (Card)'),
        ('mpesa', 'M-Pesa'),
    ]
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='film_purchases',
        limit_choices_to={'is_film_viewer': True}
    )
    film = models.ForeignKey(Film, on_delete=models.PROTECT, related_name='orders')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    transaction_id = models.CharField(max_length=255, unique=True, blank=True, null=True,
                                      help_text="ID from payment gateway (Stripe, M-Pesa)")
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.commission_amount = self.amount * models.Decimal('0.10')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.id} - {self.film.title} by {self.buyer.username if self.buyer else 'N/A'}"

class Payout(models.Model):
    PAYOUT_METHOD_CHOICES = [
        ('mpesa', 'M-Pesa'),
        ('bank_transfer', 'Bank Transfer'),
    ]
    content_creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='payouts_received',
        limit_choices_to={'is_content_creator': True}
    )
    amount_due = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.00)])
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    payout_method = models.CharField(max_length=20, choices=PAYOUT_METHOD_CHOICES)
    transaction_id = models.CharField(max_length=255, unique=True, blank=True, null=True,
                                      help_text="Transaction ID from M-Pesa B2C or Bank transfer")
    payout_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')],
        default='pending'
    )

    def __str__(self):
        return f"Payout of {self.amount_due} to {self.content_creator.username} on {self.payout_date.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ['-payout_date']
