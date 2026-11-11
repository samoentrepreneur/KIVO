import { CreditCard, Gamepad2, Gift, Package, Smartphone } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUserAuth } from "../../context/user.authContext";

// Loading Skeleton Component
const CartItemSkeleton = () => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Image skeleton */}
                <div className="w-full lg:w-80 h-64 bg-gray-200 rounded flex-shrink-0"></div>

                {/* Content skeleton */}
                <div className="flex-1 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="space-y-2 mt-6">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            </div>

            {/* Buttons skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
};

const Cart = () => {
    const { cart, loading, updateCart } = useCart();
    document.title = "My Cart"
    const navigate = useNavigate();
    const [removingItem, setRemovingItem] = useState(null);

    const {fetchMe}=useUserAuth()

    // Format date as "15 Dec 2025"
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: "numeric", month: "short", year: "numeric" };
        return date.toLocaleDateString("en-GB", options);
    };
    const getCategoryIcon = (cart) => {
        const category = cart.category?.toLowerCase();
        if (category === 'mobilegames') return <Gamepad2 className="w-6 h-6" />;
        if (category === 'giftcard') return <Gift className="w-6 h-6" />;
        if (category === 'cards' || category === 'paymentcards') return <CreditCard className="w-6 h-6" />;
        if (category === 'mobiletopup') return <Smartphone className="w-6 h-6" />;
        return <Package className="w-6 h-6" />;
    };

    const slugify = (text) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const checkout = (item) => {
        if (!item?._id) return console.log("ID not found");

        const slug = slugify(item.productSnapshot.service);
        navigate(`/checkout/${slug}-${item.productSnapshot._id}`);
    };


    const removeFromCart = async (productId, variantIndex) => {
        const key = `${productId}-${variantIndex}`;

        try {
            setRemovingItem(key);

            const res = await api.post("user/order/toggle-cart", {
                productId,
                variantIndex,
            });

            updateCart(res.data.cart);

            if (res.data.removed) toast.success("Removed from cart");

            await fetchMe();
        } catch (err) {
            toast.error("Failed to update cart");
        } finally {
            setRemovingItem(null);
        }
    };


    // Show loading skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <CartItemSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Empty cart state
    if (!Array.isArray(cart) || cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg  p-12 text-center">
                        <svg
                            className="mx-auto h-16 w-16 text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                            />
                        </svg>
                        <p className="text-gray-600 text-lg">Your cart is empty</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                    Shopping Cart
                </h2>

                <div className="space-y-6">
                    {cart.map((item) => {
                        const {
                            _id,
                            productSnapshot,
                            variantSnapshot,
                            quantity,
                            addedAt,
                            productId,
                            variantIndex
                        } = item;
                     

                        const subtotal = variantSnapshot.price * quantity;
                        const currency = productSnapshot.currency || "HTG";
                        const itemKey = `${productId}-${variantIndex}`;

                        // Get stock status (you can modify this based on your data structure)
                        const stockStatus = variantSnapshot.stock || productSnapshot.stock || "In Stock";
                        const isInStock = stockStatus !== "Out of Stock";

                        return (
                            <div
                                key={_id}
                                className="bg-white rounded-lg p-6"
                            >
                                {/* Main Content */}
                                <div className="flex flex-col sm:flex-row gap-6">
                                    {/* Image */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={productSnapshot.image}
                                            alt={productSnapshot.service}
                                            className="w-full lg:w-60 h-44 object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col">
                                        {/* Category Badge */}
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                {getCategoryIcon(productSnapshot)}
                                                <span>{productSnapshot.category}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(addedAt)}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {productSnapshot.service}
                                            </h3>
                                            <div className="mb-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${isInStock
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-red-50 text-red-700"
                                                        }`}
                                                >
                                                    <span
                                                        className={`w-2 h-2 rounded-full ${isInStock
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                            }`}
                                                    ></span>
                                                    {stockStatus}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm line-camp-2">{productSnapshot.desc}</p>

                                        {/* Description */}
                                        <div className="text-sm text-gray-600">
                                            {variantSnapshot.unitLabel && (
                                                <p className="mt-2">
                                                    <span className="font-medium">Amount:</span>{" "}
                                                    {variantSnapshot.unitValue}{" "}
                                                    {variantSnapshot.unitLabel}
                                                </p>
                                            )}
                                           
                                            <p>
                                                <span className="font-medium">Quantity:</span>{" "}
                                                {quantity}
                                            </p>

                                        </div>



                                        {/* Price */}
                                        <div className="flex flex-row flex-wrap items-center justify-start gap-3">
                                            <p className="text-sm text-gray-600">
                                                Total amount
                                            </p>
                                            <p className="text-md font-bold text-gray-900">
                                                {subtotal.toLocaleString()} {currency}
                                            </p>
                                            {variantSnapshot?.planName && (
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                                                    {variantSnapshot.planName}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <button
                                        onClick={() => removeFromCart(productId, variantIndex)}
                                        disabled={removingItem === itemKey}
                                        className="w-full py-3 px-6 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {removingItem === itemKey ? "Removing..." : "Remove"}
                                    </button>


                                    <button
                                        onClick={() => checkout(item)}
                                        disabled={!isInStock}
                                        className={`w-full py-3 px-6 font-medium rounded-lg transition-colors duration-200 ${isInStock
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            }`}
                                    >
                                        {isInStock ? "Check Out" : "Out of Stock"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Cart;