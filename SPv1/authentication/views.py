from django.shortcuts import render, redirect
from django.contrib import messages
from .recommender import get_recommendations_by 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from authentication.recommender import get_recommendations_by
from django.contrib.auth.models import User
from .models import *
from django.http import JsonResponse


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
        fullname = request.POST.get('fullname')
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        terms_agreed = request.POST.get('terms')

        #validation 
        if not all([fullname, email, username, password, terms_agreed]):
            messages.error(request, "Please fill in all fields and accept the terms.")
            return render(request, 'authentication/register.html')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return render(request, 'authentication/register.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email is already registered.")
            return render(request, 'authentication/register.html')

        #user creation
        user = User.objects.create_user(username=username, email=email, password=password)
        user.first_name = fullname  
        user.save()

        login(request, user)
        messages.success(request, ("Registration successful!"))
        return render(request, 'authentication/profile.html')

    return render(request, 'authentication/register.html')

@login_required
def profile_page(request):
    return render(request, 'authentication/profile.html', {
        'user': request.user  
    })

def logout_view(request):
    logout(request)
    return render(request, 'authentication/login.html')

def profile(request):
    recommendations = []
    message = ""

    if request.method == 'POST' and 'recommend' in request.POST:
        criteria = request.POST.get('criteria')
        value = request.POST.get('value')

        result = get_recommendations_by(criteria, value)
        if isinstance(result, str):
            message = result
        else:
            recommendations = result.to_dict(orient='records')

    return render(request, 'authentication/profile.html', {
        'recommendations': recommendations,
        'message': message,
    })

@csrf_exempt
def recommend_for_favorites(request):
    import json
    from authentication.recommender import get_recommendations_by, df
    if request.method == 'POST':
        data = json.loads(request.body)
        titles = [t.strip().lower() for t in data.get('titles', [])]
        all_recs = []
        seen = set()
        for title in titles:
            # Recommend by title
            recs_title = get_recommendations_by('title', title)
            if not isinstance(recs_title, str):
                for _, row in recs_title.iterrows():
                    key = (row['title'], row['author'])
                    if key not in seen:
                        all_recs.append({
                            'title': row['title'],
                            'author': row['author'],
                            'stars': row['stars'],
                            'isBestSeller': row['isBestSeller'],
                        })
                        seen.add(key)
            # Recommend by author and bestseller if available
            match = df[df['title'].str.strip().str.lower() == title]
            if not match.empty:
                author = match.iloc[0]['author'].strip().lower()
                is_bestseller = match.iloc[0]['isBestSeller']
                # Recommend by author
                recs_author = get_recommendations_by('author', author)
                if not isinstance(recs_author, str):
                    for _, row in recs_author.iterrows():
                        key = (row['title'], row['author'])
                        if key not in seen:
                            all_recs.append({
                                'title': row['title'],
                                'author': row['author'],
                                'stars': row['stars'],
                                'isBestSeller': row['isBestSeller'],
                            })
                            seen.add(key)
                # Recommend by bestseller status if True
                if is_bestseller and str(is_bestseller).lower() in ['true', 'yes', '1']:
                    recs_bestseller = get_recommendations_by('isBestSeller', 'true')
                    if not isinstance(recs_bestseller, str):
                        for _, row in recs_bestseller.iterrows():
                            key = (row['title'], row['author'])
                            if key not in seen:
                                all_recs.append({
                                    'title': row['title'],
                                    'author': row['author'],
                                    'stars': row['stars'],
                                    'isBestSeller': row['isBestSeller'],
                                })
                                seen.add(key)
        return JsonResponse({'results': all_recs})
    return JsonResponse({'results': []})