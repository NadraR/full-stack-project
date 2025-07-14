from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator

User = get_user_model()

class Campaign(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='campaigns')
    title = models.CharField(max_length=255)
    description = models.TextField()
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.title

    @property
    def total_donations(self):
        return float(self.donations.aggregate(
            total=models.Sum('amount')
        )['total'] or 0.00)

    @property
    def donation_count(self):
        return self.donations.count()

    @property
    def progress_percentage(self):
        target = float(self.target_amount)
        if target == 0:
            return 0
        return min(round((self.total_donations / target) * 100), 100)

    class Meta:
        ordering = ['-created_at']

class Donation(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='donations')
    donor = models.ForeignKey(User,on_delete=models.SET_NULL, null=True, related_name='donations_made')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(1.0)])
    donation_date = models.DateTimeField(auto_now_add=True)
    message = models.TextField(blank=True, null=True)

    def __str__(self):
        donor_name = self.donor.username if self.donor else "Anonymous"
        return f"{donor_name} donated {self.amount} to {self.campaign.title}"

    class Meta:
        ordering = ['-donation_date']