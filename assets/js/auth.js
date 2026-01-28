// Authentication Manager for Pet Owners Hub
// Handles both local (localStorage) and backend authentication

class AuthManager {
    constructor() {
        this.tokenKey = 'authToken';
        this.userKey = 'poh_current_user';
        this.useLocalAuth = true; // Set to false when backend is available
    }

    /**
     * Initialize authentication
     */
    init() {
        // Check if backend is available
        this.checkBackendAvailability();
    }

    /**
     * Check if backend is available
     */
    async checkBackendAvailability() {
        try {
            const response = await fetch('http://localhost:5000/api/health', {
                method: 'GET',
                timeout: 2000
            });
            this.useLocalAuth = !response.ok;
        } catch (error) {
            this.useLocalAuth = true;
            console.log('Backend not available, using local authentication');
        }
    }

    /**
     * Login user
     */
    async login(identifier, password) {
        if (this.useLocalAuth) {
            return this.loginLocal(identifier, password);
        } else {
            return this.loginBackend(identifier, password);
        }
    }

    /**
     * Login with local storage
     */
    loginLocal(identifier, password) {
        try {
            const result = localAdminManager.login(identifier, password);
            
            if (result.success) {
                // Store user data
                this.setCurrentUser(result.user);
                this.setToken(result.token);
                
                return {
                    success: true,
                    user: result.user,
                    token: result.token
                };
            } else {
                throw new Error(result.message || 'Login failed');
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Login with backend API
     */
    async loginBackend(identifier, password) {
        try {
            const response = await apiCall(API_CONFIG.endpoints.login, {
                method: 'POST',
                body: JSON.stringify({
                    identifier: identifier,
                    password: password
                })
            });

            if (response.token && response.user) {
                this.setCurrentUser(response.user);
                this.setToken(response.token);
                
                return {
                    success: true,
                    user: response.user,
                    token: response.token
                };
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Register new user
     */
    async register(userData) {
        if (this.useLocalAuth) {
            return this.registerLocal(userData);
        } else {
            return this.registerBackend(userData);
        }
    }

    /**
     * Register with local storage
     */
    registerLocal(userData) {
        try {
            const result = localAdminManager.createAdmin(userData);
            
            if (result.success) {
                return {
                    success: true,
                    message: 'Account created successfully',
                    user: result.admin
                };
            } else {
                throw new Error(result.message || 'Registration failed');
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Register with backend API
     */
    async registerBackend(userData) {
        try {
            const response = await apiCall(API_CONFIG.endpoints.register, {
                method: 'POST',
                body: JSON.stringify(userData)
            });

            return {
                success: true,
                message: 'Account created successfully',
                user: response.user
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        
        if (this.useLocalAuth) {
            localAdminManager.logout();
        }
        
        window.location.href = '../user-authentication/login.html';
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.getToken() && !!this.getCurrentUser();
    }

    /**
     * Check if user is admin
     */
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        const userStr = localStorage.getItem(this.userKey);
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * Set current user
     */
    setCurrentUser(user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    /**
     * Get auth token
     */
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Set auth token
     */
    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    /**
     * Check authentication and redirect if necessary
     */
    requireAuth(redirectUrl = '../user-authentication/login.html') {
        if (!this.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    /**
     * Require admin access
     */
    requireAdmin(redirectUrl = '../user-authentication/login.html') {
        if (!this.isAuthenticated() || !this.isAdmin()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    /**
     * Get user display name
     */
    getUserDisplayName() {
        const user = this.getCurrentUser();
        if (!user) return 'Guest';
        return `${user.firstName} ${user.lastName}`;
    }

    /**
     * Update user profile
     */
    updateProfile(profileData) {
        const user = this.getCurrentUser();
        if (!user) throw new Error('No user logged in');

        const updatedUser = { ...user, ...profileData };
        this.setCurrentUser(updatedUser);

        return {
            success: true,
            user: updatedUser
        };
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => authManager.init());
} else {
    authManager.init();
}

// Utility function to protect pages
function protectPage(requireAdminAccess = false) {
    if (requireAdminAccess) {
        return authManager.requireAdmin();
    } else {
        return authManager.requireAuth();
    }
}

// Utility function to update UI with user info
function updateUserUI() {
    const user = authManager.getCurrentUser();
    if (!user) return;

    // Update user name displays
    const userNameElements = document.querySelectorAll('[data-user-name]');
    userNameElements.forEach(el => {
        el.textContent = authManager.getUserDisplayName();
    });

    // Update user email displays
    const userEmailElements = document.querySelectorAll('[data-user-email]');
    userEmailElements.forEach(el => {
        el.textContent = user.email;
    });

    // Update user role displays
    const userRoleElements = document.querySelectorAll('[data-user-role]');
    userRoleElements.forEach(el => {
        el.textContent = user.role;
    });

    // Show/hide admin-only elements
    if (user.role === 'admin') {
        document.querySelectorAll('[data-admin-only]').forEach(el => {
            el.style.display = '';
        });
    } else {
        document.querySelectorAll('[data-admin-only]').forEach(el => {
            el.style.display = 'none';
        });
    }
}

// Setup logout buttons
function setupLogoutButtons() {
    const logoutButtons = document.querySelectorAll('[data-logout]');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                authManager.logout();
            }
        });
    });
}

// Auto-setup on page load
document.addEventListener('DOMContentLoaded', function() {
    updateUserUI();
    setupLogoutButtons();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthManager, authManager };
}

console.log('%c🔐 Auth Manager Loaded', 'color: #4d44db; font-size: 14px; font-weight: bold;');
