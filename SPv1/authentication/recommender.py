# recommender.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from base.models import Book

def load_books_from_db():
    qs = Book.objects.all().values(
        'title', 'author', 'stars', 'price', 'category_id', 'isBestSeller', 'category_name'
    )
    return pd.DataFrame(list(qs))

def get_recommendations_by(criteria, value):
    df = load_books_from_db()

    for col in ['title', 'author', 'category_name', 'isBestSeller']:
        df[col] = df[col].fillna('').astype(str)

    df['combined_features'] = (
        df['title'].str.lower() + ' ' +
        df['author'].str.lower() + ' ' +
        df['category_name'].str.lower() + ' ' +
        df['isBestSeller'].str.lower()
    )

    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['combined_features'])
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    df['title_clean'] = df['title'].str.strip().str.lower()

    value = value.strip().lower()
    match = df[df['title_clean'] == value]

    if match.empty:
        return f"No books found for title '{value}'"

    idx = match.index[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:6]
    book_indices = [i[0] for i in sim_scores]

    return df.iloc[book_indices][['title', 'author', 'stars', 'isBestSeller']]
