from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, DonationViewSet

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')
router.register(r'donations', DonationViewSet, basename='donation')

urlpatterns = [
    path('', include(router.urls)),
]
