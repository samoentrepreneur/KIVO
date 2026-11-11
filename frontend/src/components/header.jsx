import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, ShoppingCart, Sun, Moon, Menu, X, ChevronDown, Gift, Gamepad2, Tv, CreditCard, Smartphone, UserRound } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useUserAuth } from "../context/user.authContext";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/Products.context";
import UserAvatar1 from "../assets/avatar/user_avatar_2.png";
import KivoWordmark from "../assets/logos/kivo-wordmark.png";
import KivoWordmarkWhite from "../assets/logos/kivo-wordmark-white.png";
import Advertisement from "./Advertisement";

const iconFor = (id = "") => {
  const key = String(id).toLowerCase();
  if (key.includes("gift")) return Gift;
  if (key.includes("game")) return Gamepad2;
  if (key.includes("stream")) return Tv;
  if (key.includes("card") || key.includes("payment")) return CreditCard;
  if (key.includes("mobile") || key.includes("top")) return Smartphone;
  return ShoppingBag;
};

export default function Header() {
  const { isDark, setDark } = useTheme();
  const { user, loading } = useUserAuth();
  const { cartCount } = useCart();
  const { categories = [] } = useProducts();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onPointer = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setServicesOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
        setMobileOpen(false);
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (value) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
      setMobileSearchOpen(false);
      setMobileOpen(false);
    }
  };

  const formatSlug = (value = "") => String(value).trim()
    .replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
    .replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");

  const navClass = ({ isActive }) =>
    `inline-flex items-center gap-2 py-3 text-sm font-semibold transition-colors ${isActive ? "text-[#3657E8] dark:text-[#C8F169]" : "text-[#475467] hover:text-[#3657E8] dark:text-white/80 dark:hover:text-[#C8F169]"}`;

  return (
    <>
      <header className="sticky top-0 z-[100] border-b border-[#E7EAF0] bg-white/95 text-[#111827] shadow-[0_2px_12px_rgba(17,24,39,0.035)] backdrop-blur-xl dark:border-white/10 dark:bg-[#111827]/95 dark:text-white">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-5 px-4 sm:px-7 lg:px-12">
          <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu" className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#344054] hover:bg-[#F2F4F7] sm:hidden dark:text-white dark:hover:bg-white/10">
            <Menu size={21} />
          </button>

          <button type="button" onClick={() => navigate("/")} aria-label="KIVO home" className="shrink-0">
            <img src={isDark ? KivoWordmarkWhite : KivoWordmark} alt="KIVO" className="h-8 w-auto object-contain sm:h-9" />
          </button>

          <form onSubmit={submitSearch} role="search" className="mx-auto hidden h-11 max-w-[700px] flex-1 items-center rounded-full border border-[#D9DDE7] bg-[#F6F7FB] px-4 transition focus-within:border-[#3657E8] focus-within:ring-4 focus-within:ring-[#3657E8]/10 md:flex dark:border-[#344054] dark:bg-[#111827]">
            <Search size={18} className="mr-3 shrink-0 text-[#7A8496]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search brands, gift cards & games" aria-label="Search products" className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98A2B3] dark:text-white" />
            <button type="submit" aria-label="Submit search" className="ml-2 grid h-8 w-8 place-items-center rounded-full text-[#667085] hover:bg-white dark:text-[#A8B3C5] dark:hover:bg-white/10"><Search size={17} /></button>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <button type="button" onClick={() => setMobileSearchOpen(true)} aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full text-[#344054] hover:bg-[#F2F4F7] md:hidden dark:text-white dark:hover:bg-white/10"><Search size={20} /></button>
            <button type="button" onClick={() => navigate("/cart")} aria-label={`Cart, ${cartCount} items`} className="relative grid h-10 w-10 place-items-center rounded-full text-[#344054] transition hover:bg-[#F2F4F7] dark:text-white dark:hover:bg-white/10">
              <ShoppingCart size={21} />
              <span className="absolute right-0.5 top-0.5 grid min-h-[17px] min-w-[17px] place-items-center rounded-full bg-[#3657E8] px-1 text-[10px] font-bold text-white">{cartCount}</span>
            </button>
            <button type="button" onClick={() => setDark((value) => !value)} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} className="grid h-10 w-10 place-items-center rounded-full border border-[#E5E7EB] bg-white text-[#344054] transition hover:border-[#3657E8] dark:border-[#344054] dark:bg-[#111827] dark:text-[#C8F169]">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {loading ? <span className="h-9 w-9 animate-pulse rounded-full bg-[#E5E7EB] dark:bg-[#344054]" /> : user ? (
              <button type="button" onClick={() => navigate("/profile")} aria-label="Your profile" className="h-9 w-9 overflow-hidden rounded-full border border-[#E5E7EB] bg-[#F2F4F7] dark:border-[#344054]">
                {user.avatar && !profileError ? <img src={user.avatar} onError={() => setProfileError(true)} alt="" className="h-full w-full object-cover" /> : user.fullName ? <span className="grid h-full w-full place-items-center font-bold">{user.fullName.charAt(0).toUpperCase()}</span> : <img src={UserAvatar1} alt="" className="h-full w-full object-cover" />}
              </button>
            ) : <button type="button" onClick={() => navigate("/auth/login")} className="rounded-full bg-[#3657E8] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#2948D4]">Login</button>}
          </div>
        </div>

        <div className="hidden border-t border-[#F0F1F4] sm:block dark:border-white/5">
          <nav className="mx-auto flex h-[48px] max-w-[1440px] items-center gap-8 px-7 lg:px-12">
            <NavLink to="/" end className={navClass}>Home</NavLink>
            <div ref={menuRef} className="relative h-full">
              <button type="button" onClick={() => setServicesOpen((value) => !value)} aria-expanded={servicesOpen} className={`inline-flex h-full items-center gap-2 text-sm font-semibold transition-colors ${servicesOpen ? "text-[#3657E8] dark:text-[#C8F169]" : "text-[#475467] hover:text-[#3657E8] dark:text-white/80 dark:hover:text-[#C8F169]"}`}>
                Services <ChevronDown size={16} className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && <div className="absolute left-0 top-full z-[120] mt-1 w-[330px] overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-[0_18px_50px_rgba(17,24,39,0.16)] dark:border-[#344054] dark:bg-[#111827]">
                {categories.map((category) => {
                  const Icon = iconFor(category._id);
                  const label = category.name || category._id;
                  return <button key={category._id} type="button" onClick={() => { navigate(`/discover/${formatSlug(category._id)}`); setServicesOpen(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-[#344054] transition hover:bg-[#F4F6FC] hover:text-[#3657E8] dark:text-[#E5E7EB] dark:hover:bg-white/5 dark:hover:text-[#C8F169]">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#EEF2FF] text-[#3657E8] dark:bg-[#3657E8]/15 dark:text-[#C8F169]"><Icon size={18} /></span>{label}
                  </button>;
                })}
                {!categories.length && <p className="px-3 py-4 text-sm text-[#667085] dark:text-[#A8B3C5]">Explore our digital services.</p>}
              </div>}
            </div>
            <NavLink to="/my-orders" className={navClass}><ShoppingBag size={17} /> Orders</NavLink>
          </nav>
        </div>

        {mobileSearchOpen && <div className="border-t border-[#E7EAF0] p-3 md:hidden dark:border-[#344054]">
          <form onSubmit={submitSearch} className="flex h-11 items-center gap-2 rounded-full border border-[#D9DDE7] bg-[#F6F7FB] px-4 dark:border-[#344054] dark:bg-[#111827]">
            <Search size={18} className="text-[#7A8496]" />
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search brands, gift cards & games" className="min-w-0 flex-1 bg-transparent text-sm outline-none dark:text-white" />
            <button type="button" onClick={() => setMobileSearchOpen(false)} aria-label="Close search"><X size={18} /></button>
          </form>
        </div>}
      </header>

      {mobileOpen && <div className="fixed inset-0 z-[200] bg-black/50 sm:hidden" onClick={() => setMobileOpen(false)}>
        <aside onClick={(event) => event.stopPropagation()} className="h-full w-[min(86vw,360px)] overflow-y-auto bg-white p-5 shadow-2xl dark:bg-[#111827]">
          <div className="mb-8 flex items-center justify-between">
            <img src={isDark ? KivoWordmarkWhite : KivoWordmark} alt="KIVO" className="h-8 w-auto" />
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full bg-[#F2F4F7] dark:bg-white/10"><X size={19} /></button>
          </div>
          <nav className="space-y-1">
            <NavLink to="/" end onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 font-semibold hover:bg-[#F4F6FC] dark:hover:bg-white/5">Home</NavLink>
            <p className="px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#98A2B3]">Browse services</p>
            {categories.map((category) => {
              const Icon = iconFor(category._id);
              return <button key={category._id} type="button" onClick={() => { navigate(`/discover/${formatSlug(category._id)}`); setMobileOpen(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium hover:bg-[#F4F6FC] dark:hover:bg-white/5"><Icon size={18} className="text-[#3657E8] dark:text-[#C8F169]" />{category.name || category._id}</button>;
            })}
            <NavLink to="/my-orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 font-semibold hover:bg-[#F4F6FC] dark:hover:bg-white/5"><ShoppingBag size={18} /> My orders</NavLink>
            {user && <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 font-semibold hover:bg-[#F4F6FC] dark:hover:bg-white/5"><UserRound size={18} /> My account</NavLink>}
          </nav>
        </aside>
      </div>}
      <Advertisement />
    </>
  );
}
