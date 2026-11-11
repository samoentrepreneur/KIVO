import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ArrowLeft, Package, Box } from "lucide-react";
import api from "../../api";
import RemoveAdminAlert from "../../modal/RemoveAdminAlert";
import toast from "react-hot-toast";
import ImageUpdatePopup from "../../modal/ProductImagesChangeModal";
import ProductDescription from "./ProductDescription";

const SERVICE_RULES = {
    // Games - Support both unit and subscription
    "Garena Free Fire": { type: "game", unitLabel: "Diamonds", allowUnit: true, allowPlan: true },
    "PUBG Mobile": { type: "game", unitLabel: "UC", allowUnit: true, allowPlan: true },
    "Call of Duty": { type: "game", unitLabel: "CP", allowUnit: true, allowPlan: true },
    "Blood Strike": { type: "game", unitLabel: "Coins", allowUnit: true, allowPlan: true },
    "Roblox": { type: "game", unitLabel: "Robux", allowUnit: true, allowPlan: true },
    "Minecraft": { type: "game", unitLabel: "Minecoins", allowUnit: true, allowPlan: true },

    // Streaming - Subscription only
    "Netflix": { type: "streaming", allowUnit: false, allowPlan: true },
    "Prime Video": { type: "streaming", allowUnit: false, allowPlan: true },
    "Spotify": { type: "streaming", allowUnit: false, allowPlan: true },
    "Disney+": { type: "streaming", allowUnit: false, allowPlan: true },
    "Crunchyroll": { type: "streaming", allowUnit: false, allowPlan: true },

    // Cards - Value only (no type selection)
    "Apple Gift Card": { type: "value-only", allowUnit: false, allowPlan: false },
    "Amazon Gift Card": { type: "value-only", allowUnit: false, allowPlan: false },
    "Visa Prepaid Card": { type: "value-only", allowUnit: false, allowPlan: false },
    "PayPal Top-Up": { type: "value-only", allowUnit: false, allowPlan: false },

    // Mobile TopUp - Value only
    "Digicel": { type: "topup", allowUnit: false, allowPlan: false },
    "Natcom": { type: "topup", allowUnit: false, allowPlan: false },
    "E Number": { type: "topup", allowUnit: false, allowPlan: false },
    "T mobile": { type: "topup", allowUnit: false, allowPlan: false }
};

