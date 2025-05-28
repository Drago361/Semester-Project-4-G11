# Import necessary modules
from django.contrib import admin
from django.urls import path
from authentication.views import *
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    #path('login/', login_page, name='login_page'),    #login
    #path('register/', register_page, name='register_page'),  #reg
]
