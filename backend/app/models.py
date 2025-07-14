from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import RegexValidator

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, phone, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username is required')
        if not email:
            raise ValueError('The Email is required')
        if not phone:
            raise ValueError('The Phone is required')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, phone, password, **extra_fields)


class User(AbstractUser):
    phone_regex = RegexValidator(
        regex=r'^01[0-9]{9}$',
        message="Please enter a valid Egyptian phone number (10 digits starting with 01)"
    )

    phone = models.CharField(
        max_length=11,
        validators=[phone_regex],
        unique=True,
        verbose_name="Phone Number"
    )

    email = models.EmailField(
        unique=True,
        verbose_name="Email Address"
    )

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',
        blank=True
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',
        blank=True
    )

    def __str__(self):
        return f"{self.username} - {self.email}"

    @property
    def total_donations_made(self):     # Total Donations For User
        from django.db.models import Sum
        return self.donations_made.aggregate(
            total=Sum('amount')
        )['total'] or 0.00
    
    @property
    def active_campaigns(self):   # Active Campaigns
        from django.utils import timezone
        return self.campaigns.filter(
            end_date__gte=timezone.now().date()
        )
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
