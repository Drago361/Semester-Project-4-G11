from django.shortcuts import render
from django.http import HttpResponse
import csv
from datetime import datetime
from base.models import Book

def home(request):
    return render(request, "base/index.html")

def index(request):
    return render(request, "base/index.html")

def faq(request):
    return render(request, "base/faq.html")

def terms(request):
    return render(request, "base/terms.html")

def privacy(request):
    return render(request, "base/privacy.html")

def placeholder(request):
    return render(HttpResponse("This is a placeholder view."))
