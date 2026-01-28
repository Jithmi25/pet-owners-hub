/**
 * EXAMPLE: How to integrate backend API into your pages
 * 
 * This file shows practical examples for common scenarios
 */

// ==========================================
// EXAMPLE 1: Fetch and Display Clinics
// ==========================================

async function loadClinics() {
    const container = document.getElementById('clinics-container');
    container.innerHTML = '<p>Loading clinics...</p>';
    
    try {
        // Fetch from backend
        const clinics = await api.getClinics();
        
        // Clear container
        container.innerHTML = '';
        
        // Display each clinic
        clinics.forEach(clinic => {
            const clinicCard = document.createElement('div');
            clinicCard.className = 'clinic-card';
            clinicCard.innerHTML = `
                <h3>${clinic.name}</h3>
                <p>${clinic.address}</p>
                <p>Phone: ${clinic.phone}</p>
                <button onclick="viewDetails('${clinic._id}')">View Details</button>
            `;
            container.appendChild(clinicCard);
        });
        
    } catch (error) {
        container.innerHTML = `<p class="error">Failed to load clinics: ${error.message}</p>`;
    }
}

// ==========================================
// EXAMPLE 2: Search Functionality
// ==========================================

async function searchClinics() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value;
    
    if (!query.trim()) {
        alert('Please enter a search term');
        return;
    }
    
    try {
        const results = await api.searchClinics(query);
        displaySearchResults(results);
    } catch (error) {
        alert('Search failed: ' + error.message);
    }
}

function displaySearchResults(results) {
    const container = document.getElementById('results-container');
    
    if (results.length === 0) {
        container.innerHTML = '<p>No results found</p>';
        return;
    }
    
    container.innerHTML = results.map(clinic => `
        <div class="result-card">
            <h4>${clinic.name}</h4>
            <p>${clinic.district}</p>
        </div>
    `).join('');
}

// ==========================================
// EXAMPLE 3: User Login
// ==========================================

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        // Call login API
        const response = await api.login({ email, password });
        
        // Save token and user data
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Show success message
        alert('Login successful!');
        
        // Redirect to home/dashboard
        window.location.href = 'home.html';
        
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

// HTML form should have:
// <form onsubmit="handleLogin(event)">
//     <input type="email" id="email" required>
//     <input type="password" id="password" required>
//     <button type="submit">Login</button>
// </form>

// ==========================================
// EXAMPLE 4: User Registration
// ==========================================

async function handleRegister(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value
    };
    
    // Validate password confirmation
    const confirmPassword = document.getElementById('confirm-password').value;
    if (userData.password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    try {
        const response = await api.register(userData);
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
}

// ==========================================
// EXAMPLE 5: Get User Profile (Protected Route)
// ==========================================

async function loadUserProfile() {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const profile = await api.getUserProfile();
        
        // Display profile
        document.getElementById('user-name').textContent = profile.name;
        document.getElementById('user-email').textContent = profile.email;
        document.getElementById('user-phone').textContent = profile.phone || 'Not provided';
        
    } catch (error) {
        // Token might be expired
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
            alert('Session expired. Please login again.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        } else {
            alert('Failed to load profile: ' + error.message);
        }
    }
}

// ==========================================
// EXAMPLE 6: Create New Listing
// ==========================================

async function createNewListing(event) {
    event.preventDefault();
    
    const listingData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        category: document.getElementById('category').value,
        location: document.getElementById('location').value
    };
    
    try {
        const newListing = await api.createListing(listingData);
        alert('Listing created successfully!');
        window.location.href = `listing-details.html?id=${newListing._id}`;
    } catch (error) {
        alert('Failed to create listing: ' + error.message);
    }
}

// ==========================================
// EXAMPLE 7: Upload Image
// ==========================================

