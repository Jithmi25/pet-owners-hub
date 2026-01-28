// API Configuration
const API_CONFIG = {
    // Base URL for your backend API
    BASE_URL: 'http://localhost:5000/api',
    
    // Endpoints
    ENDPOINTS: {
        // Auth
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        
        // Users
        USERS: '/users',
        USER_PROFILE: '/users/profile',
        
        // Clinics
        CLINICS: '/clinics',
        CLINIC_BY_ID: (id) => `/clinics/${id}`,
        
        // Shops
        SHOPS: '/shops',
        SHOP_BY_ID: (id) => `/shops/${id}`,
        
        // Listings
        LISTINGS: '/listings',
        LISTING_BY_ID: (id) => `/listings/${id}`,
        
        // Pets
        PETS: '/admin/pets',
        PET_BY_ID: (id) => `/admin/pets/${id}`,
        
        // Admin
        ADMIN: '/admin',
        REPORTS: '/admin/reports',
        SETTINGS: '/admin/settings',
        
        // Upload
        UPLOAD: '/upload'
    },
    
    // Default headers
    getHeaders: () => {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Add auth token if exists
        const token = localStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
