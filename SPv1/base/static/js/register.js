document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === "password") {
                input.type = "text";
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = "password";
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
    
    // Form validation and submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validation
        if (password !== confirmPassword) {
            showError(confirmPasswordInput, "Passwords don't match");
            return;
        }
        
        if (password.length < 8) {
            showError(passwordInput, "Password must be at least 8 characters");
            return;
        }
        
        // Get selected genres
        const selectedGenres = [];
        document.querySelectorAll('input[name="genres"]:checked').forEach(checkbox => {
            selectedGenres.push(checkbox.value);
        });
        
        // Simulate successful registration
        // In a real application, this would be an API call
        simulateRegistration({
            fullname,
            email,
            username,
            password,
            genres: selectedGenres
        });
    });
    
    function showError(input, message) {
        // Remove any existing error message
        const parent = input.parentElement.parentElement;
        const existingError = parent.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and append error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '14px';
        errorDiv.style.marginTop = '5px';
        
        parent.appendChild(errorDiv);
        
        // Highlight the input
        input.style.borderColor = '#dc3545';
        
        // Remove error after 3 seconds
        setTimeout(() => {
            const error = parent.querySelector('.error-message');
            if (error) {
                error.remove();
                input.style.borderColor = '#ced4da';
            }
        }, 3000);
    }
    
    function simulateRegistration(userData) {
        // Show loading state
        const submitButton = document.querySelector('.register-submit-btn');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Creating Account...';
        submitButton.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // Success - in a real app this would be after API confirmation
            console.log('User registered:', userData);
            
            // Show success message
            registerForm.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle" style="font-size: 50px; color: #28a745; margin-bottom: 20px;"></i>
                    <h2>Registration Successful!</h2>
                    <p>Welcome to BookFind, ${userData.fullname}!</p>
                    <p>Your account has been created successfully.</p>
                    <a href="login.html" class="login-redirect">Proceed to Login</a>
                </div>
            `;
            
            // Style the success message
            const successMessage = registerForm.querySelector('.success-message');
            successMessage.style.textAlign = 'center';
            successMessage.style.padding = '30px';
            
            const loginRedirect = registerForm.querySelector('.login-redirect');
            loginRedirect.style.display = 'inline-block';
            loginRedirect.style.marginTop = '20px';
            loginRedirect.style.padding = '10px 20px';
            loginRedirect.style.backgroundColor = '#3a86ff';
            loginRedirect.style.color = 'white';
            loginRedirect.style.borderRadius = '6px';
            loginRedirect.style.textDecoration = 'none';
            loginRedirect.style.fontWeight = '500';
            
        }, 1500);
    }
});