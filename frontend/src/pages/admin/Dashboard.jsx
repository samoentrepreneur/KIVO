import React, { useState, useEffect } from 'react';
import { Download, Plus, ShoppingBag, DollarSign, ShoppingCart, TrendingUp, Eye, Users } from 'lucide-react';
import api from '../../api';
import { useContext } from 'react';
import { OrderContext } from '../../context/OrderContext';
import { useNavigate } from 'react-router-dom';


const iconMap = {
    users: Users,
    dollar: DollarSign,
    shopping: ShoppingCart,
    trend: TrendingUp,
};
const Dashboard = () => {

    const [stats, setStats] = useState([]);
    const [isStatsLoading, setIsStatsLoading] = useState(true);
    const { orders,  loading, setOrders } = useContext(OrderContext);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchStats = async () => {
            setIsStatsLoading(true);
            try {
                await api.get("/admin/stats").then(res => {
                    if (res.data.success) setStats(res.data.data);
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
            finally { setIsStatsLoading(false); }
        }
        fetchStats();
    }, []);


 
    const slugify = (text) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const handleViewOrder = (order) => {
        if (!order) return;
        const slug = slugify(order.productSnapshot.service);
        navigate(`/admin/dashboard/complete-order/${slug}-${order._id}`);
    }



    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-cyan-100 text-cyan-700';
            case 'pending': return 'bg-orange-100 text-orange-700';
            case 'cancelled': return 'bg-pink-100 text-pink-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getCardColor = (color) => {
        switch (color) {
            case 'purple': return 'from-purple-500 to-purple-600';
            case 'blue': return 'from-blue-400 to-blue-500';
            case 'teal': return 'from-teal-400 to-teal-500';
            case 'orange': return 'from-orange-400 to-orange-500';
            default: return 'from-gray-400 to-gray-500';
        }
    };

    const getBorderColor = (color) => {
        switch (color) {
            case 'purple': return 'border-l-purple-500';
            case 'blue': return 'border-l-blue-400';
            case 'teal': return 'border-l-teal-400';
            case 'orange': return 'border-l-orange-400';
            default: return 'border-l-gray-400';
        }
    };

    const markAsViewed = (orderId) => {
        setOrders(prev =>
            prev.map(o =>
                o._id === orderId ? { ...o, isNew: false } : o
            )
        );
    };



    const StatsSkeleton = () => (
        <>
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border-l-4 border-gray-200 p-6 animate-pulse"
                >
                    <div className="flex justify-between items-start mb-4">

                        {/* Value & Label Skeleton */}
                        <div className="flex-1">
                            <div className="h-6 w-20 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 w-28 bg-gray-200 rounded"></div>
                        </div>

                        {/* Icon Skeleton */}
                        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    </div>

                    {/* Change Text Skeleton */}
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
            ))}
        </>
    );

    const OrderSkeleton = () => {
        return (
            <div className="animate-pulse">
                {/* HEADER SKELETON */}
                <div className="hidden md:block">
                    <table className="w-full">
                        <tbody className="divide-y divide-gray-200">
                            {[...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-28 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE SKELETON */}
                <div className="md:hidden space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl space-y-3 border">
                            <div className="flex justify-between">
                                <div className="h-4 w-28 bg-gray-200 rounded"></div>
                                <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                            </div>

                            <div className="space-y-2">
                                <div className="h-4 w-40 bg-gray-200 rounded"></div>
                                <div className="h-4 w-28 bg-gray-200 rounded"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            </div>

                            <div className="flex justify-end">
                                <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <div className="h-1 w-12 bg-blue-600 mt-2"></div>
                </div>

            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {isStatsLoading ? (
                    <StatsSkeleton />
                ) : (
                    stats.map((stat, idx) => {
                        const Icon = iconMap[stat.icon] || Users; // fallback icon

                        return (
                            <div
                                key={idx}
                                className={`bg-white rounded-xl shadow-sm border-l-4 ${getBorderColor(stat.color)} p-6 hover:shadow-md transition-shadow`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
                                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                    </div>

                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getCardColor(stat.color)} flex items-center justify-center shadow-lg`}>
                                        <Icon className="text-white" size={24} />
                                    </div>
                                </div>

                                <p className={`text-xs font-medium flex items-center gap-1 
                ${stat.trend === "up" ? "text-cyan-500" : "text-red-500"}`}>
                                    <span>{stat.trend === "up" ? "↑" : "↓"}</span>
                                    {stat.change}
                                </p>
                            </div>
                        );
                    })
                )}

            </div>

            {/* Recent Orders Table */}

            <div className="bg-white rounded-xl md:shadow-sm">
                <div className="p-4 md:p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 md:w-10  h-8 md:h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <ShoppingBag className="text-blue-600" size={20} />
                            </div>
                            <h2 className="text-md md:text-xl font-bold text-gray-800">Recent Orders</h2>
                        </div>
                        <button onClick={() => navigate("/admin/dashboard/orders")} className="flex items-center cursor-pointer px-4 py-1 border-1 border-blue-400 text-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm font-medium">
                            View All
                        </button>
                    </div>
                </div>
                {/* ==== DESKTOP TABLE ==== */}
                {loading ? <OrderSkeleton /> : orders.slice(0, 5).length > 0 ? (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {orders.slice(0, 5).map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{order.orderId}
                                                {!order.isViewed && (
                                                    <span className="ml-2 animate-pulse text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                                                        NEW
                                                    </span>
                                                )}
                                            </td>
                                
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.fullName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">HTG {order.totalAmount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button onClick={() => { handleViewOrder(order); markAsViewed(order._id)}} className="flex items-center gap-2 px-4 py-1 border-1 border-blue-400 text-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm font-medium cursor-pointer">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ==== MOBILE CARD VIEW ==== */}
                        <div className="md:hidden  divide-y divide-gray-200">
                            {orders.slice(0, 5).map((order) => (
                                <div key={order._id} className="bg-white p-4  ">

                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm font-semibold text-gray-700">
                                            <span>Order ID {order.orderId}</span>
                                            {!order.isViewed && (
                                                <span className="ml-2 animate-pulse text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                                                    NEW
                                                </span>
                                            )}
                                        </div>

                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                            {order.orderStatus}
                                        </span>
                                    </div>

                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p><span className="font-medium text-gray-800">Customer:</span> {order.fullName}</p>
                                        <p><span className="font-medium text-gray-800">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                                        <p><span className="font-medium text-gray-800">Amount:</span> HTG{order.totalAmount.toFixed(2)}</p>
                                    </div>

                                    <div className="mt-3 flex justify-end">
                                        <button onClick={() => { handleViewOrder(order); markAsViewed(order._id)}} className="flex items-center gap-2 px-4 py-1 border-1 border-blue-400 text-blue-600 rounded-full transition-colors text-sm font-medium cursor-pointer">
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>

                ) : (
                    <p className="text-center text-gray-500 py-6">No orders found</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;