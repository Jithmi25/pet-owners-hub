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

