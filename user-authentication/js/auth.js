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

