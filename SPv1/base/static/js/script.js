document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const suggestions = document.querySelectorAll('.suggestion');
    const resultsSection = document.querySelector('.results-section');
    
    const bookDatabase = [
        {
            title: "The Midnight Library",
            author: "Matt Haig",
            description: "Between life and death there is a library filled with books that give you a chance to try another life you could have lived."
        },
        {
            title: "Project Hail Mary",
            author: "Andy Weir",
            description: "A lone astronaut must save humanity from an extinction-level threat with only his ingenuity and science knowledge."
        },
        {
            title: "The Song of Achilles",
            author: "Madeline Miller",
            description: "A retelling of the Trojan War from the perspective of Patroclus, companion and lover of the legendary warrior Achilles."
        },
        {
            title: "A Court of Thorns and Roses",
            author: "Sarah J. Maas",
            description: "A fantasy novel that follows the journey of a huntress who is brought into the faerie realm as punishment for killing a wolf."
        },
        {
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            description: "A fantasy novel about a hobbit who is swept into an epic quest to reclaim the dwarven kingdom from a fearsome dragon."
        }
    ];
    
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
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') return;
        
        while (resultsSection.firstChild) {
            resultsSection.removeChild(resultsSection.firstChild);
        }
        
        const numResults = Math.floor(Math.random() * 5) + 1;
        
        for (let i = 0; i < numResults; i++) {
            const randomIndex = Math.floor(Math.random() * bookDatabase.length);
            const book = bookDatabase[randomIndex];
            
            createBookCard(book, i * 100);
        }
        
        resultsSection.scrollIntoView({ behavior: 'smooth' });
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
        
        bookCard.appendChild(bookCover);
        bookCard.appendChild(bookTitle);
        bookCard.appendChild(bookAuthor);
        bookCard.appendChild(bookDescription);
        
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