from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Report
from .serializers import ReportSerializer
from .permissions import IsOwnerAndDraftOrReadOnly


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated and user.is_admin:
            return Report.objects.exclude(
                status='DRAFT'
            ).order_by('-created_at')

        if user.is_authenticated:
            return Report.objects.filter(
                reporter=user
            ).order_by('-created_at')

        return Report.objects.none()

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [
                permissions.IsAuthenticated,
                IsOwnerAndDraftOrReadOnly
            ]
        else:
            permission_classes = [
                permissions.IsAuthenticated
            ]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        user = self.request.user

        if user.is_admin:
            raise PermissionDenied(
                'Admin tidak boleh membuat laporan.'
            )

        serializer.save(
            reporter=user,
            status='DRAFT'
        )

    def perform_destroy(self, instance):
        user = self.request.user

        if user.is_admin:
            raise PermissionDenied(
                'Admin tidak boleh menghapus laporan.'
            )

        instance.delete()
