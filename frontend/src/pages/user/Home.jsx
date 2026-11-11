import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    CheckCircle2,
    ChevronRight,
    CreditCard,
    Gift,
    Gamepad2,
    Globe2,
    Headphones,
    RefreshCw,
    Search,
    ShieldCheck,
    Smartphone,
    Sparkles,
    Tv,
    Zap,
} from "lucide-react";

const categories = [
    {
        title: "Gift cards",
        description: "Digital gift cards for the brands and platforms you love.",
        icon: Gift,
        query: "gift cards",
        accent: "lime",
        label: "Popular",
    },
    {
        title: "Gaming top-ups",
        description: "Top up your favorite games and get straight back in.",
        icon: Gamepad2,
        query: "gaming",
        accent: "blue",
    },
    {
        title: "Streaming subscriptions",
        description: "Access entertainment, music and streaming services.",
        icon: Tv,
        query: "streaming",
        accent: "violet",
    },
    {
        title: "Mobile top-ups",
        description: "Stay connected with convenient mobile recharges.",
        icon: Smartphone,
        query: "mobile top up",
        accent: "orange",
    },
    {
        title: "Digital payment services",
        description: "Explore digital payment products and related services.",
        icon: CreditCard,
        query: "payment",
        accent: "cyan",
    },
    {
        title: "Currency exchange",
        description: "Discover the upcoming KIVO exchange experience.",
        icon: RefreshCw,
        accent: "lime",
        label: "Coming soon",
        disabled: true,
    },
];

const benefits = [
    {
        icon: ShieldCheck,
        title: "Shop with confidence",
        description: "A clear purchase journey with order information you can follow.",
    },
    {
        icon: Zap,
        title: "Find it faster",
        description: "Explore digital products and services from one marketplace.",
    },
    {
        icon: Headphones,
        title: "Help when you need it",
        description: "Get support when you have a question about your order.",
    },
];

const accentClasses = {
    lime: "bg-[#C8F169]/35 text-[#34420D] dark:bg-[#C8F169]/15 dark:text-[#D9F99D]",
    blue: "bg-[#3657E8]/10 text-[#3657E8] dark:bg-[#3657E8]/20 dark:text-[#9BAEFF]",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300",
    cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-300",
};

function SectionEyebrow({ children }) {
    return (
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3657E8] dark:text-[#9BAEFF]">
            {children}
        </p>
    );
}