async function uploadImage(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        // Show loading indicator
        document.getElementById('upload-status').textContent = 'Uploading...';
        
        const response = await api.uploadFile(API_CONFIG.ENDPOINTS.UPLOAD, formData);
        
        // Display uploaded image
        document.getElementById('preview-img').src = response.url;
        document.getElementById('upload-status').textContent = 'Upload successful!';
        
        // Save URL for later use
        document.getElementById('image-url').value = response.url;
        
    } catch (error) {
        alert('Upload failed: ' + error.message);
        document.getElementById('upload-status').textContent = 'Upload failed';
    }
}

// HTML:
// <input type="file" onchange="uploadImage(event)" accept="image/*">
// <p id="upload-status"></p>
// <img id="preview-img" style="max-width: 200px;">
// <input type="hidden" id="image-url">

// ==========================================
// EXAMPLE 8: Filter and Sort
// ==========================================

async function filterShops() {
    const district = document.getElementById('district-filter').value;
    const sortBy = document.getElementById('sort-by').value;
    
    try {
        let shops = await api.getShops();
        
        // Filter by district
        if (district && district !== 'all') {
            shops = shops.filter(shop => 
                shop.district?.toLowerCase() === district.toLowerCase()
            );
        }
        
        // Sort
        if (sortBy === 'name') {
            shops.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'rating') {
            shops.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        
        displayShops(shops);
        
    } catch (error) {
        console.error('Filter failed:', error);
    }
}

// ==========================================
// EXAMPLE 9: Logout Functionality
// ==========================================

async function logout() {
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }
    
    try {
        // Call logout API (optional - if backend tracks sessions)
        await api.logout();
    } catch (error) {
        console.error('Logout API call failed:', error);
    } finally {
        // Clear local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Redirect to homepage
        window.location.href = '../index.html';
    }
}

// ==========================================
// EXAMPLE 10: Check Authentication
// ==========================================

function requireAuth() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        // User not logged in - redirect to login
        alert('Please login to access this page');
        window.location.href = '../user-authentication/login.html';
        return false;
    }
    
    return true;
}

// Use at the start of protected pages:
// document.addEventListener('DOMContentLoaded', () => {
//     if (requireAuth()) {
//         loadPageContent();
//     }
// });

// ==========================================
// EXAMPLE 11: Real-time Search (Debounced)
// ==========================================

let searchTimeout;

function handleSearchInput(event) {
    const query = event.target.value;
    
    // Clear previous timeout
    clearTimeout(searchTimeout);
    
    // Set new timeout (wait 500ms after user stops typing)
    searchTimeout = setTimeout(async () => {
        if (query.trim().length >= 2) {
            try {
                const results = await api.searchClinics(query);
                displaySearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
            }
        }
    }, 500);
}

// HTML:
// <input type="text" id="search" oninput="handleSearchInput(event)" 
//        placeholder="Search clinics...">

// ==========================================
// EXAMPLE 12: Error Handling with User Feedback
// ==========================================

async function safeApiCall(apiFunction, errorMessage = 'Operation failed') {
    try {
        showLoading(true);
        const result = await apiFunction();
        showLoading(false);
        return result;
    } catch (error) {
        showLoading(false);
        
        // Specific error handling
        if (error.message.includes('401')) {
            alert('Session expired. Please login again.');
            window.location.href = 'login.html';
        } else if (error.message.includes('404')) {
            alert('Resource not found');
        } else if (error.message.includes('500')) {
            alert('Server error. Please try again later.');
        } else {
            alert(`${errorMessage}: ${error.message}`);
        }
        
        return null;
    }
}

function showLoading(show) {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        loader.style.display = show ? 'block' : 'none';
    }
}

// Usage:
// const clinics = await safeApiCall(
//     () => api.getClinics(), 
//     'Failed to load clinics'
// );

// ==========================================
// How to use these examples:
// ==========================================
// 1. Copy the relevant function to your JavaScript file
// 2. Make sure config.js and api.js are included in your HTML
// 3. Call the function from your HTML or on page load
// 4. Customize as needed for your specific page
