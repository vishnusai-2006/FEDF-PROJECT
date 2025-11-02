// Initialize Particles.js for background animation (safe initialization)
try {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true },
                size: { value: 2, random: true },
                line_linked: { enable: true, distance: 120, color: "#ffffff", opacity: 0.2, width: 1 },
                move: { enable: true, speed: 3, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "bubble" }, onclick: { enable: true, mode: "push" } },
                modes: { bubble: { distance: 200, size: 4, duration: 2 }, push: { particles_nb: 2 } }
            },
            retina_detect: true
        });
    } else {
        console.log('Particles.js not loaded, continuing without animation');
    }
} catch (error) {
    console.log('Error initializing particles.js:', error);
}

// Mouse Follower Effect
const mouseFollower = document.getElementById('mouseFollower');
if (mouseFollower) {
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        mouseFollower.style.transform = `translate(${followerX - 100}px, ${followerY - 100}px)`;
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
}

// Password toggle functionality
function togglePassword() {
    const passwordInput = document.getElementById('loginPassword');
    const toggleIcon = document.querySelector('.password-toggle i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Enhanced login form validation and animation
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const loadingOverlay = document.getElementById('loadingOverlay');

// Safety check - only add event listener if form exists
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const type = document.getElementById('loginType').value;
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Gmail-only validation
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            showError('Please enter a valid Gmail address (example@gmail.com)');
            return;
        }
        
        // Password strength validation
        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }
        
        // Show loading animation
        showLoading();
        
        try {
            // Make actual API call to backend
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    userType: type
                })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Store logged-in user information globally
                window.currentUser = {
                    email: result.user.email,
                    type: result.user.userType,
                    name: result.user.name,
                    id: result.user.id,
                    loginTime: new Date().toISOString()
                };
                
                hideLoading();
                hideError();
                
                // Check user type and redirect appropriately
                if (result.user.userType === 'admin') {
                    // Redirect admin to admin dashboard
                    window.location.href = '/admin.html';
                } else {
                    // Show activities list for students
                    document.querySelector('.login-container').style.transform = 'translateY(-100%)';
                    document.querySelector('.login-container').style.opacity = '0';
                    
                    setTimeout(() => {
                        document.querySelector('.login-container').style.display = 'none';
                        showActivitiesList();
                    }, 500);
                }
                
            } else {
                hideLoading();
                showError(result.message || 'Invalid credentials. Please check your email and password.');
            }
        } catch (error) {
            console.error('Login error:', error);
            hideLoading();
            showError('Connection error. Please try again.');
        }
    });
} else {
    console.error('Login form not found! Make sure the HTML has id="loginForm"');
}

function showError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
    loginError.classList.add('error-message');
}

