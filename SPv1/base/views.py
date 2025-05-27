from django.shortcuts import render
from django.http import HttpResponse
import csv
from datetime import datetime
from base.models import Book

def import_books(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            Book.objects.create(
                asin=row['asin'],
                title=row['title'],
                author=row['author'],
                sold_by=row.get('sold_by') or None,
                img_url=row['img_url'],
                product_url=row.get('product_url') or None,
                stars=float(row['stars']),
                reviews=int(row['reviews']),
                price=float(row['price']),
                is_kindle_unlimited=row['is_kindle_unlimited'].lower() == 'true',
                category_id=int(row['category_id']) if row['category_id'] else None,
                is_best_seller=row['is_best_seller'].lower() == 'true',
                is_editors_pick=row['is_editors_pick'].lower() == 'true',
                is_goodreads_choice=row['is_goodreads_choice'].lower() == 'true',
                published_date=datetime.strptime(row['published_date'], '%Y-%m-%d').date() if row['published_date'] else None,
                category_name=row['category_name']
            )

if __name__ == '__main__':
    csv_file_path = 'csv/books.csv'  # Replace with your actual file path
    import_books(csv_file_path)

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
