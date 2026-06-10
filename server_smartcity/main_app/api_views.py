from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination

from .models import Report
from .serializers import ReportSerializer
from .permissions import IsOwnerAndDraftOrReadOnly


class ReportPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    pagination_class = ReportPagination

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Report.objects.none()

        queryset = Report.objects.all().order_by('-updated_at')

        tab = self.request.query_params.get('tab', None)

        if user.is_admin:
            return queryset.exclude(status='DRAFT')

        if tab == 'my_reports':
            return queryset.filter(reporter=user)

        if tab == 'feed':
            return queryset.exclude(status='DRAFT')

        return queryset.filter(
            Q(reporter=user) | ~Q(status='DRAFT')
        )

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
