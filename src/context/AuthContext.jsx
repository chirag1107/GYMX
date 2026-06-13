import { createContext, useContext, useState, useEffect } from 'react';

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
        // Check for saved user in localStorage on initial load
        const storedUser = localStorage.getItem('gymx_user');
        if (storedUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(JSON.parse(storedUser));
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsAuthenticated(true);
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Mock authentication - in a real app, this would be an API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // For demonstration, we'll accept any non-empty credentials
                if (email && password) {
                    const mockUser = { id: '1', email, name: email.split('@')[0] };
                    setUser(mockUser);
                    setIsAuthenticated(true);
                    localStorage.setItem('gymx_user', JSON.stringify(mockUser));
                    resolve(mockUser);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 800); // Simulate network latency
        });
    };

    const signup = (name, email, password) => {
        // Mock signup
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (name && email && password) {
                    const mockUser = { id: Date.now().toString(), email, name };
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
