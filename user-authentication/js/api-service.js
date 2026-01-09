// API Service for making backend calls
const API_BASE_URL = 'http://localhost:3000/api';

const apiService = {
    // Set auth token for requests
    setAuthToken(token) {
        localStorage.setItem('petcareAuthToken', token);
    },
    
    // Get auth token
    getAuthToken() {
        return localStorage.getItem('petcareAuthToken');
    },
    
    // Remove auth token (logout)
    removeAuthToken() {
        localStorage.removeItem('petcareAuthToken');
        localStorage.removeItem('userData');
    },
    
    // Get current user
    getCurrentUser() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },
    
    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getAuthToken();
    },
    
    // Make authenticated requests
    async makeRequest(endpoint, options = {}) {
        const token = this.getAuthToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        if (response.status === 401) {
            // Token expired or invalid
            this.removeAuthToken();
            window.location.href = '/user-authentication/login.html';
            return null;
        }
        
        return response;
    },
    
    // Auth endpoints
    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        return response.json();
    },
    
    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        return response.json();
    },
    
    // User profile endpoints
    async getProfile() {
        const response = await this.makeRequest('/users/profile');
        return response ? response.json() : null;
    },
    
    async updateProfile(profileData) {
        const response = await this.makeRequest('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
        
        return response ? response.json() : null;
    },
    
    async changePassword(currentPassword, newPassword) {
        const response = await this.makeRequest('/users/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        return response ? response.json() : null;
    },
    
    // Pets endpoints
    async getPets() {
        const response = await this.makeRequest('/pets');
        return response ? response.json() : null;
    },
    
    async addPet(petData) {
        const response = await this.makeRequest('/pets', {
            method: 'POST',
            body: JSON.stringify(petData)
        });
        
        return response ? response.json() : null;
    },
    
    async updatePet(petId, petData) {
        const response = await this.makeRequest(`/pets/${petId}`, {
            method: 'PUT',
            body: JSON.stringify(petData)
        });
        
        return response ? response.json() : null;
    },
    
    async deletePet(petId) {
        const response = await this.makeRequest(`/pets/${petId}`, {
            method: 'DELETE'
        });
        
        return response ? response.json() : null;
    },
    
    // Appointments endpoints
    async getAppointments() {
        const response = await this.makeRequest('/appointments');
        return response ? response.json() : null;
    },
    
    async bookAppointment(appointmentData) {
        const response = await this.makeRequest('/appointments', {
            method: 'POST',
            body: JSON.stringify(appointmentData)
        });
        
        return response ? response.json() : null;
    },
    
    async cancelAppointment(appointmentId) {
        const response = await this.makeRequest(`/appointments/${appointmentId}/cancel`, {
            method: 'PUT'
        });
        
        return response ? response.json() : null;
    }
};

export default apiService;