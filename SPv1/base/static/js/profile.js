document.addEventListener('DOMContentLoaded', function() {
    // Simulate logged in user state (in a real application, this would come from a server)
    const isLoggedIn = true;

    // Update UI based on login state
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const profileBtn = document.getElementById('profile-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (isLoggedIn) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (profileBtn) profileBtn.style.display = 'inline-flex';
        if (logoutBtn) logoutBtn.style.display = 'inline-flex';
        // Load user data (simulated)
        loadUserData();
    } else {
        window.location.href = 'login.html';
    }

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Settings form handling
    const settingsForm = document.getElementById('profile-settings-form');
    const saveSettingsBtn = document.getElementById('save-settings');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveUserSettings();
        });
    }

    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            
            // Toggle password visibility
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
    
    // Delete account modal functionality
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const deleteAccountModal = document.getElementById('delete-account-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');

    if (deleteAccountBtn && deleteAccountModal) {
        deleteAccountBtn.addEventListener('click', () => {
            deleteAccountModal.style.display = 'block';
        });
    }
    if (closeModalBtn && deleteAccountModal) {
        closeModalBtn.addEventListener('click', () => {
            deleteAccountModal.style.display = 'none';
        });
    }
    if (cancelDeleteBtn && deleteAccountModal) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteAccountModal.style.display = 'none';
        });
    }
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            const passwordConfirm = document.getElementById('password-confirm');
            if (!passwordConfirm || !passwordConfirm.value) {
                alert('Please enter your password to confirm account deletion.');
                return;
            }
            alert('Account deleted successfully.');
            window.location.href = 'index.html';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === deleteAccountModal) {
            deleteAccountModal.style.display = 'none';
        }
    });
    
    // Book action functionality (favorite, comment, share)
    const bookActionBtns = document.querySelectorAll('.book-action-btn');
    
    bookActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            // Toggle active state
            if (icon.classList.contains('fa-heart')) {
                if (icon.style.color !== 'red') {
                    icon.style.color = 'red';
                    showToast('Book added to favorites!');
                } else {
                    icon.style.color = '';
                    showToast('Book removed from favorites!');
                }
            } else if (icon.classList.contains('fa-comment')) {
                // Open review form (not implemented in this example)
                showToast('Review feature coming soon!');
            } else if (icon.classList.contains('fa-share')) {
                // Share functionality (not implemented in this example)
                showToast('Share feature coming soon!');
            }
        });
    });
    
    // Library filter functionality
    const libraryFilter = document.getElementById('library-filter');
    if (libraryFilter) {
        libraryFilter.addEventListener('change', function() {
            const filterValue = this.value;
            showToast(`Filtered by ${filterValue}`);
        });
    }

    // Reviews filter functionality
    const reviewsFilter = document.getElementById('reviews-filter');
    if (reviewsFilter) {
        reviewsFilter.addEventListener('change', function() {
            const filterValue = this.value;
            showToast(`Sorted reviews by ${filterValue}`);
        });
    }
    
    // Simulate loading more books when scrolling (in a real application)
    let isLoading = false;
    
    window.addEventListener('scroll', function() {
        if (isLoading) return;
        
        const libraryTab = document.getElementById('library-tab');
        
        // Check if library tab is active and user has scrolled to bottom
        if (libraryTab.classList.contains('active')) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
                loadMoreBooks();
            }
        }
    });
});

