from rest_framework import serializers
from .models import Campaign, Donation
from django.utils import timezone

class DonationSerializer(serializers.ModelSerializer):
    donor = serializers.StringRelatedField()
    campaign_title = serializers.CharField(source='campaign.title', read_only=True)

    class Meta:
        model = Donation
        fields = ['id', 'campaign', 'amount', 'donation_date', 'message', 'donor', 'campaign_title']
        read_only_fields = ['donor', 'donation_date']

class CampaignSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    donations = DonationSerializer(many=True, read_only=True)
    total_donations = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = ['id', 'title', 'description', 'target_amount', 'start_date', 
                'end_date', 'created_at', 'owner', 'donations',
                'total_donations', 'progress_percentage']
        read_only_fields = ['owner', 'created_at', 'total_donations', 'progress_percentage']

    def validate(self, data):
        if data['start_date'] < timezone.now().date():
            raise serializers.ValidationError("Start date must be in the future.")
        if data['end_date'] <= data['start_date']:
            raise serializers.ValidationError("End date must be after start date.")
        if data['target_amount'] < 100:
            raise serializers.ValidationError("Target amount must be at least $100.")
        return data

    def get_total_donations(self, obj):
        return obj.total_donations

    def get_progress_percentage(self, obj):
        return obj.progress_percentage