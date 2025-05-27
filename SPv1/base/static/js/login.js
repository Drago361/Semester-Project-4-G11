document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.getElementById('login-form');
    const emailUsernameInput = document.getElementById('email-username');
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.querySelector('.toggle-password');
    const rememberMeCheckbox = document.getElementById('remember');
    const googleButton = document.querySelector('.social-btn.google');
    const facebookButton = document.querySelector('.social-btn.facebook');
    const forgotPasswordLink = document.querySelector('.forgot-password');
    
    // Create validation message containers
    function createValidationElements() {
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input');
            if (input) {
                const validationMessage = document.createElement('div');
                validationMessage.className = 'validation-message';
                validationMessage.style.color = '#ff3860';
                validationMessage.style.fontSize = '12px';
                validationMessage.style.marginTop = '5px';
                validationMessage.style.display = 'none';
                
                // Insert after input or password container
                const insertAfter = input.type === 'password' ? 
                    group.querySelector('.password-container') : input;
                
                insertAfter.parentNode.insertBefore(validationMessage, insertAfter.nextSibling);
            }
        });
    }
    
    // Toggle password visibility
    togglePasswordButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
    
    // Input validation functions
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function validateUsername(username) {
        // Simple validation: at least 3 characters, alphanumeric and underscore
        const re = /^[a-zA-Z0-9_]{3,}$/;
        return re.test(username);
    }
    
    function validatePassword(password) {
        // Minimum 6 characters
        return password.length >= 6;
    }
    
    // Show validation error
    function showValidationError(input, message) {
        const formGroup = input.closest('.form-group');
        const validationMessage = formGroup.querySelector('.validation-message');
        
        input.style.borderColor = '#ff3860';
        validationMessage.textContent = message;
        validationMessage.style.display = 'block';
    }
    
    // Clear validation error
    function clearValidationError(input) {
        const formGroup = input.closest('.form-group');
        const validationMessage = formGroup.querySelector('.validation-message');
        
        input.style.borderColor = '#ddd';
        validationMessage.style.display = 'none';
    }
    
    // Real-time validation for email/username
    emailUsernameInput.addEventListener('blur', function() {
        const value = this.value.trim();
        
        if (!value) {
            showValidationError(this, 'Email or username is required');
        } else if (value.includes('@') && !validateEmail(value)) {
            showValidationError(this, 'Please enter a valid email address');
        } else if (!value.includes('@') && !validateUsername(value)) {
            showValidationError(this, 'Username must be at least 3 characters (letters, numbers, underscore)');
        } else {
            clearValidationError(this);
        }
    });
    
    // Real-time validation for password
    passwordInput.addEventListener('blur', function() {
        const value = this.value.trim();
        
        if (!value) {
            showValidationError(this, 'Password is required');
        } else if (!validatePassword(value)) {
            showValidationError(this, 'Password must be at least 6 characters');
        } else {
            clearValidationError(this);
        }
    });
    
    // Clear validation errors on input focus
    const inputs = [emailUsernameInput, passwordInput];
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            clearValidationError(this);
        });
    });
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        
        // Validate email/username
        const emailUsername = emailUsernameInput.value.trim();
        if (!emailUsername) {
            showValidationError(emailUsernameInput, 'Email or username is required');
            isValid = false;
        } else if (emailUsername.includes('@') && !validateEmail(emailUsername)) {
            showValidationError(emailUsernameInput, 'Please enter a valid email address');
            isValid = false;
        } else if (!emailUsername.includes('@') && !validateUsername(emailUsername)) {
            showValidationError(emailUsernameInput, 'Username must be at least 3 characters (letters, numbers, underscore)');
            isValid = false;
        }
        
        // Validate password
        const password = passwordInput.value.trim();
        if (!password) {
            showValidationError(passwordInput, 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showValidationError(passwordInput, 'Password must be at least 6 characters');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Sanitize input for security
    function sanitizeInput(input) {
        // Replace potentially dangerous characters
        return input.replace(/[<>]/g, '');
    }
    
    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Collect form data
            const formData = {
                emailUsername: sanitizeInput(emailUsernameInput.value.trim()),
                password: passwordInput.value.trim(), // Don't sanitize password as it might contain special chars
                rememberMe: rememberMeCheckbox.checked
            };
            
            // Here you would typically send this data to your server for authentication
            // For demonstration, we'll just simulate a login process
            simulateLogin(formData);
        }
    });
    
    // Create session token
    function createSessionToken() {
        // In a real application, this would be generated server-side
        // This is just for demonstration purposes
        const token = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
        return token;
    }
    
    // Simulate login (replace this with actual API call in production)
    function simulateLogin(formData) {
        // Show loading state
        const submitButton = loginForm.querySelector('.login-submit-btn');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Signing in...';
        submitButton.disabled = true;
        
        // Simulate API call with timeout
        setTimeout(() => {
            try {
                // For demo purposes, let's assume login is successful
                console.log('Login data:', formData);
                
                // Create a session token (in a real app, this would come from the server)
                const sessionToken = createSessionToken();
                
                // Store session information
                sessionStorage.setItem('bookfind_session', sessionToken);
                sessionStorage.setItem('bookfind_user', formData.emailUsername);
                
                // Save remember me preference if checked
                if (formData.rememberMe) {
                    localStorage.setItem('bookfind_remember_user', formData.emailUsername);
                } else {
                    localStorage.removeItem('bookfind_remember_user');
                }
                
                // Successful login - redirect to homepage
                // In a real application, you would verify credentials server-side
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error during login:', error);
                alert('There was an error processing your login. Please try again.');
                
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        }, 1500);
    }
    
    // Handle social login buttons
    googleButton.addEventListener('click', function() {
        // In a real application, you would implement OAuth with Google
        console.log('Google login clicked');
        simulateSocialLogin('google');
    });
    
    facebookButton.addEventListener('click', function() {
        // In a real application, you would implement OAuth with Facebook
        console.log('Facebook login clicked');
        simulateSocialLogin('facebook');
    });
    
    // Simulate social login
    function simulateSocialLogin(provider) {
        // In a real application, this would redirect to OAuth provider
        // For demonstration, we'll just simulate a login process
        
        // Show loading state
        const socialButton = document.querySelector(`.social-btn.${provider}`);
        const originalButtonText = socialButton.innerHTML;
        socialButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting...`;
        socialButton.disabled = true;
        
        setTimeout(() => {
            try {
                // Create a session token (in a real app, this would come from the server)
                const sessionToken = createSessionToken();
                
                // Store session information
                sessionStorage.setItem('bookfind_session', sessionToken);
                sessionStorage.setItem('bookfind_user', `${provider}_user`);
                sessionStorage.setItem('bookfind_auth_provider', provider);
                
                // Successful login - redirect to homepage
                window.location.href = 'index.html';
            } catch (error) {
                console.error(`Error during ${provider} login:`, error);
                alert(`There was an error processing your ${provider} login. Please try again.`);
                
                // Reset button state
                socialButton.innerHTML = originalButtonText;
                socialButton.disabled = false;
            }
        }, 1500);
    }
    
    // Handle forgot password link
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        const emailUsername = emailUsernameInput.value.trim();
        
        if (!emailUsername) {
            showValidationError(emailUsernameInput, 'Please enter your email address first');
            emailUsernameInput.focus();
            return;
        }
        
        if (!emailUsername.includes('@')) {
            showValidationError(emailUsernameInput, 'Please enter an email address, not a username');
            emailUsernameInput.focus();
            return;
        }
        
        if (!validateEmail(emailUsername)) {
            showValidationError(emailUsernameInput, 'Please enter a valid email address');
            emailUsernameInput.focus();
            return;
        }
        
        // In a real application, you would send a password reset email
        alert(`Password reset instructions have been sent to ${emailUsername}\n\nIn a real application, this would send an actual email.`);
    });
    
    // Check if we should remember the user from previous session
    function checkRememberedUser() {
        const rememberedUser = localStorage.getItem('bookfind_remember_user');
        if (rememberedUser) {
            emailUsernameInput.value = rememberedUser;
            rememberMeCheckbox.checked = true;
        }
    }
    
    // Check if user is already logged in
    function checkLoggedInUser() {
        const sessionToken = sessionStorage.getItem('bookfind_session');
        if (sessionToken) {
            // User is already logged in, redirect to homepage
            window.location.href = 'index.html';
        }
    }
    
    // Initialize
    createValidationElements();
    checkLoggedInUser();
    checkRememberedUser();
});