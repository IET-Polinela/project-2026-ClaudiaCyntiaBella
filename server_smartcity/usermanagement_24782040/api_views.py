from django.contrib.auth import get_user_model
from rest_framework import generics
from drf_spectacular.utils import extend_schema, extend_schema_view

from .serializers import RegisterSerializer

User = get_user_model()


@extend_schema_view(
    post=extend_schema(exclude=True)
)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
