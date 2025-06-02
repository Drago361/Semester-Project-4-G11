from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from base.models import Book

# Dynamic BST Node class
class BSTNode:
    def __init__(self, data, key_func):
        self.key = key_func(data)
        self.data = data
        self.left = None
        self.right = None
        self.key_func = key_func

    def insert(self, data):
        key = self.key_func(data)
        if key < self.key:
            if self.left is None:
                self.left = BSTNode(data, self.key_func)
            else:
                self.left.insert(data)
        elif key > self.key:
            if self.right is None:
                self.right = BSTNode(data, self.key_func)
            else:
                self.right.insert(data)

    def search(self, query, results):
        if self.left:
            self.left.search(query, results)
        # Search in title, author, genre for match
        if (
            query in str(self.data.get('title', '')).lower() or
            query in str(self.data.get('author', '')).lower() or
            query in str(self.data.get('genre', '')).lower()
        ):
            results.append(self.data)
        if self.right:
            self.right.search(query, results)

def build_bst_from_db(key_func):
    root = None
    books = Book.objects.all().values('title', 'author', 'genre', 'rating', 'description')
    for book in books:
        if not root:
            root = BSTNode(book, key_func)
        else:
            root.insert(book)
    return root

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

def profile(request):
    return render(request, "base/profile.html", {
        'user': request.user
    })

def login(request):
    return render(request, "base/login.html")

def register(request):
    return render(request, "base/register.html")

def autocomplete_books(request):
    if 'term' in request.GET:
        query = request.GET.get('term')
        books = Book.objects.filter(title__icontains=query)[:15]
        results = [
            {"label": f"{book.title} - {book.author}", "value": book.title}
            for book in books
        ]
        return JsonResponse(results, safe=False)
    return JsonResponse([], safe=False)

def search_books_bst(request):
    query = request.GET.get('q', '').strip().lower()
    sort_by = request.GET.get('sort', 'title').lower()
    if not query:
        return JsonResponse({'results': []})

    # Choose key function based on sort_by
    if sort_by == 'author':
        key_func = lambda book: (book.get('author') or '').lower()
    elif sort_by == 'genre':
        key_func = lambda book: (book.get('genre') or '').lower()
    elif sort_by == 'rating':
        # For rating, sort descending (highest first)
        key_func = lambda book: -(book.get('rating') or 0)
    else:  # Default: title (relevance)
        key_func = lambda book: (book.get('title') or '').lower()

    bst_root = build_bst_from_db(key_func)
    results = []
    if bst_root:
        bst_root.search(query, results)
    return JsonResponse({'results': results})
