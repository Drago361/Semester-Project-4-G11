document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.getElementById('similarity-type');
    const similaritySection = document.querySelector('.similarity-section');

    async function fetchRecommendations(type, value) {
        try {
            const response = await fetch('/api/recommend/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken() // only if CSRF protection is needed
                },
                body: JSON.stringify({
                    dropdown_type: type,
                    value: value
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const recommendations = await response.json();
            updateRecommendations(recommendations);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    }

    function updateRecommendations(books) {
        const container = document.createElement('div');
        container.classList.add('recommendations');

        container.innerHTML = books.map(book => `
            <div class="book-card">
                <h4>${book.title}</h4>
                <p>by ${book.author}</p>
                <p>⭐ ${book.stars} ${book.isBestSeller ? '(Bestseller)' : ''}</p>
            </div>
        `).join('');

        // Clear previous results
        const old = similaritySection.querySelector('.recommendations');
        if (old) old.remove();

        similaritySection.appendChild(container);
    }

    // Optional: Replace this with real user reading history, or a default category
    const getInitialValue = () => {
        return 'fiction'; // Placeholder; adjust dynamically based on user data
    };

    dropdown.addEventListener('change', () => {
        const type = dropdown.value;
        const value = getInitialValue();
        console.log('Dropdown changed to:', type, 'with value:', value); //TOROLD MAJD KI TE FASZ

        fetchRecommendations(type, value);
    });

    // Trigger initial load
    dropdown.dispatchEvent(new Event('change'));

    // CSRF helper (for Django)
    function getCSRFToken() {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        return cookie ? cookie.split('=')[1] : '';
    }
});