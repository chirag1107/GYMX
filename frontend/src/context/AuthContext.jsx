import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL, apiFetch } from '../utils/api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('gymx_token');
            const storedUser = localStorage.getItem('gymx_user');
            
            if (API_URL && token) {
                try {
                    const res = await apiFetch('/api/auth/me');
                    if (res.success && res.user) {
                        setUser(res.user);
                        setIsAuthenticated(true);
                        localStorage.setItem('gymx_user', JSON.stringify(res.user));
                    } else {
                        logout();
                    }
                } catch (err) {
                    console.error('Failed to verify token on backend, using local cache:', err);
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                        setIsAuthenticated(true);
                    } else {
                        logout();
                    }
                }
            } else if (storedUser) {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            }
            setLoading(false);
        };

        verifyUser();
    }, []);

    const login = async (email, password) => {
        if (API_URL) {
            try {
                const data = await apiFetch('/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });
                if (data.success) {
                    localStorage.setItem('gymx_token', data.token);
                    localStorage.setItem('gymx_user', JSON.stringify(data.user));
                    setUser(data.user);
                    setIsAuthenticated(true);
                    return data.user;
                }
            } catch (err) {
                throw new Error(err.message || 'Login failed');
            }
        }

        // Mock authentication fallback
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const mockUser = { id: '1', email, name: email.split('@')[0], membershipTier: 0 };
                    setUser(mockUser);
                    setIsAuthenticated(true);
                    localStorage.setItem('gymx_user', JSON.stringify(mockUser));
                    resolve(mockUser);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 800);
        });
    };

    const signup = async (name, email, password) => {
        if (API_URL) {
            try {
                const data = await apiFetch('/api/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ name, email, password })
                });
                if (data.success) {
                    localStorage.setItem('gymx_token', data.token);
                    localStorage.setItem('gymx_user', JSON.stringify(data.user));
                    setUser(data.user);
                    setIsAuthenticated(true);
                    return data.user;
                }
            } catch (err) {
                throw new Error(err.message || 'Registration failed');
            }
        }

        // Mock signup fallback
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (name && email && password) {
                    const mockUser = { id: Date.now().toString(), email, name, membershipTier: 0 };
                    setUser(mockUser);
                    setIsAuthenticated(true);
                    localStorage.setItem('gymx_user', JSON.stringify(mockUser));
                    resolve(mockUser);
                } else {
                    reject(new Error('Please fill in all fields'));
                }
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('gymx_user');
        localStorage.removeItem('gymx_token');
    };

    const value = {
        isAuthenticated,
        user,
        loading,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
