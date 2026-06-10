from django.contrib import messages
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.views import View
from .forms import CustomUserCreationForm

class CustomLoginView(LoginView):
    template_name = 'usermanagement_24782040/login.html'

    def form_valid(self, form):
        messages.success(self.request, 'Login berhasil.')
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('report_list')

class CustomLogoutView(LogoutView):
    next_page = reverse_lazy('login')

    def dispatch(self, request, *args, **kwargs):
        messages.success(request, 'Logout berhasil.')
        return super().dispatch(request, *args, **kwargs)

class RegisterView(View):
    def get(self, request):
        form = CustomUserCreationForm()
        return render(request, 'usermanagement_24782040/register.html', {'form': form})

    def post(self, request):
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Registrasi berhasil. Silakan login.')
            return redirect('login')
        return render(request, 'usermanagement_24782040/register.html', {'form': form})
    