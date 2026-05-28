
        // Dashboard Tab Switching Logic
        function switchView(viewId) {
            // Update Sidebar Active State
            document.querySelectorAll('.sidebar-nav a').forEach(el => el.classList.remove('active'));
            const sideEl = document.getElementById('nav-' + viewId);
            if (sideEl) sideEl.classList.add('active');

            // Update Bottom Nav Active State
            document.querySelectorAll('.mobile-bottom-nav a').forEach(el => el.classList.remove('active'));
            const bottomEl = document.getElementById('bottom-nav-' + viewId);
            if (bottomEl) bottomEl.classList.add('active');

            // Toggle Content Views
            document.querySelectorAll('.dashboard-view').forEach(el => el.classList.remove('active'));
            const viewEl = document.getElementById('view-' + viewId);
            if (viewEl) viewEl.classList.add('active');
            
            // Re-load data for the specific view if needed
            loadDashboardData();
        }

        // Print Offer Letter Functionality
        function printOfferLetter() {
            const printContent = document.getElementById('offer-letter-content').innerHTML;
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Internship Offer Letter - Codmint Technologies</title>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                        body {
                            font-family: 'Poppins', sans-serif;
                            padding: 40px;
                            color: #333;
                            background: white;
                        }
                        .offer-letter-container {
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 30px;
                            border: 1px solid #EEE;
                            border-radius: 12px;
                        }
                        .letter-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        .letter-logo {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                        }
                        .text-red {
                            color: #FF3D3D;
                        }
                        @media print {
                            body { padding: 0; }
                            .offer-letter-container { border: none; box-shadow: none; padding: 0; }
                        }
                    </style>
                </head>
                <body>
                    <div class="offer-letter-container">
                        \${printContent}
                    </div>
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() { window.close(); }, 500);
                        }
                    <\/script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }

        // Accept Offer Letter Functionality
        function acceptOfferLetter() {
            const currentUserStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
            if (!currentUserStr) return;
            const user = JSON.parse(currentUserStr);

            const acceptBtn = document.getElementById('accept-offer-btn');
            if (acceptBtn) {
                acceptBtn.innerHTML = '🎉 Offer Accepted';
                acceptBtn.disabled = true;
                acceptBtn.style.backgroundColor = '#10B981';
                acceptBtn.style.color = '#fff';
                acceptBtn.style.borderColor = '#10B981';
                acceptBtn.style.cursor = 'not-allowed';
            }
            alert('Congratulations! You have successfully accepted the internship offer. Welcome to Codmint Technologies!');
            localStorage.setItem('offerAccepted_' + user.email, 'true');
        }

        function loadDashboardData() {
            const currentUserStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
            if (!currentUserStr) return;

            const user = JSON.parse(currentUserStr);
            
            // Update Profile UI
            document.getElementById('dash-user-name').textContent = user.name;
            document.getElementById('sidebar-user-name').textContent = user.name;
            document.getElementById('sidebar-user-email').textContent = user.email;
            document.getElementById('user-avatar-initial').textContent = user.name.charAt(0).toUpperCase();
            
            // Update Settings Form
            document.getElementById('edit-name').value = user.name;
            document.getElementById('edit-email').value = user.email;

            // Load Tasks
            const taskList = document.getElementById('pending-tasks-list');
            const allTasks = JSON.parse(localStorage.getItem('userTasks') || '{}');
            const userTasks = allTasks[user.email] || [
                { title: 'Profile Setup', desc: 'Account registration', completed: true },
                { title: 'Email Verified', desc: 'Security check', completed: true }
            ];

            if (taskList) {
                taskList.innerHTML = '';
                userTasks.forEach(task => {
                    const card = document.createElement('div');
                    card.className = 'task-card fade-in-up';
                    card.innerHTML = `
                        <div class="task-icon">${task.completed ? '✅' : '📝'}</div>
                        <h4>${task.title}</h4>
                        <p style="font-size: 0.8rem; color: #888;">${task.desc}</p>
                        ${!task.completed ? '<span style="font-size: 0.75rem; color: var(--primary-red); font-weight: 600;">Pending</span>' : '<span style="font-size: 0.75rem; color: #10B981; font-weight: 600;">Completed</span>'}
                    `;
                    taskList.appendChild(card);
                });
            }

            // Load Active Tasks in Dedicated Tasks View Tab
            const activeTasksContainer = document.getElementById('active-tasks-container');
            if (activeTasksContainer) {
                activeTasksContainer.innerHTML = '';
                // Filter user tasks to show user's active domain tasks
                // Exclude system tasks like Profile Setup and Email Verified
                const domainTasks = userTasks.filter(t => t.title !== 'Profile Setup' && t.title !== 'Email Verified');
                
                if (domainTasks.length > 0) {
                    domainTasks.forEach((task, idx) => {
                        const statusText = task.completed === true ? 'Completed' : (task.completed === 'Under Review' ? 'Under Review' : 'Pending');
                        const statusClass = task.completed === true ? 'status-completed' : (task.completed === 'Under Review' ? 'status-review' : 'status-pending');
                        
                        const card = document.createElement('div');
                        card.style.background = '#FFFFFF';
                        card.style.border = '1px solid #EAEAEA';
                        card.style.borderRadius = '20px';
                        card.style.padding = '30px';
                        card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.01)';
                        card.style.display = 'flex';
                        card.style.flexDirection = 'column';
                        card.style.gap = '20px';
                        
                        card.innerHTML = `
                            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                                <div>
                                    <span style="display:inline-block;background:rgba(255, 61, 61, 0.08);color:var(--primary-red);font-size:0.75rem;font-weight:700;padding:4px 12px;border-radius:20px;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Active Internship Module</span>
                                    <h3 style="margin:0;font-size:1.3rem;">${task.title}</h3>
                                </div>
                                <span class="app-status ${statusClass}">${statusText}</span>
                            </div>
                            
                            <p style="color:#666;font-size:0.95rem;line-height:1.6;margin:0;">${task.desc}</p>
                            
                            ${task.completed === false ? `
                                <hr style="border:0;border-top:1px solid #EAEAEA;margin:10px 0;">
                                <form onsubmit="submitTaskSolution(event, ${idx})" style="display:flex;flex-direction:column;gap:15px;">
                                    <div class="input-group">
                                        <label style="font-size:0.85rem;font-weight:600;color:#555;">Submission Link (GitHub, Google Drive, or Figma URL)</label>
                                        <input type="url" id="solution-link-${idx}" placeholder="https://github.com/yourusername/project" required style="padding:12px 18px;border:2px solid #F0F0F0;border-radius:12px;font-family:inherit;">
                                    </div>
                                    <div class="input-group">
                                        <label style="font-size:0.85rem;font-weight:600;color:#555;">Submission Notes (Optional)</label>
                                        <input type="text" id="solution-notes-${idx}" placeholder="e.g., Completed all frontend modules and added extra animations." style="padding:12px 18px;border:2px solid #F0F0F0;border-radius:12px;font-family:inherit;">
                                    </div>
                                    <button type="submit" class="cta-btn" style="width:fit-content;padding:12px 30px;">Submit Project Module</button>
                                </form>
                            ` : `
                                <div style="background:#F9F9FB;border:1px dashed #EAEAEA;border-radius:12px;padding:15px;font-size:0.85rem;color:#777;display:flex;align-items:center;gap:10px;">
                                    <span>🎉</span>
                                    <span>${task.completed === 'Under Review' ? 'Task solution submitted! Codmint Mentors are currently evaluating your solution.' : 'Fantastic job! This module has been approved and marked as completed.'}</span>
                                </div>
                            `}
                        `;
                        activeTasksContainer.appendChild(card);
                    });
                } else {
                    activeTasksContainer.innerHTML = `
                        <div style="text-align: center; padding: 40px; color: #888;">
                            <p>No active internship tasks assigned. Apply for a domain to receive your tasks!</p>
                            <a href="internships.html" class="cta-btn" style="display:inline-block;margin-top:15px;padding:10px 25px;text-decoration:none;">Browse Internship Tracks</a>
                        </div>
                    `;
                }
            }

            // Update Progress Bar
            const completedCount = userTasks.filter(t => t.completed === true).length;
            const totalCount = userTasks.length;
            const percent = Math.round((completedCount / totalCount) * 100);
            const progressBar = document.getElementById('progress-bar');
            const progressPercent = document.getElementById('progress-percent');
            if (progressBar) progressBar.style.width = percent + '%';
            if (progressPercent) progressPercent.textContent = percent + '%';

            // Load Applications
            const appliedList = document.getElementById('applied-internships-list');
            const allApplications = JSON.parse(localStorage.getItem('allApplications') || '{}');
            const userApplications = allApplications[user.email] || [];

            if (appliedList) {
                if (userApplications.length > 0) {
                    appliedList.innerHTML = '';
                    userApplications.forEach(app => {
                        const item = document.createElement('div');
                        item.className = 'application-item';
                        item.innerHTML = `
                            <div class="app-info">
                                <h4>${app.domain} Internship</h4>
                                <p style="font-size: 0.85rem; color: #888;">Applied on: ${app.date}</p>
                            </div>
                            <span class="app-status ${app.statusClass}">${app.status}</span>
                        `;
                        appliedList.appendChild(item);
                    });
                } else {
                    appliedList.innerHTML = '<div style="text-align: center; padding: 40px; color: #888;"><p>No applications found.</p><a href="internships.html" class="text-red">Browse Internships</a></div>';
                }
            }

            // Dynamic Offer Letter Population
            const offerLetterSec = document.getElementById('offer-letter-section');
            if (offerLetterSec) {
                if (userApplications.length > 0) {
                    const activeApp = userApplications[0];
                    
                    if (activeApp.status === 'Under Review' || activeApp.status === 'Selected' || activeApp.status === 'Approved') {
                        // Dynamically update the offer letter template values
                        document.getElementById('letter-candidate-name').textContent = user.name;
                        document.getElementById('letter-candidate-email').textContent = user.email;
                        document.getElementById('letter-salutation-name').textContent = user.name.split(' ')[0];
                        document.getElementById('letter-domain').textContent = activeApp.domain;
                        document.getElementById('letter-body-domain').textContent = activeApp.domain;
                        document.getElementById('letter-date').textContent = activeApp.date;
                        document.getElementById('letter-start-date').textContent = activeApp.date;
                        
                        // Generate a unique professional Ref No based on user email hash
                        const refHash = Math.abs(user.email.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0) % 9000) + 1000;
                        document.getElementById('letter-ref-num').textContent = `CM/INT/2026/${refHash}`;
                        
                        // Display the Offer Letter block
                        offerLetterSec.style.display = 'block';
                        
                        // Check if already accepted
                        const isAccepted = localStorage.getItem('offerAccepted_' + user.email) === 'true';
                        const acceptBtn = document.getElementById('accept-offer-btn');
                        if (acceptBtn) {
                            if (isAccepted) {
                                acceptBtn.innerHTML = '🎉 Offer Accepted';
                                acceptBtn.disabled = true;
                                acceptBtn.style.backgroundColor = '#10B981';
                                acceptBtn.style.color = '#fff';
                                acceptBtn.style.borderColor = '#10B981';
                                acceptBtn.style.cursor = 'not-allowed';
                            } else {
                                acceptBtn.innerHTML = 'Accept Internship Offer';
                                acceptBtn.disabled = false;
                                acceptBtn.style.backgroundColor = 'transparent';
                                acceptBtn.style.color = '#10B981';
                                acceptBtn.style.borderColor = '#10B981';
                                acceptBtn.style.cursor = 'pointer';
                            }
                        }
                    } else {
                        offerLetterSec.style.display = 'none';
                    }
                } else {
                    offerLetterSec.style.display = 'none';
                }
            }
        function submitTaskSolution(event, idx) {
            event.preventDefault();
            const currentUserStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
            if (!currentUserStr) return;
            const user = JSON.parse(currentUserStr);
            
            const linkInput = document.getElementById('solution-link-' + idx);
            const notesInput = document.getElementById('solution-notes-' + idx);
            if (!linkInput) return;
            
            const allTasks = JSON.parse(localStorage.getItem('userTasks') || '{}');
            const userTasks = allTasks[user.email] || [];
            
            // Map the domain tasks specifically (excluding system ones)
            const domainTasks = userTasks.filter(t => t.title !== 'Profile Setup' && t.title !== 'Email Verified');
            const targetTask = domainTasks[idx];
            
            if (targetTask) {
                // Find the index in original userTasks array
                const originalIdx = userTasks.findIndex(t => t.title === targetTask.title);
                if (originalIdx !== -1) {
                    userTasks[originalIdx].completed = 'Under Review';
                    userTasks[originalIdx].submissionLink = linkInput.value;
                    userTasks[originalIdx].submissionNotes = notesInput ? notesInput.value : '';
                    userTasks[originalIdx].submissionDate = new Date().toLocaleDateString();
                    
                    allTasks[user.email] = userTasks;
                    localStorage.setItem('userTasks', JSON.stringify(allTasks));
                    
                    // Also update status in allApplications to reflect "Under Review"!
                    const allApplications = JSON.parse(localStorage.getItem('allApplications') || '{}');
                    const userApps = allApplications[user.email] || [];
                    if (userApps.length > 0) {
                        userApps[0].status = 'Under Review';
                        userApps[0].statusClass = 'status-review';
                        allApplications[user.email] = userApps;
                        localStorage.setItem('allApplications', JSON.stringify(allApplications));
                    }
                    
                    alert('Task solution submitted successfully! Your submission is now Under Review.');
                    loadDashboardData();
                }
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            loadDashboardData();

            // Handle Profile Edit
            const profileForm = document.getElementById('profile-edit-form');
            if (profileForm) {
                profileForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const newName = document.getElementById('edit-name').value;
                    const newPwd = document.getElementById('edit-password').value;
                    
                    const currentUserStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
                    const isLocal = !!localStorage.getItem('currentUser');
                    const user = JSON.parse(currentUserStr);

                    // Update in registeredUsers
                    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                    const userIdx = registeredUsers.findIndex(u => u.email === user.email);
                    
                    if (userIdx !== -1) {
                        registeredUsers[userIdx].name = newName;
                        if (newPwd) registeredUsers[userIdx].password = newPwd;
                        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                        
                        // Update Current User session
                        user.name = newName;
                        const updatedUserStr = JSON.stringify(user);
                        if (isLocal) localStorage.setItem('currentUser', updatedUserStr);
                        else sessionStorage.setItem('currentUser', updatedUserStr);
                        
                        alert('Profile updated successfully!');
                        loadDashboardData(); // Refresh UI
                    }
                });
            }
        });
    