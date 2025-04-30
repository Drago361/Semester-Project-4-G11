from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('faq/', views.faq, name='faq'),
    path('terms/', views.terms, name='terms'),
    path('privacy/', views.privacy, name='privacy'),
    path('placeholder/', views.placeholder, name='placeholder'),
]