// Auth Functions
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication state
    const isAuthenticated = localStorage.getItem('petcareAuthToken');
    const currentPage = window.location.pathname;

    // Redirect logic
    if (isAuthenticated && (currentPage.includes('login.html') || currentPage.includes('register.html'))) {
        window.location.href = '../profile/profile.html';
    }
    if (!isAuthenticated && currentPage.includes('profile.html')) {
        window.location.href = '../login.html';
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Basic validation
            if (!username || !password) {
                alert('Please fill in all fields');
                return;
            }

            // Simulate API call
            setTimeout(() => {
                // In a real app, this would be an actual API call
                console.log('Login attempt with:', { username, password });
                
                // Store auth token
                localStorage.setItem('petcareAuthToken', 'simulated-token-123');
                localStorage.setItem('userData', JSON.stringify({
                    name: 'J. Kaushalya',
                    email: username.includes('@') ? username : '',
                    phone: !username.includes('@') ? username : '0712345678',
                    joinDate: 'Jan 2023'
                }));
                
                // Redirect to profile
                window.location.href = '../profile/profile.html';
            }, 500);
        });
    }

    // Registration Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                password: document.getElementById('regPassword').value,
                confirmPassword: document.getElementById('confirmPassword').value
            };

            // Validation
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            if (!document.getElementById('terms').checked) {
                alert('You must agree to the terms');
                return;
            }

            // Simulate API call
            setTimeout(() => {
                console.log('Registration data:', formData);
                
                // Store auth token and user data
                localStorage.setItem('petcareAuthToken', 'simulated-token-123');
                localStorage.setItem('userData', JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                }));
                
                // Redirect to profile
                window.location.href = '/user-authentication/profile/profile.html';
            }, 500);
        });

        // Password strength indicator
        const passwordInput = document.getElementById('regPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                const strengthBars = document.querySelectorAll('.strength-bar');
                const strength = calculatePasswordStrength(this.value);
                
                strengthBars.forEach((bar, index) => {
                    bar.style.backgroundColor = index < strength ? 
                        ['#ff4444', '#ffbb33', '#00C851'][strength-1] : '#eee';
                });
            });
        }
    }
});

// Moved outside of DOMContentLoaded since it's used by multiple functions
function calculatePasswordStrength(password) {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (hasUpper && hasLower) strength++;
    if (hasNumber) strength++;
    if (hasSpecial) strength++;
    
    return Math.min(Math.floor(strength), 3);
}
// Check authentication state
function checkAuth() {
    const isLoggedIn = localStorage.getItem('petcareAuthToken');
    const currentPage = window.location.pathname.split('/').pop();

    if (!isLoggedIn && currentPage !== 'login.html' && currentPage !== 'register.html') {
        window.location.href = 'login.html';
    }
    if (isLoggedIn && (currentPage === 'login.html' || currentPage === 'register.html')) {
        window.location.href = 'user-authentication/profile/profile.html';
    }
}

// Load user data
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    document.querySelectorAll('#profileName').forEach(el => el.textContent = userData.name || 'User');
    document.querySelectorAll('#joinDate').forEach(el => el.textContent = userData.joinDate || 'Just now');
}

// Initialize sidebar active state
function initSidebar() {
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.profile-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Pets Page Functionality
function initPetsPage() {
    if (!document.getElementById('petsContainer')) return;

    // Modal handling
    const modal = document.getElementById('petModal');
    const addPetBtn = document.getElementById('addPetBtn');
    const addFirstPetBtn = document.getElementById('addFirstPetBtn');
    const closeBtn = document.querySelector('.close-btn');

    function openModal() {
        modal.style.display = 'block';
        document.getElementById('petForm').reset();
        document.getElementById('modalTitle').textContent = 'Add New Pet';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    if (addPetBtn) addPetBtn.addEventListener('click', openModal);
    if (addFirstPetBtn) addFirstPetBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Form submission
    const petForm = document.getElementById('petForm');
    if (petForm) {
        petForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const petData = {
                name: document.getElementById('petName').value,
                type: document.getElementById('petType').value,
                breed: document.getElementById('petBreed').value,
                age: document.getElementById('petAge').value,
                gender: document.getElementById('petGender').value,
                photo: document.getElementById('petPhoto').files[0]
            };

            // In a real app, you would upload to server here
            console.log('Pet data:', petData);
            
            // Simulate API call
            setTimeout(() => {
                closeModal();
                alert('Pet added successfully!');
                // You would refresh the pets list here
            }, 1000);
        });
    }

    // Load pets (simulated)
    loadPets();
}

