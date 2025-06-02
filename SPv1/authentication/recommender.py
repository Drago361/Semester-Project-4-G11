import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from base.models import Book

# Load data from SQLite database via Django ORM
def load_books_from_db():
    qs = Book.objects.all().values(
        'title', 'author', 'stars', 'price', 'category_id', 'isBestSeller', 'category_name'
    )
    return pd.DataFrame(list(qs))

# Prepare DataFrame and compute similarity
df = load_books_from_db()
df = df.head(4000)
print("The database was loaded")

# Clean and fill missing values
for col in ['title', 'author', 'category_name', 'isBestSeller']:
    df[col] = df[col].fillna('').astype(str)

# Combine relevant features for TF-IDF
df['combined_features'] = df['title'] + ' ' + df['author'] + ' ' + df['category_name'] + ' ' + df['isBestSeller']

# Vectorize text
tfidf = TfidfVectorizer(max_features=100000, stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['combined_features'])

# Compute cosine similarity
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Optional BST for title lookup (not used here but available)
class BSTNode:
    def __init__(self, title, index):
        self.title = title
        self.index = index
        self.left = None
        self.right = None

class TitleBST:
    def __init__(self):
        self.root = None

    def insert(self, title, index):
        self.root = self._insert(self.root, title, index)

    def _insert(self, node, title, index):
        if node is None:
            return BSTNode(title, index)
        if title < node.title:
            node.left = self._insert(node.left, title, index)
        else:
            node.right = self._insert(node.right, title, index)
        return node

    def search(self, title):
        return self._search(self.root, title.strip().lower())

    def _search(self, node, title):
        if node is None:
            return None
        if title == node.title:
            return node.index
        elif title < node.title:
            return self._search(node.left, title)
        else:
            return self._search(node.right, title)

# Build BST
title_bst = TitleBST()
for i, row in df.iterrows():
    clean_title = row['title'].strip().lower()
    title_bst.insert(clean_title, i)

# ✅ Main Recommendation Function (supports dropdown types)
def get_recommendations_by(dropdown_type, value, df=df, cosine_sim=cosine_sim):
    value = value.strip().lower() if isinstance(value, str) else value

    df['title_clean'] = df['title'].str.strip().str.lower()
    df['author_clean'] = df['author'].str.strip().str.lower()
    df['category_clean'] = df['category_name'].str.strip().str.lower()
    df['stars'] = pd.to_numeric(df['stars'], errors='coerce')
    df['normalized_stars'] = (df['stars'] - df['stars'].min()) / (df['stars'].max() - df['stars'].min())
    df['bestseller_boost'] = df['isBestSeller'].astype(str).str.lower().isin(['true', 'yes', '1']).astype(int)

    # Mapping for dropdown values to internal logic
    dropdown_mapping = {
        "content": {"criteria": "title_clean", "weight": {"sim": 0.6, "rating": 0.3, "bestseller": 0.1}},
        "genre": {"criteria": "category_clean", "weight": {"sim": 0.7, "rating": 0.2, "bestseller": 0.1}},
        "author": {"criteria": "author_clean", "weight": {"sim": 0.5, "rating": 0.4, "bestseller": 0.1}},
        "theme": {"criteria": "category_clean", "weight": {"sim": 0.4, "rating": 0.4, "bestseller": 0.2}},
    }

    if dropdown_type not in dropdown_mapping:
        return f"Invalid dropdown option: '{dropdown_type}'"

    mapping = dropdown_mapping[dropdown_type]
    criteria_col = mapping['criteria']
    weights = mapping['weight']

    match = df[df[criteria_col].str.contains(value, case=False, na=False)]

    if match.empty:
        print(f"⚠️ No matches for {criteria_col} containing '{value}'")
        return f"No books found for {dropdown_type} = '{value}'"

    indices = match.index.tolist()
    sim_vector = cosine_sim[indices].mean(axis=0)

    scores = []
    for i in range(len(df)):
        if i in indices:
            continue
        similarity = sim_vector[i]
        rating = df.iloc[i]['normalized_stars']
        bestseller = df.iloc[i]['bestseller_boost']
        final_score = (
            weights['sim'] * similarity +
            weights['rating'] * rating +
            weights['bestseller'] * bestseller
        )
        scores.append((i, final_score))

    top_indices = [i[0] for i in sorted(scores, key=lambda x: x[1], reverse=True)[:5]]
    return df.loc[top_indices, ['title', 'author', 'stars', 'isBestSeller']]