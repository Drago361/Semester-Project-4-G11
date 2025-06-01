# Import necessary modules
from django.contrib import admin
from django.urls import path
from authentication.views import *
from authentication import views
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('api/recommend_for_favorites/', views.recommend_for_favorites, name='recommend_for_favorites'),
    path('api/recommend/favorites/', recommend_for_favorites, name='recommend_for_favorites'),
    path('recommend/', views.content_similarity_view, name='content_similarity'),
    path("api/content-similarity/", content_similarity_view, name="content_similarity"),
    path('api/recommend/', views.recommend_view, name='recommend_api'),
]
