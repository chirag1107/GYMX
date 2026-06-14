import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_URL, apiFetch } from '../utils/api';

const MembershipContext = createContext();

export const MembershipProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [currentTier, setCurrentTier] = useState(0);

    // Sync current tier with user's tier when authenticated
    useEffect(() => {
        if (isAuthenticated && user && user.membershipTier !== undefined) {
            setCurrentTier(user.membershipTier);
        } else if (!isAuthenticated) {
            setCurrentTier(0);
        }
    }, [user, isAuthenticated]);

    const upgradeTier = async (tierId) => {
        if (API_URL && isAuthenticated) {
            try {
                const res = await apiFetch('/api/auth/upgrade', {
                    method: 'PUT',
                    body: JSON.stringify({ tierId })
                });
                if (res.success && res.user) {
                    setCurrentTier(res.user.membershipTier);
                    // update user in localStorage
                    const storedUser = JSON.parse(localStorage.getItem('gymx_user') || '{}');
                    storedUser.membershipTier = res.user.membershipTier;
                    localStorage.setItem('gymx_user', JSON.stringify(storedUser));
                    return;
                }
            } catch (err) {
                console.error('Error upgrading tier in backend:', err);
            }
        }

        // Fallback
        setCurrentTier(tierId);
    };

    const hasAccess = (requiredTier) => {
        return currentTier >= requiredTier;
    };

    return (
        <MembershipContext.Provider value={{ currentTier, upgradeTier, hasAccess }}>
            {children}
        </MembershipContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMembership = () => useContext(MembershipContext);
