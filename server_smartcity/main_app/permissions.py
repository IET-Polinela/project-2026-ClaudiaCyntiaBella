from rest_framework import permissions


class IsOwnerAndDraftOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        # Read-only
        if request.method in permissions.SAFE_METHODS:
            return True

        user = request.user

        # Admin boleh update status laporan
        if user.is_admin:
            return True

        # Citizen hanya boleh edit/delete
        # laporan sendiri saat masih DRAFT
        return obj.reporter == user and obj.status == 'DRAFT'