function loadPets() {
    const petsContainer = document.getElementById('petsContainer');
    if (!petsContainer) return;

    // Simulated data - in real app you would fetch from API
    const pets = JSON.parse(localStorage.getItem('userPets')) || [];
    
    if (pets.length === 0) {
        petsContainer.innerHTML = `
            <div class="no-pets">
                <img src="../../assets/images/no-pets.svg" alt="No pets" class="empty-state-img">
                <p>You haven't added any pets yet</p>
                <button class="btn btn-primary" id="addFirstPetBtn">Add Your First Pet</button>
            </div>
        `;
        return;
    }

    let html = '';
    pets.forEach(pet => {
        html += `
            <div class="pet-card">
                <div class="pet-header">
                    <h3>${pet.name}</h3>
                    <span class="pet-type">${pet.type}</span>
                </div>
                <div class="pet-details">
                    <p><strong>Breed:</strong> ${pet.breed || 'Unknown'}</p>
                    <p><strong>Age:</strong> ${pet.age || 'Unknown'}</p>
                    <p><strong>Gender:</strong> ${pet.gender}</p>
                </div>
                <div class="pet-actions">
                    <button class="btn btn-outline edit-pet" data-id="${pet.id}">Edit</button>
                    <button class="btn btn-danger delete-pet" data-id="${pet.id}">Delete</button>
                </div>
            </div>
        `;
    });

    petsContainer.innerHTML = html;
}

// Appointments Page
function initAppointmentsPage() {
    if (!document.getElementById('appointmentsContainer')) return;

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            loadAppointments(this.value);
        });
    }

    loadAppointments('all');
}

