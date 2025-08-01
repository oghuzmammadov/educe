/**
 * Pathify API Service
 * Replaces localStorage with REST API calls to backend server
 */

class PathifyAPI {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('pathify_token');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('pathify_token', token);
        } else {
            localStorage.removeItem('pathify_token');
        }
    }

    // Get authentication headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Generic API call method
    async apiCall(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const config = {
                method: 'GET',
                headers: this.getHeaders(),
                ...options
            };

            if (config.body && typeof config.body === 'object') {
                config.body = JSON.stringify(config.body);
            }

            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // ===== AUTHENTICATION =====

    async register(userData) {
        const response = await this.apiCall('/auth/register', {
            method: 'POST',
            body: userData
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    async login(email, password) {
        const response = await this.apiCall('/auth/login', {
            method: 'POST',
            body: { email, password }
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    logout() {
        this.setToken(null);
        localStorage.removeItem('pathify_user');
        localStorage.removeItem('pathify_customer');
    }

    // ===== USER MANAGEMENT =====

    async getCurrentUser() {
        return await this.apiCall('/users/profile');
    }

    async updateProfile(userData) {
        return await this.apiCall('/users/profile', {
            method: 'PUT',
            body: userData
        });
    }

    // ===== PSYCHOLOGISTS =====

    async getPsychologists() {
        return await this.apiCall('/psychologists');
    }

    async getPsychologist(id) {
        return await this.apiCall(`/psychologists/${id}`);
    }

    async getMyPsychologistProfile() {
        return await this.apiCall('/psychologists/my-profile');
    }

    async updatePsychologistProfile(profileData) {
        return await this.apiCall('/psychologists/profile', {
            method: 'PUT',
            body: profileData
        });
    }

    // ===== ADMIN FUNCTIONS =====

    async getAdminStats() {
        return await this.apiCall('/admin/stats');
    }

    async approvePsychologist(psychologistId, approved, reason = '') {
        return await this.apiCall(`/admin/psychologists/${psychologistId}/approval`, {
            method: 'PUT',
            body: { approved, reason }
        });
    }

    // ===== CHILDREN MANAGEMENT =====

    async getChildren() {
        return await this.apiCall('/children');
    }

    async addChild(childData) {
        return await this.apiCall('/children', {
            method: 'POST',
            body: childData
        });
    }

    async updateChild(childId, childData) {
        return await this.apiCall(`/children/${childId}`, {
            method: 'PUT',
            body: childData
        });
    }

    async deleteChild(childId) {
        return await this.apiCall(`/children/${childId}`, {
            method: 'DELETE'
        });
    }

    // ===== ASSESSMENT REQUESTS =====

    async createAssessmentRequest(requestData) {
        return await this.apiCall('/assessment-requests', {
            method: 'POST',
            body: requestData
        });
    }

    async getAssessmentRequests() {
        return await this.apiCall('/assessment-requests');
    }

    async updateAssessmentRequest(requestId, updateData) {
        return await this.apiCall(`/assessment-requests/${requestId}`, {
            method: 'PUT',
            body: updateData
        });
    }

    // ===== GAME RESULTS =====

    async saveGameResults(resultsData) {
        return await this.apiCall('/game-results', {
            method: 'POST',
            body: resultsData
        });
    }

    async getGameResults() {
        return await this.apiCall('/game-results');
    }

    // ===== AI ANALYSIS =====

    async saveAIAnalysis(analysisData) {
        return await this.apiCall('/ai-analysis', {
            method: 'POST',
            body: analysisData
        });
    }

    async getAIAnalysis(childId) {
        return await this.apiCall(`/ai-analysis/${childId}`);
    }

    // ===== UTILITY METHODS =====

    async healthCheck() {
        return await this.apiCall('/health');
    }

    // Check if API is available
    async isAPIAvailable() {
        try {
            await this.healthCheck();
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Create global API instance
const pathifyAPI = new PathifyAPI();

// Migration helper functions to gradually move from localStorage to API

/**
 * Migrates localStorage data to API backend
 */
async function migrateLocalStorageToAPI() {
    if (!await pathifyAPI.isAPIAvailable()) {
        console.warn('🔄 API not available, using localStorage fallback');
        return false;
    }

    console.log('🔄 Starting localStorage to API migration...');

    try {
        // Check if user is logged in
        const currentUser = JSON.parse(localStorage.getItem('pathify_user') || '{}');
        if (!currentUser.email) {
            console.log('👤 No user logged in, skipping migration');
            return true;
        }

        // Migrate user data if needed
        await migrateUserData(currentUser);

        // Migrate psychologist data if user is psychologist
        if (currentUser.role === 'psychologist') {
            await migratePsychologistData();
        }

        // Migrate children data if user is customer
        if (currentUser.role === 'customer') {
            await migrateChildrenData();
        }

        console.log('✅ Migration completed successfully');
        return true;

    } catch (error) {
        console.error('❌ Migration failed:', error);
        return false;
    }
}

async function migrateUserData(currentUser) {
    try {
        // Try to get user from API to check if already exists
        const apiUser = await pathifyAPI.getCurrentUser();
        console.log('👤 User already exists in API');
        return apiUser;
    } catch (error) {
        // User doesn't exist in API, create account
        console.log('👤 Creating user account in API...');
        return await pathifyAPI.register({
            email: currentUser.email,
            password: 'migrated123', // Default password for migrated accounts
            name: currentUser.name || currentUser.email,
            role: currentUser.role || 'customer'
        });
    }
}

async function migratePsychologistData() {
    const psychologists = JSON.parse(localStorage.getItem('pathify_psychologists') || '[]');
    if (psychologists.length > 0) {
        console.log('👨‍⚕️ Migrating psychologist data...');
        // This would be handled during registration/profile setup
        // For now, we'll update profile after login
    }
}

async function migrateChildrenData() {
    const children = JSON.parse(localStorage.getItem('pathify_children') || '[]');
    if (children.length > 0) {
        console.log('👶 Migrating children data...');
        for (const child of children) {
            try {
                await pathifyAPI.addChild({
                    name: child.name,
                    age: child.age,
                    gender: child.gender,
                    interests: child.interests || [],
                    notes: child.notes || '',
                    status: child.status || 'available'
                });
            } catch (error) {
                console.warn('⚠️ Failed to migrate child:', child.name, error.message);
            }
        }
    }
}

/**
 * Fallback functions for when API is not available
 */
class LocalStorageFallback {
    // Fallback methods that use localStorage
    static getPsychologists() {
        const psychologists = JSON.parse(localStorage.getItem('pathify_psychologists') || '[]');
        return psychologists.filter(p => p.approved === true);
    }

    static getAllPsychologists() {
        return JSON.parse(localStorage.getItem('pathify_psychologists') || '[]');
    }

    static getChildren() {
        const customer = JSON.parse(localStorage.getItem('pathify_customer') || '{}');
        return customer.children || [];
    }

    static saveChildren(children) {
        const customer = JSON.parse(localStorage.getItem('pathify_customer') || '{}');
        customer.children = children;
        localStorage.setItem('pathify_customer', JSON.stringify(customer));
    }

    static getAssessmentRequests() {
        return JSON.parse(localStorage.getItem('pathify_requests') || '[]');
    }

    static saveAssessmentRequests(requests) {
        localStorage.setItem('pathify_requests', JSON.stringify(requests));
    }

    static getGameResults() {
        return JSON.parse(localStorage.getItem('pathify_game_results') || '[]');
    }

    static saveGameResults(results) {
        localStorage.setItem('pathify_game_results', JSON.stringify(results));
    }
}

// Adaptive data service that tries API first, then falls back to localStorage
class AdaptiveDataService {
    static async getPsychologists() {
        try {
            if (await pathifyAPI.isAPIAvailable()) {
                return await pathifyAPI.getPsychologists();
            }
        } catch (error) {
            console.warn('API call failed, using localStorage fallback');
        }
        return LocalStorageFallback.getPsychologists();
    }

    static async getAllPsychologists() {
        try {
            if (await pathifyAPI.isAPIAvailable()) {
                return await pathifyAPI.getPsychologists();
            }
        } catch (error) {
            console.warn('API call failed, using localStorage fallback');
        }
        return LocalStorageFallback.getAllPsychologists();
    }

    static async getChildren() {
        try {
            if (await pathifyAPI.isAPIAvailable()) {
                return await pathifyAPI.getChildren();
            }
        } catch (error) {
            console.warn('API call failed, using localStorage fallback');
        }
        return LocalStorageFallback.getChildren();
    }

    static async addChild(childData) {
        try {
            if (await pathifyAPI.isAPIAvailable()) {
                return await pathifyAPI.addChild(childData);
            }
        } catch (error) {
            console.warn('API call failed, using localStorage fallback');
        }
        
        // Fallback to localStorage
        const children = LocalStorageFallback.getChildren();
        const newChild = {
            id: Date.now(),
            ...childData,
            status: 'available'
        };
        children.push(newChild);
        LocalStorageFallback.saveChildren(children);
        return newChild;
    }

    static async updateChild(childId, childData) {
        try {
            if (await pathifyAPI.isAPIAvailable()) {
                return await pathifyAPI.updateChild(childId, childData);
            }
        } catch (error) {
            console.warn('API call failed, using localStorage fallback');
        }
        
        // Fallback to localStorage
        const children = LocalStorageFallback.getChildren();
        const index = children.findIndex(c => c.id == childId);
        if (index !== -1) {
            children[index] = { ...children[index], ...childData };
            LocalStorageFallback.saveChildren(children);
            return children[index];
        }
        return null;
    }
}

// Initialize migration on page load
document.addEventListener('DOMContentLoaded', function() {
    // Start migration process in background
    setTimeout(() => {
        migrateLocalStorageToAPI().catch(console.error);
    }, 1000);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { pathifyAPI, AdaptiveDataService, LocalStorageFallback };
} 