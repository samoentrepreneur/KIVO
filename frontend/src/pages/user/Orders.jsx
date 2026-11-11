// Orders View
import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronRight, Package, Clock, CheckCircle,
    XCircle, ArrowLeft,
    RotateCcw
} from 'lucide-react';
import { useUserAuth } from '../../context/user.authContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api';


const OrdersSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className='max-w-6xl mx-auto px-4 md:px-8 py-4'>
                {/* Header */}
                <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-6">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                    <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2 px-2 py-1 md:px-4 md:py-2 bg-gray-200 rounded-lg animate-pulse scrollbar-hide">
                            <div className="w-15 h-3 md:w-20 md:h-5 bg-gray-300 rounded" />
                            <div className="w-5 h-5 bg-gray-300 rounded-full" />
                        </div>
                    ))}
                </div>

                {/* Order Cards */}
                <div className="max-w-6xl space-y-2">
                    {[1, 2, 3].map((order) => (
                        <div key={order} className="bg-white rounded-lg p-4 md:p-6">
                            {/* Order Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-2">
                                    <div className="w-12 h-2 md:w-24 md:h-4 bg-gray-200 rounded animate-pulse" />
                                    <div className="w-24 h-3 md:w-48 md:h-6 bg-gray-200 rounded animate-pulse" />
                                </div>
                                <div className="w-12 h-4 md:w-24 md:h-8 bg-orange-200 rounded-full animate-pulse" />
                            </div>

                            {/* Order Item */}
                            <div className="flex items-center gap-4">
                                {/* Product Image */}
                                <div className="w-10 h-12 md:w-20 md:h-20 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />

                                {/* Product Details */}
                                <div className="flex-1 space-y-2">
                                    <div className="w-30 h-3 md:w-40 md:h-5 bg-gray-200 rounded animate-pulse" />
                                    <div className="md:w-32 md:h-4 w-20 h-2  bg-gray-200 rounded animate-pulse" />
                                    <div className="md:w-28 md:h-4 w-25 h-2 bg-gray-200 rounded animate-pulse" />
                                </div>

                                {/* Price */}
                                <div className="text-right space-y-1">
                                    <div className="md:w-24 md:h-7 w-14 h-4 bg-gray-200 rounded animate-pulse ml-auto" />
                                    <div className="md:w-16 md:h-4 w-8 h-2 bg-gray-200 rounded animate-pulse ml-auto" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


const OrdersList = () => {
   
    const [orders, setOrders] = useState([]);
    const [orderFilter, setOrderFilter] = useState('all');
    const { user, logout, loading } = useUserAuth();
    const navigate = useNavigate();
    const [isOrdersLoading, setOrdersLoading] = useState(true);
    document.title="Orders";

    const fetched = useRef(false);

    useEffect(() => {
        if (user && !fetched.current) {
            fetched.current = true;
            getMyOrders();
        }
    }, [user]);

    const getMyOrders = async () => {
        try {
            const res = await api.get("user/order/get-my-orders");

            if (res.data.success)
            {

                setOrders(res.data.orders);
            }
            // console.log(res.data.orders)

        } catch (err) {
            console.error(err)
            toast.error("Failed to load orders");
        } finally {
            setOrdersLoading(false);
        }
    };


    const getFilteredOrders = () => {
        if (orderFilter === 'all') return orders;
        return orders.filter(order => order.orderStatus === orderFilter);
    };
    const getStatusColor = (status) => {
        const colors = {
            // Order states
            pending: 'bg-amber-100 text-amber-500',
            reviewing: 'bg-blue-100 text-blue-500',
            processing: 'bg-indigo-100 text-indigo-500',
            completed: 'bg-emerald-100 text-emerald-500',
            cancelled: 'bg-red-100 text-red-500',
            failed: 'bg-rose-100 text-rose-500',

            // Refund states
            refund_initiated: 'text-sky-500',
            refund_completed: 'text-emerald-500',
        };

        return colors[status] || 'bg-gray-500';
    };
    const iconClass = "w-3 h-3 md:w-5 md:h-5";

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className={iconClass} />;

            case 'completed':
                return <CheckCircle className={iconClass} />;

            case 'cancelled':
                return <XCircle className={iconClass} />;

            // 🔄 Refund states
            case 'refund_initiated':
                return <RotateCcw className={iconClass} />;

            case 'refund_completed':
                return <CheckCircle className={iconClass} />;

            default:
                return <Package className={iconClass} />;
        }
    };
    const filteredOrders = getFilteredOrders();
    const filterOptions = [
        { value: 'all', label: 'All Orders', count: orders.length },
        { value: 'pending', label: 'Pending', count: orders.filter(o => o.orderStatus === 'pending').length },
        { value: 'completed', label: 'Completed', count: orders.filter(o => o.orderStatus === 'completed').length },
        { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.orderStatus === 'cancelled').length }
    ];

    const getCurrencySymbol = (currency) => {
        return currency === "HTG" ? "G" : "$";
    }
    const slugify = (text) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const handleViewOrder = (order) => {
        if (!order) return;
        const slug = slugify(order.productSnapshot.service);
        navigate(`/track-order/${slug}-${order._id}`);
    }

    if (isOrdersLoading) return <OrdersSkeleton />
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-15 sm:top-30 z-20">
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-1 bg-gray-100 rounded-full hover:text-blue-600 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold">My Orders</h1>
                    </div>
                    <div className="flex space-x-2 overflow-x-auto mt-4 scrollbar-hide">
                        {filterOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setOrderFilter(option.value)}
                                className={`px-3 py-1 font-semibold text-xs md:text-sm whitespace-nowrap transition-all ${orderFilter === option.value
                                    ? 'bg-blue-100 rounded-lg text-blue-600'
                                    : 'text-gray-700 hover:text-blue-500'
                                    }`}
                            >
                                {option.label}
                                <span className={`ml-2 px-2 py-0.5 shrink-0 rounded-full text-xs ${orderFilter === option.value
                                    ? 'bg-blue-200'
                                    : 'bg-gray-200'
                                    }`}>
                                    {option.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>



            <div className="max-w-6xl mx-auto px-0 md:px-8 md:py-6">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl">
                        <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <p className="text-xl font-semibold text-gray-400">No orders found</p>
                        <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="rounded">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                onClick={() => {
                                    handleViewOrder(order)
                                }}
                                className="bg-white p-4 md:p-6 transition-all cursor-pointer overflow-hidden border-b border-gray-100 last:border-b-0"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wide">Order ID</p>
                                        <p className="font-bold text-xs md:text-sm text-gray-900 mt-1">{order.orderId}</p>
                                    </div>
                                    <div className={`md:px-4 md:py-2 px-2 py-1 rounded-full  text-[10px] md:text-xs font-bold flex items-center space-x-1 md:space-x-2 ${getStatusColor(order.orderStatus)}`}>
                                        {getStatusIcon(order.orderStatus)}
                                        <span className="capitalize">{order.orderStatus}</span>
                                    </div>
                                </div>



                                <div className="flex items-start space-x-2 md:space-x-4">
                                    <div className="w-10 h-14 md:w-20 md:h-20 rounded md:rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={order.productSnapshot?.image}
                                            alt={order.productSnapshot?.service}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 text-sm md:text-lg line-camp-1 truncate">{order.productSnapshot?.service}</h3>
                                        {/* <p className="text-sm text-gray-600 mt-1">{order.variantSnapshot.name}</p> */}
                                        <div className="flex items-center gap-3">
                                            <span className=" text-xs md:text-sm flex flex-wrap gap-2">
                                                {getCurrencySymbol(order.productSnapshot.currency)} {order.variantSnapshot?.price || 0}
                                                {order.variantSnapshot?.planName && (
                                                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                                                        {order.variantSnapshot.planName}
                                                    </span>
                                                )}
                                            </span>
                                            {order.variantSnapshot?.unitValue && order.variantSnapshot?.unitLabel && (
                                                <span className="text-xs md:text-sm text-gray-500">
                                                    ({order.variantSnapshot.unitValue} {order.variantSnapshot.unitLabel})
                                                </span>
                                            )}

                                        </div>
                                        <div className="flex items-center space-x-2 mt-1 md:mt-2 text-[10px] md:text-xs text-gray-500">
                                            <span>Qty: {order.quantity}</span>
                                            <span>•</span>
                                            <span>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm md:text-2xl font-bold text-blue-600">G {order.totalAmount.toFixed(2)}</p>
                                        <p className="text-[10px] md:text-xs text-gray-500 mt-1 capitalize">{order.paymentMethod}</p>
                                        {order?.refundStatus !== "pending" && (
                                            <div
                                                className={` mt-2 text-[10px] md:text-xs flex items-center space-x-1 md:space-x-2
                                               ${getStatusColor(order.refundStatus === 'initiated'
                                                    ? 'refund_initiated'
                                                    : order.refundStatus === 'completed'
                                                        ? 'refund_completed'
                                                        : order.refundStatus
                                                )}`}
                                            >
                                                {getStatusIcon(
                                                    order.refundStatus === 'initiated'
                                                        ? 'refund_initiated'
                                                        : order.refundStatus === 'completed'
                                                            ? 'refund_completed'
                                                            : order.refundStatus
                                                )}
                                                <span className="capitalize">Refund {order.refundStatus.replace('_', ' ')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersList;