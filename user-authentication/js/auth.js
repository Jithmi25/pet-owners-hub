// Auth Functions

// Check authentication state
function checkAuth() {
    const isLoggedIn = localStorage.getItem('petcareAuthToken');
    const currentPage = window.location.pathname.split('/').pop();

    if (!isLoggedIn && currentPage !== 'login.html' && currentPage !== 'register.html') {
        window.location.href = 'login.html';
    }
    if (isLoggedIn && (currentPage === 'login.html' || currentPage === 'register.html')) {
        window.location.href = 'profile/profile.html';
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

    addPetBtn?.addEventListener('click', openModal);
    addFirstPetBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Form submission
    document.getElementById('petForm')?.addEventListener('submit', function(e) {
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

    document.getElementById('statusFilter')?.addEventListener('change', function() {
        loadAppointments(this.value);
    });

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
    document.getElementById('notificationSettings')?.addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });

    document.getElementById('securitySettings')?.addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });

    document.getElementById('languageSettings')?.addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });

    document.getElementById('changePasswordBtn')?.addEventListener('click', function() {
        // In a real app, this would open a password change modal
        alert('Password change functionality would appear here');
    });

    document.getElementById('deactivateAccount')?.addEventListener('click', function() {
        if (confirm('Are you sure you want to deactivate your account?')) {
            alert('Account deactivation would be processed here');
        }
    });

    document.getElementById('deleteAccount')?.addEventListener('click', function() {
        if (confirm('Permanently deleting your account cannot be undone. Are you sure?')) {
            alert('Account deletion would be processed here');
        }
    });
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
    document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('petcareAuthToken');
        window.location.href = '../login.html';
    });
});
