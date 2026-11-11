import { ArrowUpRight, ShieldCheck } from "lucide-react";
import Logo from "../assets/logos/kivo-wordmark-white.png";
import Playstore from "../assets/logos/playstore.png";
import Whatsapp from "../assets/logos/whatsapp.png";
import FacebookAsset from "../assets/logos/facebook.png";
import InstaAsset from "../assets/logos/insta.png";
import TikTokAsset from "../assets/logos/tiktok.png";
import { Link } from "react-router-dom";

const socialLinks = [
  { label: "Facebook", icon: FacebookAsset, href: "https://facebook.com" },
  { label: "Instagram", icon: InstaAsset, href: "https://instagram.com" },
  { label: "WhatsApp", icon: Whatsapp, href: "https://wa.me/1234567890" },
  { label: "TikTok", icon: TikTokAsset, href: "https://tiktok.com" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0D1422] text-white">
      <div className="pointer-events-none absolute -right-40 -top-48 h-[430px] w-[430px] rounded-full border border-white/[0.06]" />
      <div className="pointer-events-none absolute -right-20 -top-28 h-[300px] w-[300px] rounded-full border border-white/[0.06]" />

      <div className="mx-auto max-w-[1440px] px-5 pb-7 pt-14 sm:px-8 lg:px-12 lg:pt-[72px]">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.2fr_2fr] lg:gap-20">
          <div className="max-w-sm">
            <Link to="/" aria-label="KIVO home" className="inline-flex">
              <img src={Logo} alt="KIVO" className="h-10 w-auto object-contain" />
            </Link>
            <p className="mt-5 max-w-xs text-[15px] leading-7 text-[#A8B3C5]">Your digital world, in one place. Discover digital products and services without the detours.</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] transition hover:border-[#C8F169]/50 hover:bg-white/10">
                  <img src={social.icon} alt="" className="h-[18px] w-[18px] object-contain brightness-0 invert" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Explore</h3>
              <ul className="mt-5 space-y-3 text-sm text-[#C0CAD9]">
                <li><Link to="/search?q=gift%20cards" className="transition hover:text-[#C8F169]">Gift cards</Link></li>
                <li><Link to="/search?q=gaming" className="transition hover:text-[#C8F169]">Gaming</Link></li>
                <li><Link to="/search?q=subscriptions" className="transition hover:text-[#C8F169]">Subscriptions</Link></li>
                <li><Link to="/search?q=digital%20payments" className="transition hover:text-[#C8F169]">Digital payments</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Your account</h3>
              <ul className="mt-5 space-y-3 text-sm text-[#C0CAD9]">
                <li><Link to="/auth/login" className="transition hover:text-[#C8F169]">Sign in</Link></li>
                <li><Link to="/profile" className="transition hover:text-[#C8F169]">My account</Link></li>
                <li><Link to="/my-orders" className="transition hover:text-[#C8F169]">Order history</Link></li>
                <li><Link to="/cart" className="transition hover:text-[#C8F169]">Shopping cart</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Need help?</h3>
              <ul className="mt-5 space-y-3 text-sm text-[#C0CAD9]">
                
                <li><a href="#" className="transition hover:text-[#C8F169]">Refund policy</a></li>
                <li><a href="#" className="transition hover:text-[#C8F169]">Privacy policy</a></li>
                <li><a href="#" className="transition hover:text-[#C8F169]">Terms & conditions</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-b border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex max-w-lg items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#C8F169]/10 text-[#C8F169]"><ShieldCheck size={20} /></span>
            <div>
              <p className="text-sm font-semibold text-white">A clearer digital shopping experience</p>
              <p className="mt-1 text-xs leading-5 text-[#8E9AAF]">Keep your orders and digital purchases organized in one place.</p>
            </div>
          </div>
          <div className="inline-flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <img src={Playstore} alt="" className="h-7 w-7 object-contain" />
            <span><span className="block text-[10px] text-[#8E9AAF]">GET THE APP</span><span className="mt-0.5 block text-sm font-semibold">Google Play</span></span>
            <ArrowUpRight size={16} className="ml-2 text-[#C8F169]" />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-[#8390A5] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} KIVO. All rights reserved.</p>
          <p className="tracking-wide">Your digital world, in one place.</p>
        </div>
      </div>
    </footer>
  );
}
