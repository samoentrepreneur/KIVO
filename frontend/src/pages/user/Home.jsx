import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowUpRight,
    Tv,
    Smartphone,
    Search,
    ShieldCheck,
    Zap,
    Headphones,
} from "lucide-react";

import AmazonBanner from "../../assets/banners/amazon_banner.jpeg";
import EpayBanner from "../../assets/banners/epay_banner.jpeg";
import StreamBanner from "../../assets/banners/stream_banner.jpeg";

const spotlights = [
    {
        eyebrow: "GIFT CARDS",
        title: "A little more freedom to choose.",
        copy: "Discover digital gift cards for the brands, games and experiences you love.",
        image: AmazonBanner,
        imageAlt: "Gift card service available through KIVO",
        action: "Explore gift cards",
        query: "gift cards",
        theme: "light",
    },
    {
        eyebrow: "STREAMING & ENTERTAINMENT",
        title: "Make room for more of what you love.",
        copy: "Find subscriptions and digital entertainment services in one place.",
        image: StreamBanner,
        imageAlt: "Streaming services",
        action: "Explore subscriptions",
        query: "streaming",
        theme: "dark",
    },
];

export default function Home() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    useEffect(() => {
        document.title = "KIVO — Your digital world, in one place";
    }, []);

    const goToSearch = (value) => {
        const clean = value.trim();
        if (clean) navigate(`/search?q=${encodeURIComponent(clean)}`);
    };

    const submitSearch = (event) => {
        event.preventDefault();
        goToSearch(query);
    };

    return (
        <main className="kivo-home bg-[#F6F7FB] text-[#111827] dark:bg-[#111827] dark:text-white">
            {/* Utility strip */}
            <div className="border-b border-white/10 bg-[#111827] text-white">
                <div className="mx-auto flex max-w-[1440px] items-center justify-center px-4 py-2 text-[11px] font-medium tracking-[0.04em] sm:text-xs">
                    <span className="text-white/75">Your digital world,</span>
                    <span className="ml-1.5 font-semibold text-[#C8F169]">in one place.</span>
                </div>
            </div>

            {/* Editorial hero */}
            <section className="bg-white dark:bg-[#111827]">
                <div className="mx-auto grid max-w-[1440px] gap-8 px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-12 lg:px-12 lg:pb-20 lg:pt-16">
                    <div className="max-w-[590px]">
                        <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#3657E8] dark:text-[#A9B8FF]">
                            THE DIGITAL MARKETPLACE
                        </p>
                        <h1 className="font-[Manrope] text-[2.65rem] font-extrabold leading-[1.04] tracking-[-0.055em] text-[#111827] dark:text-white sm:text-5xl lg:text-[4.15rem]">
                            Your next digital essential
                            <span className="text-[#3657E8] dark:text-[#A9B8FF]"> starts here.</span>
                        </h1>
                        <p className="mt-6 max-w-[470px] text-[15px] leading-7 text-[#667085] dark:text-[#A8B3C5] sm:text-base">
                            Gift cards, game credits, subscriptions and everyday digital services. Find what you need, all in one place.
                        </p>

                        <form onSubmit={submitSearch} role="search" className="mt-8 flex h-[58px] max-w-[510px] items-center rounded-xl border border-[#D9DDE7] bg-white p-1.5 transition focus-within:border-[#3657E8] focus-within:ring-4 focus-within:ring-[#3657E8]/10 dark:border-[#344054] dark:bg-[#1B2536]">
                            <Search size={19} className="ml-3 shrink-0 text-[#8A93A5]" />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search products, brands and services"
                                aria-label="Search products, brands and services"
                                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-[#111827] outline-none placeholder:text-[#98A2B3] dark:text-white"
                            />
                            <button type="submit" className="h-full rounded-lg bg-[#3657E8] px-5 text-sm font-semibold text-white transition hover:bg-[#2948D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3657E8] focus-visible:ring-offset-2">
                                Search
                            </button>
                        </form>

                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#667085] dark:text-[#A8B3C5]">
                            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#3657E8] dark:text-[#C8F169]" /> Clear order tracking</span>
                            <span className="inline-flex items-center gap-1.5"><Zap size={14} className="text-[#3657E8] dark:text-[#C8F169]" /> Convenient digital access</span>
                        </div>
                    </div>

                    {/* Product-led image composition using existing KIVO assets */}
                    <div className="relative min-w-0">
                        <div className="grid grid-cols-[1.15fr_.85fr] grid-rows-[170px_150px] gap-3 sm:grid-rows-[230px_190px] lg:grid-rows-[250px_205px]">
                            <button type="button" onClick={() => goToSearch("gift cards")} className="group relative row-span-2 overflow-hidden rounded-2xl bg-[#E9EDF8] text-left">
                                <img src={AmazonBanner} alt="Gift cards" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/10 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-5 text-white sm:p-7">
                                    <span className="text-[10px] font-bold tracking-[0.18em] text-[#C8F169]">SHOP DIGITAL VALUE</span>
                                    <span className="mt-2 block font-[Manrope] text-xl font-extrabold sm:text-2xl">Gift cards</span>
                                    <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-white/85">Explore collection <ArrowUpRight size={14} /></span>
                                </div>
                            </button>

                            <button type="button" onClick={() => goToSearch("digital payments")} className="group relative overflow-hidden rounded-2xl bg-[#111827] text-left">
                                <img src={EpayBanner} alt="Digital payment services" className="absolute inset-0 h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-[1.05]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/75 to-transparent" />
                                <span className="absolute bottom-4 left-4 font-[Manrope] text-base font-extrabold text-white sm:bottom-5 sm:left-5 sm:text-lg">Digital payments <ArrowUpRight size={14} className="ml-1 inline" /></span>
                            </button>

                            <button type="button" onClick={() => goToSearch("streaming")} className="group relative overflow-hidden rounded-2xl bg-[#DCE2F2] text-left">
                                <img src={StreamBanner} alt="Streaming subscriptions" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/75 to-transparent" />
                                <span className="absolute bottom-4 left-4 font-[Manrope] text-base font-extrabold text-white sm:bottom-5 sm:left-5 sm:text-lg">Subscriptions <ArrowUpRight size={14} className="ml-1 inline" /></span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual marketplace discovery */}
            <section className="overflow-hidden bg-[#111827] text-white dark:bg-[#0D1422]">
                <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-[76px]">
                    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div className="max-w-2xl">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C8F169]">Find what you came for</p>
                            <h2 className="mt-3 font-[Manrope] text-3xl font-extrabold tracking-[-0.045em] text-white sm:text-4xl">A marketplace built around what you need.</h2>
                        </div>
                        <button type="button" onClick={() => goToSearch("digital products")} className="inline-flex w-fit items-center gap-2 border-b border-[#C8F169]/60 pb-1 text-sm font-semibold text-[#C8F169] transition hover:gap-3">
                            Explore everything <ArrowUpRight size={16} />
                        </button>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        <button type="button" onClick={() => goToSearch("gift cards")} className="group relative isolate min-h-[260px] overflow-hidden rounded-2xl bg-[#26365A] text-left sm:min-h-[320px]">
                            <img src={AmazonBanner} alt="Gift cards" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
                            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080E19]/95 via-[#080E19]/20 to-transparent" />
                            <span className="absolute left-6 top-6 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">01 / Digital value</span>
                            <span className="absolute bottom-6 left-6 right-6">
                                <span className="block font-[Manrope] text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">Gift cards</span>
                                <span className="mt-2 flex items-center gap-2 text-sm font-medium text-white/80">Give yourself more choice <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
                            </span>
                        </button>

                        <button type="button" onClick={() => goToSearch("gaming")} className="group relative isolate min-h-[260px] overflow-hidden rounded-2xl bg-[#26365A] text-left sm:min-h-[320px]">
                            <img src={StreamBanner} alt="Gaming and entertainment" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
                            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080E19]/95 via-[#080E19]/25 to-transparent" />
                            <span className="absolute left-6 top-6 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">02 / Play & enjoy</span>
                            <span className="absolute bottom-6 left-6 right-6">
                                <span className="block font-[Manrope] text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">Gaming & subscriptions</span>
                                <span className="mt-2 flex items-center gap-2 text-sm font-medium text-white/80">Top up, stream and play <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
                            </span>
                        </button>

                        <button type="button" onClick={() => goToSearch("digital payments")} className="group relative isolate min-h-[260px] overflow-hidden rounded-2xl bg-[#26365A] text-left sm:min-h-[320px]">
                            <img src={EpayBanner} alt="Digital payment services" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
                            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080E19]/95 via-[#080E19]/20 to-transparent" />
                            <span className="absolute left-6 top-6 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">03 / Everyday digital</span>
                            <span className="absolute bottom-6 left-6 right-6">
                                <span className="block font-[Manrope] text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">Payment services</span>
                                <span className="mt-2 flex items-center gap-2 text-sm font-medium text-white/80">Explore digital payment options <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
                            </span>
                        </button>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => goToSearch("mobile top up")} className="group flex items-center justify-between rounded-xl border border-white/12 bg-white/[0.045] px-5 py-4 text-left transition hover:border-[#C8F169]/50 hover:bg-white/[0.08]">
                            <span className="flex items-center gap-3"><Smartphone size={19} className="text-[#C8F169]" /><span><span className="block text-sm font-bold text-white">Mobile top-ups</span><span className="mt-1 block text-xs text-white/55">Stay connected wherever you are</span></span></span>
                            <ArrowUpRight size={17} className="text-[#C8F169] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </button>
                        <button type="button" onClick={() => goToSearch("subscriptions")} className="group flex items-center justify-between rounded-xl border border-white/12 bg-white/[0.045] px-5 py-4 text-left transition hover:border-[#C8F169]/50 hover:bg-white/[0.08]">
                            <span className="flex items-center gap-3"><Tv size={19} className="text-[#C8F169]" /><span><span className="block text-sm font-bold text-white">Subscriptions</span><span className="mt-1 block text-xs text-white/55">Access the services you use every day</span></span></span>
                            <ArrowUpRight size={17} className="text-[#C8F169] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Editorial spotlights */}
            <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3657E8] dark:text-[#A9B8FF]">Discover something new</p>
                        <h2 className="mt-1.5 font-[Manrope] text-2xl font-extrabold tracking-[-0.035em] text-[#111827] dark:text-white sm:text-3xl">Made for your digital life.</h2>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {spotlights.map((item) => (
                        <article key={item.eyebrow} className={`group relative isolate flex min-h-[290px] overflow-hidden rounded-2xl ${item.theme === "dark" ? "bg-[#111827] text-white" : "bg-[#E8ECF8] text-[#111827]"}`}>
                            <img src={item.image} alt={item.imageAlt} className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
                            <div className={`absolute inset-0 -z-10 ${item.theme === "dark" ? "bg-gradient-to-r from-[#111827]/95 via-[#111827]/65 to-[#111827]/5" : "bg-gradient-to-r from-white/95 via-white/75 to-white/10"}`} />
                            <div className="flex max-w-[360px] flex-col items-start justify-center p-7 sm:p-9">
                                <p className={`text-[10px] font-bold tracking-[0.18em] ${item.theme === "dark" ? "text-[#C8F169]" : "text-[#3657E8]"}`}>{item.eyebrow}</p>
                                <h3 className="mt-3 font-[Manrope] text-2xl font-extrabold leading-[1.12] tracking-[-0.04em] sm:text-[2rem]">{item.title}</h3>
                                <p className={`mt-3 text-sm leading-6 ${item.theme === "dark" ? "text-white/70" : "text-[#586174]"}`}>{item.copy}</p>
                                <button type="button" onClick={() => goToSearch(item.query)} className={`mt-6 inline-flex items-center gap-2 border-b pb-1 text-sm font-bold transition-all hover:gap-3 ${item.theme === "dark" ? "border-[#C8F169] text-[#C8F169]" : "border-[#3657E8] text-[#3657E8]"}`}>
                                    {item.action} <ArrowUpRight size={15} />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Service principles */}
            <section className="border-y border-[#E7E9EF] bg-white dark:border-[#344054] dark:bg-[#1B2536]">
                <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 sm:grid-cols-3 sm:px-8 lg:px-12 lg:py-12">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 shrink-0 text-[#3657E8] dark:text-[#A9B8FF]" size={21} />
                        <div><h3 className="font-[Manrope] text-sm font-extrabold">A clear way to shop</h3><p className="mt-1 text-xs leading-5 text-[#7A8496] dark:text-[#A8B3C5]">Straightforward product discovery and order information.</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Zap className="mt-0.5 shrink-0 text-[#3657E8] dark:text-[#A9B8FF]" size={21} />
                        <div><h3 className="font-[Manrope] text-sm font-extrabold">Digital, without the detours</h3><p className="mt-1 text-xs leading-5 text-[#7A8496] dark:text-[#A8B3C5]">A growing range of digital products and services in one destination.</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Headphones className="mt-0.5 shrink-0 text-[#3657E8] dark:text-[#A9B8FF]" size={21} />
                        <div><h3 className="font-[Manrope] text-sm font-extrabold">Support that stays close</h3><p className="mt-1 text-xs leading-5 text-[#7A8496] dark:text-[#A8B3C5]">Help is available when you need assistance with your experience.</p></div>
                    </div>
                </div>
            </section>

            {/* Distinct closing feature, separated from the footer */}
            <section className="border-t border-[#DCE2F0] bg-[#E9EDFF] dark:border-[#344054] dark:bg-[#1D2A42]">
                <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
                    <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
                        <div className="max-w-2xl">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3657E8] dark:text-[#C8F169]">KIVO is growing</p>
                            <h2 className="mt-3 font-[Manrope] text-3xl font-extrabold tracking-[-0.045em] text-[#111827] dark:text-white sm:text-4xl">More of your digital world.<br className="hidden sm:block" /> One destination.</h2>
                            <p className="mt-4 max-w-xl text-sm leading-6 text-[#586174] dark:text-[#C0CAD9]">We’re building a broader way to access digital products and services. Explore what’s available today.</p>
                        </div>
                        <button type="button" onClick={() => goToSearch("digital products")} className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-[#3657E8] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#2948D4] sm:self-auto">
                            Explore KIVO <ArrowUpRight size={16} />
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
