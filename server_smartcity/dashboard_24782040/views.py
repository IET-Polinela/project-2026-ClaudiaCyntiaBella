from django.contrib import messages
from django.db.models import Count
from django.http import JsonResponse
from django.shortcuts import redirect
from django.views.generic import TemplateView

from main_app.models import Report


class AdminDashboardRequiredMixin:
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.error(request, 'Anda harus login terlebih dahulu.')
            return redirect('login')

        if not request.user.is_admin:
            messages.error(request, 'Anda tidak dapat mengakses dashboard admin.')
            return redirect('home')

        return super().dispatch(request, *args, **kwargs)


class DashboardView(AdminDashboardRequiredMixin, TemplateView):
    template_name = 'dashboard_24782040/dashboard.html'


def dashboard_data(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    if not request.user.is_admin:
        return JsonResponse({'error': 'Forbidden'}, status=403)

    status_data = (
        Report.objects
        .exclude(status='DRAFT')
        .values('status')
        .annotate(total=Count('id'))
        .order_by('status')
    )

    category_data = (
        Report.objects
        .exclude(status='DRAFT')
        .values('category')
        .annotate(total=Count('id'))
        .order_by('category')
    )

    latest_reported = (
        Report.objects
        .filter(status='REPORTED')
        .order_by('-id')[:5]
    )

    latest_resolved = (
        Report.objects
        .filter(status='RESOLVED')
        .order_by('-id')[:5]
    )

    data = {
        'status_labels': [item['status'] for item in status_data],
        'status_values': [item['total'] for item in status_data],

        'category_labels': [item['category'] for item in category_data],
        'category_values': [item['total'] for item in category_data],

        'latest_reported': [
            {
                'id': report.id,
                'title': report.title,
                'category': report.category,
                'status': report.status,
                'location': report.location,
            }
            for report in latest_reported
        ],

        'latest_resolved': [
            {
                'id': report.id,
                'title': report.title,
                'category': report.category,
                'status': report.status,
                'location': report.location,
            }
            for report in latest_resolved
        ],
    }

    return JsonResponse(data)
