// API Configuration
const API_CONFIG = {
    baseURL: 'http://localhost:5000/api',
    endpoints: {
        // Auth endpoints
        login: '/auth/login',
        register: '/auth/register',
        forgotPassword: '/auth/forgot-password',
        resetPassword: '/auth/reset-password',
        
        // User endpoints
        users: '/users',
        userProfile: '/users/profile',
        updateProfile: '/users/profile',
        
        // Listing endpoints
        listings: '/listings',
        listingById: (id) => `/listings/${id}`,
        createListing: '/listings',
        approveListing: (id) => `/listings/${id}/approve`,
        rejectListing: (id) => `/listings/${id}/reject`,
        markAsSold: (id) => `/listings/${id}/sold`,
        recordInquiry: (id) => `/listings/${id}/inquiry`,
        
        // Clinic endpoints
        clinics: '/clinics',
        clinicById: (id) => `/clinics/${id}`,
        
        // Shop endpoints
        shops: '/shops',
        shopById: (id) => `/shops/${id}`,
        
        // Admin endpoints
        admin: '/admin',
        adminPets: '/admin/pets',
        adminReports: '/admin/reports',
        adminSettings: '/admin/settings',
        
        // Upload endpoints
        upload: '/upload'
    }
};

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
    const url = API_CONFIG.baseURL + endpoint;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    };
    
    // Get token from localStorage if exists
    const token = localStorage.getItem('authToken');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Merge options
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, finalOptions);
        
        // Handle different response status codes
        if (response.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '../user-authentication/login.html';
            throw new Error('Unauthorized');
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API call failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Helper function for file uploads
async function uploadFile(file, endpoint = API_CONFIG.endpoints.upload) {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('authToken');
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(API_CONFIG.baseURL + endpoint, {
            method: 'POST',
            body: formData,
            headers: headers,
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Upload Error:', error);
        throw error;
    }
}

// Helper function to get full image URL
function getImageURL(imagePath) {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, apiCall, uploadFile, getImageURL };
}
