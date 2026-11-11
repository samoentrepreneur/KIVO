import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/admin.sidebar";
import { Bell, Menu, Search, TextAlignStart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LogOut, User, Settings } from "lucide-react";
import { ShieldCheck, } from "lucide-react";
import { useAuth } from "../context/admin.authContext";
import LogoutModal from "../modal/LogoutModal";
import { useNotifications } from "../context/NotificationContext";
function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);
    const { admin, logout } = useAuth()
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const { unreadCount } = useNotifications();
    document.title = "EASYPAY - ADMIN";


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setShowPopup(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);




    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 lg:hidden z-10"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main
                className={`flex-1 transition-all duration-300  ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"
                    }`}
            >

                {/* Header */}
                <div className="flex items-center justify-between sticky top-0 gap-4 shadow-sm px-4 py-2 bg-white z-10">
                    <div className="flex flex-row items-center gap-2">
                        {/* Mobile Menu Toggle */}
                        <button
                            className=" lg:hidden rounded-md hover:bg-gray-200 cursor-pointer"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <TextAlignStart size={30} />
                        </button>

                        {/* <DashboardHeader userName={admin.name.split(" ")[0]} /> */}
                        <div className="flex items-center gap-2 px-4 py-1 md:py-2 bg-gray-100 rounded-full border border-transparent focus-within:border-blue-600 transition">
                            <Search size={18} strokeWidth={2} className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                            />
                        </div>

                    </div>

                    <div className="flex items-center gap-2 md:gap-4">

                        <div onClick={()=>navigate("/admin/dashboard/notifications")} className="relative">
                            <div className="h-8 w-8 bg-gray-100 border border-gray-300 cursor-pointer flex items-center justify-center rounded-full hover:bg-gray-200 transition">
                                <Bell size={18} className="text-gray-600 hover:text-gray-800 transition" />
                            </div>
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1 py-0 rounded-full">
                                {unreadCount}
                            </span>
                        </div>


                        <div className="relative ">
                        <div
                            onClick={() => setShowPopup(!showPopup)}
                            className="cursor-pointer flex items-center gap-2 p-1  hover:opacity-90"
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                {!imgError && admin?.avatar ? (
                                    <img
                                        src={admin?.avatar}
                                        className="w-full h-full object-cover"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <div className="bg-blue-950 text-white font-bold flex items-center justify-center w-full h-full">
                                        {admin?.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="hidden md:flex flex-col leading-tight">
                                <span className="text-xs font-bold">{admin.name}</span>
                                <span className="text-[10px] text-gray-500 font-semibold">{admin.role}</span>
                            </div>
                        </div>

                        {/* POPUP CARD */}
                        {showPopup && (
                            <div
                                ref={popupRef}
                                className="absolute right-0  mt-1 w-60 md:w-72 bg-white shadow-xl rounded-xl border border-gray-200 px-4 py-6 z-50"
                            >
                                {/* Avatar */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full overflow-hidden">
                                        {!imgError && admin?.avatar ? (
                                            <img
                                                src={admin?.avatar}
                                                className="w-full h-full object-cover"
                                                onError={() => setImgError(true)}
                                            />
                                        ) : (
                                                    <div className="bg-blue-950 font-bold  text-white flex items-center justify-center w-full h-full">
                                                {admin?.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-semibold mt-2">{admin.name}</h3>
                                    <p className="text-xs text-gray-500">{admin.email}</p>

                                    {/* ROLE BADGE */}
                                    <span className="mt-2 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                                        <ShieldCheck size={12} />
                                        {admin.role === "admin"
                                            ? "Admin"
                                            : admin.role === "superadmin"
                                                ? "Super Admin"
                                                : "Developer"}

                                    </span>
                                </div>

                                {/* Join Date */}
                                <p className="text-xs text-gray-500 text-center mt-3">
                                    Joined: {new Date(admin?.createdAt).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "2-digit",
                                    })}
                                </p>


                                {/* Actions */}
                                <div className="mt-4 flex flex-col gap-2">

                                    <button
                                            onClick={() => { setLogoutModalOpen(true); setShowPopup(false); }}
                                        className="w-full py-2 border border-gray-300 cursor-pointer rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2 text-red-600"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    </div>
                </div>

                {/* Routed Screens */}
                <Outlet />
            </main>

            {logoutModalOpen && <LogoutModal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} onConfirm={logout} />}

        </div>
    );
}

export default AdminLayout;
