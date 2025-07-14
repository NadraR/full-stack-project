from djoser.views import UserViewSet
from rest_framework.response import Response
from rest_framework import status

class CustomUserViewSet(UserViewSet):
    def perform_create(self, serializer):
        user = serializer.save()
        self.custom_response = {
            "message": "LOGIN SUCCESSFULLY",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "phone": user.phone,
            }
        }

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response(self.custom_response, status=status.HTTP_201_CREATED)
