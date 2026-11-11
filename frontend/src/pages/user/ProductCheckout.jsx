

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, AlertCircle, Package, CreditCard, Gamepad2, Gift, Smartphone, Check, Upload, X, MonitorPlay, XCircle } from 'lucide-react';
import { useUserAuth } from '../../context/user.authContext';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import useClickOutside from '../../hooks/useOutsideClick';
import MoncashQr from '../../assets/QR/moncash-qr.jpeg'
import NatcashQr from '../../assets/QR/natcash-qr.jpeg'
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';


export default function ProductCheckout() {
    const [currentStep, setCurrentStep] = useState(1);
    const { slugAndId } = useParams();
    const id = slugAndId.split("-").pop();
    const [product, setProduct] = useState({});
    const { user, fetchMe } = useUserAuth();
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [showVariants, setShowVariants] = useState(false);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const variantRef = useRef();
    const [isPlacingOrder, setIsPlaceingOrder] = useState(false);
    const [orderPlacedSuccessMessage, setOrderPlacedSuccessMessage] = useState(false);
    const navigate = useNavigate();
    const { updateCart } = useCart();

    const [htgPrice, setHtgPrice] = useState(null);
    const [loadingRate, setLoadingRate] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState(false);

    useEffect(() => {
        async function convertPrice() {
            if (!selectedVariant) return;
            if (product.currency === "HTG") {
                setHtgPrice(selectedVariant.price);
                return;
            }
            setHtgPrice(selectedVariant.price * 145);
            
            // setLoadingRate(true);
            // try {
            //     const res = await api.get("/utils/usd-to-htg-rate");
            //     const rate = res.data.rate;
            //     setHtgPrice(selectedVariant.price * rate);
            // } catch (err) {
            //     console.error("Conversion failed:", err.message);
            //     setHtgPrice(selectedVariant.price * 135);
            // }
            // finally {

            //     setLoadingRate(false);
            // }
        }

        convertPrice();

    }, [product.currency, selectedVariant]);


    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const res = await api.get(`/user/products/product-details/${id}`)
                // console.log(res)
                if (res.data.success) {
                    
                    setProduct(res.data.product);
                    document.title = res.data.product.service + "-Checkout";
                }
             

            } catch (error) {
                // console.log(error)
                setErrorMessage(true);
            }
            finally {
                setLoading(false)
            }

        }
        if (!id) return;
        fetchProductDetails();
    }, [id])


    const [formData, setFormData] = useState({
        // User Default Info
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        email: user?.email || '',
        receiveEmails: true,
        orderNotes: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        paypalEmail: '',
        gameId: '',
        gameUsername: '',
        recipientEmail: '',
        mobileNumber: '',
        streamEmail: '',
        streamUsername: '',
        streamPassword: '',
        region: '',
        paymentMethod: 'moncash',
        paymentPhone: '',
        transactionId: '',
        screenshot: null,
        meruCardId: '',
        wiseEmailOrId:'',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (product?.variants?.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, screenshot: 'File size must be less than 5MB' }));
                return;
            }
            setFormData(prev => ({ ...prev, screenshot: file }));
            setScreenshotPreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, screenshot: '' }));
        }
    };

    const removeScreenshot = () => {
        setFormData(prev => ({ ...prev, screenshot: null }));
        setScreenshotPreview(null);
    };
    const formatCardNumber = (value) => {
        return value
            .replace(/\D/g, "")          // remove non-digits
            .replace(/(.{4})/g, "$1 ")   // add space every 4 digits
            .trim();
    };

    const formatExpiry = (value) => {
        let cleaned = value.replace(/\D/g, "").slice(0, 4);

        if (cleaned.length >= 3) {
            cleaned = cleaned.replace(/(\d{2})(\d{1,2})/, "$1/$2");
        }

        return cleaned;
    };

    const formatCVV = (value) => {
        return value.replace(/\D/g, "").slice(0, 4); // Allows max 4 digits
    };

    const validateWiseIdentifier = (value) => {
        if (!value) return "Wise email or Wise ID is required";

        const input = value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const wiseIdRegex = /^[a-zA-Z0-9_-]{6,32}$/;

        if (!emailRegex.test(input) && !wiseIdRegex.test(input)) {
            return "Enter a valid Wise email or Wise ID";
        }

        return null; 
    };

    
 const validateMeruCardId = (value) => {
        if (!value) return "MeruCard number is required";
        const input = value.trim();
        if (!/^\d{8,16}$/.test(input)) {
            return "Enter a valid MeruCard number or Id";
        }
        return null;
    };



    const validateStep1 = () => {
        if (!selectedVariant || selectedVariant.stock === 0) {
            alert('Please select an available variant');
            return false;
        }
        if (!user) {
            navigate("/auth/login");
            return
        }
        return true;
    };
    const validateStep2 = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }

        const category = product?.category?.toLowerCase();
        const productText = `${product?.name || ""} ${product?.service || ""}`.toLowerCase();

        const isPaypalTopup = productText.includes("paypal");
        const isWiseCardTopUp = productText.includes("wise");
        const isMeruCardTopUp = productText.includes("meru");

        if (category === "cards" || category === "paymentcards") {

            if (isPaypalTopup) {
                if (!formData.paypalEmail?.trim()) {
                    newErrors.paypalEmail = "PayPal email is required";
                } else if (!/\S+@\S+\.\S+/.test(formData.paypalEmail)) {
                    newErrors.paypalEmail = "Enter a valid PayPal email";
                }
            }

            else if (isWiseCardTopUp) {
                const wiseError = validateWiseIdentifier(formData.wiseEmailOrId);

                if (wiseError) {
                    newErrors.wiseEmailOrId = wiseError;
                }
            }

            else if (isMeruCardTopUp) {
                const meruError = validateMeruCardId(formData.meruCardId);
                if (meruError) {
                    newErrors.meruCardId = meruError;
                }
            }

            else {
                const cardNumber = formatCardNumber(formData.cardNumber).replace(/\s+/g, "");
                const expiry = formatExpiry(formData.expiryDate);
                const cvv = formatCVV(formData.cvv);

                if (!/^\d{13,19}$/.test(cardNumber)) {
                    newErrors.cardNumber = "Invalid card number";
                }

                if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
                    newErrors.expiryDate = "Invalid expiry format (MM/YY)";
                }

                if (!/^\d{3,4}$/.test(cvv)) {
                    newErrors.cvv = "Invalid CVV";
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        const newErrors = {};
        const haitianPhoneRegex = /^(?:\+509|509)?[34]\d{7}$/;
        if (!formData.paymentPhone.trim()) {
            newErrors.paymentPhone = "Payment phone is required";
        } else if (!haitianPhoneRegex.test(formData.paymentPhone.trim())) {
            newErrors.paymentPhone = "Invalid Haitian phone number format";
        }

        const moncashTxnRegex = /^[A-Za-z0-9\-]{6,20}$/;
        const natcashTxnRegex = /^\d{6,12}$/;

        if (!formData.transactionId.trim()) {
            newErrors.transactionId = "Transaction ID is required";
        } else if (
            !moncashTxnRegex.test(formData.transactionId.trim()) &&
            !natcashTxnRegex.test(formData.transactionId.trim())
        ) {
            newErrors.transactionId =
                "Invalid Transaction ID format (Must be MonCash or NatCash)";
        }
        if (!formData.screenshot) newErrors.screenshot = 'Payment screenshot is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
            window.scrollTo(0, 0);
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const showSuccessMessage = () => {
        setOrderPlacedSuccessMessage(true);

        const timer = setTimeout(() => {
            setOrderPlacedSuccessMessage(false);
            navigate("/")

        }, 3000);

        return () => clearTimeout(timer);
    };

    const handlePlaceOrder = async () => {
        if (!validateStep3()) return;
        setIsPlaceingOrder(true)
        const fd = new FormData();

        // Append all form fields
        Object.keys(formData).forEach(key => {
            if (key !== "screenshot") {
                fd.append(key, formData[key]);
            }
        });

        fd.append("product", JSON.stringify(product));
        fd.append("variant", JSON.stringify(selectedVariant));
        fd.append("totalAmount", (htgPrice ?? 0).toFixed(2));

        if (formData.screenshot) {
            fd.append("screenshot", formData.screenshot);
        }

        try {
            const res = await api.post("user/order/create", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                showSuccessMessage();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
        finally {
            setIsPlaceingOrder(false);
            setFormData([{}]);
        }
    };


    const getCategoryIcon = () => {
        const category = product.category?.toLowerCase();
        if (category === 'mobilegames') return <Gamepad2 className="w-6 h-6" />;
        if (category === 'giftcard') return <Gift className="w-6 h-6" />;
        if (category === 'cards' || category === 'paymentcards') return <CreditCard className="w-6 h-6" />;
        if (category === 'mobiletopup') return <Smartphone className="w-6 h-6" />;
        return <Package className="w-6 h-6" />;
    };

    const renderCategoryForm = () => {
        const category = product.category?.toLowerCase();
        const subCategory = product?.service?.toLowerCase();
        const name = product?.name?.toLowerCase();

        const isPaypalTopup =
            (subCategory && subCategory.includes("paypal")) ||
            (name && name.includes("paypal")) ||
            product?.type === "paypal";
        
        const isWiseCardTopUp = (subCategory && subCategory.includes("wise")) ||
            (name && name.includes("wise")) ||
            product?.type === "wise";

        const isMeruCardTopUp = (subCategory && subCategory.includes("meru")) ||
            (name && name.includes("meru")) ||
            product?.type === "meru";

        if (category === "cards" || category === "paymentcards") {
            if (isPaypalTopup) {
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            PayPal Top-Up Details
                        </h3>

                        <div>
                            <label className="block text-sm font-medium mb-1">PayPal Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                name="paypalEmail"
                                value={formData.paypalEmail}
                                onChange={handleInputChange}
                                placeholder="example@gmail.com"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.paypalEmail ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.paypalEmail && <p className="text-red-500 text-xs mt-1">{errors.paypalEmail}</p>}
                        </div>
                    </div>
                );
            }
            if (isWiseCardTopUp) {
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Wise Card Details
                        </h3>

                        <div>
                            <label className="block text-sm font-medium mb-1">Wise Email or ID <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                name="wiseEmailOrId"
                                value={formData.wiseEmailOrId}
                                onChange={handleInputChange}
                                placeholder="Wise Id or email"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.wiseEmailOrId ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.wiseEmailOrId && <p className="text-red-500 text-xs mt-1">{errors.wiseEmailOrId}</p>}
                        </div>
                    </div>
                );
            }
            if (isMeruCardTopUp) {
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Meru Card Details
                        </h3>

                        <div>
                            <label className="block text-sm font-medium mb-1">Meru ID <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="meruCardId"
                                value={formData.meruCardId}
                                onChange={handleInputChange}
                                placeholder="Meru Id"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.meruCardId ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.meruCardId && <p className="text-red-500 text-xs mt-1">{errors.meruCardId}</p>}
                        </div>
                    </div>
                );
            }

            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Card Details
                    </h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">Card Number <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Expiry Date <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">CVV <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                                maxLength="3"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                        </div>
                    </div>
                </div>
            );
        }

        if (category === 'mobilegames') {
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5" />
                        Game Account Details
                    </h3>
                    <div>
                        <label className="block text-sm font-medium mb-1">Game ID <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="gameId"
                            value={formData.gameId}
                            onChange={handleInputChange}
                            placeholder="Enter your game ID"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.gameId ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.gameId && <p className="text-red-500 text-xs mt-1">{errors.gameId}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Game Username <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="gameUsername"
                            value={formData.gameUsername}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.gameUsername ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.gameUsername && <p className="text-red-500 text-xs mt-1">{errors.gameUsername}</p>}
                    </div>
                </div>
            );
        }

        if (category === 'giftcard') {
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Gift className="w-5 h-5" />
                        Gift Card Details
                    </h3>
                    <div>
                        <label className="block text-sm font-medium mb-1">Recipient Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            name="recipientEmail"
                            value={formData.recipientEmail}
                            onChange={handleInputChange}
                            placeholder="recipient@example.com"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.recipientEmail ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.recipientEmail && <p className="text-red-500 text-xs mt-1">{errors.recipientEmail}</p>}
                    </div>
                </div>
            );
        }

        if (category === 'mobiletopup') {
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        Mobile Top-Up Details
                    </h3>
                    <div>
                        <label className="block text-sm font-medium mb-1">Mobile Number <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                            placeholder="+509XXXXXXXX"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
                    </div>
                </div>
            );
        }
        if (category === "streaming") {
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MonitorPlay className="w-5 h-5" />
                        Streaming Account Details
                    </h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Account Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="streamEmail"
                            value={formData.streamEmail}
                            onChange={handleInputChange}
                            placeholder="youraccount@email.com"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.streamEmail ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.streamEmail && (
                            <p className="text-red-500 text-xs mt-1">{errors.streamEmail}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Username (optional)
                        </label>
                        <input
                            type="text"
                            name="streamUsername"
                            value={formData.streamUsername}
                            onChange={handleInputChange}
                            placeholder="username if required"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none border-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Country/Region (optional)
                        </label>
                        <input
                            type="text"
                            name="region"
                            value={formData.region}
                            onChange={handleInputChange}
                            placeholder="Example: US, Haiti"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none border-gray-300"
                        />
                    </div>
                </div>
            );
        }


        return null;
    };

    useEffect(() => {
        setTimeout(() => setMounted(true), 50);
    }, []);

    useEffect(() => {
        if (!user || !user.cart) return;

        const isPresentInCart = user.cart.some(
            c =>
                c.productId?.toString() === id &&
                c.variantIndex === selectedVariantIndex
        );

        setIsInCart(isPresentInCart);
    }, [user, id, selectedVariantIndex]);


    const handleAddToCart = async () => {
        if (!user) {
            navigate("/auth/login");
            return
        }

        try {
            setIsAddingToCart(true);

            const res = await api.post("user/order/toggle-cart", {
                productId: product._id,
                variantIndex: selectedVariantIndex,
            });
            updateCart(res.data.cart);
            if (res.data.added) toast.success("Added to cart");
            if (res.data.removed) toast("Removed from cart");
            await fetchMe();

        } catch (err) {
            toast.error("Failed to update cart");
        } finally {
            setIsAddingToCart(false);
        }
    };



    const progressPercent = mounted
        ? `${((currentStep - 1) / (3 - 1)) * 100}%`
        : "0%";

    useClickOutside(variantRef, () => setShowVariants(!showVariants));

    const getCurrencySymbol = (currency) => {
        return currency === "HTG" ? "G" : "$";
    }
    if (loading) {
        return (
            <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-8 lg:px-8 py-12">
                {/* Product Details Skeleton */}
                <div className="w-full h-12 bg-gray-300 rounded-lg animate-pulse mb-6 "></div>


                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                    <div className="md:flex">
                        <div className="md:w-1/3 bg-gray-300 animate-pulse h-44 md:h-76"></div>
                        <div className="md:w-2/3 p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                                <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                            <div className="w-3/4 h-8 bg-gray-300 rounded animate-pulse"></div>
                            <div className="space-y-2">
                                <div className="w-full h-4 bg-gray-300 rounded animate-pulse"></div>
                                <div className="w-full h-4 bg-gray-300 rounded animate-pulse"></div>
                                <div className="w-2/3 h-4 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                            <div className="pt-4">
                                <div className="w-24 h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                                <div className="w-full md:w-96 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Form Skeleton */}
                <div className="w-full h-12 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-6 rounded-lg  text-center">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
                    <p className="text-gray-700">Failed to load product details. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {orderPlacedSuccessMessage && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white animate-fadeIn">

                    <svg
                        className="w-24 h-24 text-green-500 animate-bounce border-5 rounded-full"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>

                    <h2 className="mt-6 text-xl md:text-3xl font-bold text-gray-800 text-center">
                        Order Placed Successfully 🎉
                    </h2>
                    <p className='text-gray-500 mt-2'>Delivery may take 5 minutes to 24 hours, depending on product availability and verification.</p>

                    <p className="text-gray-500 mt-2">
                        Redirecting to homepage in 3 seconds...
                    </p>

                </div>
            )}

            {isPlacingOrder && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
                <div className="bg-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                    <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                    <p className="text-lg">Placing your order...</p>
                </div>
            </div>}

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative w-full mb-6">
                        <div className="relative w-full h-1 bg-gray-300 rounded-full">
                            <div
                                className="h-1 bg-blue-600 rounded-full transition-[width] duration-500 ease-out"
                                style={{ width: progressPercent }}
                            ></div>
                        </div>
                        <div className="relative z-10 flex justify-between mt-[-18px]">
                            {[1, 2, 3].map((step) => (
                                <div key={step} onClick={() => setCurrentStep(step)}
                                    className="cursor-pointer flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-sm ${currentStep >= step ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"}
            `} >{currentStep > step ? <Check className="w-4 h-4" /> : step}
                                    </div>
                                    <span
                                        className={`mt-2 text-[11px] sm:text-xs text-center ${currentStep >= step ? "text-blue-600 font-medium" : "text-gray-500"
                                            }`}
                                    >
                                        {step === 1
                                            ? "Select Amount"
                                            : step === 2
                                                ? "Billing Details"
                                                : "Payment Done"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>


                    {currentStep === 1 && (
                        <>
                            <div className="bg-white rounded-lg border border-gray-200  mb-6">
                                <div className="md:flex">
                                    <div className="md:w-1/3 bg-gray-100 overflow-hidden rounded-lg">
                                        <img
                                            src={product.image}
                                            alt={product.service}
                                            className="w-full h-64 md:h-full object-cover"
                                        />
                                    </div>
                                    <div className="md:w-2/3 p-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                            {getCategoryIcon()}
                                            <span>{product.category}</span>
                                        </div>
                                        <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.service}</h1>
                                        <p className="text-gray-600 mb-4">{product.description}</p>

                                        {/* Variant Selector */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium mb-2">Select Amount</label>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowVariants(!showVariants)}
                                                    className="w-full cursor-pointer md:w-96 px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-between bg-white hover:border-blue-500 transition"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {/* Price */}
                                                        <span className="font-semibold text-lg">
                                                            {getCurrencySymbol(product.currency)} {selectedVariant?.price || 0}
                                                        </span>

                                                        {/* Unit-based (Games / TopUp) */}
                                                        {selectedVariant?.unitValue && selectedVariant?.unitLabel && (
                                                            <span className="text-sm text-gray-500">
                                                                ({selectedVariant.unitValue} {selectedVariant.unitLabel})
                                                            </span>
                                                        )}

                                                        {/* Plan-based (Games & Streaming) */}
                                                        {selectedVariant?.planName && (
                                                            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                                                                {selectedVariant.planName}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <ChevronDown className={`w-5 h-5 transition-transform ${showVariants ? 'rotate-180' : ''}`} />
                                                </button>
                                                <div className="mt-3">
                                                    {loadingRate ? (
                                                        <p className="text-gray-500">Converting...</p>
                                                    ) : (
                                                        <p className="text-sm font-medium text-gray-500">Total amount {(htgPrice ?? 0).toFixed(2)} gourdes</p>
                                                    )}
                                                </div>

                                                {showVariants && (
                                                    <div ref={variantRef} className="absolute z-10 w-full md:w-96 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                        {product.variants.map((variant, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => { setSelectedVariant(variant); setShowVariants(false); setSelectedVariantIndex(index) }}
                                                                disabled={variant.stock === 0}
                                                                className={`w-full  w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'
                                                                    } ${selectedVariant === variant ? 'bg-blue-50' : ''}`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        {/* Price */}
                                                                        <div className="font-semibold">
                                                                            {getCurrencySymbol(product.currency)} {variant.price}
                                                                        </div>

                                                                        {/* Unit-based (Games, TopUp) */}
                                                                        {variant.unitValue && variant.unitLabel && (
                                                                            <div className="text-sm text-gray-500">
                                                                                {variant.unitValue} {variant.unitLabel}
                                                                            </div>
                                                                        )}

                                                                        {/* Plan-based (Games & Streaming) */}
                                                                        {variant.planName && (
                                                                            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                                                                                {variant.planName}
                                                                            </span>
                                                                        )}

                                                                    </div>

                                                                    {variant.stock === 0 ? (
                                                                        <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                                                                    ) : (
                                                                        <span className="text-xs text-green-600">{variant.stock} available</span>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {selectedVariant?.stock === 0 && (
                                                <div className="w-fit mt-3 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                                                    <AlertCircle className="w-5 h-5" />
                                                    <span className="text-sm font-medium">This variant is currently out of stock</span>
                                                </div>
                                            )}
                                            {!product.variants?.length && (
                                                <div className="w-fit mt-3 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                                                    <AlertCircle className="w-5 h-5" />
                                                    <span className="text-sm font-medium">This product is currently out of stock</span>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className="flex gap-3 mt-12">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                    className="cursor-pointer flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                                >
                                    {isAddingToCart
                                        ? (isInCart ? "Removing..." : "Adding...")
                                        : (isInCart ? "Remove from cart" : "Add to cart")}
                                </button>


                                <button
                                    onClick={handleNext}
                                    disabled={!selectedVariant || selectedVariant.stock === 0|| !product.variants.length}
                                    className={`cursor-pointer flex-1 w-full py-3 rounded-lg font-semibold transition ${selectedVariant && selectedVariant.stock > 0
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Continue
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 2: Billing Details */}
                    {currentStep === 2 && (
                        <>
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-6">Billing Details</h2>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Phone <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled
                                            className={`w-full px-4 py-2 border bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    <label className="flex items-start gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="receiveEmails"
                                            checked={formData.receiveEmails}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                        />
                                        <span className="text-sm text-gray-700">Receive exclusive emails with discounts</span>
                                    </label>
                                </div>

                                {renderCategoryForm()}

                                <div className="mt-6">
                                    <label className="block text-sm font-medium mb-1">Order Notes (Optional)</label>
                                    <textarea
                                        name="orderNotes"
                                        value={formData.orderNotes}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Special notes about your order"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    />
                                </div>


                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleBack}
                                    className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                                >
                                    Continue
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 3: Payment */}
                    {currentStep === 3 && (
                        <div className="space-y-6">

                            {/* Order Summary */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">

                                    {/* Original USD or HTG price */}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{product.service}</span>
                                        <span className="font-medium">
                                            {getCurrencySymbol(product.currency)} {selectedVariant?.price}
                                        </span>
                                    </div>

                                    {/* Show converted HTG ONLY if original is USD */}
                                    {product.currency === "USD" && (
                                        <div className="flex justify-between text-sm text-blue-600 mt-3 ">
                                            <span>Price in HTG</span>
                                            <div className="">
                                                {loadingRate ? (
                                                    <p className="text-gray-500">Converting...</p>
                                                ) : (
                                                    <p className="text-sm font-medium ">G {(htgPrice ?? 0).toFixed(2)}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Optional: Show unit */}
                                    {selectedVariant.unitValue && selectedVariant.unitLabel && (
                                        <div className="text-sm text-gray-500">
                                            {selectedVariant.unitValue} {selectedVariant.unitLabel}
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>
                                        {getCurrencySymbol(product.currency)} {selectedVariant?.price}
                                    </span>
                                </div>
                                {product.currency === "USD" && (

                                    <div className="flex justify-between text-sm font-medium text-blue-600 mt-3">
                                        <span>Total amount in gourde</span>
                                        <div className="">
                                            {loadingRate ? (
                                                <p className="text-gray-500">Converting...</p>
                                            ) : (
                                                <p className="text-sm font-medium">G {(htgPrice ?? 0).toFixed(2)}</p>
                                            )}
                                        </div>
                                    </div>
                                )}


                            </div>



                            {/* Payment Method */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                                <div className="space-y-3 mb-6">
                                    {["moncash", "natcash"].map(method => (
                                        <label key={method} className={`flex items-center gap-3 p-3 border-1  rounded-lg cursor-pointer transition 
                        ${formData.paymentMethod === method ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-300"}`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method}
                                                checked={formData.paymentMethod === method}
                                                onChange={handleInputChange}
                                                className="w-5 h-5"
                                            />
                                            <span className="font-semibold capitalize">{method} Payment</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Payment Instructions */}
                                {formData.paymentMethod && (
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <p className="text-sm text-gray-700 mb-4">
                                            Please complete your payment using <strong className="capitalize">{formData.paymentMethod}</strong>.
                                            You may pay using the <strong>QR Code</strong> or follow the manual steps below.
                                            <span className="block mt-1 text-blue-600 font-semibold">
                                                A payment screenshot is required for verification.
                                            </span>
                                        </p>

                                        {/* QR Section */}
                                        <div className="bg-white p-4 rounded-lg mb-4">
                                            <h4 className="font-semibold mb-3 text-center">Scan QR Code to Pay</h4>
                                            <div className="flex flex-col items-center">
                                                <div className="w-60 h-60 bg-gray-200 border border-gray-200 overflow-hidden rounded-lg mb-3 flex items-center justify-center">

                                                    {
                                                        formData.paymentMethod === "moncash" ?
                                                            (
                                                                <img src={MoncashQr} className='w-full h-full' />

                                                            )
                                                            : (
                                                                <img src={NatcashQr} className='w-full h-full' />
                                                            )
                                                    }
                                                </div>
                                                <p className="text-sm text-gray-600 text-center">
                                                    Scan using your camera or the payment app to complete the transaction.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Manual Instructions */}
                                        <div>
                                            <p className="font-semibold mb-2">OR Manual Payment Steps:</p>
                                            {formData.paymentMethod === "moncash" && (
                                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                                    <li>Dial *202#</li>
                                                    <li>Select "Send Money"</li>
                                                    <li>Enter merchant number: <strong>+(509) 31 14 8147</strong></li>
                                                    <li>Enter: <strong>G {Math.round(htgPrice || 0)}</strong></li>
                                                    <li>Confirm and save your Transaction ID</li>
                                                </ol>
                                            )}

                                            {formData.paymentMethod === "natcash" && (
                                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                                    <li>Open NatCash app or dial *505#</li>
                                                    <li>Select "Send Money"</li>
                                                    <li>Enter merchant number: <strong>+(509) 41 16 5493</strong></li>
                                                    <li>Enter: <strong>G {Math.round(htgPrice || 0)}</strong></li>
                                                    <li>Confirm and save your Transaction ID</li>
                                                </ol>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Payment Details Form */}
                                <div className="space-y-4">
                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Your Phone Number <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="paymentPhone"
                                            value={formData.paymentPhone}
                                            onChange={handleInputChange}
                                            placeholder="+509XXXXXXXX"
                                            className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 
                        ${errors.paymentPhone ? "border-red-500" : "border-gray-300"}`}
                                        />
                                        {errors.paymentPhone && <p className="text-red-500 text-xs">{errors.paymentPhone}</p>}
                                    </div>

                                    {/* Transaction ID */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Transaction ID <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="transactionId"
                                            value={formData.transactionId}
                                            onChange={handleInputChange}
                                            placeholder="Enter transaction ID"
                                            className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 
                        ${errors.transactionId ? "border-red-500" : "border-gray-300"}`}
                                        />
                                        {errors.transactionId && <p className="text-red-500 text-xs">{errors.transactionId}</p>}
                                    </div>

                                    {/* Screenshot Upload */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Payment Screenshot <span className="text-red-500">*</span></label>

                                        {!screenshotPreview ? (
                                            <label className={`block w-full p-6 flex flex-col items-center border-2 border-dashed rounded-lg cursor-pointer text-center 
                            hover:border-blue-400 transition ${errors.screenshot ? "border-red-500" : "border-gray-300"}`}
                                            >
                                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                                <Upload className="w-8 h-8 text-gray-400 mb-2 text-center" />
                                                <span className="text-sm text-gray-600">Click to upload proof</span>
                                                <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                                            </label>
                                        ) : (
                                            <div className="relative">
                                                <img src={screenshotPreview} className="w-full h-48 object-contain rounded-lg" />
                                                <button onClick={removeScreenshot}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        {errors.screenshot && <p className="text-red-500 text-xs">{errors.screenshot}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button className="flex-1 py-3 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition" onClick={handleBack}>Back</button>
                                <button disabled={isPlacingOrder} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700" onClick={handlePlaceOrder}>{isPlacingOrder ? "Placing order..." : "Place Order"}</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>

    );
}