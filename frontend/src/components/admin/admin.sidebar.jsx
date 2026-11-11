import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    Settings,
    Bell,
    PanelRightOpen,
    PanelRightClose,
    SquareActivity,
    Plus,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const { pathname } = useLocation();

    const sections = [
        {
            label: "MAIN",
            items: [
                { title: "Dashboard", icon: <LayoutDashboard  size={18} />, path: "/admin/dashboard" },
                { title: "Users", icon: <Users size={18} />, path: "/admin/dashboard/users" },
                { title: "Products", icon: <Package size={18} />, path: "/admin/dashboard/products" },
                { title: "Orders", icon: <ShoppingCart size={18} />, path: "/admin/dashboard/orders" },
            ],
        },
        {
            label: "ADMIN",
            items: [
                { title: "Add products", icon: <Plus size={18} />, path: "/admin/dashboard/add-products" },
                { title: "Add advertisement", icon: <Plus size={18} />, path: "/admin/dashboard/add-advertisement" },
                { title: "Settings", icon: <Settings size={18} />, path: "/admin/dashboard/setting" },
                { title: "Notifications", icon: <Bell size={18} />, path: "/admin/dashboard/notifications" },
                { title: "Activity logs", icon: <SquareActivity size={18} />, path: "/admin/dashboard/activity-logs" },
            ],
        },
    ];

    const handleNavClick = () => {
        if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    return (
        <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-gray-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 z-110 `} >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-[10px] border-b border-gray-700">
                <div
                    className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                        }`}
                >
                    <h1 className="text-xl font-bold tracking-wide">
                        Admin <span className="text-blue-400">Panel</span>
                    </h1>
                </div>

                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-all"
                >
                    {sidebarOpen ? <PanelRightOpen size={22} /> : <PanelRightClose size={22} />}
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-scroll  mt-4">
                {sections.map((section, idx) => (
                    <div key={idx} className="mb-5">
                        <p
                            className={`text-xs text-gray-500 font-semibold px-3 transition-all duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
                                }`}
                        >
                            {section.label}
                        </p>

                        {section.items.map((item, i) => {
                            const isActive = pathname === item.path;

                            return (
                                <NavLink
                                    key={i}
                                    to={item.path}
                                    onClick={handleNavClick}
                                    className={`flex items-center gap-3 px-3 py-3 transition-all ${isActive ? "bg-gray-800 border-l-4 border-blue-500" : "border-l-4 border-gray-900"
                                        }`}
                                >
                                    {item.icon}
                                    <span
                                        className={`transition-all duration-300 whitespace-nowrap ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                                            }`}
                                    >
                                        {item.title}
                                    </span>
                                </NavLink>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
