from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView

from .models import Report


def home_view(request):
    return render(request, 'main_app/home.html')


class AdminRequiredMixin:
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.error(request, 'Anda harus login terlebih dahulu.')
            return redirect('login')

        if not request.user.is_admin:
            messages.error(request, 'Anda tidak dapat mengakses fitur admin.')
            return redirect('home')

        return super().dispatch(request, *args, **kwargs)


class ReportListView(AdminRequiredMixin, ListView):
    model = Report
    template_name = 'main_app/report_list.html'
    context_object_name = 'reports'

    def get_queryset(self):
        return Report.objects.exclude(status='DRAFT').order_by('-updated_at')


class ReportDetailView(AdminRequiredMixin, DetailView):
    model = Report
    template_name = 'main_app/report_detail.html'
    context_object_name = 'report'

    def get_queryset(self):
        return Report.objects.exclude(status='DRAFT')


class ReportCreateView(CreateView):
    model = Report
    template_name = 'main_app/add_report.html'
    fields = ['title', 'category', 'description', 'location']
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        messages.error(request, 'Pembuatan laporan dilakukan melalui Citizen SPA.')
        return redirect('home')


class ReportUpdateView(UpdateView):
    model = Report
    template_name = 'main_app/edit_report.html'
    fields = ['title', 'category', 'description', 'location']
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        messages.error(
            request,
            'Admin tidak boleh mengubah isi laporan. Admin hanya boleh memperbarui status.'
        )
        return redirect('report_list' if request.user.is_authenticated and request.user.is_admin else 'home')


class ReportDeleteView(DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    context_object_name = 'report'
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        messages.error(request, 'Admin tidak boleh menghapus laporan.')
        return redirect('report_list' if request.user.is_authenticated and request.user.is_admin else 'home')


class ReportUpdateStatusView(AdminRequiredMixin, View):
    def post(self, request, pk):
        report = get_object_or_404(Report.objects.exclude(status='DRAFT'), pk=pk)
        new_status = request.POST.get('status')

        valid_transitions = {
            'REPORTED': 'VERIFIED',
            'VERIFIED': 'IN_PROGRESS',
            'IN_PROGRESS': 'RESOLVED',
        }

        current_status = report.status
        allowed_next_status = valid_transitions.get(current_status)

        if new_status == allowed_next_status:
            report.status = new_status
            report.save()
            messages.success(request, f'Status laporan berhasil diubah menjadi {new_status}.')
        else:
            messages.error(request, 'Perubahan status tidak valid.')

        return redirect('report_list')


def report_live_search(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    if not request.user.is_admin:
        return JsonResponse({'error': 'Forbidden'}, status=403)

    keyword = request.GET.get('q', '')

    reports = (
        Report.objects
        .exclude(status='DRAFT')
        .filter(
            Q(title__icontains=keyword) |
            Q(category__icontains=keyword) |
            Q(status__icontains=keyword) |
            Q(location__icontains=keyword)
        )
        .order_by('-created_at')[:50]
    )

    data = [
        {
            'id': report.id,
            'title': report.title,
            'category': report.category,
            'status': report.status,
            'location': report.location,
        }
        for report in reports
    ]

    return JsonResponse({
        'reports': data,
        'results': data,
    })


def report_detail_json(request, pk):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    if not request.user.is_admin:
        return JsonResponse({'error': 'Forbidden'}, status=403)

    report = get_object_or_404(Report.objects.exclude(status='DRAFT'), pk=pk)

    data = {
        'id': report.id,
        'title': report.title,
        'category': report.category,
        'description': report.description,
        'location': report.location,
        'status': report.status,
    }

    return JsonResponse(data)