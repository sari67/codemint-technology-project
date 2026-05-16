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
    const applyModal = document.getElementById('apply-modal');
    
    const loginClose = document.getElementById('login-close');
    const registerClose = document.getElementById('register-close');
    const applyClose = document.getElementById('apply-close');
    
    const applyForm = document.getElementById('apply-form');
    const applyDomainInput = document.getElementById('apply-domain');
    const applyPhoneError = document.getElementById('apply-phone-error');

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
    if (applyClose) applyClose.addEventListener('click', () => closeModal(applyModal));

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
        if (e.target === applyModal) closeModal(applyModal);
    });

    // Handle Apply Buttons
    const applyBtns = document.querySelectorAll('.apply-btn');
    applyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const domain = btn.getAttribute('data-domain');
            if (applyDomainInput) {
                applyDomainInput.value = domain;
            }
            openModal(applyModal);
        });
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
        const newsletterInput = document.querySelector('#newsletter-form input');
        
        if (currentUserStr) {
            const user = JSON.parse(currentUserStr);
            // Logged In State
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (userDisplay) {
                userDisplay.style.display = 'inline-block';
                userDisplay.textContent = `Hello, ${user.name}`;
                // Add Dashboard Link if it doesn't exist
                if (!document.getElementById('nav-dash-link')) {
                    const dashLink = document.createElement('a');
                    dashLink.id = 'nav-dash-link';
                    dashLink.href = 'dashboard.html';
                    dashLink.textContent = 'Dashboard';
                    dashLink.style.color = 'var(--primary-red)';
                    dashLink.style.fontWeight = '600';
                    document.querySelector('.main-nav').appendChild(dashLink);
                }
            }
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            
            // Auto-fill newsletter if empty
            if (newsletterInput && !newsletterInput.value) {
                newsletterInput.value = user.email;
            }
        } else {
            // Logged Out State
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (registerBtn) registerBtn.style.display = 'inline-block';
            if (userDisplay) userDisplay.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
            
            // Remove Dashboard Link if it exists
            const dashLink = document.getElementById('nav-dash-link');
            if (dashLink) dashLink.remove();
            
            // Clear newsletter if it was auto-filled
            if (newsletterInput) {
                newsletterInput.value = '';
            }
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
            const loginError = document.getElementById('login-error');
            
            if (email && password) {
                // Get registered users
                const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
                
                if (foundUser) {
                    if (loginError) loginError.style.display = 'none';
                    const userObj = { email: foundUser.email, name: foundUser.name };
                    
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
                } else {
                    if (loginError) {
                        loginError.style.display = 'block';
                        loginError.textContent = 'Invalid email or password. Please register first.';
                    } else {
                        alert('Invalid email or password. Please register first.');
                    }
                }
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
                const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const userExists = registeredUsers.find(u => u.email === email);
                
                if (userExists) {
                    regError.style.display = 'block';
                    regError.textContent = 'An account with this email already exists.';
                    return;
                }
                
                regError.style.display = 'none';
                
                // Add to registered users
                registeredUsers.push({ name, email, password: pwd });
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                
                alert('Registration successful! Please log in to continue.');
                closeModal(registerModal);
                registerForm.reset();
                
                // Open login modal so they can log in
                setTimeout(() => {
                    const loginModal = document.getElementById('login-modal');
                    loginModal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }, 300);
            }
        });
    }

    // Apply Form Submit Logic
    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const phoneInput = document.getElementById('apply-phone').value;
            // Phone validation: Exactly 10 digits
            const phoneRegex = /^[0-9]{10}$/;
            
            if (!phoneRegex.test(phoneInput.replace(/[-\s]/g, ''))) {
                if (applyPhoneError) applyPhoneError.style.display = 'block';
                return; // Stop form submission
            }
            
            if (applyPhoneError) applyPhoneError.style.display = 'none';

            // Save application to localStorage for Dashboard
            const currentUserStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
            if (currentUserStr) {
                const user = JSON.parse(currentUserStr);
                const domain = document.getElementById('apply-domain').value;
                const allApplications = JSON.parse(localStorage.getItem('allApplications') || '{}');
                
                if (!allApplications[user.email]) {
                    allApplications[user.email] = [];
                }
                
                const newApp = {
                    domain: domain,
                    date: new Date().toLocaleDateString(),
                    status: 'Under Review',
                    statusClass: 'status-review'
                };
                
                allApplications[user.email].push(newApp);
                localStorage.setItem('allApplications', JSON.stringify(allApplications));

                // Assign Default Simple Task based on Domain
                const tasksByDomain = {
                    'Web Development': { title: 'Create Landing Page', desc: 'Build a basic HTML/CSS landing page.' },
                    'Python': { title: 'Python Scripting', desc: 'Write a script to automate a simple file task.' },
                    'Data Science': { title: 'Data Cleaning', desc: 'Clean a sample CSV dataset using Pandas.' },
                    'UI/UX Design': { title: 'Login Wireframe', desc: 'Design a low-fidelity login screen wireframe.' },
                    'Android Development': { title: 'Hello Android', desc: 'Create a "Hello World" app in Android Studio.' },
                    'AI/ML': { title: 'Model Setup', desc: 'Load a dataset and split it for training.' },
                    'Cloud Computing': { title: 'S3 Bucket Setup', desc: 'Create and configure an AWS S3 bucket.' },
                    'Cyber Security': { title: 'Security Audit', desc: 'Perform a basic security scan on a local port.' }
                };

                const domainTask = tasksByDomain[domain] || { title: 'Intro Task', desc: 'Complete the introductory module for your domain.' };
                
                const allTasks = JSON.parse(localStorage.getItem('userTasks') || '{}');
                if (!allTasks[user.email]) {
                    allTasks[user.email] = [
                        { title: 'Profile Setup', desc: 'Account registration', completed: true },
                        { title: 'Email Verified', desc: 'Security check', completed: true }
                    ];
                }

                allTasks[user.email].push({
                    title: domainTask.title,
                    desc: domainTask.desc,
                    completed: false,
                    date: new Date().toLocaleDateString()
                });

                localStorage.setItem('userTasks', JSON.stringify(allTasks));
            }

            alert('Your internship application has been submitted successfully! A starter task has been assigned to your Dashboard. ALL THE BEST!');
            closeModal(applyModal);
            applyForm.reset();
            
            // Redirect to dashboard after short delay if logged in
            if (currentUserStr) {
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        });
    }

    // 5. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && e.target !== mobileMenuBtn) {
                mainNav.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
            });
        });
    }

    // 6. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // 7. Back to Top Button Logic
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 8. Newsletter Form Submission Logic
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input').value;
            const currentUserStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
            
            if (currentUserStr) {
                const user = JSON.parse(currentUserStr);
                if (user.email === emailInput) {
                    alert(`Success! You are logged in as ${user.name} and have subscribed with your registered email: ${emailInput}.`);
                } else {
                    const confirmDifferent = confirm(`You are currently logged in with ${user.email}. Do you want to subscribe with a different email (${emailInput}) instead?`);
                    if (!confirmDifferent) return;
                    alert(`Thank you for subscribing with ${emailInput}!`);
                }
            } else {
                alert(`Thank you for subscribing! We've sent a confirmation email to ${emailInput}.`);
            }
            newsletterForm.reset();
        });
    }

    // 9. Certificate Verification Logic
    const certForm = document.getElementById('certificate-verify-form');
    const verifyFeedback = document.getElementById('verify-feedback');

    if (certForm && verifyFeedback) {
        certForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const certId = document.getElementById('cert-id').value.trim();
            const submitBtn = certForm.querySelector('button');
            const originalBtnContent = submitBtn.innerHTML;

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Verifying...</span>';
            verifyFeedback.textContent = '';
            verifyFeedback.style.color = 'var(--dark-grey)';

            setTimeout(() => {
                // Mock verification logic
                if (certId.toUpperCase().startsWith('CM-2026-')) {
                    verifyFeedback.textContent = `✅ Certificate ${certId} is VALID. Issued to an Outstanding Intern.`;
                    verifyFeedback.style.color = '#28a745';
                } else {
                    verifyFeedback.textContent = `❌ Certificate ${certId} not found. Please check the ID and try again.`;
                    verifyFeedback.style.color = 'var(--primary-red)';
                }
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }, 1500);
        });
    }

});
