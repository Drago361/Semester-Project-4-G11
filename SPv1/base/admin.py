from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from base.models import Book
from import_export import resources

def before_import(self, dataset, **kwargs):
    super().before_import(dataset, **kwargs)
    dataset.append_col([None] * len(dataset), header='id')

class BookResource(resources.ModelResource):

    class Meta:
        model = Book  # or 'core.Book'
        import_id_fields = ('asin',)
        fields = (
            'asin', 'title', 'author', 'soldBy', 'imgUrl', 'productUrl',
            'stars', 'reviews', 'price', 'isKindleUnlimited',
            'categoryId', 'isBestSeller', 'isEditorsPick',
            'isGoodReadsChoice', 'publishedDate', 'categoryName')

def before_import(self, dataset, **kwargs):
    super().before_import(dataset, **kwargs)
    dataset.append_col([None] * len(dataset), header='id')



@admin.register(Book)
class BookAdmin(ImportExportModelAdmin):
    resource_classes = [BookResource]


#admin.site.register(Book)
#admin.site.register(Author)

# Register your models here.
