from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from base.models import Book

# BST Node class
class BSTNode:
    def __init__(self, title, data):
        self.title = title.lower()
        self.data = data
        self.left = None
        self.right = None

    def insert(self, title, data):
        title = title.lower()
        if title < self.title:
            if self.left is None:
                self.left = BSTNode(title, data)
            else:
                self.left.insert(title, data)
        elif title > self.title:
            if self.right is None:
                self.right = BSTNode(title, data)
            else:
                self.right.insert(title, data)

    def search(self, query, results):
        # In-order traversal with substring match
        if self.left:
            self.left.search(query, results)
        if query in self.title:
            results.append(self.data)
        if self.right:
            self.right.search(query, results)

def build_bst_from_db():
    root = None
    books = Book.objects.all().values('title', 'author')
    for book in books:
        title = book['title']
        if not root:
            root = BSTNode(title, book)
        else:
            root.insert(title, book)
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
    if not query:
        return JsonResponse({'results': []})

    bst_root = build_bst_from_db()
    results = []
    if bst_root:
        bst_root.search(query, results)
    return JsonResponse({'results': results})
