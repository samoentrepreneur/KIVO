import { useState,useEffect } from "react";
import { Settings, User, Mail, Shield, Trash2, LogOut, Plus, X, Lock, Edit, LockKeyhole, ShieldUser } from "lucide-react";

import { useAuth } from "../../context/admin.authContext";
import toast from "react-hot-toast";
import LogoutModal from "../../modal/LogoutModal";
import api from "../../api";
import RemoveAdminAlert from "../../modal/RemoveAdminAlert";

const Setting = () => {
    const { admin, logout, fetchMe } = useAuth();
    const isSuperAdmin = admin?.role === "superadmin";
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);

    // Add Admin Form
    const [newAdminName, setNewAdminName] = useState("");
    const [newAdminEmail, setNewAdminEmail] = useState("");
    const [newAdminRole, setNewAdminRole] = useState("admin");

    // Edit Profile Form
    const [editName, setEditName] = useState(admin?.name || "");
    const [editEmail, setEditEmail] = useState(admin?.email || "");

    // Change Password Form
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [adminList, setAdminList] = useState([
    ]);

    const handleAddAdmin = async () => {
        const errors = {};

        if (!newAdminName.trim()) {
            errors.name = "Name is required";
        }

        if (!newAdminEmail.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(newAdminEmail)) {
            errors.email = "Invalid email format";
        }

        if (!newAdminRole) {
            errors.role = "Role is required";
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await api.post("/admin/add-admin", {
                name: newAdminName,
                email: newAdminEmail,
                role: newAdminRole,
            });
            if (response.data.success)
            toast.success(response.data.message);
            setAdminList(prev => [...prev, response.data.admin]);
            setNewAdminEmail("");
            setNewAdminName("");
            setNewAdminRole("admin");
            setShowAddAdminModal(false);
            setErrors({});

            

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally {
            setIsSubmitting(false);
        }
    };


  

    const handleUpdateProfile = async () => {
        if (!editName || editName.trim() === "") return toast.error("Name cannot be empty");
        setIsSubmitting(true);
        try {
            const response = await api.post("/admin/edit-profile", {
                adminId: admin?._id,
                name: editName,
            });
            if (response.data.success)
                await fetchMe();
            toast.success(response.data.message);
            setShowEditProfileModal(false);


        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const validatePasswordChange = () => {
        const newErrors = {};

        if (!currentPassword || !newPassword || !confirmPassword) {
            newErrors.AllPassError = "Please fill all password fields";
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPasswordError = "New passwords do not match";
        }

        if (newPassword.length < 8) {
            newErrors.newPasswordError = "Password must be at least 8 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChangePassword = async () => {
        const isValid = validatePasswordChange();
        if (!isValid) return; // stop execution if validation fails
        setIsSubmitting(true);
        try {
            // API CALL HERE
            const response = await api.post("/admin/change-password", {
                adminId: admin?._id,
                currentPassword,
                newPassword,
            });
            if (response.data.success)
                toast.success(response.data.message);
            // reset
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setErrors({});
            setShowChangePasswordModal(false);

        } catch (error) {
            // console.error("Change Password Error:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally {
            setIsSubmitting(false);
        }
    };


    useEffect(() => {
        if (!admin || admin.role !== "superadmin") return;

        let executed = false; // prevent multiple fetches

        const fetchAdmins = async () => {
            if (executed) return;
            executed = true;

            try {
                setLoading(true);
                const response = await api.get("/admin/admin-list");
                if (response.data.success) setAdminList(response.data.admins);
            } catch (err) {
                console.error("Fetch Admins Error:", err);
                toast.error(err?.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, [admin]);


    const deleteAdmin = async (selectedAdmin) => {
       
        if (admin._id === selectedAdmin._id) {
            toast.error("You cannot remove yourself!");
            return;
        }
        if (selectedAdmin.role === "superadmin") {
            toast.error("Cannot remove Super Admin!");
            return;
        }
         setIsDeleting(true);
        try {
            const response = await api.delete(`/admin/remove/${selectedAdmin?._id}`);

            if (response.data.success) {
                toast.success(`Admin removed successfully`);
                setAdminList(prev => prev.filter(a => a._id !== selectedAdmin._id)); 
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Delete failed");
        }
        finally {
            setDeleteModalOpen(false);
            setSelectedAdmin({});
            setIsDeleting(false);
        }
    };


    const cancelChangePassword = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
        setShowChangePasswordModal(false);
    }
    const closeAdminModal = () => {
        setShowAddAdminModal(false);
        setNewAdminEmail("");
        setNewAdminName("");
        setNewAdminRole("admin");
        setErrors({});

    };



    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "superadmin":
                return "bg-purple-100 text-purple-700";
            case "developer":
                return "bg-green-100 text-green-700";
            default:
                return "bg-blue-100 text-blue-700";
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case "superadmin":
                return "Super Admin";
            case "developer":
                return "Developer";
            default:
                return "Admin";
        }
    };

    return (
        <>
            {isSubmitting && (
                <div className="fixed inset-0 bg-black/10  flex items-center justify-center z-100">
                    <div className="bg-white rounded-2xl p-6 w-fit shadow-2xl">
                        <div className="flex  items-center gap-4">
                            <div className="mx-auto w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <h1 className="font-semibold">Submitting...</h1>
                        </div>
                    </div>
                </div>
            )}
            <div className="min-h-screen p-4 md:p-6 bg-white">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-3xl font-bold ">Settings</h1>
                    <div className="h-1 w-12 bg-blue-600 mt-2"></div>
                    <p className="text-gray-400 mt-1">Manage your account and preferences</p>
                </div>

                <div className="space-y-8">
                    {/* Profile Section */}
                    <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-md md:text-xl font-bold text-gray-800 flex items-center gap-2">
                                <User size={24} />
                                Profile Information
                            </h2>
                            <button
                                onClick={() => {
                                    setEditName(admin?.name || "");
                                    setEditEmail(admin?.email || "");
                                    setShowEditProfileModal(true);
                                }}
                                className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                            >
                                <Edit size={18} />
                                <span className="hidden md:block">Edit Profile</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                                <div className="text-md md:text-lg font-semibold text-gray-800">{admin?.name}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                                <div className="text-md md:text-lg font-semibold text-gray-800">{admin?.email}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                                <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(admin?.role)}`}>
                                    {getRoleLabel(admin?.role)}
                                </span>
                            </div>
                        </div>
                    </div>



                    {/* Admin Management Section - Only for Super Admin */}
                    {isSuperAdmin && (
                        <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-md md:text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <ShieldUser size={24} />
                                    Admin Management
                                </h2>
                                <button
                                    onClick={() => setShowAddAdminModal(true)}
                                    className="bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                                >
                                    <Plus size={18} />
                                    <span className="hidden md:block">Add new admin</span>

                                </button>
                            </div>
                            {loading ? (
                                <div className="flex flex-col items-center justify-center gap-3 py-10">    
                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div> <p>Loading admins...</p>
                                </div>
                            ) : (
                                    
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {adminList.map((adminItem) => (
                                    <div
                                        key={adminItem._id}
                                        className="flex items-center justify-between p-2 md:p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center gap-2 md:gap-4">
                                            <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {adminItem.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className=" flex gap-2 items-center  font-semibold text-gray-800 text-sm md:text-lg">
                                                    <span>{adminItem.name}</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(adminItem.role)}`}>
                                                        {getRoleLabel(adminItem.role)}
                                                    </span>
                                                </div>

                                                <div className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                                                    <Mail size={14} />
                                                    {adminItem.email}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex  items-center gap-3">

                                            {adminItem.role !== "superadmin" && (
                                                <button
                                                    onClick={() => {
                                                        setDeleteModalOpen(true);
                                                        setSelectedAdmin(adminItem);
                                                    }}
                                                    className="text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                    title="Remove access"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                    </div>
                            )}
                        </div>

                    )}
                    {/* Security Section */}
                    <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                        <h2 className="text-md md:text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                            <LockKeyhole size={24} />
                            Security
                        </h2>

                        <div className="space-y-4">
                            <div className="flex  items-center justify-between p-2 md:p-4 bg-white rounded-lg border border-gray-200">
                                <div>
                                    <h3 className="text-sm md:text-md font-semibold text-gray-800">Password</h3>
                                    <p className="text-xs md:text-sm text-gray-600">Change your account password</p>
                                </div>
                                <button
                                    onClick={() => setShowChangePasswordModal(true)}
                                    className="bg-blue-600 text-white px-4 py-2 cursor-pointer text-xs md:text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Change
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-2 md:p-4 bg-red-50 rounded-lg border border-red-200">
                                <div>
                                    <h3 className="font-semibold text-red-800 text-sm md:text-md">Logout</h3>
                                    <p className="text-sm text-red-700 text-xs md:text-sm">Sign out from your account</p>
                                </div>
                                <button
                                    onClick={() => setLogoutModalOpen(true)}
                                    className="bg-red-600 text-white cursor-pointer px-4 py-2 text-xs md:text-sm rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Admin Modal */}
                {showAddAdminModal && (
                    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800">Add New Admin</h3>
                                <button
                                    onClick={closeAdminModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        value={newAdminName}
                                        onChange={(e) => setNewAdminName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter full name"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        value={newAdminEmail}
                                        onChange={(e) => setNewAdminEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                                    <select
                                        value={newAdminRole}
                                        onChange={(e) => setNewAdminRole(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="developer">Developer</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {newAdminRole === "super_admin" && "Full access to all features including admin management"}
                                        {newAdminRole === "developer" && "Access to development and technical features"}
                                        {newAdminRole === "admin" && "Standard admin access to manage content and users"}
                                    </p>
                                    {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                                </div>
                            </div>

                            <div className="flex gap-3 p-6 border-t border-gray-200">
                                <button
                                    onClick={closeAdminModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddAdmin}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Add Admin'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Profile Modal */}
                {showEditProfileModal && (
                    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800">Edit Profile</h3>
                                <button
                                    onClick={() => setShowEditProfileModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        value={editEmail}
                                        disabled
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        className="w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 p-6 border-t border-gray-200">
                                <button
                                    onClick={() => setShowEditProfileModal(false)}
                                    className="flex-1 px-4 py-2 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Change Password Modal */}
                {showChangePasswordModal && (
                    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
                                <button
                                    onClick={cancelChangePassword}
                                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password *</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter new password"
                                    />
                                    {errors.newPasswordError && (
                                        <p className="text-red-500 text-sm">{errors.newPasswordError}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password *</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Confirm new password"
                                    />
                                    {errors.confirmPasswordError && (
                                        <p className="text-red-500 text-sm">{errors.confirmPasswordError}</p>
                                    )}
                                </div>
                                {errors.AllPassError && (
                                    <p className="text-red-500 text-sm">{errors.AllPassError}</p>
                                )}
                            </div>

                            <div className="flex gap-3 p-6 border-t border-gray-200">
                                <button
                                    onClick={cancelChangePassword}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Change'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {logoutModalOpen && <LogoutModal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} onConfirm={logout} />}
                {deleteModalOpen && <RemoveAdminAlert isOpen={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setSelectedAdmin({}) }} onConfirm={() => deleteAdmin(selectedAdmin)} isDeleting={isDeleting} />}
                

            </div>
        </>

    );
};

export default Setting;