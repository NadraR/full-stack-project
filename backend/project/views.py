from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .models import Campaign, Donation
from .serializers import CampaignSerializer, DonationSerializer
from .permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticated

class CampaignViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]      
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['owner']
    search_fields = ['title', 'description']


    def get_queryset(self):
        return Campaign.objects.select_related('owner').prefetch_related('donations')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def mine(self, request):
        campaigns = self.get_queryset().filter(owner=request.user)
        serializer = self.get_serializer(campaigns, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def donations(self, request, pk=None):
        campaign = self.get_object()
        donations = campaign.donations.all()
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)

class DonationViewSet(viewsets.ModelViewSet):
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['campaign', 'donor']

    def get_queryset(self):
        return Donation.objects.select_related('campaign', 'donor')

    def perform_create(self, serializer):
        serializer.save(donor=self.request.user)