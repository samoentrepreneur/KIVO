import React, { useState, useMemo } from "react";
import {
    Upload, X, Plus, Trash2, Gift, Gamepad2, Tv, CreditCard,
    Smartphone, Apple, PlayCircle, ShoppingBag, Zap, MonitorPlay,
    Film, Music, Wallet, DollarSign, Phone, CheckCircle, AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api";



const CATEGORIES = {
    GiftCard: {
        label: "Gift Cards",
        icon: Gift,
        services: [
            "Apple Gift Card",
            "Netflix Gift Card",
            "Amazon Gift Card",
            "Xbox Gift Card",
            "Play store Gift Card",
            "Steam Gift Card"
        ]
    },
    MobileGames: {
        label: "Mobile Games",
        icon: Gamepad2,
        services: [
            "Garena Free Fire",
            "Call of Duty",
            "Blood Strike",
            "PUBG Mobile",
            "Roblox",
            "Minecraft"
        ]
    },
    Streaming: {
        label: "Streaming",
        icon: Tv,
        services: ["Netflix", "Prime Video", "Crunchyroll", "Disney+", "Spotify"]
    },
    Cards: {
        label: "Payment Cards",
        icon: CreditCard,
        services: [
            "Visa Prepaid Card",
            "Wise Card",
            "PayPal Top-Up",
            "Binance Top-Up",
            "Meru Card"
        ]
    },
    MobileTopUp: {
        label: "Mobile Top-Up",
        icon: Smartphone,
        services: ["Digicel", "Natcom", "E Number", "T mobile"]
    }
};

const PRICE_TYPES = {
    UNIT: "unit",
    PLAN: "plan"
};


const SERVICE_ICONS = {
    "Apple Gift Card": Apple,
    "Netflix Gift Card": MonitorPlay,
    "Amazon Gift Card": ShoppingBag,
    "Xbox Gift Card": Gamepad2,
    "Play store Gift Card": Smartphone, 
    "Steam Gift Card": Gamepad2,

    "Garena Free Fire": Zap,
    "Call of Duty": Gamepad2,
    "Blood Strike": Gamepad2,
    "PUBG Mobile": Gamepad2,
    "Roblox": Gamepad2,
    "Minecraft": Gamepad2,

    "Netflix": Film,
    "Prime Video": PlayCircle,
    "Crunchyroll": MonitorPlay,
    "Disney+": Film,
    "Spotify": Music,

    "Visa Prepaid Card": CreditCard,
    "Wise Card": Wallet,
    "PayPal Top-Up": DollarSign,
    "Binance Top-Up": DollarSign,
    "Meru Card": Wallet,

    "Digicel": Phone,
    "Natcom": Phone,
    "E Number": Phone,
    "T mobile": Smartphone
};


const CURRENCY_LABELS = {
    "Garena Free Fire": "Diamond Packages",
    "Call of Duty": "CP Packages",
    "Blood Strike": "Coin Packages",
    "PUBG Mobile": "UC Packages",
    "Roblox": "Robux Packages",
    "Minecraft": "Minecoin Packages",
};
const GAME_UNITS = {
    "Garena Free Fire": "Diamonds",
    "Call of Duty": "CP",
    "Blood Strike": "Coins",
    "PUBG Mobile": "UC",
    "Roblox": "Robux",
    "Minecraft": "Minecoins"
};

const CURRENCIES = {
    USD: { symbol: "$", label: "US Dollar (USD)" },
    HTG: { symbol: "G", label: "Haitian Gourde (HTG)" }
};

const SERVICE_RULES = {
    // Games
    "Garena Free Fire": { type: "game", unitLabel: "Diamonds", allowPlans: true },
    "PUBG Mobile": { type: "game", unitLabel: "UC", allowPlans: true },
    "Call of Duty": { type: "game", unitLabel: "CP", allowPlans: true },
    "Blood Strike": { type: "game", unitLabel: "Coins", allowPlans: true },
    "Roblox": { type: "game", unitLabel: "Robux", allowPlans: false },
    "Minecraft": { type: "game", unitLabel: "Minecoins", allowPlans: false },

    // Streaming
    "Netflix": { type: "plan-only" },
    "Prime Video": { type: "plan-only" },
    "Spotify": { type: "plan-only" },
    "Disney+": { type: "plan-only" },
    "Crunchyroll": { type: "plan-only" },

    // Cards
    "Apple Gift Card": { type: "value-only" },
    "Amazon Gift Card": { type: "value-only" },
    "Visa Prepaid Card": { type: "value-only" },
    "PayPal Top-Up": { type: "value-only" },

    // Mobile TopUp (Haiti)
    "Digicel": { type: "topup" },
    "Natcom": { type: "topup" },
    "E Number": { type: "topup" },
    "T mobile": { type: "topup" }
};


const FormField = ({ label, children, required, error }) => (
    <div className="w-full">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle size={14} />
                <span>{error}</span>
            </div>
        )}
    </div>
);

