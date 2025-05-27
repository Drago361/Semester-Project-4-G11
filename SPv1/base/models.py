from django.db import models

'''class Book(models.Model):
    name = models.CharField(max_length=100)
    ISBN = models.CharField(max_length=13)
    genre = models.CharField(max_length=50)
    publication_date = models.DateField()
    
class Author(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()'''

class Book(models.Model):
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
        return self.name
    
'''class Author(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
class Category(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name'''