function ProductVariantEditor({ product, onBack, onUpdated }) {
    const [variants, setVariants] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(product.image);

    // Get service rules
    const serviceRule = SERVICE_RULES[product?.service] || { allowUnit: false, allowPlan: false };
    const { allowUnit, allowPlan, unitLabel } = serviceRule;
    const showTypeSelector = allowUnit && allowPlan;


    const handleUpdate = (data) => {
        onUpdated(data);
    };

    // Initialize variants
    useEffect(() => {
        if (!product?.variants) return;

        const initializedVariants = product.variants.map(v => {
            // Determine default priceType
            let priceType = "unit";
            if (v.priceType) {
                priceType = v.priceType;
            } else if (v.unitValue) {
                priceType = "unit";
            } else if (v.planName) {
                priceType = "plan";
            } else if (allowPlan && !allowUnit) {
                priceType = "plan";
            }

            return {
                priceType,
                unitValue: v.unitValue ?? "",
                planName: v.planName ?? "",
                price: v.price ?? "",
                stock: v.stock ?? ""
            };
        });

        setVariants(initializedVariants);
    }, [product, allowUnit, allowPlan]);

    const handleChange = (index, key, value) => {
        setVariants(prev => {
            const updated = [...prev];
            updated[index][key] = value;
            return updated;
        });
    };

    const deleteVariant = (index) => {
        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    const addVariant = () => {
        const defaultType = allowUnit ? "unit" : allowPlan ? "plan" : "value";
        setVariants(prev => [
            ...prev,
            {
                priceType: defaultType,
                unitValue: "",
                planName: "",
                price: "",
                stock: ""
            }
        ]);
    };

    const handleSave = async () => {
        // Validation
        const invalid = variants.some(v => {
            if (!v.price || v.price <= 0) return true;
            if (v.stock === "" || v.stock < 0) return true;
            if (v.priceType === "unit" && allowUnit && (!v.unitValue || v.unitValue <= 0)) return true;
            if (v.priceType === "plan" && allowPlan && !v.planName.trim()) return true;
            return false;
        });

        if (invalid) return toast.error("Please fill all fields correctly.");

        // Format data for backend
        const formattedVariants = variants.map(v => ({
            priceType: v.priceType,
            price: Number(v.price),
            stock: Number(v.stock),
            unitValue: v.priceType === "unit" && allowUnit ? Number(v.unitValue) : null,
            unitLabel: v.priceType === "unit" && allowUnit ? unitLabel : null,
            planName: v.priceType === "plan" && allowPlan ? v.planName : null
        }));

        try {
            setIsSaving(true);
            const response = await api.put(
                `/admin/product/${product._id}/variants`,
                { variants: formattedVariants }
            );

            if (response.data.success) {
                toast.success("Changes saved successfully!");
                setVariants(response.data.product.variants);
                onUpdated?.(response.data.product);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update variants");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await api.delete(`/admin/product/delete/${product._id}`);
            if (res.data.success) {
                toast.success("Product deleted successfully!");
                onUpdated?.(null);
                onBack();
            }
        } catch (error) {
            toast.error("Failed to delete product. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
            >
                <ArrowLeft size={20} /> Back to Categories
            </button>

            {/* Saving Overlay */}
            {isSaving && (
                <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-fit shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <h1 className="font-semibold">Saving Product...</h1>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md ring-4 ring-white">
                            <img
                                src={product.image}
                                alt={product.service}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{product.service}</h2>
                            <p className="text-sm text-gray-600">
                                {variants.length} variant{variants.length !== 1 ? 's' : ''} available
                            </p>
                            <button onClick={() => setIsPopupOpen(true)} className="text-sm text-blue-600 underline">Change banner</button>
                        </div>
                    </div>
                    <div className="mt-2">
                       <ProductDescription product={product} onUpdated={onUpdated} />
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    {showTypeSelector && (
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Type
                                        </th>
                                    )}
                                    {allowUnit && (
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            {unitLabel || "Amount"}
                                        </th>
                                    )}
                                    {allowPlan && (
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Plan
                                        </th>
                                    )}
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Price ({product?.currency || "USD"})
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {variants.map((v, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        {/* Type Selector */}
                                        {showTypeSelector && (
                                            <td className="py-3 px-4">
                                                <select
                                                    value={v.priceType}
                                                    onChange={e => handleChange(index, "priceType", e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="unit">Unit</option>
                                                    <option value="plan">Plan</option>
                                                </select>
                                            </td>
                                        )}

                                        {/* Unit Value */}
                                        {allowUnit && (
                                            <td className="py-3 px-4">
                                                {v.priceType === "unit" || !showTypeSelector ? (
                                                    <input
                                                        type="number"
                                                        value={v.unitValue}
                                                        onChange={e => handleChange(index, "unitValue", e.target.value)}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder={`Enter ${unitLabel || "amount"}`}
                                                        onWheel={e => e.target.blur()}
                                                    />
                                                ) : (
                                                    <input type="number"
                                                        value={v.unitValue}
                                                        disabled
                                                        onChange={e => handleChange(index, "unitValue", e.target.value)}
                                                        className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed bg-red-100 "
                                                        placeholder={`Enter ${unitLabel || "amount"}`}
                                                        onWheel={e => e.target.blur()} />
                                                )}
                                            </td>
                                        )}

                                        {/* Plan Name */}
                                        {allowPlan && (
                                            <td className="py-3 px-4">
                                                {v.priceType === "plan" || !showTypeSelector ? (
                                                    <input
                                                        type="text"
                                                        value={v.planName}
                                                        onChange={e => handleChange(index, "planName", e.target.value)}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Monthly / Weekly"
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={v.planName}
                                                        disabled
                                                        onChange={e => handleChange(index, "planName", e.target.value)}
                                                        className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed bg-red-100 "
                                                        placeholder="Monthly / Weekly"
                                                    />
                                                )}
                                            </td>
                                        )}

                                        {/* Price */}
                                        <td className="py-3 px-4">
                                            <input
                                                type="number"
                                                value={v.price}
                                                onChange={e => handleChange(index, "price", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter price"
                                                onWheel={e => e.target.blur()}
                                            />
                                        </td>

                                        {/* Stock */}
                                        <td className="py-3 px-4">
                                            <input
                                                type="number"
                                                value={v.stock}
                                                onChange={e => handleChange(index, "stock", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter stock"
                                                onWheel={e => e.target.blur()}
                                            />
                                        </td>

                                        {/* Delete */}
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => deleteVariant(index)}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden p-4 space-y-3">
                    {variants.map((v, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Variant {index + 1}
                                    </span>
                                    {showTypeSelector && (
                                        <span
                                            className={`px-2 py-0.5 text-xs rounded-full font-medium ${v.priceType === "unit"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700"
                                                }`}
                                        >
                                            {v.priceType === "unit" ? "Unit" : "Plan"}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => deleteVariant(index)}
                                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* Type Selector */}
                                {showTypeSelector && (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Variant Type
                                        </label>
                                        <select
                                            value={v.priceType}
                                            onChange={e => handleChange(index, "priceType", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="unit">Unit</option>
                                            <option value="plan">Plan</option>
                                        </select>
                                    </div>
                                )}

                                {/* Unit Value */}
                                {allowUnit && (v.priceType === "unit" || !showTypeSelector) && (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            {unitLabel || "Amount"}
                                        </label>
                                        <input
                                            type="number"
                                            value={v.unitValue}
                                            onChange={e => handleChange(index, "unitValue", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder={`Enter ${unitLabel || "amount"}`}
                                            onWheel={e => e.target.blur()}
                                        />
                                    </div>
                                )}

                                {/* Plan Name */}
                                {allowPlan && (v.priceType === "plan" || !showTypeSelector) && (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Plan Name
                                        </label>
                                        <input
                                            type="text"
                                            value={v.planName}
                                            onChange={e => handleChange(index, "planName", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Monthly / Weekly / 30 Days"
                                        />
                                    </div>
                                )}

                                {/* Price */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Price ({product?.currency || "USD"})
                                    </label>
                                    <input
                                        type="number"
                                        value={v.price}
                                        onChange={e => handleChange(index, "price", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="0"
                                        onWheel={e => e.target.blur()}
                                    />
                                </div>

                                {/* Stock */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        value={v.stock}
                                        onChange={e => handleChange(index, "stock", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="0"
                                        onWheel={e => e.target.blur()}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="bg-gray-50 p-6 flex flex-col-reverse sm:flex-row gap-3 border-t border-gray-200">
                    <button
                        onClick={() => setIsDeletePopupOpen(true)}
                        disabled={isDeleting}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all font-medium"
                    >
                        <Trash2 size={18} /> {isDeleting ? "Deleting..." : "Delete Product"}
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all font-medium"
                    >
                        <Save size={18} /> {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        onClick={addVariant}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                    >
                        <Plus size={18} /> Add Variant
                    </button>
                </div>
            </div>

            {isDeletePopupOpen && (
                <RemoveAdminAlert
                    isOpen={isDeletePopupOpen}
                    onClose={() => setIsDeletePopupOpen(false)}
                    onConfirm={handleDelete}
                    isDeleting={isDeleting}
                    deleteItemName="product"
                />
            )}
            <ImageUpdatePopup
                id={product._id}
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                currentImage={currentBanner}
                productName={product.service}
                onUpdate={handleUpdate}
            />
        </div>
    );
}





function ServicesList({ category, onSelectProduct, onBack }) {
    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Categories</span>
            </button>

            {/* Header */}
            <div className="pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                <div className="flex gap-6 mt-3">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Package size={18} />
                        <span className="text-sm">{category.servicesCount} Products</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Box size={18} />
                        <span className="text-sm">{category.totalStock} Total Stock</span>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.services.map((service) => {
                    const totalStock = service.variants.reduce((sum, v) => sum + Number(v.stock), 0);
                    return (
                        <div
                            key={service._id}
                            onClick={() => onSelectProduct(service)}
                            className="bg-white rounded-xl p-4 border border-gray-200 cursor-pointer hover:border-blue-300 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-18 rounded-xl overflow-hidden shadow-sm ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all">
                                    <img
                                        src={service.image}
                                        alt={service.service}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {service.service}
                                    </h3>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-sm text-gray-600">{service.variants.length} variants</p>
                                        <p className="text-sm text-gray-600">Stock: {totalStock}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function CategoryList({ categories, onSelectCategory }) {
    return (
        <div className="space-y-6">
            {/* Header */}

            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Categories</h1>
                <div className="h-1 w-12 bg-blue-600 mt-2"></div>
                <p className="text-gray-600 mt-2">Select a category to manage products</p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div
                        key={category.category}
                        onClick={() => onSelectCategory(category)}
                        className="bg-white rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-blue-300 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {category.category}
                            </h3>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all">
                                <Package className="text-blue-600" size={24} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Product</span>
                                <span className="font-semibold text-gray-900">{category.servicesCount}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Total Stock</span>
                                <span className="font-semibold text-gray-900">{category.totalStock}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProductsList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/product/by-category");
            if (res.data.success) {
                // console.log(res.data)
                setCategories(res.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch products. Please try again.");
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setSelectedProduct(null);
    };

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
    };

    const handleBackToCategories = () => {
        setSelectedCategory(null);
        setSelectedProduct(null);
    };

    const handleBackToServices = () => {
        setSelectedProduct(null);
    };

    const updateProductInState = (updatedProduct) => {
        const productId = updatedProduct?._id ?? selectedProduct?._id;

        // Helper: calculate stats for a category
        const recalcCategory = (category) => {
            const services = category.services;

            return {
                ...category,
                servicesCount: services.length,
                totalStock: services.reduce(
                    (sum, service) => sum + service.variants.reduce((t, v) => t + Number(v.stock), 0),
                    0
                )
            };
        };

        // ---------------- DELETE PRODUCT ----------------
        if (!updatedProduct) {

            setCategories(prev =>
                prev.map(category => {
                    const filtered = category.services.filter(s => s._id !== productId);
                    return recalcCategory({ ...category, services: filtered });
                })
            );

            setSelectedCategory(prev => {
                if (!prev) return prev;

                const filtered = prev.services.filter(s => s._id !== productId);
                return recalcCategory({ ...prev, services: filtered });
            });

            setSelectedProduct(null);
            return;
        }

        // ---------------- UPDATE PRODUCT ----------------
        setSelectedProduct(updatedProduct);

        setCategories(prev =>
            prev.map(category => {
                const updated = category.services.map(s =>
                    s._id === updatedProduct._id ? updatedProduct : s
                );
                return recalcCategory({ ...category, services: updated });
            })
        );

        setSelectedCategory(prev => {
            if (!prev) return prev;

            const updated = prev.services.map(s =>
                s._id === updatedProduct._id ? updatedProduct : s
            );

            return recalcCategory({ ...prev, services: updated });
        });
    };

    // const [productType, setProductType] = useState("unit");

    // useEffect(() => {
    //     if (selectedProduct?.service) {
    //         setProductType(
    //             SERVICE_EDITOR_TYPE[selectedProduct.service] || "unit"
    //         );
    //     }
    // }, [selectedProduct]);



    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    if (!categories?.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <p>No products listed yet !</p>
            </div>
        )

    }

    return (

        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Show Product Editor if product is selected */}
                {selectedProduct ? (
                    <ProductVariantEditor
                        product={selectedProduct}
                        onBack={handleBackToServices}
                        onUpdated={updateProductInState}
                    />

                ) : selectedCategory ? (
                    /* Show Services List if category is selected */
                    <ServicesList
                        category={selectedCategory}
                        onSelectProduct={handleSelectProduct}
                        onBack={handleBackToCategories}
                    />
                ) : (
                    /* Show Category List by default */
                    <CategoryList
                        categories={categories}
                        onSelectCategory={handleSelectCategory}
                    />
                )}
            </div>
        </div>

    );
}