function hideError() {
    loginError.style.display = 'none';
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Helper function to extract name from email
function extractNameFromEmail(email) {
    const localPart = email.split('@')[0];
    const name = localPart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return name;
}

// Show activities list after login with enhanced design
function showActivitiesList() {
    const currentUserName = window.currentUser ? window.currentUser.name : 'Student';
    const currentUserEmail = window.currentUser ? window.currentUser.email : 'user@gmail.com';
    
    // Current/Ongoing Activities that user is actively participating in
    const currentActivities = [
        { 
            name: 'Science Club Weekly Meeting', 
            date: '2025-09-25', 
            time: '3:30 PM', 
            location: 'Lab 201', 
            type: 'Academic',
            status: 'Active Member',
            role: 'Vice President',
            contribution: 'Leading research project on renewable energy',
            nextMeeting: 'Tomorrow',
            progressPercentage: 75
        },
        { 
            name: 'Basketball Team Practice', 
            date: '2025-09-26', 
            time: '4:00 PM', 
            location: 'Main Gym', 
            type: 'Sports',
            status: 'Team Captain',
            role: 'Point Guard',
            contribution: 'Training junior players, organizing team strategies',
            nextMeeting: '2 days',
            progressPercentage: 90
        },
        { 
            name: 'Drama Club Rehearsal', 
            date: '2025-09-27', 
            time: '2:00 PM', 
            location: 'Auditorium', 
            type: 'Creative',
            status: 'Lead Actor',
            role: 'Main Character',
            contribution: 'Memorizing lines, helping with set design',
            nextMeeting: '3 days',
            progressPercentage: 60
        },
        { 
            name: 'Environmental Club Project', 
            date: '2025-09-28', 
            time: '1:00 PM', 
            location: 'School Garden', 
            type: 'Service',
            status: 'Project Coordinator',
            role: 'Team Leader',
            contribution: 'Organizing campus recycling program',
            nextMeeting: '4 days',
            progressPercentage: 80
        },
        { 
            name: 'Coding Club Workshop', 
            date: '2025-09-29', 
            time: '3:00 PM', 
            location: 'Computer Lab', 
            type: 'Technology',
            status: 'Mentor',
            role: 'Senior Developer',
            contribution: 'Teaching Python to beginners, developing school app',
            nextMeeting: '5 days',
            progressPercentage: 85
        }
    ];
    
    // Upcoming events with specific dates
    const upcomingEvents = [
        { name: 'Basketball Tournament Finals', date: '2025-09-30', time: '10:00 AM', location: 'Main Gym', type: 'Sports' },
        { name: 'Science Fair Exhibition', date: '2025-10-15', time: '9:00 AM', location: 'Science Hall', type: 'Academic' },
        { name: 'Annual Music Concert', date: '2025-10-20', time: '6:00 PM', location: 'Auditorium', type: 'Cultural' },
        { name: 'Coding Competition', date: '2025-10-25', time: '2:00 PM', location: 'Computer Lab', type: 'Technology' },
        { name: 'Art Gallery Opening', date: '2025-11-05', time: '4:00 PM', location: 'Art Wing', type: 'Creative' },
        { name: 'Community Service Drive', date: '2025-11-10', time: '8:00 AM', location: 'Campus Grounds', type: 'Service' }
    ];

    const activities = [
        { 
            name: 'Academic & Subject Clubs', 
            icon: 'fas fa-graduation-cap', 
            color: '#3498db', 
            description: 'Math, Science, Debate, and Academic Competitions',
            subActivities: ['Math Olympiad', 'Science Club', 'Debate Society', 'Quiz Bowl', 'Academic Honor Society']
        },
        { 
            name: 'Sports & Athletics', 
            icon: 'fas fa-running', 
            color: '#e74c3c', 
            description: 'Team Sports, Individual Athletics, and Fitness Activities',
            subActivities: ['Basketball', 'Football', 'Tennis', 'Swimming', 'Track & Field', 'Volleyball']
        },
        { 
            name: 'Creative & Performing Arts', 
            icon: 'fas fa-palette', 
            color: '#9b59b6', 
            description: 'Music, Drama, Visual Arts, and Creative Expression',
            subActivities: ['School Band', 'Theater Club', 'Art Club', 'Photography', 'Dance Team', 'Creative Writing']
        },
        { 
            name: 'Community Service', 
            icon: 'fas fa-hands-helping', 
            color: '#27ae60', 
            description: 'Volunteering, Social Impact, and Community Outreach',
            subActivities: ['Environmental Club', 'Food Drive', 'Tutoring Program', 'Senior Care Visit', 'Animal Shelter Help']
        },
        { 
            name: 'Leadership & Governance', 
            icon: 'fas fa-crown', 
            color: '#f39c12', 
            description: 'Student Government, Leadership Programs, and Mentoring',
            subActivities: ['Student Council', 'Peer Mediation', 'Leadership Workshop', 'Mentoring Program', 'Ambassador Club']
        },
        { 
            name: 'Technology & Innovation', 
            icon: 'fas fa-microchip', 
            color: '#1abc9c', 
            description: 'Coding, Robotics, Tech Clubs, and Innovation Projects',
            subActivities: ['Coding Club', 'Robotics Team', 'App Development', 'Game Design', 'Tech Support', 'Innovation Lab']
        }
    ];

    // Create modern activities dashboard with upcoming events
    document.body.innerHTML = `
        <div class="activities-dashboard">
            <div class="dashboard-header">
                <div class="header-content">
                    <div class="user-welcome">
                        <i class="fas fa-user-circle"></i>
                        <div>
                            <h1>Welcome Back, ${currentUserName}!</h1>
                            <p>Logged in as: ${currentUserEmail}</p>
                            <small>Explore activities and upcoming events</small>
                        </div>
                    </div>
                    <button class="logout-btn" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </button>
                </div>
            </div>

            <div class="dashboard-content">
                <!-- Current Activities Section -->
                <div class="section current-activities">
                    <div class="section-header">
                        <h2><i class="fas fa-user-check"></i> My Current Activities</h2>
                        <p>Activities you're actively participating in right now</p>
                    </div>
                    <div class="current-activities-grid">
                        ${currentActivities.map(activity => `
                            <div class="current-activity-card" onclick="showCurrentActivityDetails('${activity.name}')">
                                <div class="activity-header">
                                    <div class="activity-status ${activity.type.toLowerCase()}">${activity.status}</div>
                                    <div class="next-meeting">Next: ${activity.nextMeeting}</div>
                                </div>
                                <div class="activity-content">
                                    <h4>${activity.name}</h4>
                                    <div class="activity-role">
                                        <i class="fas fa-star"></i> ${activity.role}
                                    </div>
                                    <div class="activity-contribution">
                                        <p>${activity.contribution}</p>
                                    </div>
                                    <div class="activity-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${activity.progressPercentage}%"></div>
                                        </div>
                                        <span class="progress-text">${activity.progressPercentage}% Complete</span>
                                    </div>
                                    <div class="activity-meta">
                                        <span><i class="fas fa-clock"></i> ${activity.time}</span>
                                        <span><i class="fas fa-map-marker-alt"></i> ${activity.location}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Upcoming Events Section -->
                <div class="section upcoming-events">
                    <div class="section-header">
                        <h2><i class="fas fa-calendar-alt"></i> Upcoming Events</h2>
                        <p>New opportunities to join and explore</p>
                    </div>
                    <div class="events-grid">
                        ${upcomingEvents.map(event => `
                            <div class="event-card" onclick="showUpcomingEventDetails('${event.name}')">
                                <div class="event-date">
                                    <div class="date-day">${new Date(event.date).getDate()}</div>
                                    <div class="date-month">${new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                                </div>
                                <div class="event-details">
                                    <h4>${event.name}</h4>
                                    <div class="event-meta">
                                        <span><i class="fas fa-clock"></i> ${event.time}</span>
                                        <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                                        <span class="event-type ${event.type.toLowerCase()}">${event.type}</span>
                                    </div>
                                </div>
                                <button class="join-btn" onclick="event.stopPropagation(); joinEvent('${event.name}')">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Activities Section -->
                <div class="section activities-section">
                    <div class="section-header">
                        <h2><i class="fas fa-star"></i> Activity Categories</h2>
                        <p>Choose your area of interest and explore opportunities</p>
                    </div>
                    <div class="activities-grid">
                        ${activities.map(activity => `
                            <div class="activity-card modern-card" onclick="showActivityDetails('${activity.name}')" style="--card-color: ${activity.color}">
                                <div class="card-icon">
                                    <i class="${activity.icon}"></i>
                                </div>
                                <div class="card-content">
                                    <h3>${activity.name}</h3>
                                    <p>${activity.description}</p>
                                    <div class="sub-activities">
                                        ${activity.subActivities.slice(0, 3).map(sub => `<span class="sub-tag">${sub}</span>`).join('')}
                                        ${activity.subActivities.length > 3 ? `<span class="sub-tag more">+${activity.subActivities.length - 3} more</span>` : ''}
                                    </div>
                                    <div class="card-stats">
                                        <span><i class="fas fa-users"></i> ${Math.floor(Math.random() * 50) + 20} Members</span>
                                        <span><i class="fas fa-star"></i> ${(Math.random() * 2 + 3).toFixed(1)} Rating</span>
                                    </div>
                                </div>
                                <div class="card-arrow">
                                    <i class="fas fa-arrow-right"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <style>
            .activities-dashboard {
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: 'Poppins', sans-serif;
            }

            .dashboard-header {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                padding: 1.5rem 2rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }

            .header-content {
                max-width: 1400px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .user-welcome {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .user-welcome i {
                font-size: 3rem;
                color: #667eea;
            }

            .user-welcome h1 {
                margin: 0;
                font-size: 1.8rem;
                font-weight: 700;
                color: #333;
                background: linear-gradient(45deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .user-welcome p {
                margin: 0;
                color: #666;
                font-size: 1rem;
            }

            .user-welcome small {
                color: #888;
                font-size: 0.9rem;
            }

            .logout-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.8rem 1.5rem;
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
                border: none;
                border-radius: 25px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Poppins', sans-serif;
            }

            .logout-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
            }

            .dashboard-content {
                padding: 2rem;
                max-width: 1400px;
                margin: 0 auto;
            }

            .section {
                margin-bottom: 3rem;
            }

            .section-header {
                text-align: center;
                margin-bottom: 2rem;
            }

            .section-header h2 {
                color: white;
                font-size: 2.2rem;
                margin-bottom: 0.5rem;
                font-weight: 700;
            }

            .section-header p {
                color: rgba(255, 255, 255, 0.8);
                font-size: 1.1rem;
            }

            /* Upcoming Events Styles */
            .events-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
            }

            .event-card {
                background: rgba(255, 255, 255, 0.95);
                border-radius: 15px;
                padding: 1.5rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .event-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            }

            .event-date {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border-radius: 10px;
                padding: 1rem;
                text-align: center;
                min-width: 60px;
            }

            .date-day {
                font-size: 1.5rem;
                font-weight: bold;
                line-height: 1;
            }

            .date-month {
                font-size: 0.9rem;
                opacity: 0.9;
            }

            .event-details {
                flex: 1;
            }

            .event-details h4 {
                margin: 0 0 0.5rem 0;
                color: #333;
                font-size: 1.1rem;
            }

            .event-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 0.8rem;
                font-size: 0.85rem;
                color: #666;
            }

            .event-meta span {
                display: flex;
                align-items: center;
                gap: 0.3rem;
            }

            .event-type {
                background: #f8f9fa;
                padding: 0.2rem 0.5rem;
                border-radius: 10px;
                font-weight: 500;
            }

            .event-type.sports { background: #ffe6e6; color: #e74c3c; }
            .event-type.academic { background: #e6f3ff; color: #3498db; }
            .event-type.cultural { background: #f3e6ff; color: #9b59b6; }
            .event-type.technology { background: #e6fff7; color: #1abc9c; }
            .event-type.creative { background: #fff0e6; color: #f39c12; }
            .event-type.service { background: #e6ffe6; color: #27ae60; }

            .join-btn {
                background: linear-gradient(135deg, #27ae60, #2ecc71);
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .join-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
            }

            /* Activities Styles */
            .activities-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 2rem;
            }

            .activity-card {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(15px);
                border-radius: 20px;
                padding: 2rem;
                cursor: pointer;
                transition: all 0.4s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
                position: relative;
                overflow: hidden;
            }

            .activity-card:hover {
                transform: translateY(-10px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                background: rgba(255, 255, 255, 1);
            }

            .card-icon {
                background: var(--card-color);
                color: white;
                width: 60px;
                height: 60px;
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.8rem;
                margin-bottom: 1.5rem;
                transition: all 0.3s ease;
            }

            .activity-card:hover .card-icon {
                transform: scale(1.1);
            }

            .card-content h3 {
                margin: 0 0 0.5rem 0;
                color: #333;
                font-size: 1.3rem;
                font-weight: 600;
            }

            .card-content p {
                color: #666;
                margin-bottom: 1rem;
                line-height: 1.5;
            }

            .sub-activities {
                margin-bottom: 1rem;
            }

            .sub-tag {
                display: inline-block;
                background: #f8f9fa;
                color: #666;
                padding: 0.3rem 0.6rem;
                border-radius: 15px;
                font-size: 0.8rem;
                margin: 0.2rem 0.3rem 0.2rem 0;
                border: 1px solid #e9ecef;
            }

            .sub-tag.more {
                background: var(--card-color);
                color: white;
            }

            .card-stats {
                display: flex;
                justify-content: space-between;
                font-size: 0.9rem;
                color: #777;
                margin-bottom: 1rem;
            }

            .card-stats span {
                display: flex;
                align-items: center;
                gap: 0.3rem;
            }

            .card-arrow {
                position: absolute;
                top: 1.5rem;
                right: 1.5rem;
                color: var(--card-color);
                font-size: 1.2rem;
                opacity: 0.5;
                transition: all 0.3s ease;
            }

            .activity-card:hover .card-arrow {
                opacity: 1;
                transform: translateX(5px);
            }

            @media (max-width: 768px) {
                .dashboard-content {
                    padding: 1rem;
                }
                
                .events-grid,
                .activities-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }

                .header-content {
                    flex-direction: column;
                    gap: 1rem;
                    text-align: center;
                }

                .event-card {
                    padding: 1rem;
                }

                .activity-card {
                    padding: 1.5rem;
                }
            }
        </style>
    `;
}

// Logout functionality
function logout() {
    location.reload();
}

// New functions for enhanced dashboard
function showCurrentActivityDetails(activityName) {
    const activity = currentActivities.find(a => a.name === activityName);
    if (!activity) return;

    const modal = document.createElement('div');
    modal.className = 'activity-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <div class="modal-header">
                <h2><i class="fas fa-trophy"></i> ${activity.name}</h2>
                <div class="activity-badge ${activity.type.toLowerCase()}">${activity.status}</div>
            </div>
            
            <div class="modal-body">
                <div class="performance-section">
                    <h3><i class="fas fa-chart-line"></i> My Performance & Contribution</h3>
                    <div class="performance-grid">
                        <div class="performance-card role-card">
                            <i class="fas fa-user-tie"></i>
                            <h4>My Role</h4>
                            <p>${activity.role}</p>
                        </div>
                        <div class="performance-card progress-card">
                            <i class="fas fa-percentage"></i>
                            <h4>Progress</h4>
                            <div class="progress-circle">
                                <div class="progress-ring" style="--progress: ${activity.progressPercentage}%">
                                    <span>${activity.progressPercentage}%</span>
                                </div>
                            </div>
                        </div>
                        <div class="performance-card contribution-card">
                            <i class="fas fa-hands-helping"></i>
                            <h4>My Contributions</h4>
                            <p>${activity.contribution}</p>
                        </div>
                    </div>
                </div>

                <div class="activity-details-section">
                    <h3><i class="fas fa-info-circle"></i> Activity Details</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span class="detail-label">Schedule:</span>
                            <span class="detail-value">${activity.date} at ${activity.time}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span class="detail-label">Location:</span>
                            <span class="detail-value">${activity.location}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-flag"></i>
                            <span class="detail-label">Type:</span>
                            <span class="detail-value">${activity.type}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span class="detail-label">Next Meeting:</span>
                            <span class="detail-value">${activity.nextMeeting}</span>
                        </div>
                    </div>
                </div>

                <div class="achievements-section">
                    <h3><i class="fas fa-medal"></i> Recent Achievements</h3>
                    <div class="achievements-list">
                        <div class="achievement-item">
                            <i class="fas fa-star"></i>
                            <span>Maintained consistent attendance</span>
                        </div>
                        <div class="achievement-item">
                            <i class="fas fa-users"></i>
                            <span>Collaborated effectively with team</span>
                        </div>
                        <div class="achievement-item">
                            <i class="fas fa-lightbulb"></i>
                            <span>Contributed innovative ideas</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn-primary" onclick="viewFullReport('${activity.name}')">
                    <i class="fas fa-file-alt"></i> View Full Report
                </button>
                <button class="btn-secondary" onclick="updateProgress('${activity.name}')">
                    <i class="fas fa-edit"></i> Update Progress
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.onclick = () => document.body.removeChild(modal);
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };

    // Animate the modal
    setTimeout(() => modal.classList.add('show'), 10);
}

function viewFullReport(activityName) {
    alert(`Opening full performance report for ${activityName}...`);
}

function updateProgress(activityName) {
    alert(`Opening progress update form for ${activityName}...`);
}

function showUpcomingEventDetails(eventName) {
    const event = upcomingEvents.find(e => e.name === eventName);
    if (!event) return;

    const eventDate = new Date(event.date);
    const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
    const fullDate = eventDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const timeUntil = getTimeUntilEvent(eventDate);

    const modal = document.createElement('div');
    modal.className = 'activity-modal upcoming-event-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <div class="modal-header upcoming-header">
                <h2><i class="fas fa-calendar-plus"></i> ${event.name}</h2>
                <div class="event-badge ${event.type.toLowerCase()}">${event.type}</div>
            </div>
            
            <div class="modal-body">
                <div class="event-timing-section">
                    <h3><i class="fas fa-clock"></i> Event Schedule</h3>
                    <div class="timing-grid">
                        <div class="timing-card main-date">
                            <i class="fas fa-calendar-day"></i>
                            <h4>Date</h4>
                            <p class="date-display">${fullDate}</p>
                            <span class="day-name">${dayName}</span>
                        </div>
                        <div class="timing-card main-time">
                            <i class="fas fa-clock"></i>
                            <h4>Time</h4>
                            <p class="time-display">${event.time}</p>
                            <span class="time-period">Make sure to arrive early!</span>
                        </div>
                        <div class="timing-card countdown">
                            <i class="fas fa-hourglass-half"></i>
                            <h4>Time Until Event</h4>
                            <p class="countdown-display">${timeUntil}</p>
                            <span class="countdown-note">Mark your calendar!</span>
                        </div>
                    </div>
                </div>

                <div class="event-details-section">
                    <h3><i class="fas fa-info-circle"></i> Event Information</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <i class="fas fa-tag"></i>
                            <span class="detail-label">Event Type:</span>
                            <span class="detail-value">${event.type}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span class="detail-label">Location:</span>
                            <span class="detail-value">${event.location}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span class="detail-label">Day of Week:</span>
                            <span class="detail-value">${dayName}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span class="detail-label">Duration:</span>
                            <span class="detail-value">2-3 hours (estimated)</span>
                        </div>
                    </div>
                </div>

                <div class="event-description-section">
                    <h3><i class="fas fa-file-alt"></i> What to Expect</h3>
                    <div class="description-content">
                        <p>This ${event.type.toLowerCase()} event will provide great opportunities for:</p>
                        <ul class="expectations-list">
                            <li><i class="fas fa-users"></i> Meeting new people and networking</li>
                            <li><i class="fas fa-trophy"></i> Developing your skills and talents</li>
                            <li><i class="fas fa-heart"></i> Contributing to the community</li>
                            <li><i class="fas fa-star"></i> Building your experience and resume</li>
                        </ul>
                    </div>
                </div>

                <div class="preparation-section">
                    <h3><i class="fas fa-list-check"></i> How to Prepare</h3>
                    <div class="preparation-grid">
                        <div class="prep-item">
                            <i class="fas fa-calendar-check"></i>
                            <h4>Save the Date</h4>
                            <p>Add this event to your calendar and set reminders</p>
                        </div>
                        <div class="prep-item">
                            <i class="fas fa-route"></i>
                            <h4>Plan Your Route</h4>
                            <p>Check the location and plan your transportation</p>
                        </div>
                        <div class="prep-item">
                            <i class="fas fa-user-friends"></i>
                            <h4>Invite Friends</h4>
                            <p>Consider bringing friends who might be interested</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn-primary" onclick="joinEvent('${event.name}'); document.body.removeChild(this.closest('.activity-modal'))">
                    <i class="fas fa-plus-circle"></i> Join This Event
                </button>
                <button class="btn-secondary" onclick="addToCalendar('${event.name}', '${event.date}', '${event.time}')">
                    <i class="fas fa-calendar-plus"></i> Add to Calendar
                </button>
                <button class="btn-info" onclick="shareEvent('${event.name}')">
                    <i class="fas fa-share"></i> Share Event
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.onclick = () => document.body.removeChild(modal);
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };

    // Animate the modal
    setTimeout(() => modal.classList.add('show'), 10);
}

function getTimeUntilEvent(eventDate) {
    const now = new Date();
    const timeDiff = eventDate.getTime() - now.getTime();
    
    if (timeDiff < 0) {
        return "Event has passed";
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
        return `${days} days, ${hours} hours`;
    } else if (hours > 0) {
        return `${hours} hours, ${minutes} minutes`;
    } else {
        return `${minutes} minutes`;
    }
}

function addToCalendar(eventName, eventDate, eventTime) {
    alert(`Adding "${eventName}" on ${eventDate} at ${eventTime} to your calendar...`);
    // Here you could integrate with calendar APIs
}

function shareEvent(eventName) {
    if (navigator.share) {
        navigator.share({
            title: `Join me at ${eventName}!`,
            text: `I'm planning to attend ${eventName}. Would you like to join?`,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const text = `Join me at ${eventName}! Check it out at ${window.location.href}`;
        navigator.clipboard.writeText(text).then(() => {
            alert('Event details copied to clipboard!');
        });
    }
}

function joinEvent(eventName) {
    alert(`You've expressed interest in joining: ${eventName}\n\nYou'll receive more details via email soon!`);
}

function showActivityDetails(activityName) {
    // Personal performance data for each activity
    const activityData = {
        'Academic & Subject Clubs': {
            participated: 12,
            achievements: ['Science Fair Gold Medal', 'Math Olympiad Regional Winner', 'Debate Team Captain', 'Quiz Bowl MVP', 'Honor Roll Student'],
            totalPoints: 485,
            averageScore: 92,
            badges: ['Academic Star', 'Research Excellence', 'Leadership Award', 'Scholar of the Year'],
            lastParticipation: 'September 20, 2025',
            upcomingEvents: ['Science Exhibition - Oct 8', 'Math Competition - Oct 15', 'Debate Finals - Oct 22'],
            skillsGained: ['Research Skills', 'Public Speaking', 'Critical Thinking', 'Problem Solving'],
            recentHistory: [
                { event: 'Science Fair 2025', date: 'Sep 20', score: 95, position: '1st Place', points: 60 },
                { event: 'Math Olympiad', date: 'Sep 15', score: 89, position: '2nd Place', points: 50 },
                { event: 'Debate Tournament', date: 'Sep 10', score: 93, position: 'Captain', points: 55 },
                { event: 'Quiz Bowl Championship', date: 'Sep 5', score: 91, position: 'MVP', points: 50 }
            ]
        },
        'Sports & Athletics': {
            participated: 18,
            achievements: ['Basketball District Champions', 'Swimming State Qualifier', 'Tennis Regional Finalist', 'Track Record Holder', 'Most Valuable Player'],
            totalPoints: 520,
            averageScore: 86,
            badges: ['Athletic Excellence', 'Team Captain', 'Sportsmanship Award', 'Record Breaker'],
            lastParticipation: 'September 22, 2025',
            upcomingEvents: ['Basketball Tournament - Oct 5', 'Swimming Championship - Oct 12', 'Track Meet - Oct 18'],
            skillsGained: ['Teamwork', 'Physical Fitness', 'Competitive Spirit', 'Leadership'],
            recentHistory: [
                { event: 'Basketball District Finals', date: 'Sep 22', score: 90, position: 'Captain', points: 55 },
                { event: 'Swimming Championships', date: 'Sep 18', score: 88, position: 'Qualifier', points: 45 },
                { event: 'Tennis Regional', date: 'Sep 12', score: 85, position: 'Finalist', points: 50 },
                { event: 'Track & Field Meet', date: 'Sep 8', score: 92, position: 'Record Holder', points: 60 }
            ]
        },
        'Creative & Performing Arts': {
            participated: 14,
            achievements: ['Lead Actor Award', 'Art Exhibition Featured Artist', 'Band Lead Guitarist', 'Dance Competition Winner', 'Creative Writing Prize'],
            totalPoints: 425,
            averageScore: 89,
            badges: ['Creative Genius', 'Performance Excellence', 'Artistic Vision', 'Renaissance Artist'],
            lastParticipation: 'September 18, 2025',
            upcomingEvents: ['Drama Production - Oct 10', 'Art Gallery - Oct 17', 'Music Concert - Oct 25'],
            skillsGained: ['Creativity', 'Self-Expression', 'Confidence', 'Artistic Techniques'],
            recentHistory: [
                { event: 'Annual Drama Production', date: 'Sep 18', score: 92, position: 'Lead Actor', points: 55 },
                { event: 'Art Exhibition', date: 'Sep 14', score: 88, position: 'Featured Artist', points: 45 },
                { event: 'Band Performance', date: 'Sep 10', score: 90, position: 'Lead Guitar', points: 40 },
                { event: 'Dance Competition', date: 'Sep 6', score: 87, position: 'Winner', points: 50 }
            ]
        },
        'Community Service': {
            participated: 15,
            achievements: ['Community Service Award', 'Environmental Champion', 'Volunteer of the Month', 'Leadership Excellence', '100+ Hours Volunteer'],
            totalPoints: 395,
            averageScore: 94,
            badges: ['Community Hero', 'Environmental Steward', 'Service Leader', 'Change Maker'],
            lastParticipation: 'September 21, 2025',
            upcomingEvents: ['Beach Clean-up - Oct 6', 'Food Drive - Oct 13', 'Senior Center Visit - Oct 20'],
            skillsGained: ['Leadership', 'Social Responsibility', 'Empathy', 'Project Management'],
            recentHistory: [
                { event: 'Community Clean-up Drive', date: 'Sep 21', score: 96, position: 'Coordinator', points: 50 },
                { event: 'Food Bank Volunteer', date: 'Sep 17', score: 94, position: 'Team Leader', points: 45 },
                { event: 'Environmental Project', date: 'Sep 13', score: 92, position: 'Champion', points: 55 },
                { event: 'Senior Care Program', date: 'Sep 9', score: 95, position: 'Volunteer', points: 40 }
            ]
        },
        'Leadership & Governance': {
            participated: 10,
            achievements: ['Student Council President', 'Peer Mediator', 'Leadership Workshop Graduate', 'Mentorship Award', 'Student Ambassador'],
            totalPoints: 385,
            averageScore: 93,
            badges: ['Natural Leader', 'Mentor', 'Diplomat', 'Student Voice'],
            lastParticipation: 'September 19, 2025',
            upcomingEvents: ['Student Council Meeting - Oct 7', 'Leadership Summit - Oct 14', 'Peer Mediation Training - Oct 21'],
            skillsGained: ['Leadership', 'Communication', 'Conflict Resolution', 'Public Service'],
            recentHistory: [
                { event: 'Student Council Election', date: 'Sep 19', score: 95, position: 'President', points: 60 },
                { event: 'Peer Mediation Session', date: 'Sep 15', score: 91, position: 'Mediator', points: 40 },
                { event: 'Leadership Workshop', date: 'Sep 11', score: 93, position: 'Graduate', points: 45 },
                { event: 'Student Assembly', date: 'Sep 7', score: 89, position: 'Speaker', points: 35 }
            ]
        },
        'Technology & Innovation': {
            participated: 11,
            achievements: ['Coding Hackathon Winner', 'App Store Published', 'Robotics Team Captain', 'AI Project Showcase', 'Tech Innovation Award'],
            totalPoints: 465,
            averageScore: 88,
            badges: ['Tech Innovator', 'Code Master', 'Digital Creator', 'Future Engineer'],
            lastParticipation: 'September 16, 2025',
            upcomingEvents: ['Robotics Competition - Oct 9', 'Coding Workshop - Oct 16', 'Tech Fair - Oct 23'],
            skillsGained: ['Programming', 'Problem Solving', 'Innovation', 'Technical Design'],
            recentHistory: [
                { event: 'Coding Hackathon', date: 'Sep 16', score: 92, position: 'Winner', points: 60 },
                { event: 'App Development Contest', date: 'Sep 12', score: 87, position: 'Published', points: 50 },
                { event: 'Robotics Regional', date: 'Sep 8', score: 90, position: 'Captain', points: 55 },
                { event: 'Tech Innovation Fair', date: 'Sep 4', score: 85, position: 'Showcase', points: 40 }
            ]
        }
    };

    const data = activityData[activityName];
    
    if (data) {
        // Create detailed performance modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 25px;
                max-width: 900px;
                max-height: 90vh;
                width: 90%;
                padding: 0;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            ">
                <div style="
                    background: rgba(255, 255, 255, 0.95);
                    margin: 3px;
                    border-radius: 22px;
                    padding: 2.5rem;
                ">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: rgba(255, 255, 255, 0.9);
                        border: none;
                        border-radius: 50%;
                        width: 45px;
                        height: 45px;
                        cursor: pointer;
                        font-size: 1.3rem;
                        color: #666;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    ">×</button>
                    
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <h2 style="color: #2c3e50; margin-bottom: 0.5rem; font-size: 2rem;">🎯 ${activityName}</h2>
                        <p style="color: #7f8c8d; font-size: 1.1rem;">Your Personal Performance Dashboard</p>
                    </div>
                    
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 1.5rem;
                        margin-bottom: 2.5rem;
                    ">
                        <div style="background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 1.8rem; border-radius: 18px; text-align: center; box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);">
                            <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;">${data.totalPoints}</div>
                            <div style="font-size: 1rem; opacity: 0.9;">Total Points</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #27ae60, #16a085); color: white; padding: 1.8rem; border-radius: 18px; text-align: center; box-shadow: 0 8px 25px rgba(39, 174, 96, 0.3);">
                            <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;">${data.averageScore}%</div>
                            <div style="font-size: 1rem; opacity: 0.9;">Average Score</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 1.8rem; border-radius: 18px; text-align: center; box-shadow: 0 8px 25px rgba(231, 76, 60, 0.3);">
                            <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;">${data.participated}</div>
                            <div style="font-size: 1rem; opacity: 0.9;">Events Joined</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #f39c12, #d68910); color: white; padding: 1.8rem; border-radius: 18px; text-align: center; box-shadow: 0 8px 25px rgba(243, 156, 18, 0.3);">
                            <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;">${data.badges.length}</div>
                            <div style="font-size: 1rem; opacity: 0.9;">Badges Earned</div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2.5rem;">
                        <h3 style="color: #2c3e50; margin-bottom: 1.2rem; font-size: 1.4rem; display: flex; align-items: center; gap: 0.5rem;">
                            🏆 Your Achievements
                        </h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.7rem;">
                            ${data.achievements.map(achievement => 
                                `<span style="
                                    background: linear-gradient(135deg, #667eea, #764ba2);
                                    color: white;
                                    padding: 0.6rem 1.2rem;
                                    border-radius: 25px;
                                    font-size: 0.9rem;
                                    font-weight: 500;
                                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                                ">${achievement}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2.5rem;">
                        <h3 style="color: #2c3e50; margin-bottom: 1.2rem; font-size: 1.4rem; display: flex; align-items: center; gap: 0.5rem;">
                            🏅 Badges Collection
                        </h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.7rem;">
                            ${data.badges.map(badge => 
                                `<span style="
                                    background: linear-gradient(135deg, #f39c12, #e67e22);
                                    color: white;
                                    padding: 0.6rem 1.2rem;
                                    border-radius: 25px;
                                    font-size: 0.9rem;
                                    font-weight: 500;
                                    box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
                                ">🏅 ${badge}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2.5rem;">
                        <h3 style="color: #2c3e50; margin-bottom: 1.2rem; font-size: 1.4rem; display: flex; align-items: center; gap: 0.5rem;">
                            📈 Recent Performance
                        </h3>
                        <div style="background: rgba(0, 0, 0, 0.02); border-radius: 18px; padding: 1.5rem;">
                            ${data.recentHistory.map(event => 
                                `<div style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 1.2rem;
                                    background: white;
                                    margin: 0.8rem 0;
                                    border-radius: 12px;
                                    border-left: 5px solid #667eea;
                                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
                                ">
                                    <div>
                                        <div style="font-weight: bold; color: #2c3e50; font-size: 1.1rem;">${event.event}</div>
                                        <div style="font-size: 0.9rem; color: #7f8c8d; margin-top: 0.3rem;">${event.date} • ${event.position}</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-weight: bold; color: #27ae60; font-size: 1.2rem;">${event.score}%</div>
                                        <div style="font-size: 0.9rem; color: #f39c12; font-weight: 500;">${event.points} pts</div>
                                    </div>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2.5rem;">
                        <h3 style="color: #2c3e50; margin-bottom: 1.2rem; font-size: 1.4rem; display: flex; align-items: center; gap: 0.5rem;">
                            🚀 Skills Developed
                        </h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.7rem;">
                            ${data.skillsGained.map(skill => 
                                `<span style="
                                    background: rgba(52, 152, 219, 0.1);
                                    color: #3498db;
                                    padding: 0.6rem 1.2rem;
                                    border-radius: 20px;
                                    font-size: 0.9rem;
                                    border: 2px solid rgba(52, 152, 219, 0.2);
                                    font-weight: 500;
                                ">🚀 ${skill}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <h3 style="color: #2c3e50; margin-bottom: 1.2rem; font-size: 1.4rem; display: flex; align-items: center; gap: 0.5rem;">
                            📅 Upcoming Events
                        </h3>
                        <div style="background: rgba(46, 204, 113, 0.1); border-radius: 18px; padding: 1.5rem;">
                            ${data.upcomingEvents.map(event => 
                                `<div style="
                                    background: white;
                                    padding: 1.2rem;
                                    margin: 0.8rem 0;
                                    border-radius: 12px;
                                    border-left: 5px solid #27ae60;
                                    color: #2c3e50;
                                    font-weight: 500;
                                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
                                ">📅 ${event}</div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div style="text-align: center; padding-top: 1.5rem; border-top: 2px solid rgba(0, 0, 0, 0.05);">
                        <div style="font-size: 1rem; color: #7f8c8d; margin-bottom: 0.5rem;">
                            Last Participation: <strong>${data.lastParticipation}</strong>
                        </div>
                        <div style="font-size: 0.9rem; color: #95a5a6;">
                            Keep up the excellent work! 🌟
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
        
    } else {
        // Fallback for unknown activities
        alert(`Activity details for "${activityName}" are being prepared. Please check back soon!`);
    }
}