from django.urls import path
from authentication import views as auth_views

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('faq/', views.faq, name='faq'),
    path('terms/', views.terms, name='terms'),
    path('privacy/', views.privacy, name='privacy'),
    path('placeholder/', views.placeholder, name='placeholder'),
    path('profile/', auth_views.profile_page, name='profile'),
    path('login/', auth_views.login_page, name='login'),
    path('register/', auth_views.register_page, name='register'),
]