// Function to show toast notification
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
        
        // Add CSS for toast
        const style = document.createElement('style');
        style.textContent = `
            #toast {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #333;
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            #toast.show {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show toast with message
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Simulated functions for demonstration purposes
function loadUserData() {
    setTimeout(() => {
        const profileName = document.getElementById('profile-name');
        if (profileName) profileName.textContent = 'Jane Smith';
        const profileUsername = document.getElementById('profile-username');
        if (profileUsername) profileUsername.textContent = '@janesmith';
        const profileBio = document.getElementById('profile-bio');
        if (profileBio) profileBio.textContent = 'Book lover, mystery enthusiast, and aspiring writer. I enjoy reading classics and contemporary fiction equally.';

        const booksRead = document.getElementById('books-read');
        if (booksRead) booksRead.textContent = '42';
        const reviews = document.getElementById('reviews');
        if (reviews) reviews.textContent = '12';
        const followers = document.getElementById('followers');
        if (followers) followers.textContent = '87';
        const following = document.getElementById('following');
        if (following) following.textContent = '65';

        const fullname = document.getElementById('fullname');
        if (fullname) fullname.value = 'Jane Smith';
        const username = document.getElementById('username');
        if (username) username.value = 'janesmith';
        const email = document.getElementById('email');
        if (email) email.value = 'jane.smith@example.com';
        const bio = document.getElementById('bio');
        if (bio) bio.value = 'Book lover, mystery enthusiast, and aspiring writer. I enjoy reading classics and contemporary fiction equally.';

        const fiction = document.getElementById('fiction');
        if (fiction) fiction.checked = true;
        const mystery = document.getElementById('mystery');
        if (mystery) mystery.checked = true;
        const fantasy = document.getElementById('fantasy');
        if (fantasy) fantasy.checked = true;

        loadReadingList();
        loadLibrary();
        loadReviews();
    }, 1000);
}

function loadReadingList() {
    const readingList = document.getElementById('reading-list');
    if (!readingList) return;
    readingList.innerHTML = '';
    
    // Check if user has books in reading list
    const hasBooks = true;
    
    if (!hasBooks) {
        // Show empty state
        readingList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-reader"></i>
                <h3>Your reading list is empty</h3>
                <p>Books you plan to read will appear here.</p>
                <button class="action-btn">Browse Books</button>
            </div>
        `;
        return;
    }
    
    // Sample reading list items
    const books = [
        {
            title: "The Midnight Library",
            author: "Matt Haig",
            progress: 45
        },
        {
            title: "Project Hail Mary",
            author: "Andy Weir",
            progress: 12
        },
        {
            title: "The Four Winds",
            author: "Kristin Hannah",
            progress: 0
        }
    ];
    
    // Create reading list items
    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'reading-item';
        bookItem.innerHTML = `
            <div class="reading-info">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${book.progress}%"></div>
                </div>
                <p class="progress-text">${book.progress}% complete</p>
            </div>
            <div class="reading-actions">
                <button class="action-btn small">
                    <i class="fas fa-book-open"></i> Continue Reading
                </button>
            </div>
        `;
        readingList.appendChild(bookItem);
    });
    
    // Add CSS for new elements
    const style = document.createElement('style');
    style.textContent = `
        .reading-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border-radius: 8px;
            background-color: #f8f9fa;
            margin-bottom: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            transition: transform 0.3s ease;
        }
        
        .reading-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 10px rgba(0,0,0,0.1);
        }
        
        .reading-info {
            flex: 1;
        }
        
        .reading-info h3 {
            margin: 0 0 5px 0;
            color: #333;
        }
        
        .reading-info p {
            margin: 0 0 10px 0;
            color: #6c757d;
        }
        
        .progress-bar {
            height: 6px;
            background-color: #e9ecef;
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 5px;
        }
        
        .progress {
            height: 100%;
            background-color: #3a86ff;
        }
        
        .progress-text {
            font-size: 12px;
            color: #6c757d;
        }
        
        .reading-actions {
            margin-left: 20px;
        }
        
        .action-btn.small {
            padding: 6px 12px;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);
}

function loadLibrary() {
    const libraryList = document.getElementById('library-list');
    if (!libraryList) return;
    libraryList.innerHTML = '';
    
    // Sample library books
    const books = [
        {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            rating: 4
        },
        {
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            rating: 4.5
        },
        {
            title: "Pride and Prejudice",
            author: "Jane Austen",
            rating: 5
        },
        {
            title: "1984",
            author: "George Orwell",
            rating: 4
        }
    ];
    
    // Create book cards
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        // Generate star rating HTML
        let ratingHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= book.rating) {
                ratingHTML += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 === book.rating) {
                ratingHTML += '<i class="fas fa-star-half-alt"></i>';
            } else {
                ratingHTML += '<i class="far fa-star"></i>';
            }
        }
        
        bookCard.innerHTML = `
            <div class="book-cover">Book Cover</div>
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <div class="book-rating">
                ${ratingHTML}
            </div>
            <div class="book-action">
                <button class="book-action-btn"><i class="fas fa-heart"></i></button>
                <button class="book-action-btn"><i class="fas fa-comment"></i></button>
                <button class="book-action-btn"><i class="fas fa-share"></i></button>
            </div>
        `;
        
        libraryList.appendChild(bookCard);
    });
}

function loadReviews() {
    const reviewsList = document.getElementById('user-reviews');
    if (!reviewsList) return;
    reviewsList.innerHTML = '';
    
    // Check if user has reviews
    const hasReviews = true;
    
    if (!hasReviews) {
        // Show empty state
        reviewsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-star"></i>
                <h3>You haven't written any reviews yet</h3>
                <p>Books you've reviewed will appear here.</p>
                <button class="action-btn">Write a Review</button>
            </div>
        `;
        return;
    }
    
    // Sample reviews
    const reviews = [
        {
            book: "The Alchemist",
            author: "Paulo Coelho",
            rating: 5,
            date: "April 15, 2025",
            content: "A profound book about following your dreams. The story is both simple and complex at the same time, weaving in spiritual and philosophical elements."
        },
        {
            book: "Dune",
            author: "Frank Herbert",
            rating: 4,
            date: "March 22, 2025",
            content: "An epic science fiction masterpiece with rich world-building and complex characters. The political intrigue and environmental themes are particularly compelling."
        }
    ];
    
    // Create review items
    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        // Generate star rating HTML
        let ratingHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= review.rating) {
                ratingHTML += '<i class="fas fa-star"></i>';
            } else {
                ratingHTML += '<i class="far fa-star"></i>';
            }
        }
        
        reviewItem.innerHTML = `
            <div class="review-header">
                <div class="review-book-info">
                    <h3>${review.book}</h3>
                    <p>by ${review.author}</p>
                </div>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="review-rating">
                ${ratingHTML}
            </div>
            <div class="review-content">
                <p>${review.content}</p>
            </div>
            <div class="review-actions">
                <button class="action-btn small">Edit</button>
                <button class="action-btn small danger">Delete</button>
            </div>
        `;
        
        reviewsList.appendChild(reviewItem);
    });
    
    // Add CSS for review items
    const style = document.createElement('style');
    style.textContent = `
        .review-item {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        
        .review-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        
        .review-book-info h3 {
            margin: 0 0 5px 0;
            color: #333;
        }
        
        .review-book-info p {
            margin: 0;
            color: #6c757d;
        }
        
        .review-date {
            color: #6c757d;
            font-size: 14px;
        }
        
        .review-rating {
            color: #ffc107;
            margin-bottom: 10px;
        }
        
        .review-content p {
            color: #495057;
            line-height: 1.5;
        }
        
        .review-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        .action-btn.danger {
            background-color: #dc3545;
        }
        
        .action-btn.danger:hover {
            background-color: #c82333;
        }
    `;
    document.head.appendChild(style);
}