function loadAppointments(filter) {
    const container = document.getElementById('appointmentsContainer');
    if (!container) return;

    // Simulated data
    const appointments = [
        {
            id: 1,
            petName: 'Buddy',
            clinic: 'Colombo Animal Hospital',
            date: '2023-11-15',
            time: '10:30 AM',
            status: 'upcoming',
            type: 'Vaccination'
        },
        {
            id: 2,
            petName: 'Whiskers',
            clinic: 'Peradeniya Vet',
            date: '2023-10-20',
            time: '02:15 PM',
            status: 'completed',
            type: 'Checkup'
        }
    ];

    const filtered = filter === 'all' 
        ? appointments 
        : appointments.filter(a => a.status === filter);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="no-appointments">
                <img src="../../assets/images/no-appointments.svg" alt="No appointments" class="empty-state-img">
                <p>No ${filter} appointments found</p>
                <a href="../vet-clinics/clinics.html" class="btn btn-primary">Book Appointment</a>
            </div>
        `;
        return;
    }

    let html = '';
    filtered.forEach(appt => {
        html += `
            <div class="appointment-card ${appt.status}">
                <div class="appt-header">
                    <h3>${appt.type} for ${appt.petName}</h3>
                    <span class="status-badge ${appt.status}">${appt.status}</span>
                </div>
                <div class="appt-details">
                    <p><i class="fas fa-hospital"></i> ${appt.clinic}</p>
                    <p><i class="fas fa-calendar-day"></i> ${appt.date} at ${appt.time}</p>
                </div>
                <div class="appt-actions">
                    ${appt.status === 'upcoming' ? `
                        <button class="btn btn-outline reschedule-btn" data-id="${appt.id}">Reschedule</button>
                        <button class="btn btn-danger cancel-btn" data-id="${appt.id}">Cancel</button>
                    ` : ''}
                    <button class="btn btn-primary details-btn" data-id="${appt.id}">Details</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Saved Items Page
function initSavedPage() {
    if (!document.getElementById('savedClinics')) return;

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const tabId = this.dataset.tab + '-tab';
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    loadSavedItems();
}

function loadSavedItems() {
    // Simulated data
    const savedClinics = [
        { id: 1, name: 'Colombo Animal Hospital', rating: 4.5 }
    ];

    const savedProducts = [];
    const savedArticles = [];

    renderSavedItems('clinics', savedClinics);
    renderSavedItems('products', savedProducts);
    renderSavedItems('articles', savedArticles);
}

function renderSavedItems(type, items) {
    const container = document.getElementById(`saved${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-${getIconForType(type)} empty-icon"></i>
                <p>No saved ${type} yet</p>
                ${type === 'clinics' ? 
                    '<a href="../vet-clinics/clinics.html" class="btn btn-outline">Browse Clinics</a>' : 
                 type === 'products' ? 
                    '<a href="../marketplace/marketplace.html" class="btn btn-outline">Browse Products</a>' : ''}
            </div>
        `;
        return;
    }

    // Render items list
    let html = '<div class="saved-items-list">';
    items.forEach(item => {
        html += `
            <div class="saved-item">
                <h4>${item.name}</h4>
                ${item.rating ? `<span class="rating">${'★'.repeat(Math.floor(item.rating))}${'☆'.repeat(5 - Math.floor(item.rating))}</span>` : ''}
                <button class="btn btn-danger remove-btn" data-type="${type}" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

function getIconForType(type) {
    switch(type) {
        case 'clinics': return 'hospital-user';
        case 'products': return 'shopping-bag';
        case 'articles': return 'newspaper';
        default: return 'heart';
    }
}

// Settings Page
function initSettingsPage() {
    if (!document.getElementById('notificationSettings')) return;

    // Load current settings
    const settings = JSON.parse(localStorage.getItem('userSettings')) || {
        notifications: {
            appointmentReminders: true,
            vaccinationAlerts: true,
            promotionalEmails: false
        },
        security: {
            twoFactorAuth: false
        },
        language: 'en',
        region: 'LK'
    };

    // Set form values
    document.getElementById('appointmentReminders').checked = settings.notifications.appointmentReminders;
    document.getElementById('vaccinationAlerts').checked = settings.notifications.vaccinationAlerts;
    document.getElementById('promotionalEmails').checked = settings.notifications.promotionalEmails;
    document.getElementById('twoFactorAuth').checked = settings.security.twoFactorAuth;
    document.getElementById('language').value = settings.language;
    document.getElementById('region').value = settings.region;

    // Form submissions
    const notificationSettings = document.getElementById('notificationSettings');
    if (notificationSettings) {
        notificationSettings.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings();
        });
    }

    const securitySettings = document.getElementById('securitySettings');
    if (securitySettings) {
        securitySettings.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings();
        });
    }

    const languageSettings = document.getElementById('languageSettings');
    if (languageSettings) {
        languageSettings.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings();
        });
    }

    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            // In a real app, this would open a password change modal
            alert('Password change functionality would appear here');
        });
    }

    const deactivateAccount = document.getElementById('deactivateAccount');
    if (deactivateAccount) {
        deactivateAccount.addEventListener('click', function() {
            if (confirm('Are you sure you want to deactivate your account?')) {
                alert('Account deactivation would be processed here');
            }
        });
    }

    const deleteAccount = document.getElementById('deleteAccount');
    if (deleteAccount) {
        deleteAccount.addEventListener('click', function() {
            if (confirm('Permanently deleting your account cannot be undone. Are you sure?')) {
                alert('Account deletion would be processed here');
            }
        });
    }
}

function saveSettings() {
    const settings = {
        notifications: {
            appointmentReminders: document.getElementById('appointmentReminders').checked,
            vaccinationAlerts: document.getElementById('vaccinationAlerts').checked,
            promotionalEmails: document.getElementById('promotionalEmails').checked
        },
        security: {
            twoFactorAuth: document.getElementById('twoFactorAuth').checked
        },
        language: document.getElementById('language').value,
        region: document.getElementById('region').value
    };

    localStorage.setItem('userSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    initSidebar();
    
    // Initialize specific page functionality
    initPetsPage();
    initAppointmentsPage();
    initSavedPage();
    initSettingsPage();

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('petcareAuthToken');
            window.location.href = '../../index.html';
        });
    }
});

// Add to profile.html or create a separate profile.js
document.addEventListener('DOMContentLoaded', async function() {
    const authToken = localStorage.getItem('petcareAuthToken');
    if (!authToken) {
        window.location.href = '../login.html';
        return;
    }
    
    try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Split name if stored as full name
        const nameParts = (userData.name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Populate form fields
        if (document.getElementById('profileFirstName')) {
            document.getElementById('profileFirstName').value = firstName;
        }
        if (document.getElementById('profileLastName')) {
            document.getElementById('profileLastName').value = lastName;
        }
        if (document.getElementById('profileEmail')) {
            document.getElementById('profileEmail').value = userData.email || '';
        }
        if (document.getElementById('profilePhone')) {
            document.getElementById('profilePhone').value = userData.phone || '';
        }
        if (document.getElementById('profileAddress')) {
            document.getElementById('profileAddress').value = userData.address || '';
        }
        
        // Update sidebar
        if (document.getElementById('profileName')) {
            document.getElementById('profileName').textContent = userData.name || 'User';
        }
        if (document.getElementById('joinDate')) {
            document.getElementById('joinDate').textContent = userData.joinDate || 'Recently';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
    
    // Handle profile update
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                firstName: document.getElementById('profileFirstName').value,
                lastName: document.getElementById('profileLastName').value,
                email: document.getElementById('profileEmail').value,
                phone: document.getElementById('profilePhone').value,
                address: document.getElementById('profileAddress').value
            };
            
            try {
                const response = await fetch('http://localhost:3000/api/users/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('Profile updated successfully!');
                } else {
                    alert('Failed to update profile');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Network error. Please try again.');
            }
        });
    }
});