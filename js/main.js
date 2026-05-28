const initPlatform = () => {
    
    // Shared icon SVGs accessible across all functions
    const hamburgerIconSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;

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
        const mainNav = document.querySelector('.main-nav');
        if (!mainNav) return;

        // Ensure mobile-only verify link is always present
        if (!document.getElementById('nav-mobile-verify')) {
            const verifyLink = document.createElement('a');
            verifyLink.id = 'nav-mobile-verify';
            verifyLink.href = '/verify';
            verifyLink.className = 'mobile-only-link';
            verifyLink.textContent = 'Verify Certificate';
            mainNav.appendChild(verifyLink);
        }
        
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
                    dashLink.href = '/dashboard';
                    dashLink.textContent = 'Dashboard';
                    dashLink.style.color = '#FF6B6B';
                    dashLink.style.fontWeight = '700';
                    mainNav.appendChild(dashLink);
                }
            }
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            
            // Remove mobile logged-out links if they exist
            const mobLogin = document.getElementById('nav-mobile-login');
            if (mobLogin) mobLogin.remove();
            const mobReg = document.getElementById('nav-mobile-register');
            if (mobReg) mobReg.remove();
            
            // Add mobile user greeting and logout link
            if (!document.getElementById('nav-mobile-user')) {
                const mobUser = document.createElement('span');
                mobUser.id = 'nav-mobile-user';
                mobUser.className = 'mobile-only-link user-greeting-mobile';
                mobUser.textContent = `Hello, ${user.name}`;
                mainNav.appendChild(mobUser);
            } else {
                document.getElementById('nav-mobile-user').textContent = `Hello, ${user.name}`;
            }
            
            if (!document.getElementById('nav-mobile-logout')) {
                const mobLogout = document.createElement('a');
                mobLogout.id = 'nav-mobile-logout';
                mobLogout.className = 'mobile-only-link logout-link-mobile';
                mobLogout.href = '#';
                mobLogout.textContent = 'Log Out';
                mobLogout.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('currentUser');
                    sessionStorage.removeItem('currentUser');
                    updateNavState();
                });
                mainNav.appendChild(mobLogout);
            }

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
            
            // Remove mobile logged-in elements
            const mobUser = document.getElementById('nav-mobile-user');
            if (mobUser) mobUser.remove();
            const mobLogout = document.getElementById('nav-mobile-logout');
            if (mobLogout) mobLogout.remove();
            
            // Add Log In link to mobile drawer if not present
            if (!document.getElementById('nav-mobile-login')) {
                const mobLogin = document.createElement('a');
                mobLogin.id = 'nav-mobile-login';
                mobLogin.href = '#';
                mobLogin.className = 'mobile-only-link';
                mobLogin.textContent = 'Log In';
                mobLogin.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Close drawer first
                    const mainNavEl = document.querySelector('.main-nav');
                    const mobileMenuBtnEl = document.getElementById('mobile-menu-btn');
                    const overlayEl = document.getElementById('drawer-overlay');
                    if (mainNavEl) mainNavEl.classList.remove('active');
                    if (mobileMenuBtnEl) { mobileMenuBtnEl.classList.remove('active'); mobileMenuBtnEl.innerHTML = hamburgerIconSVG; }
                    if (overlayEl) overlayEl.classList.remove('active');
                    // Then open login modal
                    if (loginBtn) loginBtn.click();
                });
                mainNav.appendChild(mobLogin);
            }

            // Add Sign Up link to mobile drawer if not present
            if (!document.getElementById('nav-mobile-register')) {
                const mobReg = document.createElement('a');
                mobReg.id = 'nav-mobile-register';
                mobReg.href = '#';
                mobReg.className = 'mobile-only-link';
                mobReg.textContent = 'Sign Up';
                mobReg.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Close drawer first
                    const mainNavEl = document.querySelector('.main-nav');
                    const mobileMenuBtnEl = document.getElementById('mobile-menu-btn');
                    const overlayEl = document.getElementById('drawer-overlay');
                    if (mainNavEl) mainNavEl.classList.remove('active');
                    if (mobileMenuBtnEl) { mobileMenuBtnEl.classList.remove('active'); mobileMenuBtnEl.innerHTML = hamburgerIconSVG; }
                    if (overlayEl) overlayEl.classList.remove('active');
                    // Then open register modal
                    if (registerBtn) registerBtn.click();
                });
                mainNav.appendChild(mobReg);
            }

            // Clear newsletter if it was auto-filled
            if (newsletterInput) {
                newsletterInput.value = '';
            }
        }

        // No emoji decoration - keeping nav links professional and clean
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
                    status: 'Selected',
                    statusClass: 'status-completed'
                };
                
                allApplications[user.email].push(newApp);
                localStorage.setItem('allApplications', JSON.stringify(allApplications));

                // Assign Default Simple Task based on Domain
                const tasksByDomain = {
                    'Frontend Development': { title: 'Create Landing Page', desc: 'Build a responsive HTML/CSS landing page with animations.' },
                    'Backend Development': { title: 'Build a REST API', desc: 'Create a simple Express.js REST API with CRUD routes.' },
                    'Web Development': { title: 'Create Landing Page', desc: 'Build a basic HTML/CSS landing page.' },
                    'Python': { title: 'Python Scripting', desc: 'Write a script to automate a simple file task.' },
                    'Data Science': { title: 'Data Cleaning', desc: 'Clean a sample CSV dataset using Pandas.' },
                    'UI/UX Design': { title: 'Login Wireframe', desc: 'Design a low-fidelity login screen wireframe in Figma.' },
                    'Mobile App Development': { title: 'Hello Android', desc: 'Create a "Hello World" app using React Native or Flutter.' },
                    'Flutter Engineering': { title: 'Flutter Counter App', desc: 'Build a stateful counter app using Flutter and Dart.' },
                    'Machine Learning': { title: 'ML Model Training', desc: 'Train a simple classification model using scikit-learn on a sample dataset.' },
                    'Node.js Engineering': { title: 'REST API with Express', desc: 'Build a Node.js Express REST API with GET, POST, and DELETE routes.' },
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
                    window.location.href = '/dashboard';
                }, 1000);
            }
        });
    }

    // 5. Mobile Menu Toggle & Sidebar Drawer
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuBtn && mainNav) {
        // Dynamically create and append Drawer Overlay to the body
        let overlay = document.getElementById('drawer-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'drawer-overlay';
            overlay.className = 'drawer-overlay';
            document.body.appendChild(overlay);
        }

        const hamburgerIcon = hamburgerIconSVG;
        const closeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

        function updateMenuIcon() {
            if (mainNav.classList.contains('active')) {
                mobileMenuBtn.innerHTML = closeIcon;
            } else {
                mobileMenuBtn.innerHTML = hamburgerIcon;
            }
        }

        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            overlay.classList.toggle('active');
            updateMenuIcon();
        });

        // Close menu when clicking the overlay
        overlay.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            overlay.classList.remove('active');
            updateMenuIcon();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && e.target !== mobileMenuBtn) {
                mainNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                overlay.classList.remove('active');
                updateMenuIcon();
            }
        });

        // Close menu when clicking a link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                overlay.classList.remove('active');
                updateMenuIcon();
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

    // 9. Certificate Verification Logic — reads real application data from localStorage
    const certForm = document.getElementById('certificate-verify-form');
    const verifyFeedback = document.getElementById('verify-feedback');

    // Helper: build a flat list of all applications with generated cert IDs
    function buildCertIndex() {
        const allApps = JSON.parse(localStorage.getItem('allApplications') || '{}');
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const flat = [];
        for (const email in allApps) {
            const user = users.find(u => u.email === email);
            const name = user ? user.name : email;
            allApps[email].forEach(app => {
                flat.push({ email, name, ...app });
            });
        }
        // Generate cert IDs in same order as admin panel: CM-2026-0001, 0002, ...
        const index = {};
        flat.forEach((entry, i) => {
            const id = `CM-2026-${String(i + 1).padStart(4, '0')}`;
            index[id.toUpperCase()] = entry;
        });
        return index;
    }

    if (certForm && verifyFeedback) {
        certForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const certId = document.getElementById('cert-id').value.trim().toUpperCase();
            const submitBtn = certForm.querySelector('button');
            const originalBtnContent = submitBtn.innerHTML;

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Verifying...</span>';
            verifyFeedback.innerHTML = '';

            setTimeout(() => {
                const certIndex = buildCertIndex();
                const found = certIndex[certId];

                if (found) {
                    // Rich verified card
                    const statusColor = found.status === 'Completed' ? '#22c55e' : found.status === 'On Hold' ? '#ef4444' : '#3b82f6';
                    verifyFeedback.innerHTML = `
                        <div style="margin-top:28px;background:linear-gradient(135deg,rgba(34,197,94,0.06),rgba(34,197,94,0.02));border:2px solid rgba(34,197,94,0.3);border-radius:20px;padding:32px 28px;text-align:left;">
                            <div style="display:flex;align-items:center;gap:12px;margin-bottom:22px;">
                                <div style="width:48px;height:48px;background:rgba(34,197,94,0.12);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                                <div>
                                    <p style="font-weight:700;font-size:1rem;color:#22c55e;margin:0;">Certificate Verified</p>
                                    <p style="font-size:0.8rem;color:#888;margin:0;font-family:monospace;">${certId}</p>
                                </div>
                            </div>                             <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                                <div style="background:rgba(255,255,255,0.7);border:1px solid #EAEAEA;border-radius:12px;padding:14px 16px;">
                                    <p style="font-size:0.72rem;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Name</p>
                                    <p style="font-weight:700;color:#1A1A1C;margin:0;font-size:0.95rem;">${found.name}</p>
                                </div>
                                <div style="background:rgba(255,255,255,0.7);border:1px solid #EAEAEA;border-radius:12px;padding:14px 16px;">
                                    <p style="font-size:0.72rem;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Certificate Id</p>
                                    <p style="font-weight:700;color:#1A1A1C;margin:0;font-size:0.95rem;">${certId}</p>
                                </div>
                                <div style="background:rgba(255,255,255,0.7);border:1px solid #EAEAEA;border-radius:12px;padding:14px 16px;">
                                    <p style="font-size:0.72rem;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Domain</p>
                                    <p style="font-weight:700;color:#1A1A1C;margin:0;font-size:0.95rem;">${found.domain}</p>
                                </div>
                                <div style="background:rgba(255,255,255,0.7);border:1px solid #EAEAEA;border-radius:12px;padding:14px 16px;">
                                    <p style="font-size:0.72rem;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Start and End date</p>
                                    <p style="font-weight:700;color:#1A1A1C;margin:0;font-size:0.95rem;">${found.date || '05/17/2026'} to ${new Date(new Date(found.date || '2026-05-17').getTime() + 8*7*24*60*60*1000).toLocaleDateString()}</p>
                                </div>
                                <div style="background:rgba(255,255,255,0.7);border:1px solid #EAEAEA;border-radius:12px;padding:14px 16px;grid-column: span 2;">
                                    <p style="font-size:0.72rem;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Status</p>
                                    <p style="font-weight:700;color:${statusColor};margin:0;font-size:0.95rem;">${found.status || 'completed'}</p>
                                </div>
                            </div>
                            <div style="margin-top:16px;padding:12px 16px;background:rgba(34,197,94,0.06);border-radius:10px;font-size:0.82rem;color:#555;display:flex;justify-content:space-between;align-items:center;">
                                <span><strong style="color:#22c55e;">✓ Verified</strong> — Authentic Record</span>
                                <span style="font-size:0.75rem;font-weight:600;color:#888;">Authorized by Codmint Technologies</span>
                            </div>
                        </div>`;
                } else if (certId.startsWith('CM-2026-')) {
                    // Format is right but not found in data — show not found
                    verifyFeedback.innerHTML = `
                        <div style="margin-top:28px;background:rgba(255,61,61,0.04);border:2px solid rgba(255,61,61,0.2);border-radius:20px;padding:28px;text-align:center;">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF3D3D" stroke-width="2" style="margin-bottom:12px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            <p style="font-weight:700;color:#FF3D3D;margin:0 0 6px;font-size:1rem;">Certificate Not Found</p>
                            <p style="color:#888;font-size:0.88rem;margin:0;">No record found for <strong>${certId}</strong>. Please check the ID and try again, or contact <a href="mailto:codmint.hr@gmail.com" style="color:var(--primary-red);">codmint.hr@gmail.com</a>.</p>
                        </div>`;
                } else {
                    // Wrong format
                    verifyFeedback.innerHTML = `
                        <div style="margin-top:28px;background:rgba(245,158,11,0.05);border:2px solid rgba(245,158,11,0.25);border-radius:20px;padding:28px;text-align:center;">
                            <p style="font-weight:700;color:#f59e0b;margin:0 0 6px;">Invalid Format</p>
                            <p style="color:#888;font-size:0.88rem;margin:0;">Certificate IDs follow the format <strong>CM-2026-XXXX</strong> (e.g. CM-2026-0001). Please enter a valid ID.</p>
                        </div>`;
                }

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }, 1500);
        });
    }

    // Global Theme Switcher Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('theme-toggle-sun');
    const moonIcon = document.getElementById('theme-toggle-moon');

    function updateThemeUI(isDark) {
        if (isDark) {
            document.body.classList.add('dark-theme');
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        } else {
            document.body.classList.remove('dark-theme');
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeUI(isDark);
        });
    }

    // Init theme based on saved preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    updateThemeUI(savedTheme === 'dark');

    // Initialize navigation bar and user authentication state on page load
    updateNavState();

};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlatform);
} else {
    initPlatform();
}


