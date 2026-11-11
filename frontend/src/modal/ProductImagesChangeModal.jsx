import { useState } from 'react';
import { X, Upload, ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

function ImageUpdatePopup({id, isOpen, onClose, currentImage, productName, onUpdate }) {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(currentImage);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!imageFile) {
            toast.error("Please select an image");
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("productId", id);
            formData.append("image", imageFile);

            const res = await api.post(
                "/admin/product/upload-product-image",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (res.data.success) {
                onUpdate?.(res.data.product);
                toast.success("Banner image updated successfully!");
                setImageFile(null);
                setImagePreview(res.data.imageUrl);
                onClose();

            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to update image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleReset = () => {
        setImageFile(null);
        setImagePreview(currentImage);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Update Banner Image</h2>
                        <p className="text-sm text-gray-600 mt-1">{productName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors"
                        disabled={isUploading}
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Current Image Preview */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Current Banner
                        </label>
                        <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border-2 border-gray-300">
                            <img
                                src={imagePreview}
                                alt="Banner preview"
                                className="w-full h-full object-cover"
                            />
                            {imageFile && (
                                <div className="absolute top-2 right-2">
                                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full shadow-lg">
                                        New
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upload Area */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Upload New Image
                        </label>

                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${dragActive
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                                }`}
                        >
                            <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={isUploading}
                            />

                            <label
                                htmlFor="image-upload"
                                className="flex flex-col items-center justify-center cursor-pointer"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                                    {dragActive ? (
                                        <Upload size={28} className="text-blue-600" />
                                    ) : (
                                        <ImageIcon size={28} className="text-blue-600" />
                                    )}
                                </div>

                                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                                    {dragActive ? 'Drop image here' : 'Choose image or drag & drop'}
                                </h3>

                                <p className="text-sm text-gray-500 text-center">
                                    PNG, JPG, GIF up to 5MB
                                </p>

                                {imageFile && (
                                    <div className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                        {imageFile.name}
                                    </div>
                                )}
                            </label>
                        </div>

                    </div>

                    {/* Actions */}
                    {imageFile && (
                        <button
                            onClick={handleReset}
                            className="w-full py-2.5 text-sm text-blue-600 underline font-medium transition-colors"
                            disabled={isUploading}
                        >
                            Reset to Original
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="w-full flex-1 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 hover:border-gray-400 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!imageFile || isUploading}
                        className="w-full flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                Update
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Uploading Overlay */}
            {isUploading && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <Loader2 size={32} className="text-blue-600 animate-spin" />
                            <div>
                                <h3 className="font-semibold text-gray-900">Uploading Image</h3>
                                <p className="text-sm text-gray-600">Please wait...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImageUpdatePopup;

