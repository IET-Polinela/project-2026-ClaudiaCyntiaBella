from django.urls import path
from .views import (
    home_view,
    ReportListView,
    ReportDetailView,
    ReportCreateView,
    ReportUpdateView,
    ReportDeleteView,
    ReportUpdateStatusView,
    report_live_search,
    report_detail_json,
)

urlpatterns = [
    path('', home_view, name='home'),
    path('reports/', ReportListView.as_view(), name='report_list'),
    path('reports/add/', ReportCreateView.as_view(), name='add_report'),

    path('reports/search/', report_live_search, name='report_live_search'),
    path('reports/<int:pk>/json/', report_detail_json, name='report_detail_json'),

    path('reports/<int:pk>/', ReportDetailView.as_view(), name='report_detail'),
    path('reports/<int:pk>/edit/', ReportUpdateView.as_view(), name='edit_report'),
    path('reports/<int:pk>/delete/', ReportDeleteView.as_view(), name='delete_report'),
    path('reports/<int:pk>/update-status/', ReportUpdateStatusView.as_view(), name='update_status'),
]