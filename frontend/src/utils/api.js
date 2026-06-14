// Configuration for the backend API URL
// Can be set via environment variable VITE_API_URL.
// Defaults to the production URL: https://gymx-backend.onrender.com
const rawApiUrl = import.meta.env.VITE_API_URL || '';

// Sanitize potential mangled/duplicate URLs (e.g., from Vercel environment variable copy-paste issues)
function sanitizeApiUrl(url) {
    if (!url) return '';
    
    // Check if the URL is mangled with duplicate gymx-backend.onrender domains
    if (url.includes('gymx-backend.onrender')) {
        return 'https://gymx-backend.onrender.com';
    }
    
    return url;
}

export const API_URL = sanitizeApiUrl(rawApiUrl);

/**
 * Helper to make API requests to the backend.
 * @param {string} endpoint - The API endpoint (e.g. '/api/auth/login')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<any>}
 */
export async function apiFetch(endpoint, options = {}) {
    if (!API_URL) {
        throw new Error('API_URL is not configured. Falling back to local storage.');
    }

    const url = `${API_URL.replace(/\/$/, '')}${endpoint}`;
    
    // Default headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Attach JWT token if user is logged in
    const token = localStorage.getItem('gymx_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong with the request.');
    }

    return data;
}
