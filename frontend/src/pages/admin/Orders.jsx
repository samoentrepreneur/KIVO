import { useContext } from "react";
import { OrderContext } from "../../context/OrderContext";
import React, { useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom";

const OrdersAdmin = () => {
    const {
        orders,
        loading,
        loadingMore,
        hasMore,
        search,
        setSearch,
        loadMoreOrders,
        setOrders,
        totalOrders

    } = useContext(OrderContext);
    const [searchInput, setSearchInput] = useState(search);


    const navigate = useNavigate();

    useEffect(() => {
        const delay = setTimeout(() => {
            setSearch(searchInput.trim());
        }, 400); // 400ms debounce

        return () => clearTimeout(delay);
    }, [searchInput]);

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



    const markAsViewed = (orderId) => {
        setOrders(prev =>
            prev.map(o =>
                o._id === orderId ? { ...o, isViewed: true } : o
            )
        );
    };
    const OrderSkeleton = () => {
        return (
            <div className="animate-pulse">
                {/* HEADER SKELETON */}
                <div className="hidden md:block">
                    <table className="w-full">
                        <tbody className="divide-y divide-gray-200">
                            {[...Array(8)].map((_, i) => (
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
                        <div key={i} className="bg-white p-4 space-y-3 border-b border-gray-200">
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
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Orders</h1>
                <div className="h-1 w-12 bg-blue-600 mt-2"></div>
                <p className="text-gray-600 mt-1">Total orders: {totalOrders}</p>
            </div>
            <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search order ID / customer"
                className="px-4 py-2 border rounded-lg w-full md:w-80 border-gray-200 bg-white mb-4"
            />

            <div className="bg-white rounded-xl md:shadow-sm">

                {/* ==== DESKTOP TABLE ==== */}
                {loading ? <OrderSkeleton /> : orders.length > 0 ? (
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
                                    {orders.map((order) => (
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
                                                <button onClick={() => { handleViewOrder(order); markAsViewed(order._id) }} className="flex items-center gap-2 px-4 py-1 border-1 border-blue-400 text-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm font-medium cursor-pointer">
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
                            {orders.map((order) => (
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
                                        <p><span className="font-medium text-gray-800">Amount:</span> HTG {order.totalAmount.toFixed(2)}</p>
                                    </div>

                                    <div className="mt-3 flex justify-end">
                                        <button onClick={() => { handleViewOrder(order); markAsViewed(order._id) }} className="flex items-center gap-2 px-4 py-1 border-1 border-blue-400 text-blue-600 rounded-full transition-colors text-sm font-medium cursor-pointer">
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
            {hasMore && !loading && (
                <div className="flex justify-center py-6">
                    <button
                        onClick={loadMoreOrders}
                        disabled={loadingMore}
                        className="px-6 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                        {loadingMore ? "Loading..." : "Load more"}
                    </button>
                </div>
            )}
        </div>
    )
}
export default OrdersAdmin;