const SuccessModal = ({ isOpen, onClose, productCount }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
                    <p className="text-gray-600 mb-6">
                        {productCount} {productCount === 1 ? 'product has' : 'products have'} been added successfully.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};



export default function AddProduct() {
    const [products, setProducts] = useState([]);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        category: "",
        service: "",
        currency: "USD",
        priceEntries: [],
        description: "",
        image: null
    });
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errors, setErrors] = useState({});

    const selectedServices = useMemo(() => {
        const category = CATEGORIES[form.category];
        return category ? category.services : [];
    }, [form.category]);

    const currencyLabel = CURRENCY_LABELS[form.service] || "Price Options";
    // const currentUnit = GAME_UNITS[form.service] || null;
    // const isGameService = Boolean(currentUnit);

    const serviceRule = SERVICE_RULES[form.service] || {};
    const isGame = serviceRule.type === "game";
    const isPlanOnly = serviceRule.type === "plan-only";
    const isValueOnly = serviceRule.type === "value-only";
    const isTopup = serviceRule.type === "topup";
    const unitLabel = serviceRule.unitLabel || null;



    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const addPriceEntry = () => {
        updateField("priceEntries", [
            ...form.priceEntries,
            {
                priceType: isGame
                    ? PRICE_TYPES.UNIT
                    : isPlanOnly
                        ? PRICE_TYPES.PLAN
                        : null,


                unit: "",
                planName: "",
                price: "",
                stock: ""
            }
        ]);
    };

    const updatePriceEntry = (index, field, value) => {
        const updated = [...form.priceEntries];
        updated[index][field] = value;
        updateField("priceEntries", updated);

        const errorKey = `priceEntry_${index}_${field}`;
        if (errors[errorKey]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    };

    const removePriceEntry = (index) => {
        updateField("priceEntries", form.priceEntries.filter((_, i) => i !== index));

        setErrors(prev => {
            const newErrors = { ...prev };
            Object.keys(newErrors).forEach(key => {
                if (key.startsWith(`priceEntry_${index}_`)) {
                    delete newErrors[key];
                }
            });
            return newErrors;
        });
    };

    const goToDetailsForm = () => {
        const newErrors = {};

        if (!form.category) {
            newErrors.category = "Please select a category";
        }
        if (!form.service) {
            newErrors.service = "Please select a service";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setStep(2);
    };

    const resetForm = () => {
        setForm({
            category: "",
            service: "",
            currency: "USD",
            priceEntries: [],
            description: "",
            image: null
        });
        setImageFile(null);
        setStep(1);
        setErrors({});
    };

    const countWords = (text) =>
        text
            .trim()
            .split(/\s+/)
            .filter(Boolean).length;

    const validateForm = () => {
        const newErrors = {};
        if (!form.category) newErrors.category = "Please select a category";
        if (!form.service) newErrors.service = "Please select a service";

        if (!form.priceEntries.length) {
            newErrors.priceEntries = "Please add at least one price entry";
        }
        
        form.priceEntries.forEach((entry, index) => {

            if (isGame && entry.priceType === "unit" && !entry.unit) {
                newErrors[`priceEntry_${index}_unit`] = `${unitLabel} amount is required`;
            }

            if ((isGame || isPlanOnly) && entry.priceType === "plan" && !entry.planName.trim()) {
                newErrors[`priceEntry_${index}_planName`] = "Plan name is required";
            }


            if (entry.priceType === "plan") {
                if (!entry.planName.trim()) {
                    newErrors[`priceEntry_${index}_planName`] = "Plan name is required";
                }
            }
            if (!entry.price) {
                newErrors[`priceEntry_${index}_price`] = "Price is required";
            } else if (Number(entry.price) <= 0) {
                newErrors[`priceEntry_${index}_price`] = "Price must be greater than 0";
            }


            if (!entry.stock) {
                newErrors[`priceEntry_${index}_stock`] = "Stock is required";
            } else if (Number(entry.stock) < 0) {
                newErrors[`priceEntry_${index}_stock`] = "Stock cannot be negative";
            }
        });

        if (!form.description.trim()) {
            newErrors.description = "Description is required";
        } else {
            const wordCount = countWords(form.description);
            if (wordCount < 10) {
                newErrors.description = `Description must be at least 10 words (currently: ${wordCount})`;
            }
        }

        if (!imageFile) newErrors.image = "Product image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitForm = async () => {
        if (!validateForm()) return;

        setSubmitting(true);

        const unitKey = GAME_UNITS[form.service] || null;

        // const finalProducts = form.priceEntries.map(v => ({
        //     price: Number(v.price),
        //     stock: Number(v.stock),
        //     currency: form.currency,
        //     unit: isGameService ? Number(v.unit) : null,
        //     unitLabel: unitKey,
        //     description: form.description.trim()
        // }));
        const finalProducts = form.priceEntries.map(v => ({
            price: Number(v.price),
            stock: Number(v.stock),
            currency: form.currency,

            priceType: v.priceType,
            unit: isGame && v.priceType === "unit" ? v.unit : null,
            unitLabel: isGame && v.priceType === "unit" ? unitLabel : null,
            planName: (isGame || isPlanOnly) && v.priceType === "plan" ? v.planName : null,

            description: form.description.trim()
        }));


        try {
            const fd = new FormData();
            fd.append("category", form.category);
            fd.append("service", form.service);
            fd.append("products", JSON.stringify(finalProducts));
            fd.append("image", imageFile);

            const res = await api.post("/admin/add-item/create-or-update", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data?.success) {
                toast.success(res.data.message || "Saved Successfully");
                setShowSuccessModal(true);

                setTimeout(() => {
                    setShowSuccessModal(false);
                    resetForm();
                }, 3000);
            }
        } catch (err) {
            console.error("Submit error:", err);
            const msg = err?.response?.data?.message || "Something went wrong";
            toast.error(msg);
            setErrors({ submit: msg });
        } finally {
            setSubmitting(false);
        }
    };

    const uploadImage = e => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setErrors(prev => ({ ...prev, image: "Only image files are allowed" }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, image: "Maximum file size is 5MB" }));
            return;
        }

        setImageFile(file);

        const reader = new FileReader();
        reader.onload = () => updateField("image", reader.result);
        reader.readAsDataURL(file);
    };

    return (
        <>
            

            {submitting && (
                <div className="fixed inset-0 bg-black/10  flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-fit shadow-2xl">
                        <div className="flex  items-center gap-4">
                            <div className="mx-auto w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <h1 className="font-semibold">Adding Product...</h1>
                        </div>
                    </div>
                </div>
            )}

            {/* -------- Success Pop Animation -------- */}
            {showSuccessModal && (
                    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 w-fit  shadow-2xl transform transition-all">
                            <div className="text-center">
                                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="text-green-600" size={25} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
                                <p className="text-gray-600 text-xs">
                                   Product has been added successfully.
                                </p>
                               
                            </div>
                    </div>
                </div>
            )}


            <div className="min-h-screen p-4 md:p-6 flex flex-col items-center">
                <div className="w-full   mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Add Products</h1>
                        <div className="h-1 w-12 bg-blue-600 mt-2"></div>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                        {step === 1
                            ? "Step 1: Select Category & Service"
                            : "Step 2: Enter Product Details"}
                    </p>
                </div>

                <div className="md:bg-white rounded-xl p-1 md:p-8 w-full  space-y-8">
                    {step === 1 && (
                        <>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Select Category</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {Object.entries(CATEGORIES).map(([key, data]) => {
                                        const Icon = data.icon;
                                        const isSelected = form.category === key;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => {
                                                    updateField("category", key);
                                                    updateField("service", "");
                                                }}
                                                className={`p-6 rounded-xl border-2 transition cursor-pointer flex flex-col items-center gap-3 hover:shadow-lg
                                                    ${isSelected
                                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                                        : "border-gray-200 hover:border-blue-300"
                                                    }`}
                                            >
                                                <div
                                                    className={`p-3 rounded-full ${isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}
                                                >
                                                    <Icon size={28} />
                                                </div>
                                                <span
                                                    className={`text-sm font-semibold text-center ${isSelected ? "text-blue-700" : "text-gray-700"}`}
                                                >
                                                    {data.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.category && (
                                    <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
                                        <AlertCircle size={14} />
                                        <span>{errors.category}</span>
                                    </div>
                                )}
                            </div>

                            {form.category && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Select Service</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {selectedServices.map((service) => {
                                            const ServiceIcon = SERVICE_ICONS[service];
                                            const isSelected = form.service === service;
                                            return (
                                                <button
                                                    key={service}
                                                    onClick={() => updateField("service", service)}
                                                    className={`p-5 rounded-xl border-2 transition cursor-pointer flex flex-col items-center gap-3 hover:shadow-lg
                                                        ${isSelected
                                                            ? "border-green-500 bg-green-50 shadow-md"
                                                            : "border-gray-200 hover:border-green-300"
                                                        }`}
                                                >
                                                    <div
                                                        className={`p-3 rounded-full ${isSelected ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"}`}
                                                    >
                                                    <ServiceIcon size={24} />
                                                    </div>
                                                    <span
                                                        className={`text-sm font-medium text-center ${isSelected ? "text-green-700" : "text-gray-700"}`}
                                                    >
                                                        {service}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.service && (
                                        <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
                                            <AlertCircle size={14} />
                                            <span>{errors.service}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {form.service && (
                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={goToDetailsForm}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium shadow-md hover:shadow-lg transition"
                                    >
                                        Continue to Details →
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    {(() => {
                                        const CategoryIcon = CATEGORIES[form.category]?.icon;
                                        const ServiceIcon = SERVICE_ICONS[form.service];
                                        return (
                                            <>
                                                <div className="p-2 bg-blue-500 text-white rounded-lg">
                                                    <CategoryIcon size={20} />
                                                </div>
                                                <div className="p-2 bg-green-500 text-white rounded-lg">
                                                    <ServiceIcon size={20} />
                                                </div>
                                            </>
                                        );
                                    })()}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">
                                            {CATEGORIES[form.category]?.label} → {form.service}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-sm text-blue-600 hover:underline font-medium cursor-pointer"
                                >
                                    ← Change Selection
                                </button>
                            </div>

                            <FormField label="Currency" required>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(CURRENCIES).map(([code, info]) => (
                                        <button
                                            key={code}
                                            onClick={() => updateField("currency", code)}
                                            className={`p-4 rounded-lg border-2 transition cursor-pointer text-left
                                                ${form.currency === code
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-300 hover:border-gray-400"
                                                }`}
                                        >
                                            <p className="font-bold text-lg">{info.symbol}</p>
                                            <p className="text-sm text-gray-600">{info.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </FormField>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {currencyLabel}
                                    </h3>
                                    <button
                                        onClick={addPriceEntry}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer text-sm shadow-md hover:shadow-lg transition"
                                    >
                                        <Plus size={16} /> Add Entry
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {form.priceEntries.length === 0 ? (
                                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                                            <p className="text-gray-500">
                                                No entries yet. Click "Add Entry" to start.
                                            </p>
                                        </div>
                                    ) : (
                                        form.priceEntries.map((entry, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                            >
                                                {isGame && serviceRule.allowPlans && (
                                                    <FormField label="Product Type" required>
                                                        <select
                                                            value={entry.priceType}
                                                            onChange={(e) =>
                                                                updatePriceEntry(index, "priceType", e.target.value)
                                                            }
                                                            className="w-full px-4 py-2 border rounded-lg"
                                                        >
                                                            <option value="unit">Unit Based</option>
                                                            <option value="plan">Plan Based</option>
                                                        </select>
                                                    </FormField>
                                                )}
                                                {isGame && entry.priceType === "unit" && (

                                                    <FormField
                                                        label={unitLabel}
                                                        required
                                                        error={errors[`priceEntry_${index}_unit`]}
                                                    >
                                                        <input
                                                            type="text"
                                                            value={entry.unit}
                                                            onChange={(e) =>
                                                                updatePriceEntry(index, "unit", e.target.value)
                                                            }
                                                            placeholder={`e.g., 100 + 10 ${unitLabel}`}
                                                            className="w-full px-4 py-2 border rounded-lg"
                                                        />
                                                    </FormField>
                                                )}

                                                {(isGame || isPlanOnly) && entry.priceType === "plan" && (

                                                    <FormField
                                                        label="Plan Name"
                                                        required
                                                        error={errors[`priceEntry_${index}_planName`]}
                                                    >
                                                        <input
                                                            type="text"
                                                            value={entry.planName}
                                                            onChange={(e) =>
                                                                updatePriceEntry(index, "planName", e.target.value)
                                                            }
                                                            placeholder="e.g., Weekly Subscription"
                                                            className="w-full px-4 py-2 border rounded-lg"
                                                        />
                                                    </FormField>
                                                )}

                                                <FormField
                                                    label={`Price (${CURRENCIES[form.currency].symbol})`}
                                                    required
                                                    error={errors[`priceEntry_${index}_price`]}
                                                >
                                                    <input
                                                        type="text"
                                                        inputMode="decimal"
                                                        value={entry.price}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/[^0-9.]/g, "");
                                                            const parts = value.split(".");
                                                            const sanitized =
                                                                parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : value;
                                                            updatePriceEntry(index, "price", sanitized);
                                                        }}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${errors[`priceEntry_${index}_price`]
                                                                ? "border-red-500"
                                                                : "border-gray-300"
                                                            }`}
                                                        placeholder="e.g., 9.99"
                                                    />
                                                </FormField>

                                                <FormField
                                                    label="Stock"
                                                    required
                                                    error={errors[`priceEntry_${index}_stock`]}
                                                >
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={entry.stock}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/[^0-9]/g, "");
                                                            updatePriceEntry(index, "stock", value);
                                                        }}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${errors[`priceEntry_${index}_stock`]
                                                                ? "border-red-500"
                                                                : "border-gray-300"
                                                            }`}
                                                        placeholder="e.g., 50"
                                                    />
                                                </FormField>

                                                <div className="flex items-end">
                                                    <button
                                                        onClick={() => removePriceEntry(index)}
                                                        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
                                                    >
                                                        <Trash2 size={16} /> remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {errors.priceEntries && (
                                    <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
                                        <AlertCircle size={14} />
                                        <span>{errors.priceEntries}</span>
                                    </div>
                                )}

                                {form.priceEntries.length > 0 && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mt-4">
                                        <p className="text-2xl font-bold text-blue-700">{form.priceEntries.length}</p>
                                        <p className="text-gray-600 text-sm">Total Products to Add</p>
                                    </div>
                                )}
                            
                            </div>

                            <FormField label="Description" required error={errors.description}>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => updateField("description", e.target.value)}
                                    rows={4}
                                    className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${errors.description ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Add product description (minimum 10 words)..."
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {countWords(form.description)} / 10 Minimum words
                                </div>
                            </FormField>

                            <FormField label="Product Image" required error={errors.image}>
                                <div className={`border-2 border-dashed rounded-xl p-6 text-center hover:border-blue-400 transition ${errors.image ? 'border-red-500' : 'border-gray-300'
                                    }`}>
                                    {form.image ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={form.image}
                                                alt="Preview"
                                                className="h-40 rounded-lg object-cover shadow"
                                            />
                                            <button
                                                onClick={() => {
                                                    updateField("image", null);
                                                    setImageFile(null);
                                                }}
                                                className="absolute cursor-pointer -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg transition"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block">
                                            <Upload
                                                size={40}
                                                className="mx-auto text-gray-400 mb-3"
                                            />
                                            <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                                                Click to Upload Image
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PNG, JPG up to 5MB
                                            </p>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={uploadImage}
                                            />
                                        </label>
                                    )}
                                </div>
                            </FormField>

                            {errors.submit && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                                    <div className="flex-1">
                                        <p className="text-red-800 font-medium">Error</p>
                                        <p className="text-red-700 text-sm">{errors.submit}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    onClick={resetForm}
                                    className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer font-medium transition shadow-sm hover:shadow-md"
                                >
                                    Cancel & Reset
                                </button>
                                <button
                                    onClick={submitForm}
                                    disabled={submitting}
                                    className={`flex-1 py-3 rounded-lg font-medium cursor-pointer shadow-md hover:shadow-lg transition ${submitting
                                        ? "bg-blue-400 text-white cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                >
                                    {submitting
                                        ? "Saving..."
                                        : `Add ${form.priceEntries.length} Product(s)`}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {products.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 w-full max-w-6xl mt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Added Products ({products.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((product, index) => (
                                <div
                                    key={product._id || index}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                                >
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-32 object-cover rounded mb-3"
                                        />
                                    )}
                                    <p className="font-semibold text-sm">{product.name}</p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Stock: {product.stock}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Category: {product.category}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}