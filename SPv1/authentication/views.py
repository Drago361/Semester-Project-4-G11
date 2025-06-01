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
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json



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
'''
@csrf_exempt
def recommend_for_favorites(request):
    import json
    if request.method == 'POST':
        data = json.loads(request.body)
        titles = [t.strip().lower() for t in data.get('titles', [])]
        all_recs = []
        seen = set()
        for title in titles:
            recs = get_recommendations_by('title', title)
            if isinstance(recs, str):
                continue
            for _, row in recs.iterrows():
                key = (row['title'], row['author'])
                if key not in seen and row['title'] not in titles:
                    all_recs.append({
                        'title': row['title'],
                        'author': row['author'],
                        'stars': row['stars'],
                        'isBestSeller': row['isBestSeller'],
                    })
                    seen.add(key)
        return JsonResponse({'results': all_recs})
    return JsonResponse({'results': []})
'''
@csrf_exempt
def content_similarity_view(request):
    print("Received POST for content similarity")
    print("Dropdown:", dropdown_id)
    print("Value:", value)


    if request.method == "POST":
        # Try parsing JSON first
        try:
            import json
            data = json.loads(request.body)
            dropdown_id = data.get("dropdown_id")
            value = data.get("value")
        except (json.JSONDecodeError, TypeError):
            # Fallback to form POST
            dropdown_id = request.POST.get("dropdown_id")
            value = request.POST.get("value")

        if not dropdown_id or not value:
            return JsonResponse({'error': 'Missing parameters'}, status=400)

        result = get_recommendations_by(dropdown_id, value)
        if isinstance(result, str):
            return JsonResponse({'error': result}, status=404)

        return JsonResponse({'recommendations': result.to_dict(orient='records')}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=405)





@csrf_exempt  # Use this only if you're not using CSRF tokens in JS
def recommend_view(request):
    print("🧠 recommend_view() was called!")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            dropdown_type = data.get('dropdown_type')
            value = data.get('value')

            if not dropdown_type or not value:
                return JsonResponse({'error': 'Missing parameters'}, status=400)


            result_df = get_recommendations_by(dropdown_type, value)
            
            if isinstance(result_df, str):
                print("⚠️ No recommendations found:", result_df)
                print("Dropdown type:", dropdown_type)
                print("Value:", value)

                return JsonResponse({'error': result_df}, status=404)

            return JsonResponse(result_df.to_dict(orient='records'), safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
