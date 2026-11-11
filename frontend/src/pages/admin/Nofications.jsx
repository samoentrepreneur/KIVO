import React, { useState } from 'react';
import { Bell, Package, XCircle, MessageSquare, DollarSign, Check, Trash2, Filter } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
const NotificationSkeleton = ({ count = 5 }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
            <div className="w-full mx-auto">
                {/* Header Skeleton */}
                <div className="mb-6 animate-pulse">
                    <div className="h-8 w-48 bg-gray-300 rounded-lg mb-2"></div>
                    <div className="h-1 w-12 bg-gray-300 rounded"></div>
                    <div className="h-4 w-32 bg-gray-300 rounded-lg mt-3"></div>
                </div>

                {/* Notifications List Skeleton */}
                <div className="divide-y divide-gray-200">
                    {[...Array(count)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white hover:bg-white/50 transition-all"
                        >
                            <div className="p-4">
                                <div className="flex gap-4">
                                    {/* Icon Skeleton */}
                                    <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>

                                    {/* Content Skeleton */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            {/* Title Skeleton */}
                                            <div className="h-5 bg-gray-300 rounded-lg w-40 sm:w-56 animate-pulse"></div>

                                            {/* Badge and Time Skeleton */}
                                            <div className="flex items-center gap-3">
                                                {index % 2 === 0 && (
                                                    <div className="h-5 w-12 bg-gray-300 rounded-full animate-pulse"></div>
                                                )}
                                                <div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
                                            </div>
                                        </div>

                                        {/* Message Skeleton */}
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                                            <div className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export const formatTime = (value) => {
    if (!value) return "";

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date)) return "";

    const now = new Date();
    let diff = Math.floor((now - date) / 1000);

    // Future safety
    if (diff < 0) diff = 0;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

const Notifications = () => {
    const { unreadCount, notifications, loading, fetchNotifications, markAsRead } = useNotifications();
    const navigate = useNavigate();
    const getIcon = (type) => {
        const iconMap = {
            order_created: <Package className="w-5 h-5" />,
            order_cancelled: <XCircle className="w-5 h-5" />,
            message_received: <MessageSquare className="w-5 h-5" />,
            refund_requested: <DollarSign className="w-5 h-5" />,
        };
        return iconMap[type] || <Bell className="w-5 h-5" />;
    };

    const getIconColor = (type) => {
        const colorMap = {
            order_created: 'bg-green-100 text-green-600',
            order_cancelled: 'bg-red-100 text-red-600',
            message_received: 'bg-blue-100 text-blue-600',
            refund_requested: 'bg-yellow-100 text-yellow-600',
        };
        return colorMap[type] || 'bg-gray-100 text-gray-600';
    };

    const slugify = (text) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const handleViewNotification = (notification) => {
        if (!notification) return;

        const { type, data } = notification;
        if (!type || !data) return;

        markAsRead(notification._id);

        if (type.startsWith("order")) {
            const slug = slugify(data.orderName || "");
            const orderId = data.orderId;

            if (!orderId || !data.redirectTo) return;

            navigate(`/admin/dashboard/complete-order/${slug}-${orderId}`);
            return;
        }

        if (data.redirectTo) {
            navigate(data.redirectTo);
        }
    };




    if (loading) {
        return <NotificationSkeleton count={5} />;
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Notifications</h1>
                    <div className="h-1 w-12 bg-blue-600 mt-2"></div>
                    <p className="text-gray-600 mt-1">{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>

                {/* Notifications List */}
                <div className="divide-y divide-gray-200">
                    {notifications.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>

                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={() => handleViewNotification(notification)}
                                className="bg-white   hover:bg-white/50 cursor-pointer transition-all" >
                                <div className="p-4">
                                    <div className="flex gap-4">
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getIconColor(notification.type)}`}>
                                            {getIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-1">
                                                <h3 className="font-semibold text-gray-900">
                                                    {notification.title}
                                                </h3>
                                                <div className='flex items-center  gap-3'>
                                                    {!notification.isRead && (
                                                        <span className="ml-2 animate-pulse text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                                                            NEW
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                                        {formatTime(notification.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">
                                                {notification.message}
                                            </p>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;