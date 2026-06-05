from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    reporter = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)

    class Meta:
        model = Report
        fields = [
            'id',
            'title',
            'category',
            'description',
            'location',
            'status',
            'reporter',
            'is_owner',
            'created_at',
            'updated_at',
        ]

    def get_reporter(self, obj):
        request = self.context.get('request')

        if request:
            tab = request.query_params.get('tab')

            if tab == 'feed':
                return 'Warga Anonim'

            if request.user.is_authenticated and obj.reporter == request.user:
                return obj.reporter.username

        return 'Warga Anonim'

    def get_is_owner(self, obj):
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            return obj.reporter == request.user

        return False
