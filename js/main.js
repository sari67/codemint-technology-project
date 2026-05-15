document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Navigation Effect (shadow on scroll)
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. 'Fade-in-up' Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Slight offset so it triggers just before coming fully into view
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach((entry, index) => {
            if (!entry.isIntersecting) {
                return;
            } else {
                // Add staggered delay based on element index in the viewport if multiple appear at once
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); 
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 3. Modal Logic & Validation
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    
    const loginClose = document.getElementById('login-close');
    const registerClose = document.getElementById('register-close');

    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');

    function openModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Open events
    if (loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(loginModal); });
    if (registerBtn) registerBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(registerModal); });

    // Close events
    if (loginClose) loginClose.addEventListener('click', () => closeModal(loginModal));
    if (registerClose) registerClose.addEventListener('click', () => closeModal(registerModal));

    // Switching between modals
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            setTimeout(() => openModal(registerModal), 300); // slight delay for smooth transition
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(registerModal);
            setTimeout(() => openModal(loginModal), 300);
        });
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) closeModal(loginModal);
        if (e.target === registerModal) closeModal(registerModal);
    });

    // 4. Authentication State Management & Form Validation
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const regError = document.getElementById('reg-error');
    
    const userDisplay = document.getElementById('user-display');
    const logoutBtn = document.getElementById('logout-btn');

    // Function to toggle UI based on auth state
    function updateNavState() {
        const currentUserStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        
        if (currentUserStr) {
            const user = JSON.parse(currentUserStr);
            // Logged In State
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (userDisplay) {
                userDisplay.style.display = 'inline-block';
                userDisplay.textContent = `Hello, ${user.name}`;
            }
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
        } else {
            // Logged Out State
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (registerBtn) registerBtn.style.display = 'inline-block';
            if (userDisplay) userDisplay.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }

    // Initialize state on load
    updateNavState();

    // Logout Logic
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            updateNavState();
        });
    }

    // Login Submit Logic
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            if (email && password) {
                // Mock user data
                const userName = email.split('@')[0];
                const userObj = { email: email, name: userName };
                
                // Auto-save logic
                if (rememberMe) {
                    localStorage.setItem('currentUser', JSON.stringify(userObj)); // Persists across browser restarts
                } else {
                    sessionStorage.setItem('currentUser', JSON.stringify(userObj)); // Clears when tab closes
                }

                alert('Login successful! Welcome back.');
                closeModal(loginModal);
                loginForm.reset();
                updateNavState(); // Update UI
            }
        });
    }

    // Register Submit Logic
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const pwd = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;
            
            if (pwd !== confirm) {
                regError.style.display = 'block';
                regError.textContent = 'Passwords do not match.';
            } else if (pwd.length < 6) {
                regError.style.display = 'block';
                regError.textContent = 'Password must be at least 6 characters.';
            } else {
                regError.style.display = 'none';
                
                // Automatically log them in after registration
                const userObj = { email: email, name: name };
                sessionStorage.setItem('currentUser', JSON.stringify(userObj));
                
                alert('Registration successful! Welcome to Codmint.');
                closeModal(registerModal);
                registerForm.reset();
                updateNavState(); // Update UI
            }
        });
    }

});
