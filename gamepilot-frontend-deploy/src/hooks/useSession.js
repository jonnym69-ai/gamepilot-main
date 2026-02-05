"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSession = useSession;
const react_1 = require("react");
const authStore_1 = require("../store/authStore");
function useSession() {
    const { user, isAuthenticated, setUser, setAuthenticated, fetchCurrentUser } = (0, authStore_1.useAuth)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const checkSession = async () => {
            // Check localStorage backup for authentication state
            const storedAuth = localStorage.getItem('isAuthenticated');
            const token = localStorage.getItem('sessionToken');
            console.log('🔍 Session check:', { isAuthenticated, storedAuth, hasToken: !!token });
            // If we have a token and stored auth state, ensure we're authenticated
            if (token && storedAuth === 'true' && !isAuthenticated) {
                console.log('🔄 Restoring authentication from localStorage');
                setAuthenticated(true);
                return;
            }
            // Skip validation if user is already authenticated (set by SteamCallback)
            if (isAuthenticated) {
                console.log('✅ Already authenticated, skipping validation');
                return;
            }
            if (token && !user) {
                // We have a token but no user in memory, fetch user
                setIsLoading(true);
                try {
                    await fetchCurrentUser();
                }
                catch (error) {
                    console.error('❌ Failed to fetch user with session token:', error);
                    // Clear invalid token
                    localStorage.removeItem('sessionToken');
                    localStorage.removeItem('isAuthenticated');
                    setUser(null);
                    setAuthenticated(false);
                }
                setIsLoading(false);
            }
        };
        checkSession();
    }, [user, isAuthenticated, setUser, setAuthenticated, fetchCurrentUser]);
    const logout = () => {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('isAuthenticated');
        setUser(null);
        setAuthenticated(false);
    };
    return {
        user,
        isAuthenticated,
        isLoading,
        logout
    };
}
