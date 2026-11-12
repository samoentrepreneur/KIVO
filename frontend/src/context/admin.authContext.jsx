import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";

const AuthContext = createContext();
let refreshTimer = null;

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMe = useCallback(async () => {
        try {
            const res = await api.get("/admin/me")
            if (res.data.success && res.data.admin) {
                const authenticatedAdmin = {
                    ...res.data.admin,
                    expiresAt: res.data.expiresAt
                };
                setAdmin(authenticatedAdmin);
                return authenticatedAdmin;
            }

            setAdmin(null);
            return null;
        } catch(err) {
            setAdmin(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshAccessToken = useCallback(async () => {
        try {
            await api.get("/admin/refresh-token");
            await fetchMe();
        } catch {
            logout();
        }
    }, [fetchMe]);

    const scheduleRefresh = useCallback((expiresAt) => {
        if (refreshTimer) clearTimeout(refreshTimer);

        if (!expiresAt) return;

        const now = Date.now();
        const refreshIn = Math.max(expiresAt - now - 60000, 5000);

        refreshTimer = setTimeout(() => {
            refreshAccessToken();
        }, refreshIn);
    }, [refreshAccessToken]);

    const login = useCallback(async (email, password) => {
        await api.post("/admin/login", { email, password });
        await fetchMe();
    }, [fetchMe]);

    const logout = useCallback(async () => {
        try {
            await api.post("/admin/logout");
        } catch { }
        if (refreshTimer) clearTimeout(refreshTimer);
        setAdmin(null);
        window.location.href = "/admin/login";
    }, []);

    useEffect(() => {
        fetchMe();
    }, [fetchMe]);


    useEffect(() => {
        if (admin?.expiresAt) {
            scheduleRefresh(admin.expiresAt);
        }
        return () => clearTimeout(refreshTimer);
    }, [admin?.expiresAt, scheduleRefresh]);

    return (
        <AuthContext.Provider value={{ admin, loading, login, logout,fetchMe }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
