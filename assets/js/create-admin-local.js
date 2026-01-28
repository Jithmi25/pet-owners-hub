// Local Admin Creation Script (for development without backend)
// This creates an admin account in localStorage for testing purposes

class LocalAdminManager {
    constructor() {
        this.storageKey = 'poh_users';
        this.currentUserKey = 'poh_current_user';
        this.tokenKey = 'authToken';
    }

    /**
     * Initialize users storage if it doesn't exist
     */
    initStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            // Create default admin and user on first init
            const defaultUsers = [
                {
                    id: 'admin_default_001',
                    firstName: 'Admin',
                    lastName: 'User',
                    email: 'admin@petownershub.com',
                    username: 'admin',
                    password: btoa('admin123'), // Simple hash for demo
                    role: 'admin',
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    permissions: [
                        'manage_users',
                        'manage_clinics',
                        'manage_shops',
                        'manage_pets',
                        'manage_listings',
                        'view_reports',
                        'manage_settings'
                    ]
                },
                {
                    id: 'user_default_001',
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'user@petownershub.com',
                    username: 'user',
                    password: btoa('user123'), // Simple hash for demo
                    role: 'user',
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(defaultUsers));
        }
    }

    /**
     * Get all users
     */
    getAllUsers() {
        this.initStorage();
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    /**
     * Save users
     */
    saveUsers(users) {
        localStorage.setItem(this.storageKey, JSON.stringify(users));
    }

    /**
     * Check if user exists
     */
    userExists(email, username) {
        const users = this.getAllUsers();
        return users.some(user => 
            user.email.toLowerCase() === email.toLowerCase() || 
            user.username.toLowerCase() === username.toLowerCase()
        );
    }

    /**
     * Create admin user
     */
    createAdmin(adminData) {
        this.initStorage();

        // Validate required fields
        const required = ['firstName', 'lastName', 'email', 'username', 'password'];
        for (const field of required) {
            if (!adminData[field]) {
                throw new Error(`${field} is required`);
            }
        }

        // Check if user already exists
        if (this.userExists(adminData.email, adminData.username)) {
            throw new Error('An account with this email or username already exists');
        }

        // Create admin object
        const admin = {
            id: this.generateId(),
            firstName: adminData.firstName,
            lastName: adminData.lastName,
            email: adminData.email.toLowerCase(),
            username: adminData.username.toLowerCase(),
            password: this.hashPassword(adminData.password), // In production, use proper hashing
            role: 'admin',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            permissions: [
                'manage_users',
                'manage_clinics',
                'manage_shops',
                'manage_pets',
                'manage_listings',
                'view_reports',
                'manage_settings'
            ]
        };

        // Get existing users and add new admin
        const users = this.getAllUsers();
        users.push(admin);
        this.saveUsers(users);

        return {
            success: true,
            message: 'Admin account created successfully',
            admin: {
                id: admin.id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                username: admin.username,
                role: admin.role
            }
        };
    }

    /**
     * Simple hash function (for demo purposes - use bcrypt in production!)
     */
    hashPassword(password) {
        // This is a simple hash for demo purposes
        // In production, use proper password hashing like bcrypt
        return btoa(password); // Base64 encoding (NOT SECURE - for demo only)
    }

    /**
     * Verify password
     */
    verifyPassword(inputPassword, hashedPassword) {
        return this.hashPassword(inputPassword) === hashedPassword;
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Login user
     */
    login(identifier, password) {
        const users = this.getAllUsers();
        
        // Find user by email or username
        const user = users.find(u => 
            (u.email.toLowerCase() === identifier.toLowerCase() || 
             u.username.toLowerCase() === identifier.toLowerCase()) &&
            u.status === 'active'
        );

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        if (!this.verifyPassword(password, user.password)) {
            throw new Error('Invalid credentials');
        }

        // Generate token
        const token = this.generateToken(user);

        // Store token and user info
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.currentUserKey, JSON.stringify({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            role: user.role,
            permissions: user.permissions
        }));

        return {
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                role: user.role
            }
        };
    }

    /**
     * Generate auth token
     */
    generateToken(user) {
        const tokenData = {
            userId: user.id,
            role: user.role,
            timestamp: Date.now()
        };
        return btoa(JSON.stringify(tokenData));
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        const userStr = localStorage.getItem(this.currentUserKey);
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * Check if user is admin
     */
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.currentUserKey);
    }

    /**
     * Create default admin (for quick setup)
     */
    createDefaultAdmin() {
        try {
            return this.createAdmin({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@petownershub.com',
                username: 'admin',
                password: 'Admin@123'
            });
        } catch (error) {
            console.error('Error creating default admin:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Get all admin users
     */
    getAdmins() {
        const users = this.getAllUsers();
        return users.filter(user => user.role === 'admin');
    }

    /**
     * Delete user (admin only)
     */
    deleteUser(userId) {
        if (!this.isAdmin()) {
            throw new Error('Unauthorized: Admin access required');
        }

        const users = this.getAllUsers();
        const filteredUsers = users.filter(user => user.id !== userId);
        
        if (users.length === filteredUsers.length) {
            throw new Error('User not found');
        }

        this.saveUsers(filteredUsers);
        return { success: true, message: 'User deleted successfully' };
    }
}

// Create global instance
const localAdminManager = new LocalAdminManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalAdminManager;
}

// Console helper functions for quick admin creation
window.createQuickAdmin = function() {
    const result = localAdminManager.createDefaultAdmin();
    console.log('Default Admin Created:');
    console.log('Email: admin@petownershub.com');
    console.log('Username: admin');
    console.log('Password: Admin@123');
    console.log('Result:', result);
    return result;
};

window.listAdmins = function() {
    const admins = localAdminManager.getAdmins();
    console.log('Admin Users:', admins);
    return admins;
};

window.listAllUsers = function() {
    const users = localAdminManager.getAllUsers();
    console.log('All Users:', users);
    return users;
};

console.log('%c🐾 Pet Owners Hub - Admin Manager Loaded', 'color: #6c63ff; font-size: 14px; font-weight: bold;');
console.log('%cQuick Commands:', 'color: #333; font-weight: bold;');
console.log('createQuickAdmin() - Create default admin account');
console.log('listAdmins() - List all admin users');
console.log('listAllUsers() - List all users');
