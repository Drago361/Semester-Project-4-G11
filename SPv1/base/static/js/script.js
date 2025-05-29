document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const suggestions = document.querySelectorAll('.suggestion');
    const resultsSection = document.querySelector('.results-section');
    
    
    const searchLogo = document.querySelector('.search-logo');
    searchLogo.addEventListener('mouseover', function() {
        this.style.textShadow = "0 0 15px rgba(58, 134, 255, 0.7)";
    });
    searchLogo.addEventListener('mouseout', function() {
        this.style.textShadow = "1px 1px 2px rgba(0, 0, 0, 0.1)";
    });
    
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            const text = this.textContent;
            searchInput.value = text;
            
            this.style.transform = "scale(1.1)";
            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 300);
            
            setTimeout(() => {
                searchButton.click();
            }, 500);
        });
    });
    
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm === '') return;

        while (resultsSection.firstChild) {
            resultsSection.removeChild(resultsSection.firstChild);
        }

        fetch(`/api/search_books_bst/?q=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => {
                const books = data.results;
                if (books.length === 0) {
                    resultsSection.innerHTML = '<p>No books found.</p>';
                    return;
                }
                books.forEach((book, i) => {
                    createBookCard({
                        title: book.title,
                        author: book.author,
                        description: book.description || ''
                    }, i * 100);
                });
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            })
            .catch(() => {
                resultsSection.innerHTML = '<p>Error searching for books.</p>';
            });
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
    
    function createBookCard(book, delay) {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.style.opacity = '0';
        
        const bookCover = document.createElement('div');
        bookCover.className = 'book-cover';
        bookCover.textContent = 'Book Cover';
        
        const bookTitle = document.createElement('div');
        bookTitle.className = 'book-title';
        bookTitle.textContent = book.title;
        
        const bookAuthor = document.createElement('div');
        bookAuthor.className = 'book-author';
        bookAuthor.textContent = book.author;
        
        const bookDescription = document.createElement('div');
        bookDescription.className = 'book-description';
        bookDescription.textContent = book.description;
        
            // --- Add star button ---
            const starBtn = document.createElement('button');
            starBtn.className = 'star-btn';
            starBtn.title = 'Add to Favorites';
            starBtn.innerHTML = '☆';
        
            // Check if already in favorites
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            if (favorites.some(f => f.title === book.title && f.author === book.author)) {
                starBtn.innerHTML = '★';
            }
        
            // Only allow favoriting if logged in
            starBtn.addEventListener('click', function() {
                if (!window.isAuthenticated) {
                    alert('You must be logged in to favorite books.');
                    return;
                }
                let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                if (!favorites.some(f => f.title === book.title && f.author === book.author)) {
                    favorites.push(book);
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    starBtn.innerHTML = '★';
                }
            });
    
        
        bookCard.appendChild(bookCover);
        bookCard.appendChild(bookTitle);
        bookCard.appendChild(bookAuthor);
        bookCard.appendChild(bookDescription);
        bookCard.appendChild(starBtn);
        
        resultsSection.appendChild(bookCard);
        
        setTimeout(() => {
            bookCard.style.opacity = '1';
            bookCard.style.transform = 'translateY(0)';
            bookCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }, delay);
    }
    
    const teamMembers = document.querySelectorAll('.team-member');
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    function animateOnScroll() {
        teamMembers.forEach(member => {
            if (isInViewport(member)) {
                member.style.opacity = '1';
                member.style.transform = 'translateY(0)';
            }
        });
    }
    
    teamMembers.forEach(member => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(20px)';
        member.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    
    animateOnScroll();
});