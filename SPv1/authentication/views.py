from django.shortcuts import render
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import *


def login_page(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, "Logged in successfully!")
            return render(request, 'base/index.html')
        else:
            messages.error(request, "Invalid username or password.")
            return render(request, 'authentication/login.html')

    return render(request, 'authentication/login.html')

def register_page(request):
    if request.method == 'POST':
        full_name = request.POST.get('fullname')
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        terms_agreed = request.POST.get('terms')

        #validation 
        if not all([full_name, email, username, password, terms_agreed]):
            messages.error(request, "Please fill in all fields and accept the terms.")
            return render(request, 'authentication/register.html')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return render(request, 'authentication/register.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email is already registered.")
            return render(request, 'authentication/register.html')

        #user creation
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        user.first_name = full_name
        user.save()

        login(request, user)
        messages.success(request, "Registration successful!")
        return redirect('base/index.html')

    return render(request, 'authentication/register.html')

@login_required
def profile_page(request):
    return render(request, 'authentication/profile.html', {
        'user': request.user  # Django injects this automatically, but explicit is okay
    })