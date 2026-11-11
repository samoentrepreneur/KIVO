import { useRef, useState,useEffect } from "react";
import {
    ChevronDown,
    ChevronUp,
    X,
    ShoppingCart,
    Home,
    User2,
    LogOut,
    Moon,
    Sun,
    CardSim,
    CreditCard,
    HandCoins,
    Gamepad2,
    Gift, Tag, Tv,
    Loader,
    ShoppingBag
} from "lucide-react";
import useClickOutside from "../hooks/useOutsideClick";
import { useTheme } from "../context/ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useProducts } from "../context/Products.context";


const categoryStyles = {
    mobilegames: {
        bg: "bg-green-100",
        icon: <Gamepad2 className="w-4 h-4 md:w-6 md:h-6 text-green-600" />,
        label: "Mobile Games Top-Up"
    },
    streaming: {
        bg: "bg-purple-100",
        icon: <Tv className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />,
        label: "Streaming Services"
    },
    giftcard: {
        bg: "bg-red-100",
        icon: <Gift className="w-4 h-4 md:w-6 md:h-6 text-red-600" />,
        label: "Gift Cards"
    },
    cards: {
        bg: "bg-blue-100",
        icon: <CreditCard className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />,
        label: "Payment Cards"
    },
    mobiletopup: {
        bg: "bg-yellow-100",
        icon: <CardSim className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />,
        label: "Mobile Top-Up"
    },
    default: {
        bg: "bg-gray-100",
        icon: <Tag className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />,
        label: "Others"
    }
};

