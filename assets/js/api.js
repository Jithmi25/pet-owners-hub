// API Service - Handles all API calls to the backend

class ApiService {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    /**
     * Generic API call method
     * @param {string} endpoint - API endpoint
     * @param {object} options - Fetch options
     * @returns {Promise} - Response data
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const config = {
            ...options,
            headers: {
                ...API_CONFIG.getHeaders(),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            
            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                throw new Error(data.message || data || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint) {
        return this.request(endpoint, {
            method: 'GET'
        });
    }

    /**
     * POST request
     */
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    /**
     * Upload file
     */
    async uploadFile(endpoint, formData) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = localStorage.getItem('authToken');
        
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData // Don't set Content-Type for FormData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Upload failed! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    }

    // ========== Auth Endpoints ==========
    
    async login(credentials) {
        return this.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
    }

    async register(userData) {
        return this.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
    }

    async logout() {
        return this.post(API_CONFIG.ENDPOINTS.LOGOUT);
    }

    // ========== User Endpoints ==========
    
    async getUserProfile() {
        return this.get(API_CONFIG.ENDPOINTS.USER_PROFILE);
    }

    async updateUserProfile(data) {
        return this.put(API_CONFIG.ENDPOINTS.USER_PROFILE, data);
    }

    // ========== Clinic Endpoints ==========
    
    async getClinics() {
        return this.get(API_CONFIG.ENDPOINTS.CLINICS);
    }

    async getClinicById(id) {
        return this.get(API_CONFIG.ENDPOINTS.CLINIC_BY_ID(id));
    }

    async searchClinics(query) {
        return this.get(`${API_CONFIG.ENDPOINTS.CLINICS}?search=${encodeURIComponent(query)}`);
    }

    // ========== Shop Endpoints ==========
    
    async getShops() {
        return this.get(API_CONFIG.ENDPOINTS.SHOPS);
    }

    async getShopById(id) {
        return this.get(API_CONFIG.ENDPOINTS.SHOP_BY_ID(id));
    }

    async searchShops(query) {
        return this.get(`${API_CONFIG.ENDPOINTS.SHOPS}?search=${encodeURIComponent(query)}`);
    }

    // ========== Listing Endpoints ==========
    
    async getListings() {
        return this.get(API_CONFIG.ENDPOINTS.LISTINGS);
    }

    async getListingById(id) {
        return this.get(API_CONFIG.ENDPOINTS.LISTING_BY_ID(id));
    }

    async createListing(listingData) {
        return this.post(API_CONFIG.ENDPOINTS.LISTINGS, listingData);
    }

    async updateListing(id, listingData) {
        return this.put(API_CONFIG.ENDPOINTS.LISTING_BY_ID(id), listingData);
    }

    async deleteListing(id) {
        return this.delete(API_CONFIG.ENDPOINTS.LISTING_BY_ID(id));
    }

    // ========== Pet Endpoints ==========
    
    async getPets() {
        return this.get(API_CONFIG.ENDPOINTS.PETS);
    }

    async getPetById(id) {
        return this.get(API_CONFIG.ENDPOINTS.PET_BY_ID(id));
    }
}

// Create a single instance to be used across the app
const api = new ApiService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { api, ApiService };
}
