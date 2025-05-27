from django.db import models
from import_export import resources

class Book(models.Model):
    asin = models.CharField(max_length=20, primary_key=True, null=False, blank=False)
    # ASIN: Amazon Standard Identification Number
    title = models.TextField(null=False, blank=False)
    # Title of the book
    author = models.CharField(max_length=255, null=False, blank=False)
    # Author(s) of the book
    soldBy = models.CharField(max_length=255, null=True, blank=True)
    # Seller of the book
    imgUrl = models.URLField()
    # URL of the book's image
    productUrl = models.URLField(null=True, blank=True)
    # URL of the book's product page
    stars = models.DecimalField(max_digits=3, decimal_places=2)
    reviews = models.IntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    isKindleUnlimited = models.BooleanField(null=True, blank=True)
    categoryId = models.IntegerField(null=True, blank=True)
    # Category ID of the book
    isBestSeller = models.BooleanField()
    isEditorsPick = models.BooleanField()
    isGoodReadsChoice = models.BooleanField()
    publishedDate = models.DateField(  null=True, blank=True)
    categoryName = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.title} by {self.author}"
    
    def before_import(self, dataset, **kwargs):
       super().before_import(dataset, **kwargs)
       dataset.append_col([], header='id')

'''class Book(models.Model):
    name = models.CharField(max_length=100)
    ISBN = models.CharField(max_length=13)
    genre = models.CharField(max_length=50)
    publication_date = models.DateField()
    
class Author(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()'''

'''class Book(models.Model):
    bookID = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    authors = models.CharField(max_length=200)
    average_rating = models.FloatField()
    isbn = models.CharField(max_length=13, unique=True)
    isbn13 = models.CharField(max_length=13, unique=True)
    language_code = models.CharField(max_length=10)
    num_pages = models.IntegerField()
    ratings_count = models.IntegerField()
    text_reviews_count = models.IntegerField()
    
    def __str__(self):
        return self.name'''
    
'''class Author(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
class Category(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name'''