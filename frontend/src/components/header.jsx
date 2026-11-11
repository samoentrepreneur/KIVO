import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, TextAlignStart, ShoppingCart, Search, X } from 'lucide-react';
import UserAvatar1 from "../assets/avatar/user_avatar_2.png";
import KivoWordmark from "../assets/logos/kivo-wordmark.png";
import KivoWordmarkWhite from "../assets/logos/kivo-wordmark-white.png";
import { useNavigate } from "react-router-dom"
import useClickOutside from "../hooks/useOutsideClick";
import NavbarDropdown from "./navDropDown";

import { useUserAuth } from "../context/user.authContext";
import { useCart } from "../context/CartContext";
import Advertisement from "./Advertisement";


const Header = ({ showSearch }) => {
    const { isDark, setDark } = useTheme();
    const [isProfileError, setProfileError] = useState(false);
    const [isSideBarOpen, setSidebarOpen] = useState(false);
    const mobileSearchRef = useRef();
    const navigate = useNavigate();
    const { user, loading } = useUserAuth();
    const { cartCount } = useCart();
    const [querry, setQuerry] = useState("")
    const [showSearhBarInMobile, setShowSearchBarInMobile] = useState(false);




    useEffect(() => {
        const esc = (e) => e.key === "Escape" && setShowSearchBarInMobile(false);
        window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && querry.trim()) {
            navigate(`/search?q=${encodeURIComponent(querry.trim())}`);
        }
    };

    useClickOutside(mobileSearchRef, () => setShowSearchBarInMobile(false));

    const DarkMode = () => {
        const Icon = isDark ? Sun : Moon;
        return (
            <button onClick={() => setDark(prev => !prev)} className={`shadow-lg rounded-full hidden md:block p-2 cursor-pointer ${isDark ? "bg-yellow-600 text-white" : "bg-gray-900 text-white"} hover:scale-108 transition-all duration-200 `}>
                <Icon size={16} />
            </button>
        )
    }


    return (
        <>
        <div className="flex flex-1 sticky top-0 z-100 border-b border-black/10 dark:border-white/5 ">
            <header className="bg-white dark:bg-gray-900 w-full flex-1 transition-all duration-300">
                {showSearhBarInMobile && (
                    <div ref={mobileSearchRef} className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 p-3 md:hidden">
                        <div className="w-full gap-4 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-500 flex items-center focus-within:border-blue-500">
                            <Search className="h-5 w-5 shrink-0 text-[#7A8496]" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search brands, gift cards & games"
                                className="w-full bg-transparent outline-none text-sm text-[#111827] placeholder:text-[#98A2B3] dark:text-white dark:placeholder:text-[#8290A5]"
                                value={querry}
                                onChange={(e) => setQuerry(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <X onClick={()=>setShowSearchBarInMobile(false)} className="h-5 w-5 text-gray-500" />
                        </div>
                    </div>
                )}

                <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
                    <div className="flex h-[68px] items-center justify-between gap-5">
                        {/* Logo */}
                        <div className="flex items-center gap-2 space-x-2">
                            <TextAlignStart strokeWidth={2} className="flex sm:hidden text-black dark:text-white" onClick={() => setSidebarOpen(true)} />
                            <img src={isDark ? KivoWordmarkWhite : KivoWordmark} alt="KIVO" className="h-7 md:h-8 w-auto object-contain" />
                        </div>

                        <div className="hidden md:flex min-w-0 flex-1 max-w-[720px] mx-4 lg:mx-10">
                            <div className="w-full h-11 px-4 rounded-full border border-[#D9DDE7] bg-[#F8F9FC] flex items-center transition focus-within:border-[#3657E8] focus-within:ring-4 focus-within:ring-[#3657E8]/10 dark:border-[#344054] dark:bg-[#1B2536]">
                                <input
                                    type="text"
                                    placeholder="Search brands, gift cards & games"
                                    className="w-full outline-none dark:placeholder:text-gray-500 font-medium dark:text-white"
                                    value={querry}
                                    onChange={(e) => setQuerry(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <Search className="h-5 w-5 text-gray-500" />
                            </div>
                        </div>

                        {/* Right side icons */}
                        <div className="flex items-center  space-x-3 md:space-x-4">
                            <Search onClick={()=>setShowSearchBarInMobile(true)} className="flex md:hidden h-6 w-6 text-gray-700 dark:text-gray-200" />
                            <div className="relative cursor-pointer hover:scale-110 transition-all duration-300">
                                <ShoppingCart onClick={()=>navigate("/cart")} strokeWidth={2} className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1 py-0 rounded-full">
                                        {cartCount}
                                    </span>
                            </div>
                            <DarkMode />
                            {loading ? (
                                <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-gray-300 animate-pulse"></div>
                            ) : user ? (
                                <div className="relative" onClick={() => navigate("/profile")}>
                                    <div
                                        className="h-7 w-7 md:h-8 md:w-8 rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-all duration-300 flex items-center justify-center bg-gray-200"
                                    >
                                        {user?.avatar && !isProfileError ? (
                                            <img
                                                src={user.avatar}
                                                onError={() => setProfileError(true)}
                                                className="w-full h-full object-cover"
                                                alt="Profile"
                                            />
                                        ) : user?.fullName ? (
                                            user.fullName.charAt(0).toUpperCase()
                                        ) : (
                                            <img src={UserAvatar1} className="w-full h-full object-cover" alt="default" />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => navigate('/auth/login')} className="rounded-full text-white px-4 py-1 text-sm cursor-pointer bg-blue-600 hover:shadow-md hover:scale-108 font-medium">
                                    Login
                                </button>
                            )}

                        </div>
                    </div>

                    <nav className="flex items-center justify-between ">
                        <NavbarDropdown isOpen={isSideBarOpen} onClose={() => setSidebarOpen(false)} />
                    </nav>
                </div>
            </header>
        </div>
            <Advertisement />
        </>
    );
};

export default Header;
