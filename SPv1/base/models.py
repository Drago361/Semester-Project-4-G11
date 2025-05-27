from django.db import models

class Book(models.Model):
    name = models.CharField(max_length=100)
    ISBN = models.CharField(max_length=13)
    genre = models.CharField(max_length=50)
    publication_date = models.DateField()
    
class Author(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()