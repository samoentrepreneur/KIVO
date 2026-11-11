import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../api";

const ProductDescription = ({ product, onUpdated }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(product.description || "");
    const [originalDesc, setOriginalDesc] = useState(product.description || "");
    const [isSaving, setIsSaving] = useState(false);

    // detect change
    const hasChanged = description.trim() !== originalDesc.trim();

    const handleSave = async () => {
        if (!hasChanged) return;

        setIsSaving(true);
        try {
            const res = await api.put("/admin/product/update-description", {
                productId: product._id,
                description,
            });

            if (res.data.success) {
                setOriginalDesc(description);
                onUpdated?.(res.data.product);
                toast.success("Description updated");
                setIsEditing(false);
            }
        } catch (err) {
            toast.error("Failed to update description");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setDescription(originalDesc);
        setIsEditing(false);
    };

    return (
        <div className="mt-2 space-y-2">
            {!isEditing ? (
                <>
                    <p className="text-gray-600 text-sm whitespace-pre-line">
                        {originalDesc || "No description"}
                    </p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-blue-600 underline"
                    >
                        Edit description
                    </button>
                </>
            ) : (
                <>
                    <textarea
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 border-gray-300"
                        placeholder="Enter product description"
                    />

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="px-4 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanged || isSaving}
                            className={`px-4 py-1.5 text-sm rounded-lg text-white transition
                ${hasChanged && !isSaving
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-300 cursor-not-allowed"}
              `}
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </button>

                       
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductDescription;
