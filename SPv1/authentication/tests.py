from django.test import TestCase, Client
from base.models import Book
import json
'''''''''''''''
class RecommendationTestCase(TestCase):
    def setUp(self):
        Book.objects.create(
            asin="123ABC",
            title="Test Book",
            author="Test Author",
            reviews=100,
            stars=4.5,
            price=10.99,
            imgUrl="http://example.com/img.jpg",
            productURL="http://example.com/product",
            isKindleUnlimited=False,
            category_id=1,
            isBestSeller=True,
            isEditorsPick=False,
            isGoodReadsChoice=False,
            publishedDate="2022-01-01",
            category_name="Fiction",
            soldBy="Test Seller"
        )

    def test_recommend_for_favorites(self):
        client = Client()
        response = client.post("/api/recommend_for_favorites/", data=json.dumps({
            "titles": ["Test Book"]
        }), content_type="application/json")
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("results", response.json())
'''''''''
class AutocompleteIntegrationTest(TestCase):
    def setUp(self):
        Book.objects.create(
            asin="B001",
            title="The Great Gatsby",
            author="F. Scott Fitzgerald",
            stars=4.2,
            reviews=3000,
            price=9.99,
            category_name="Fiction"
        )
        Book.objects.create(
            asin="B002",
            title="The Grapes of Wrath",
            author="John Steinbeck",
            stars=4.5,
            reviews=2500,
            price=8.99,
            category_name="Fiction"
        )
        self.client = Client()

    def test_autocomplete_returns_matching_titles(self):
        response = self.client.get('/autocomplete/', {'term': 'Grap'})
        self.assertEqual(response.status_code, 200)
        self.assertIn("The Grapes of Wrath", str(response.content))

class SearchBooksBSTComponentTest(TestCase):
    def setUp(self):
        Book.objects.create(
            asin="B001",
            title="Alpha Book",
            author="Alice Author",
            stars=4.0,
            reviews=100,
            price=12.99,
            category_name="Fiction"
        )
        Book.objects.create(
            asin="B002",
            title="Beta Book",
            author="Bob Author",
            stars=4.5,
            reviews=200,
            price=15.99,
            category_name="Nonfiction"
        )
        Book.objects.create(
            asin="B003",
            title="Gamma Book",
            author="Charlie Author",
            stars=3.5,
            reviews=50,
            price=8.99,
            category_name="Fiction"
        )
        self.client = Client()

    def test_search_returns_matching_books(self):
        response = self.client.get('/api/search_books_bst/', {'q': 'Book'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        titles = [book['title'] for book in data['results']]
        self.assertIn("Alpha Book", titles)
        self.assertIn("Beta Book", titles)
        self.assertIn("Gamma Book", titles)

    def test_search_sort_by_author(self):
        response = self.client.get('/api/search_books_bst/', {'q': 'Book', 'sort': 'author'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        authors = [book['author'] for book in data['results']]
        self.assertEqual(authors, sorted(authors))

    def test_search_empty_query_returns_empty(self):
        response = self.client.get('/api/search_books_bst/', {'q': ''})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['results'], [])


