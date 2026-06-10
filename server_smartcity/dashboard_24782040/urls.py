from django.urls import path
from .views import DashboardView, dashboard_data

app_name = 'dashboard_24782040'

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('data/', dashboard_data, name='dashboard_data'),
]
