import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "./admin.authContext";

export const OrderContext = createContext();

const PAGE_LIMIT = 20;

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");
    const [totalOrders, setTotalOrders] = useState(0);
    const API_URL = import.meta.env.VITE_API_URL;
    const { admin } = useAuth();

    /* ================= FETCH ORDERS ================= */
    const fetchOrders = async ({ pageNo = 1, reset = false } = {}) => {
        try {
            reset ? setLoading(true) : setLoadingMore(true);

            const res = await api.get("admin/orders", {
                params: {
                    page: pageNo,
                    limit: PAGE_LIMIT,
                    search,
                },
            });
            //  console.log(res)
            if (res.data.success) {
                const fetched = res.data.orders || [];

                setOrders(prev =>
                    reset ? fetched : [...prev, ...fetched]
                );
                setTotalOrders(res.data.pagination.totalOrders || 0);

                setHasMore(fetched.length === PAGE_LIMIT);
            }
        } catch (err) {
            console.error("Fetch orders failed", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    /* ================= LOAD MORE ================= */
    const loadMoreOrders = () => {
        if (!hasMore || loadingMore) return;
        const next = page + 1;
        setPage(next);
        fetchOrders({ pageNo: next });
    };

    useEffect(() => {
        if (!admin) return;

        setPage(1);
        fetchOrders({ pageNo: 1, reset: true });
    }, [search, admin]);

    const playSound = () => {
        const audio = new Audio("/notify.wav");
        audio.play().catch(() => { });
    };

    useEffect(() => {
        if (!admin) return;

        const eventSource = new EventSource(
            `${API_URL}/admin/orders-stream/stream`,
            { withCredentials: true }
        );

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.operationType === "insert") {
                const newOrder = data.fullDocument;

                setOrders(prev => {
                    const exists = prev.some(o => o._id === newOrder._id);
                    if (exists) return prev;
                    return [newOrder, ...prev];
                });

                toast.success(`New Order: #${newOrder.orderId}`);
                playSound();

                if (Notification.permission === "granted") {
                    const notification = new Notification(
                        `New Order: #${newOrder.orderId}`,
                        {
                            body: `${newOrder.fullName} placed an order`,
                            icon: "/site_logo.png",
                        }
                    );

                    notification.onclick = () => {
                        window.focus();
                        window.location.href = "/admin/dashboard/orders";
                    };
                }
            }
        };

        return () => eventSource.close();
    }, [admin]);

    return (
        <OrderContext.Provider
            value={{
                orders,
                loading,
                loadingMore,
                hasMore,
                search,
                setSearch,
                loadMoreOrders,
                setOrders,
                totalOrders,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};