function saveUserSettings() {
    const fullname = document.getElementById('fullname');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const bio = document.getElementById('bio');
    if (!fullname || !username || !email) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Check if password fields are filled
    const currentPassword = document.getElementById('current-password');
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-password');
    
    if (newPassword && newPassword !== confirmPassword) {
        alert('New password and confirm password do not match.');
        return;
    }
    
    // Simulate API call to save settings
    setTimeout(() => {
        const profileName = document.getElementById('profile-name');
        if (profileName) profileName.textContent = fullname.value;
        const profileUsername = document.getElementById('profile-username');
        if (profileUsername) profileUsername.textContent = '@' + username.value;
        const profileBio = document.getElementById('profile-bio');
        if (profileBio) profileBio.textContent = bio.value;

        const currentPassword = document.getElementById('current-password');
        if (currentPassword) currentPassword.value = '';
        const newPassword = document.getElementById('new-password');
        if (newPassword) newPassword.value = '';
        const confirmPassword = document.getElementById('confirm-password');
        if (confirmPassword) confirmPassword.value = '';

        showToast('Profile settings saved successfully!');
    }, 500);
}

function loadMoreBooks() {
    // Simulate loading more books
    isLoading = true;
    
    // Add loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading more books...';
    loadingIndicator.style.textAlign = 'center';
    loadingIndicator.style.padding = '20px';
    loadingIndicator.style.color = '#6c757d';
    document.getElementById('library-list').appendChild(loadingIndicator);
    
    // Simulate API call to load more books
    setTimeout(() => {
        // Remove loading indicator
        document.getElementById('library-list').removeChild(loadingIndicator);
        
        // Add more books
        const moreBooks = [
            {
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                rating: 5
            },
            {
                title: "The Catcher in the Rye",
                author: "J.D. Salinger",
                rating: 3.5
            },
            {
                title: "The Alchemist",
                author: "Paulo Coelho",
                rating: 4.5
            },
            {
                title: "Anna Karenina",
                author: "Leo Tolstoy",
                rating: 4
            }
        ];
        
        // Add books to library
        const libraryList = document.getElementById('library-list');
        moreBooks.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            
            // Generate star rating HTML
            let ratingHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= book.rating) {
                    ratingHTML += '<i class="fas fa-star"></i>';
                } else if (i - 0.5 === book.rating) {
                    ratingHTML += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    ratingHTML += '<i class="far fa-star"></i>';
                }
            }
            
            bookCard.innerHTML = `
                <div class="book-cover">Book Cover</div>
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-rating">
                    ${ratingHTML}
                </div>
                <div class="book-action">
                    <button class="book-action-btn"><i class="fas fa-heart"></i></button>
                    <button class="book-action-btn"><i class="fas fa-comment"></i></button>
                    <button class="book-action-btn"><i class="fas fa-share"></i></button>
                </div>
            `;
            
            libraryList.appendChild(bookCard);
        });
        
        // Reset loading state
        isLoading = false;
    }, 1500);
}