export default function Home() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    useEffect(() => {
        document.title = "KIVO | Your digital world, in one place";
    }, []);

    const search = (event) => {
        event.preventDefault();
        const value = query.trim();
        if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
    };

    const explore = (value) => {
        if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
    };

    return (
        <main className="min-h-screen overflow-hidden bg-[#F6F7FB] text-[#111827] dark:bg-[#111827] dark:text-[#F9FAFB]">
            {/* Hero */}
            <section className="relative isolate overflow-hidden bg-white dark:bg-[#111827]">
                <div className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-[#C8F169]/30 blur-3xl dark:bg-[#C8F169]/10" />
                <div className="pointer-events-none absolute -bottom-48 -left-32 -z-10 h-[30rem] w-[30rem] rounded-full bg-[#3657E8]/10 blur-3xl" />

                <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-24">
                    <div className="max-w-2xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3657E8]/15 bg-[#3657E8]/5 px-3.5 py-2 text-xs font-semibold text-[#3657E8] dark:border-[#9BAEFF]/20 dark:bg-[#3657E8]/15 dark:text-[#B9C7FF] sm:text-sm">
                            <Sparkles size={15} />
                            Your digital world, in one place.
                        </div>

                        <h1 className="max-w-xl font-[Manrope] text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-[#111827] dark:text-white sm:text-5xl lg:text-[4.25rem]">
                            Everything digital.
                            <span className="mt-1 block text-[#3657E8] dark:text-[#9BAEFF]">
                                All in one place.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-7 text-[#667085] dark:text-[#A8B3C5] sm:text-lg sm:leading-8">
                            Discover gift cards, gaming top-ups, subscriptions and digital services through one simple marketplace.
                        </p>

                        <form
                            onSubmit={search}
                            role="search"
                            className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-[0_14px_45px_rgba(17,24,39,0.08)] transition focus-within:border-[#3657E8] focus-within:ring-4 focus-within:ring-[#3657E8]/10 dark:border-[#344054] dark:bg-[#1B2536] dark:shadow-black/20"
                        >
                            <Search className="ml-3 shrink-0 text-[#98A2B3]" size={21} aria-hidden="true" />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search gift cards, games, subscriptions..."
                                aria-label="Search digital products and services"
                                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-[#111827] outline-none placeholder:text-[#98A2B3] dark:text-white sm:text-base"
                            />
                            <button
                                type="submit"
                                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#3657E8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2948D4] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3657E8]/25 sm:px-5"
                            >
                                Search <ArrowRight size={16} />
                            </button>
                        </form>

                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#667085] dark:text-[#A8B3C5] sm:text-sm">
                            <span className="inline-flex items-center gap-2"><CheckCircle2 size={15} className="text-[#3657E8] dark:text-[#C8F169]" /> Easy discovery</span>
                            <span className="inline-flex items-center gap-2"><CheckCircle2 size={15} className="text-[#3657E8] dark:text-[#C8F169]" /> Clear checkout</span>
                            <span className="inline-flex items-center gap-2"><CheckCircle2 size={15} className="text-[#3657E8] dark:text-[#C8F169]" /> Helpful support</span>
                        </div>
                    </div>

                    {/* Brand-led marketplace preview: deliberately independent from backend data */}
                    <div className="relative mx-auto w-full max-w-[540px] py-4">
                        <div className="absolute inset-8 rounded-[2.5rem] bg-[#3657E8]/10 blur-2xl" />
                        <div className="relative rounded-[2rem] border border-white bg-[#F6F7FB] p-4 shadow-[0_30px_90px_rgba(17,24,39,0.12)] dark:border-[#344054] dark:bg-[#1B2536] dark:shadow-black/30 sm:p-6">
                            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 dark:border-[#344054]">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#98A2B3]">Explore KIVO</p>
                                    <p className="mt-1 font-[Manrope] text-lg font-extrabold text-[#111827] dark:text-white">Your digital essentials</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C8F169] text-[#111827]">
                                    <Sparkles size={19} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <div className="col-span-2 flex min-h-[145px] items-center justify-between overflow-hidden rounded-2xl bg-[#3657E8] p-5 text-white">
                                    <div className="relative z-10">
                                        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">Discover</span>
                                        <p className="mt-3 max-w-[190px] font-[Manrope] text-xl font-extrabold leading-tight sm:text-2xl">More ways to enjoy digital.</p>
                                        <p className="mt-2 text-xs text-white/75">Find what you need, faster.</p>
                                    </div>
                                    <div className="mr-1 flex h-24 w-24 shrink-0 rotate-6 items-center justify-center rounded-[1.75rem] bg-white/10">
                                        <Globe2 size={52} strokeWidth={1.3} />
                                    </div>
                                </div>
                                <div className="flex min-h-[116px] flex-col justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-[#243146]">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8F169]/35 text-[#111827]"><Gift size={21} /></div>
                                    <div><p className="font-[Manrope] font-extrabold text-[#111827] dark:text-white">Gift cards</p><p className="mt-1 text-xs text-[#98A2B3]">Give more choice</p></div>
                                </div>
                                <div className="flex min-h-[116px] flex-col justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-[#243146]">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3657E8]/10 text-[#3657E8] dark:text-[#9BAEFF]"><Gamepad2 size={21} /></div>
                                    <div><p className="font-[Manrope] font-extrabold text-[#111827] dark:text-white">Top-ups</p><p className="mt-1 text-xs text-[#98A2B3]">Power your play</p></div>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 dark:border-[#344054] dark:bg-[#243146]">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111827] text-[#C8F169]"><RefreshCw size={17} /></div>
                                    <div><p className="text-sm font-bold text-[#111827] dark:text-white">Digital services</p><p className="text-[11px] text-[#98A2B3]">One marketplace, more possibilities</p></div>
                                </div>
                                <ArrowRight size={17} className="text-[#3657E8] dark:text-[#9BAEFF]" />
                            </div>
                        </div>
                        <div className="absolute -left-3 top-16 hidden items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 shadow-lg dark:border-[#344054] dark:bg-[#243146] sm:flex">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C8F169]/40 text-[#111827]"><Zap size={17} /></span>
                            <span className="text-xs font-bold text-[#111827] dark:text-white">Simple. Convenient.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Marketplace categories */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <SectionEyebrow>Explore the marketplace</SectionEyebrow>
                        <h2 className="mt-2 font-[Manrope] text-2xl font-extrabold tracking-tight text-[#111827] dark:text-white sm:text-3xl">
                            What can we help you find?
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-[#667085] dark:text-[#A8B3C5] sm:text-base">
                            Browse the digital products and services you use every day.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => explore("digital products")}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#3657E8] transition hover:gap-3 dark:text-[#9BAEFF]"
                    >
                        Explore marketplace <ArrowRight size={16} />
                    </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map(({ title, description, icon: Icon, accent, query: categoryQuery, label, disabled }) => (
                        <button
                            key={title}
                            type="button"
                            disabled={disabled}
                            onClick={() => explore(categoryQuery)}
                            className="group relative flex min-h-[174px] flex-col rounded-2xl border border-[#E5E7EB] bg-white p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-[#3657E8]/30 hover:shadow-[0_18px_45px_rgba(17,24,39,0.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3657E8]/15 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none dark:border-[#344054] dark:bg-[#1B2536] dark:hover:border-[#7188F5]/50 sm:p-6"
                        >
                            <div className="flex w-full items-start justify-between">
                                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentClasses[accent]}`}>
                                    <Icon size={23} strokeWidth={1.8} />
                                </span>
                                {label && (
                                    <span className="rounded-full bg-[#F6F7FB] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:bg-[#243146] dark:text-[#A8B3C5]">
                                        {label}
                                    </span>
                                )}
                            </div>
                            <div className="mt-5 flex items-end justify-between gap-3">
                                <div>
                                    <h3 className="font-[Manrope] text-base font-extrabold text-[#111827] dark:text-white">{title}</h3>
                                    <p className="mt-1.5 max-w-[270px] text-sm leading-5 text-[#667085] dark:text-[#A8B3C5]">{description}</p>
                                </div>
                                <span className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F6F7FB] text-[#3657E8] transition group-hover:bg-[#3657E8] group-hover:text-white dark:bg-[#243146] dark:text-[#9BAEFF]">
                                    {disabled ? <Sparkles size={17} /> : <ChevronRight size={18} />}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Why KIVO */}
            <section className="border-y border-[#E5E7EB] bg-white dark:border-[#344054] dark:bg-[#1B2536]">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <SectionEyebrow>The KIVO experience</SectionEyebrow>
                        <h2 className="mt-2 font-[Manrope] text-2xl font-extrabold tracking-tight text-[#111827] dark:text-white sm:text-3xl">
                            Digital shopping, made simpler.
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-[#667085] dark:text-[#A8B3C5] sm:text-base">
                            A clearer way to discover, purchase and access the digital services that matter to you.
                        </p>
                    </div>
                    <div className="grid gap-10 md:grid-cols-3 md:gap-10">
                        {benefits.map(({ icon: Icon, title, description }, index) => (
                            <div key={title} className="text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3657E8]/8 text-[#3657E8] dark:bg-[#3657E8]/20 dark:text-[#9BAEFF]">
                                    <Icon size={25} strokeWidth={1.8} />
                                </div>
                                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#98A2B3]">0{index + 1}</p>
                                <h3 className="mt-2 font-[Manrope] text-lg font-extrabold text-[#111827] dark:text-white">{title}</h3>
                                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#667085] dark:text-[#A8B3C5]">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing CTA */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
                <div className="relative overflow-hidden rounded-[2rem] bg-[#111827] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
                    <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#3657E8]/40 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-40 right-1/3 h-72 w-72 rounded-full bg-[#C8F169]/15 blur-3xl" />
                    <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#C8F169]">
                                <Sparkles size={14} /> Discover more with KIVO
                            </div>
                            <h2 className="mt-5 font-[Manrope] text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                                Your next digital essential is just a search away.
                            </h2>
                            <p className="mt-4 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
                                Explore the marketplace and find a simpler way to access digital products and services.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => explore("digital products")}
                            className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-[#C8F169] px-5 py-3.5 text-sm font-extrabold text-[#111827] transition hover:bg-[#D7F58E] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C8F169]/30"
                        >
                            Explore KIVO <ArrowRight size={17} />
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
