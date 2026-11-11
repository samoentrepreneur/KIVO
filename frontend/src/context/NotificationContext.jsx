import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "./admin.authContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { admin } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/notifications");

            if (res.data.success) {
                setNotifications(res.data.notifications);
                setUnreadCount(res.data.unreadCount);
            }
        } catch (err) {
            console.error("Notification fetch failed");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        await api.patch(`/admin/notifications/${id}/read`);
        setNotifications(prev =>
            prev.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            )
        );
        setUnreadCount(c => Math.max(c - 1, 0));
    };

    const markAllAsRead = async () => {
        await api.patch("/admin/notifications/read-all");
        setNotifications(prev =>
            prev.map(n => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
    };

    useEffect(() => {
        if (admin) fetchNotifications();
    }, [admin]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                fetchNotifications,
                markAsRead,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () =>
    useContext(NotificationContext);
