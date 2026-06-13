import { createContext, useContext, useState } from 'react';

const MembershipContext = createContext();

export const MembershipProvider = ({ children }) => {
    // Default to Tier 0 (Free)
    const [currentTier, setCurrentTier] = useState(0);

    const upgradeTier = (tierId) => {
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
