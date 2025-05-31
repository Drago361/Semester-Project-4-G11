from django.test import TestCase, Client
from base.models import Book
import json

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