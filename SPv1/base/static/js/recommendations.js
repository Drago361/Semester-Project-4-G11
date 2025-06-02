document.addEventListener('DOMContentLoaded', function () {
    const similaritySection = document.querySelector('.similarity-section');
    const readingList = document.getElementById('reading-list');

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        similaritySection.innerHTML += '<p>No favorites found for recommendations.</p>';
        readingList.innerHTML += '<p>No favorites found for aggregated recommendations.</p>';
        return;
    }

    // 📘 Content-based recommendations (based on first favorite book)
    const singleValue = favorites[0].title.toLowerCase();
    fetch('/api/recommend/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({
            dropdown_type: 'content',
            value: singleValue
        })
    })
    .then(res => res.json())
    .then(data => {
        if (Array.isArray(data)) {
            renderRecommendations(data, similaritySection);
        } else {
            similaritySection.innerHTML += '<p>No content-based recommendations found.</p>';
        }
    })
    .catch(err => {
        console.error('❌ Error loading content-based recommendations:', err);
        similaritySection.innerHTML += '<p>Error loading recommendations.</p>';
    });

    // 📚 Aggregated recommendations (based on all favorite titles)
    const allTitles = favorites.map(book => book.title);
    fetch('/api/recommend/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({
            dropdown_type: 'multiple',
            value: allTitles
        })
    })
    .then(res => res.json())
    .then(data => {
        if (Array.isArray(data)) {
            renderRecommendations(data, readingList);
        } else {
            readingList.innerHTML += '<p>No aggregated recommendations found.</p>';
        }
    })
    .catch(err => {
        console.error('❌ Error loading aggregated recommendations:', err);
        readingList.innerHTML += '<p>Error loading aggregated recommendations.</p>';
    });

    // 🔧 Render book list into a given section
    function renderRecommendations(books, targetElement) {
        const container = document.createElement('div');
        container.classList.add('recommendations');

        container.innerHTML = books.map(book => `
            <div class="book-card">
                <h4>${book.title}</h4>
                <p>by ${book.author}</p>
                <p>⭐ ${book.stars} ${book.isBestSeller ? '(Bestseller)' : ''}</p>
            </div>
        `).join('');

        targetElement.innerHTML = '';
        targetElement.appendChild(container);
    }

    // 🔐 CSRF token helper for Django
    function getCSRFToken() {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        return cookie ? cookie.split('=')[1] : '';
    }
});
