import { useEffect, useState } from "react";

const EditUserModal = ({ open, onClose, loading, onSave, user }) => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setForm({
                name: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
            });
            setErrors({});
        }
    }, [user]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    /** -----------------------------
     * Validation
     * -----------------------------*/
    const validate = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "Full name is required";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else {
            const phone = form.phone.replace(/\s+/g, "");
            const haitiPhoneRegex = /^(?:\+509|509)?[34]\d{7}$/;

            if (!haitiPhoneRegex.test(phone)) {
                newErrors.phone = "Enter a valid Haitian phone number";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        onSave({
            fullName: form.name.trim(),
            phone: form.phone.trim(),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-md p-6 mx-4 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                    Edit Profile
                </h2>

                {/* Name */}
                <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.name
                                ? "border-red-500 focus:ring-red-400"
                                : "focus:ring-blue-500"
                            }`}
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={form.email}
                        disabled
                        className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Email cannot be changed
                    </p>
                </div>

                {/* Phone */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+50938123456"
                        className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.phone
                                ? "border-red-500 focus:ring-red-400"
                                : "focus:ring-blue-500"
                            }`}
                    />
                    {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.phone}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;
