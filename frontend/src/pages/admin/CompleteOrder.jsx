import React, { useState, useEffect } from 'react';
import {
    Package, Clock, CheckCircle,
    XCircle, Home, User, MessageCircle,
    X,
    RotateCcw,
    Copy,
    Code,
    Calendar
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { Mail, Phone, Gamepad2, Tv, FileText, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminOrderCancelReasonModal from '../../modal/AdminOrderCancelReasonModal';


const OrderDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50">
           

            <div className="w-full mx-auto px-4 md:px-8 py-4 lg:py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {/* Left Column - Order Timeline Skeleton */}
                    <div className="space-y-4">
                        {/* Product Header Skeleton */}
                        <div className="bg-white p-4 md:p-6 rounded-lg animate-pulse">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="w-16 h-3 bg-gray-200 rounded mb-2"></div>
                                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                                </div>
                                <div className="w-20 md:w-24 h-6 md:h-8 bg-gray-200 rounded-full"></div>
                            </div>

                            <div className="flex items-start space-x-2 md:space-x-4">
                                <div className="w-10 h-14 md:w-20 md:h-20 rounded md:rounded-xl bg-gray-200"></div>
                                <div className="flex-1 min-w-0">
                                    <div className="w-3/4 h-5 md:h-6 bg-gray-200 rounded mb-2"></div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                                        <div className="w-24 h-4 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-12 h-3 bg-gray-200 rounded"></div>
                                        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                        <div className="w-20 h-3 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="w-16 md:w-20 h-6 md:h-8 bg-gray-200 rounded mb-1"></div>
                                    <div className="w-12 h-3 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Timeline Skeleton */}
                        <div className="bg-white p-4 md:p-6 rounded-lg animate-pulse">
                            <div className="space-y-0">
                                {[1, 2, 3, 4].map((_, idx) => (
                                    <div key={idx} className="flex items-start relative">
                                        {/* Timeline Connector */}
                                        <div className="flex flex-col items-center z-1">
                                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200"></div>
                                            {idx < 3 && (
                                                <div className="w-0.5 h-14 md:h-16 bg-gray-200"></div>
                                            )}
                                        </div>

                                        {/* Step Content */}
                                        <div className="flex-1 pl-8 py-2 -ml-5">
                                            <div className="w-32 md:w-40 h-4 md:h-5 bg-gray-200 rounded mb-1"></div>
                                            {idx === 0 && (
                                                <div className="w-24 h-3 bg-gray-200 rounded"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pb-4 md:pb-6 border-b border-gray-200">
                                <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
                                <div className="h-10 md:h-12 bg-gray-200 rounded"></div>
                                <div className="h-10 md:h-12 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details Skeleton */}
                    <div className="space-y-4">
                        {/* Order Details Skeleton */}
                        <div className="bg-white rounded-lg p-4 md:p-5 animate-pulse">
                            <div className="w-32 h-6 md:h-7 bg-gray-200 rounded mb-4"></div>

                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-3 flex-1 py-3 ${index === 2 ? "border-b border-gray-200" : ""
                                        }`}
                                >
                                    <div className="w-5 h-5 bg-gray-200 rounded"></div>

                                    <div className="min-w-0 flex-1">
                                        <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-2/4 h-3 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}


                            <div className="flex items-center gap-3 flex-1 py-3">
                                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                <div className="min-w-0 flex-1">
                                    <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>

                        {/* Price Details Skeleton */}
                        <div className="bg-white rounded-lg p-4 md:p-5 animate-pulse">
                            <div className="w-28 h-6 md:h-7 bg-gray-200 rounded mb-4"></div>

                            <div className="space-y-3 bg-gray-50 px-4 py-6 rounded-lg mb-5 border border-gray-100">
                                <div className="flex justify-between items-center">
                                    <div className="w-12 h-4 bg-gray-200 rounded"></div>
                                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                                </div>

                                <div className="border-t border-dashed border-gray-300 my-4"></div>

                                <div className="flex justify-between items-center mb-4">
                                    <div className="w-24 h-5 bg-gray-200 rounded"></div>
                                    <div className="w-20 h-5 bg-gray-200 rounded"></div>
                                </div>

                                <div className="flex justify-between items-start pt-4 border-t border-gray-200">
                                    <div className="w-28 h-4 bg-gray-200 rounded"></div>
                                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};




const OrderDetailsSection = ({ order }) => {
    // Helper function to render detail rows
    const DetailRow = ({ icon: Icon, label, value, copyable = true }) => {
        if (!value) return null;
        const handleCopy = async (text) => {
            try {
                await navigator.clipboard.writeText(text);
                toast.success("Copied to clipboard");
            } catch {
                toast.error("Failed to copy");
            }
        };

        return (
            <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-sm text-gray-600 truncate">{value}</p>
                    </div>
                </div>

                {copyable && (
                    <button
                        onClick={() => handleCopy(value)}
                        className="ml-3 p-1 rounded hover:text-blue-500"
                        title="Copy"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                )}
            </div>
        );
    };


    return (
        <div className="bg-white rounded-lg p-4 md:p-5">
            <h2 className="font-semibold text-lg md:text-xl mb-4">Order details</h2>

            <div className="space-y-0">
                {/* Address (if available) */}
                <DetailRow
                    icon={Home}
                    label="Address"
                    value={order.address}
                />

                {/* Recipient Email (if different) */}
                {order.recipientEmail && (
                    <DetailRow
                        icon={Mail}
                        label="Recipient Email"
                        value={order.recipientEmail}
                    />
                )}
                {order.meruCardId && (
                    <DetailRow
                        icon={CreditCard}
                        label="Meru ID"
                        value={order.meruCardId}
                    />
                )}
                {order.wiseEmailOrId && (
                    <DetailRow
                        icon={CreditCard}
                        label="Wise Email or ID"
                        value={order.wiseEmailOrId}
                    />
                )}
                {/* card */}
                {order.card && (
                    <>
                        <DetailRow
                            icon={CreditCard}
                            label="Card Number"
                            value={order.card.cardNumber}
                        />

                        <DetailRow
                            icon={Calendar}
                            label="Card Expiry Date"
                            value={order.card.expiryDate}
                        />

                        <DetailRow
                            icon={Code}
                            label="CVV"
                            value={order.card.cvv}
                        />
                    </>
                )}


                {/* Game Details */}
                {order.gameDetails && (
                    <>
                        <DetailRow
                            icon={Gamepad2}
                            label="Game ID"
                            value={order.gameDetails.gameId}
                        />

                        <DetailRow
                            icon={User}
                            label="Game Username"
                            value={order.gameDetails.username}
                        />

                        <DetailRow
                            icon={Gamepad2}
                            label="Game Region"
                            value={order.gameDetails.region}
                        />
                    </>
                )}

                {/* Streaming Details */}
                {order.streamingDetails && (
                    <>
                        <DetailRow
                            icon={Tv}
                            label="Stream Email"
                            value={order.streamingDetails.streamEmail}
                        />

                        <DetailRow
                            icon={User}
                            label="Stream Username"
                            value={order.streamingDetails.streamUsername}
                        />

                        <DetailRow
                            icon={Tv}
                            label="Stream Password"
                            value={order.streamingDetails.streamPassword ? '••••••••' : null}
                        />

                        <DetailRow
                            icon={Tv}
                            label="Streaming Region"
                            value={order.streamingDetails.region}
                        />
                    </>
                )}

                {/* Payment Info */}
                <DetailRow
                    icon={Phone}
                    label="Payment Phone"
                    value={order.paymentPhone}
                />

                <DetailRow
                    icon={CreditCard}
                    label="Transaction ID"
                    value={order.transactionId}
                />

                {order.orderNotes && (
                    <DetailRow
                        icon={FileText}
                        label="Order Notes"
                        value={order.orderNotes}
                        copyable={false}
                    />
                )}
            </div>

            {/* Customer Information Section - Separated at the bottom */}
            <div className="mt-3 pt-3 border-t border-gray-200">

                <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="font-medium text-gray-900">{order.fullName || 'Dilip Kumar'}</p>
                        <p className="text-sm text-gray-600">{order.email} | {order.phone || order.paymentPhone}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};



const CompleteOrder = () => {
   
    const { trackId } = useParams();
    const id = trackId.split("-").pop();
    const [isLoadingOrder, setIsLoadingOrder] = useState(true);
    const [order, setOrder] = useState({});
    const [orderCancelLoader, setOrderCancelLoader] = useState(false);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    document.title =  "ADMIN Order Details";
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);


    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/admin/orders/order-details/${id}`)
                // console.log(res)

                if (res.data.success)
                    setOrder(res.data.order);
            } catch (error) {
                // console.log(error)
                setErrorMessage(true);
            }
            finally {
                setIsLoadingOrder(false)
            }
        }
        if (!id) return;
        fetchOrder();
    }, [id])

    const getCurrencySymbol = (currency) => {
        return currency === "HTG" ? "G" : "$";
    }

    const handleUpdateStatus = async (status) => {
        if (actionLoading) return;
           setActionLoading(true);
        try {
            
            const res = await api.patch("/admin/orders/update-status", {
                orderId: order._id,
                status,
            });
            console.log(res)

            if (res.data.success) {
                setOrder(res.data.order);
                toast.success(`Order moved to ${status}`);
            }
        } catch {
            toast.error("Failed to update order status");
        }
        finally {
            setActionLoading(false);
        }
    };

    const handleRefundUpdate = async (status) => {
            setOrderCancelLoader(true);
        try {
            const res = await api.patch("/admin/orders/update-refund", {
                orderId: order._id,
                refundStatus: status,
            });

            if (res.data.success) {
                setOrder(res.data.order);
                toast.success(`Refund ${status}`);
            }
        } catch {
            toast.error("Failed to update refund status");
        }
        finally {
            setOrderCancelLoader(false);
        }
    };


    const getDeliverySteps = () => {
        const steps = [];
        steps.push({
            status: 'placed',
            label: 'Order Placed',
            date: order?.createdAt,
            desc: 'Order has been placed and is awaiting review.',
            isCompleted: true,
            isActive: false,
            type: 'placed',
        });

        if (order?.orderStatus === 'cancelled') {
            steps.push({
                status: 'cancelled',
                label: 'Order Cancelled',
                date: order?.cancelledAt,
                desc: 'Order cancelled by admin. Refund action required.',
                isCompleted: true,
                isActive: false,
                type: 'cancelled',
            });

            if (['initiated', 'completed'].includes(order?.refundStatus)) {
                steps.push({
                    status: 'refund_initiated',
                    label: 'Refund Initiated',
                    date: order?.refundInitiatedAt,
                    desc: 'Refund initiated. Complete the refund once payment is returned.',
                    isCompleted: true,
                    isActive: order?.refundStatus === 'initiated',
                    type: 'refund',
                });
            }

            if (order?.refundStatus === 'completed') {
                steps.push({
                    status: 'refund_completed',
                    label: 'Refund Completed',
                    date: order?.refundCompletedAt,
                    desc: 'Refund marked as completed.',
                    isCompleted: true,
                    isActive: true,
                    type: 'refund',
                });
            }

            return steps;
        }

        return [
            {
                status: 'placed',
                label: 'Order Recieved',
                date: order?.createdAt,
                desc: 'Order received. Review payment and order details.',
                isCompleted: true,
                isActive: order?.orderStatus === 'pending',
            },
            {
                status: 'reviewing',
                label: 'Under Review',
                date: order?.reviewingAt,
                desc: 'Verify payment and order information.',
                isCompleted: ['reviewing', 'processing', 'completed'].includes(order?.orderStatus),
                isActive: order?.orderStatus === 'reviewing',
                canAction: order?.orderStatus === 'pending',
                actionLabel: 'Mark as Reviewing',
                action: () => handleUpdateStatus('reviewing'),
            },

            {
                status: 'processing',
                label: 'Processing',
                date: order?.processingAt,
                desc: 'Process the order and prepare for completion.',
                isCompleted: ['processing', 'completed'].includes(order?.orderStatus),
                isActive: order?.orderStatus === 'processing',
                canAction: order?.orderStatus === 'reviewing',
                actionLabel: 'Move to Processing',
                action: () => handleUpdateStatus('processing'),
            },
            {
                status: 'completed',
                label: 'Completed',
                date: order?.completedAt,
                desc: 'Order completed successfully.',
                isCompleted: order?.orderStatus === 'completed',
                isActive: order?.orderStatus === 'completed',
                canAction: order?.orderStatus === 'processing',
                actionLabel: 'Mark Complete',
                action: () => handleUpdateStatus('completed'),
            },
        ];
    };


    const getOrderMessageConfig = (order, isAdmin = false) => {

            if (order?.refundStatus === 'completed') {
                return {
                    text: 'Refund has been marked as completed.',
                    bg: 'bg-emerald-50',
                    textColor: 'text-emerald-700',
                };
            }

            if (order?.refundStatus === 'initiated') {
                return {
                    text: 'Refund has been initiated. Complete the refund once payment is returned.',
                    bg: 'bg-sky-50',
                    textColor: 'text-sky-700',
                };
            }

            if (order?.orderStatus === 'cancelled' && order?.refundStatus === 'pending') {
                return {
                    text: 'Order cancelled. Please initiate the refund.',
                    bg: 'bg-red-50',
                    textColor: 'text-red-700',
                };
            }

            if (order?.orderStatus === 'completed') {
                return {
                    text: 'Order completed successfully.',
                    bg: 'bg-emerald-50',
                    textColor: 'text-emerald-700',
                };
            }

            if (order?.orderStatus === 'processing') {
                return {
                    text: 'Order is currently being processed.',
                    bg: 'bg-indigo-50',
                    textColor: 'text-indigo-700',
                };
            }

            return {
                text: 'Review and update the order status as required.',
                bg: 'bg-gray-50',
                textColor: 'text-gray-700',
            };

       
    };


    const getStatusColor = (status) => {
        const colors = {
            // Order states
            pending: 'bg-amber-500',
            reviewing: 'bg-blue-500',
            processing: 'bg-indigo-500',
            completed: 'bg-emerald-500',
            cancelled: 'bg-red-500',
            failed: 'bg-rose-500',

            // Refund states
            refund_initiated: 'bg-sky-500',
            refund_completed: 'bg-emerald-500',
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

    const deliverySteps = order.orderStatus ? getDeliverySteps() : [];

   
    const downloadScreenShot = async (url) => {
        try {
            const response = await fetch(url, { mode: "cors" });
            const blob = await response.blob();

            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = blobUrl;
            link.download = `payment-${order.orderId}.jpg`;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            // console.error("Download failed", error);
            toast.error("Failed to download image");
        }
    };


    const handleCancelConfirm = async (reason) => {
        try {
            setOrderCancelLoader(true);
            const res = await api.post("/admin/orders/cancel-order", {
                cancelReason: reason,
                orderId: order._id
            });

            if (res.data.success) {
                setOrder(res.data.order);
                toast.success("Order cancelled & Refund initiated successfully");
                setShowReasonModal(false);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel order');
        } finally {
            setOrderCancelLoader(false);
        }
    };


    const isDisabled = ['completed', 'cancelled'].includes(order?.orderStatus);



    if (isLoadingOrder) {
        return <OrderDetailsSkeleton />;
    }
    if(errorMessage){
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-6 rounded-lg  text-center">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h2>
                    <p className="text-gray-700">Failed to load order details. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {order.orderStatus==="cancelled" && (
                <div className="w-full  border-b border-red-200 bg-red-50 p-4 md:p-6">
                    <div className="flex items-start gap-3">

                        <div className="flex-1">
                            <p className="text-sm font-semibold text-red-700">
                                Order Cancelled
                            </p>

                            <p className="text-sm text-red-600 mt-1">
                                This order was cancelled by{" "}
                                <span className="font-medium capitalize">
                                    {order.orderCancelledBy === "admin" ? "Admin" : "Customer"}
                                </span>.
                            </p>

                            {order.cancelReason && (
                                <p className="text-sm text-gray-700 mt-2">
                                    <span className="font-medium">Reason:</span>{" "}
                                    {order.cancelReason}
                                </p>
                            )}

                            {order.cancelledAt && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Cancelled on {new Date(order.cancelledAt).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}


            <div className="w-full mx-auto px-4 md:px-8 py-4 lg:py-6">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {/* Left Column - Order Timeline */}
                    <div className="space-y-4">
                        {/* Product Header */}
                        <div
                            className="bg-white p-4 md:p-6 transition-all cursor-pointer overflow-hidden rounded-lg"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wide">Order ID</p>
                                    <p className="font-bold text-xs md:text-sm text-gray-900 mt-1">{order.orderId}</p>
                                </div>
                                <div className={`md:px-4 md:py-2 px-2 py-1 rounded-full text-white text-[10px] md:text-xs font-bold flex items-center space-x-1 md:space-x-2 ${getStatusColor(order.orderStatus)}`}>
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
                                    <div className="flex items-center flex-wrap gap-2">
                                        <span className=" text-xs md:text-sm">
                                            {getCurrencySymbol(order.productSnapshot.currency)} {order.variantSnapshot?.price || 0}
                                        </span>
                                        {order.variantSnapshot?.planName && (
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                                                {order.variantSnapshot.planName}
                                            </span>
                                        )}
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
                                    <p className="text-[10px] md:text-xs text-green-600 mt-1">{order.variantSnapshot.stock} available</p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Timeline */}
                        <div className="bg-white  p-4 md:p-6 rounded-lg">
                            <div className="space-y-0">
                                {deliverySteps.map((step, idx) => (
                                    <div key={idx} className="flex items-start  relative">
                                        {/* Timeline Connector */}
                                        <div className="flex flex-col items-center z-1 ">
                                            {step.type === 'cancelled' ? (
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-red-500 flex items-center justify-center">
                                                    <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                                </div>
                                            ) : step.type === 'refund' ? (
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                                    <RotateCcw className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                                </div>
                                            ) : step.isCompleted ? (
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-green-600 flex items-center justify-center z-10">
                                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                                </div>
                                            ) : step.isActive ? (
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-4 border-green-600 bg-white flex items-center justify-center z-10">
                                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-600"></div>
                                                </div>
                                            ) : (
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center z-10">
                                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-gray-300"></div>
                                                </div>
                                            )}
                                            {idx < deliverySteps.length - 1 && (
                                                <div
                                                    className={`w-0.5 h-14 md:h-16 ${step.type === 'cancelled'
                                                        ? 'bg-red-400'
                                                        : step.type === 'refund'
                                                            ? 'bg-blue-400'
                                                            : step.isCompleted
                                                                ? 'bg-green-600'
                                                                : 'bg-gray-300'
                                                        }`}
                                                />
                                            )}
                                        </div>

                                        {/* Step Content */}
                                        <div
                                            className={`flex-1 pl-8 py-2 -ml-5
    ${step.isCancelled
                                                    ? 'bg-red-50 rounded-r-lg'
                                                    : step.isActive
                                                        ? 'bg-green-50 rounded-r-lg'
                                                        : ''
                                                }`}
                                        >

                                            <p
                                                className={`font-normal text-sm md:text-base ${step.isCancelled
                                                    ? 'text-red-600'
                                                    : step.isCompleted || step.isActive
                                                        ? 'text-gray-900'
                                                        : 'text-gray-400'
                                                    }`}
                                            >

                                                {step.label}
                                            </p>
                                            {step.desc && step.isActive && (
                                                <p className="text-xs md:text-sm text-gray-600 mt-1">{step.desc}</p>
                                            )}
                                            {step.canAction && (
                                                <button
                                                    onClick={step.action}
                                                    disabled={actionLoading}
                                                    className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded
                   bg-indigo-600 text-white hover:bg-indigo-700"
                                                >
                                                    {actionLoading ? <div className='flex items-center gap-2'> <div className="h-4 w-4 border-2 border-white bg-transparent rounded-full border-t-transparent animate-spin" /> <span>Updating...</span></div>
:step.actionLabel}
                                                </button>
                                            )}

                                            {step.date && step.isCompleted && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(step.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {(() => {
                                const { text, bg, textColor } = getOrderMessageConfig(order);
                                return (
                                    <p className={`text-sm mt-6 p-3 rounded-lg ${bg} ${textColor}`}>
                                        {text}
                                    </p>
                                );
                            })()}
                            {(() => {
                                if (order?.orderStatus === 'completed') {
                                    return (
                                        <button
                                            disabled
                                            className="w-full py-2.5 mt-4 rounded bg-emerald-50 text-emerald-600 cursor-not-allowed"
                                        >
                                            Order Completed
                                        </button>
                                    );
                                }

                                if (order?.orderStatus === 'cancelled' && order?.refundStatus === 'pending') {
                                    return (
                                        <button
                                            onClick={() => handleRefundUpdate('initiated')}
                                            disabled={orderCancelLoader}
                                            className="w-full py-2.5 mt-4 rounded bg-sky-600 text-white hover:bg-sky-700"
                                        >
                                            
                                            {orderCancelLoader ? 'Initiating...' : 'Initiate Refund'}

                                        </button>
                                    );
                                }

                                if (order?.orderStatus === 'cancelled' && order?.refundStatus === 'initiated') {
                                    return (
                                        <button
                                            onClick={() => handleRefundUpdate('completed')}
                                            disabled={orderCancelLoader}
                                            className="w-full py-2.5 mt-4 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                                        >
                                           
                                            {orderCancelLoader ? 'Issuing...' : 'Refund Issued'}

                                        </button>
                                    );
                                }

                                if (order?.orderStatus === 'cancelled' && order?.refundStatus === 'completed') {
                                    return (
                                        <button
                                            disabled
                                            className="w-full py-2.5 mt-4 rounded bg-emerald-50 text-emerald-600 cursor-not-allowed"
                                        >
                                            Refund Completed

                                        </button>
                                    );
                                }

                                return (
                                    <button
                                        disabled={isDisabled || orderCancelLoader}
                                        onClick={() => setShowReasonModal(true)}
                                        
                                        className={`w-full py-2.5 mt-4 rounded border text-base font-medium transition-colors
                ${isDisabled
                                                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                                : 'text-red-600 border-red-500 hover:bg-red-50'
                                            }`}
                                    >
                                        {orderCancelLoader ? 'Cancelling...' : 'Cancel Order'}
                                    </button>
                                );
                            })()}

                            <button className='border border-blue-500 text-blue-500 hover:bg-blue-50 rounded flex items-center justify-center mt-4 text-base font-medium transition-colors gap-2 w-full px-4 py-2 '>
                                <MessageCircle size={20} />
                                <span>Chat with {order.fullName}</span>
                            </button>
                               
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-4">

                        <OrderDetailsSection order={order} />

                        {/* Price Details */}
                        <div className="bg-white rounded-lg p-4 md:p-5">
                            <h2 className="font-semibold text-lg md:text-xl mb-4">Payment details</h2>
                            <div className="w-full h-60 mb-4 cursor-zoom-in">
                                <img
                                    src={order.paymentScreenshotUrl}
                                    alt="Payment Screenshot"
                                    className="w-full h-full object-contain space-y-3 bg-gray-50 px-4 py-6 rounded-lg mb-5 border border-gray-100 hover:opacity-90 transition"
                                    onClick={() => setShowImagePreview(true)}
                                    loading='lazy'
                                />
                            </div>
                            {showImagePreview && (
                                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
                                    <button
                                        onClick={() => setShowImagePreview(false)}
                                        className="absolute top-4 right-4 text-white hover:text-gray-300"
                                    >
                                        <X size={30}/>
                                    </button>
                                    <button
                                        onClick={() => downloadScreenShot(order.paymentScreenshotUrl)}
                                        className="absolute top-4 left-4 px-3 py-1.5 rounded bg-white text-sm font-medium hover:bg-gray-100"
                                    >
                                        Download
                                    </button>
                                    <div className="max-w-[90%] max-h-[90%] overflow-auto">
                                        <img
                                            src={order.paymentScreenshotUrl}
                                            alt="Payment Screenshot Preview"
                                            className="max-w-full max-h-full transform transition-transform duration-300 hover:scale-125 cursor-zoom-in"
                                        />
                                    </div>
                                </div>
                            )}


                            <div className="space-y-3 bg-gray-50 px-4 py-6 rounded-lg mb-5 border border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 text-sm md:text-base">Price</span>
                                    <span className="text-gray-900 font-normal text-sm md:text-base">{getCurrencySymbol(order.productSnapshot.currency)} {order.variantSnapshot.price}</span>
                                </div>
                                {order.productSnapshot.currency === "USD" && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700 text-sm md:text-base">Price in HTG</span>
                                        <span className="text-gray-900 font-normal text-sm md:text-base">G {(order.totalAmount || 0).toFixed(0)}</span>
                                    </div>
                                )}
                                <div className="border-t border-dashed border-gray-300 my-4"></div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-semibold text-base md:text-lg text-gray-900">Total amount paid</span>
                                    <span className="font-semibold text-base md:text-lg text-gray-900">G {order.totalAmount?.toFixed(0) || 0}</span>
                                </div>

                                <div className="flex justify-between items-start pt-4 border-t border-gray-200">
                                    <span className="text-gray-700 text-sm md:text-base">Payment method</span>
                                    <span className="text-gray-900 font-normal text-sm md:text-base text-right capitalize">
                                        {order.paymentMethod}
                                    </span>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
            <AdminOrderCancelReasonModal
                open={showReasonModal}
                onClose={() => setShowReasonModal(false)}
                onConfirm={handleCancelConfirm}
                loading={orderCancelLoader}
            />

            
        </div>
    );
};

export default CompleteOrder;