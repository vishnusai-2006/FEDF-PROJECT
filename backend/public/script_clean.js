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
                <!-- Upcoming Events Section -->
                <div class="section upcoming-events">
                    <div class="section-header">
                        <h2><i class="fas fa-calendar-alt"></i> Upcoming Events</h2>
                        <p>Don't miss these exciting upcoming activities!</p>
                    </div>
                    <div class="events-grid">
                        ${upcomingEvents.map(event => `
                            <div class="event-card">
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
                                <button class="join-btn" onclick="joinEvent('${event.name}')">
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
function joinEvent(eventName) {
    alert(`You've expressed interest in joining: ${eventName}\n\nYou'll receive more details via email soon!`);
}

function showActivityDetails(activityName) {
    alert(`Loading detailed view for: ${activityName}\n\nThis would show:\n- Sub-activities list\n- Requirements\n- Meeting times\n- Contact information\n- Registration options`);
}