const NavbarDropdown = ({ isOpen, onClose }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const { isDark, setDark } = useTheme();
    const { pathname } = useLocation();
    const { categories,loading, error } = useProducts();
   

    const wrapperRef = useRef(null);
    const mobileNavWrapper = useRef(null);
    const navigate = useNavigate();
    useClickOutside(wrapperRef, () => {
        if (currentMenu?.data) setActiveMenu(null);
    });

    useClickOutside(mobileNavWrapper, onClose);

    useEffect(() => {
        const matchedMenu = menus.find(m =>
            pathname === m.path || pathname.startsWith(m.path + "/")
        );
        setActiveMenu(matchedMenu ? matchedMenu.id : null);
    }, [pathname]);





    const toggleMenu = (menu) => {
        const hasDropdown = !!menu.data;

        if (hasDropdown) {
            setActiveMenu(prev => prev === menu.id ? null : menu.id);
        } else {
            if (menu.path) {
                navigate(menu.path);
                onClose();
            }
           
        }
    };
    const formaturlSlug = (text = "") =>
        String(text)
            .trim()
            .replace(/([a-z])([A-Z])/g, "$1-$2")
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-");

  



    const menus = [
        { id: "home", title: "Home", icon: Home, path: "/" },
        { id: "profile", title: "Profile", icon: User2, path: "/profile" },

        {
            id: "services",
            title: "Services",
            icon: HandCoins,
            data: loading
                ? [{ name: "Loading...", icon: () => <Loader />, path: null, disabled: true }]
                : error
                    ? [{ name: "Failed to load categories", icon: () => <Tag />, path: null, disabled: true }]
                    : categories.map(cat => {
                        const key = cat._id.toLowerCase();
                        const style = categoryStyles[key] || categoryStyles.default;

                        return {
                            name: style.label,
                            icon: () => style.icon,
                            path: `/discover/${formaturlSlug(cat._id)}`,
                            disabled: false
                        };
                    })
        },
        { id: "addtocart", title: "Cart", icon: ShoppingCart, path: "/cart" },
        { id: "orders", title: "Orders", icon: ShoppingBag,path:'/my-orders' },
    ];


    const currentMenu = menus.find((m) => m.id === activeMenu);

    const desktopMenus = menus.filter((m) =>
        ["home", "services", "orders"].includes(m.id)
    );

    return (
        <div ref={wrapperRef} className="relative">
            {isOpen && (
                <div
                    onClick={onClose} 
                    className="w-full h-screen sm:hidden fixed top-0 left-0  z-90 bg-black/50 flex flex-col justify-between"
                >
                    
                    
                    <div ref={mobileNavWrapper} onClick={(e) => e.stopPropagation()} className=" w-[75%] max-w-xs h-screen bg-white dark:bg-gray-900 shadow ">
                        <div className="flex items-center justify-between py-4 px-4 border-b border-black/10 dark:border-white/10">
                            <span className="font-bold text-lg text-black dark:text-white">Menu</span>
                            <X
                                strokeWidth={2}
                                className="cursor-pointer text-black dark:text-white"
                                onClick={onClose}
                            />
                        </div>

                        <div className="flex flex-col p-4 gap-2">
                            {menus.map((menu) => {
                                const Icon = menu.icon;
                                const hasDropdown = !!menu.data;
                                return (
                                    <div key={menu.id} className="pb-2">
                                        <button
                                            onClick={() => toggleMenu(menu)}
                                            className={`w-full flex items-center justify-between font-semibold py-2 cursor-pointer hover:text-blue-400 ${activeMenu === menu.id
                                                ? "text-blue-400"
                                                : "text-gray-800 dark:text-gray-100"
                                                }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Icon size={18} />
                                                {menu.title}
                                            </span>

                                            {hasDropdown &&
                                                (activeMenu === menu.id ? <ChevronUp /> : <ChevronDown />)}
                                        </button>

                                        {hasDropdown && (
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${activeMenu === menu.id
                                                    ? "max-h-80 opacity-100"
                                                    : "max-h-0 opacity-0"
                                                    }`}
                                            >
                                                <div className="mt-2 space-y-2">
                                                    {menu.data.map((item, i) => {
                                                        const ItemIcon = item.icon;
                                                        return (
                                                            <p
                                                                key={i}
                                                                onClick={() => { navigate(item.path); onClose()}}
                                                                className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 dark:text-white hover:text-blue-400"
                                                            >
                                                                <ItemIcon size={16} />
                                                                {item.name}
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="px-4 py-4 border-t border-black/10 dark:border-white/10 space-y-4">
                            {/* Dark Mode Toggle */}
                            <button
                                onClick={() => setDark((p) => !p)}
                                className="flex items-center gap-2 text-gray-800 dark:text-gray-100 cursor-pointer"
                            >
                                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                                <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                            </button>
                           
                        </div>
                    </div>

                  
                </div>
            )}

            {!pathname.startsWith("/checkout") && (
                <>
                    <div className="hidden sm:flex items-center justify-start gap-8 border-t border-[#EEF0F4] py-3 dark:border-white/10">
                        {desktopMenus.map((menu) => {
                            const Icon = menu.icon;
                            const hasDropdown = !!menu.data;

                            return (
                                <button
                                    key={menu.id}
                                    onClick={() => toggleMenu(menu)}
                                    className={`flex items-center gap-2 text-sm font-semibold cursor-pointer transition-colors hover:text-[#3657E8] dark:hover:text-[#A9B8FF] ${activeMenu === menu.id
                                        ? "text-blue-400"
                                        : "text-gray-700 dark:text-gray-200"
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{menu.title}</span>

                                    {hasDropdown &&
                                        (activeMenu === menu.id ? <ChevronUp /> : <ChevronDown />)}
                                </button>
                            );
                        })}
                    </div>


                    <div
                        className={`hidden sm:block absolute left-0 w-full bg-white dark:bg-gray-900 shadow-md border border-black/10 dark:border-white/10 transition-all duration-300 overflow-hidden ${currentMenu?.data
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 pointer-events-none -translate-y-3"
                            }`}
                    >
                        {currentMenu?.data && (
                            <div className="max-w-5xl mx-auto px-6 py-6">
                                <div className="flex flex-col gap-4">
                                    {currentMenu.data.map((item, i) => {
                                        const ItemIcon = item.icon;

                                        return (
                                            <p
                                                key={i}
                                                onClick={() => navigate(item.path)}
                                                className="flex items-center gap-2 text-gray-800 dark:text-gray-200 cursor-pointer hover:text-blue-400"
                                            >
                                                {ItemIcon()}
                                                {item.name}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        )}


                    </div>
                </>
            )}
        </div>
    );
};

export default NavbarDropdown;
