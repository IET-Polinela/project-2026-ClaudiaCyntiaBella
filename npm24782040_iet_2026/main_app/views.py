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
            messages.error(request, 'Anda tidak dapat mengakses fitur ini.')
            return redirect('report_list')

        return super().dispatch(request, *args, **kwargs)


class ReportListView(ListView):
    model = Report
    template_name = 'main_app/report_list.html'
    context_object_name = 'reports'

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated and user.is_admin:
            return Report.objects.exclude(status='DRAFT').order_by('-updated_at')

        if user.is_authenticated:
            return Report.objects.filter(reporter=user).order_by('-updated_at')

        return Report.objects.none()


class ReportDetailView(DetailView):
    model = Report
    template_name = 'main_app/report_detail.html'
    context_object_name = 'report'


class ReportCreateView(CreateView):
    model = Report
    template_name = 'main_app/add_report.html'
    fields = ['title', 'category', 'description', 'location']
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        messages.error(request, "Pembuatan laporan dilakukan melalui Citizen SPA.")
        return redirect('report_list')


class ReportUpdateView(UpdateView):
    model = Report
    template_name = 'main_app/edit_report.html'
    fields = ['title', 'category', 'description', 'location']
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        messages.error(request, "Admin tidak boleh mengubah isi laporan. Admin hanya boleh memperbarui status.")
        return redirect('report_list')


class ReportDeleteView(DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    context_object_name = 'report'
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        messages.error(request, "Admin tidak boleh menghapus laporan.")
        return redirect('report_list')


class ReportUpdateStatusView(AdminRequiredMixin, View):
    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
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
            messages.success(request, f"Status laporan berhasil diubah menjadi {new_status}.")
        else:
            messages.error(request, "Perubahan status tidak valid.")

        return redirect('report_list')


def report_live_search(request):
    keyword = request.GET.get('q', '')

    reports = Report.objects.filter(
        Q(title__icontains=keyword) |
        Q(category__icontains=keyword) |
        Q(status__icontains=keyword) |
        Q(location__icontains=keyword)
    ).order_by('-created_at')[:50]

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

    return JsonResponse({'reports': data})


def report_detail_json(request, pk):
    report = get_object_or_404(Report, pk=pk)

    data = {
        'id': report.id,
        'title': report.title,
        'category': report.category,
        'description': report.description,
        'location': report.location,
        'status': report.status,
    }

    return JsonResponse(data)
