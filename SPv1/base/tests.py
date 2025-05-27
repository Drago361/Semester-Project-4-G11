# Create your tests here.
from django.test import TestCase
from django.urls import reverse


class HomePageTest(TestCase):
    def test_home_page_renders_correctly(self):
        
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'base.html')

    def test_contains_search_input_and_button(self):
        
        response = self.client.get(reverse('home'))
        self.assertContains(response, 'id="search-input"')
        self.assertContains(response, 'id="search-button"')

    def test_contains_suggestions(self):
        
        suggestions = ['Fiction', 'Science Fiction', 'Mystery']
        response = self.client.get(reverse('home'))
        for item in suggestions:
            self.assertContains(response, item)

    def test_contains_book_vards(self):
        
        titles = ['The Great Gatsby', 'To Kill a Mockingbird', '1984']
        response = self.client.get(reverse('home'))
        for title in titles:
            self.assertContains(response, title)