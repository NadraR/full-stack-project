from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers
from .models import User  
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['username', 'email', 'phone', 'password', ]
        extra_kwargs = {
            'phone': {'required': True},
            'username': {'required': True},
            'email': {'required': True},
            'password': {'required': True},
        }

    def create(self, validated_data):
        user = super().create(validated_data)
        self.context['response_data'] = {
            "message": "LOGIN SUCCESFLLY",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "phone": user.phone,
            }
        }
        return user


class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ['id', 'username', 'email', 'phone']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = CustomUserSerializer(self.user).data
        return data