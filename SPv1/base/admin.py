from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from base.models import Book

class BookResource(resources.ModelResource):

    class Meta:
        model = Book  # or 'core.Book'

@admin.register(Book)
class BookAdmin(ImportExportModelAdmin):
    resource_classes = [BookResource]


#admin.site.register(Book)
#admin.site.register(Author)

# Register your models here.
