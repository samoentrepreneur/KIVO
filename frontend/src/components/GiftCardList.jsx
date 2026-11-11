import { useProducts } from "../context/Products.context";
import { useRef, useState, useEffect } from "react";
import { CardSim, ChevronLeft, ChevronRight, CreditCard, Gamepad2, Gift, Tag, Tv, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function Store() {
    const { categories, randomProducts, loading, error } = useProducts();
    const scrollRefs = useRef({});
    const [scrollStates, setScrollStates] = useState({});
    const navigate = useNavigate()

    const updateScrollRefs = (key, ref) => {
        if (ref && !scrollRefs.current[key]) {
            scrollRefs.current[key] = ref;
            ref.addEventListener("scroll", () => checkScroll(key));
            // Initial check after mount
            setTimeout(() => checkScroll(key), 100);
        }
    };

    const scroll = (key, direction) => {
        const ref = scrollRefs.current[key];
        if (!ref) return;

        ref.scrollBy({
            left: direction === "right" ? 300 : -300,
            behavior: "smooth",
        });

        setTimeout(() => checkScroll(key), 250);
    };

    const checkScroll = (key) => {
        const ref = scrollRefs.current[key];
        if (!ref) return;

        const { scrollLeft, scrollWidth, clientWidth } = ref;

        setScrollStates(prev => ({
            ...prev,
            [key]: {
                showLeft: scrollLeft > 5,
                showRight: scrollLeft + clientWidth < scrollWidth - 5,
            }
        }));
    };
    const slugify = (text) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const checkout = (item) => {
        if (!item?._id) return console.log("ID not found");

        const slug = slugify(item.service);
        navigate(`/checkout/${slug}-${item._id}`);
    };
    // Check scroll for all sections when data loads
    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                Object.keys(scrollRefs.current).forEach(key => checkScroll(key));
            }, 200);
        }
    }, [loading, randomProducts, categories]);

    const formaturlSlug = (text = "") =>
        String(text)
            .trim()
            .replace(/([a-z])([A-Z])/g, "$1-$2")
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-");

    const handleDiscover = (id) => {
        if (!id) return toast.error("Selected item id not found");
        const cId = formaturlSlug(id);
        navigate(`/discover/${cId}`);
    }

    const getCategoryLabelWithIcon = (cat, category) => {
        const key = category.toLowerCase().replace(/\s+/g, "");
        const { bg, icon, label } = categoryStyles[key] || categoryStyles.default;

        return (
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 mb-6 px-4 sm:px-6 lg:px-8">
                    <div className={`w-8 h-8 md:w-10 md:h-10 ${bg} rounded-full flex items-center justify-center`}>
                        {icon}
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold">{label}</h2>
                </div>
                {cat.products?.length > 4 && <button onClick={() => { handleDiscover(category) }} className="text-blue-500 hover:underline text-sm">Discover all</button>}
            </div>
        );
    };

    if (loading || error) {
        return (
            <>
                {/* Random Products Skeleton */}
                <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <div className="rounded-lg border border-black/10 p-4">
                        <div className="h-7 w-48 bg-gray-300 rounded animate-pulse mb-4"></div>
                        <div className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-6">
                            {[...Array(6)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Category Skeletons */}
                {[...Array(3)].map((_, idx) => (
                    <section key={idx} className="relative max-w-6xl mx-auto mt-10">
                        <div className="flex items-center gap-3 mb-6 px-4 sm:px-6 lg:px-8">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full animate-pulse"></div>
                            <div className="h-6 w-40 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        <div
                            className="
        grid grid-cols-2 gap-4 pb-6 px-4
        sm:flex sm:gap-4 sm:overflow-x-auto sm:scroll-smooth
        sm:px-6 lg:px-8
        scrollbar-hide
    "
                        >
                            {[...Array(6)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>

                    </section>
                ))}
            </>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="flex flex-col items-center justify-center py-12 text-red-600">
                    <Package className="w-16 h-16 mb-4" />
                    <p className="text-lg font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Best Selling Section */}
            <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="rounded-lg border border-black/10">
                    <h2 className="text-lg md:text-2xl font-bold mb-4 p-4">Best selling in Haiti</h2>

                    {randomProducts && randomProducts.length > 0 ? (
                        <>
                            {scrollStates["random"]?.showLeft && (
                                <button
                                    onClick={() => scroll("random", "left")}
                                    className="hidden sm:flex justify-center items-center absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 z-10 transition"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}

                            {scrollStates["random"]?.showRight && (
                                <button
                                    onClick={() => scroll("random", "right")}
                                    className="hidden sm:flex justify-center items-center absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 z-10 transition"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}

                            <div className="px-4">
                                <div
                                    ref={(el) => updateScrollRefs("random", el)}
                                    className="
            flex gap-4
            overflow-x-auto scroll-smooth
            pb-6
            scrollbar-hide snap-x snap-mandatory
        "
                                >
                                    {randomProducts.map((item) => (
                                        <Card
                                            key={item._id}
                                            item={item}
                                            onClick={() => checkout(item)}
                                        />
                                    ))}
                                </div>
                            </div>

                        </>
                    ) : (
                        <EmptyState message="No products available at the moment" />
                    )}
                </div>
            </section>

            {/* Categories Sections */}

            <div className="pb-12">
                {categories && categories.length > 0 ? (
                    categories.map((cat) => (
                        <section key={cat._id} className="relative max-w-6xl mx-auto mt-10">
                            {getCategoryLabelWithIcon(cat, cat._id)}

                            {cat.products && cat.products.length > 0 ? (
                                <>
                                    {scrollStates[cat._id]?.showLeft && (
                                        <button
                                            onClick={() => scroll(cat._id, "left")}
                                            className="hidden sm:flex justify-center items-center absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 z-10 transition"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                    )}

                                    {scrollStates[cat._id]?.showRight && (
                                        <button
                                            onClick={() => scroll(cat._id, "right")}
                                            className="hidden sm:flex justify-center items-center absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 z-10 transition"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    )}

                                    <div
                                        ref={(el) => updateScrollRefs(cat._id, el)}
                                        className="
        grid grid-cols-2 gap-4
        px-4 pb-6             

        sm:flex sm:flex-row sm:gap-4
        sm:overflow-x-auto sm:scroll-smooth
        sm:px-6 lg:px-8

        scrollbar-hide
    "
                                    >
                                        {cat.products.map((item) => (
                                            <Card
                                                key={item._id}
                                                item={item}
                                                onClick={() => checkout(item)}
                                            />
                                        ))}
                                    </div>


                                </>
                            ) : (
                                <div className="px-4 sm:px-6 lg:px-8">
                                    <EmptyState message="No products in this category" />
                                </div>
                            )}
                        </section>
                    ))
                ) : null}
            </div>
        </>
    );
}

function Card({ item, onClick }) {
    return (
        <div
            onClick={onClick}
            className=" snap-start
                min-w-[160px] w-[160px]
                sm:min-w-[230px] sm:w-[230px]
                cursor-pointer group 
            "
        >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl shadow-md bg-gray-200">
                <img
                    src={item.image}
                    alt={item.service}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            <p className="text-xs text-gray-500 mt-2 truncate">
                {item.category}
            </p>

            <p className="text-sm font-semibold text-gray-900 truncate mt-1">
                {item.service}
            </p>
        </div>
    );
}



function SkeletonCard() {
    return (
        <div className="w-full">
            <div className="aspect-[4/3] w-full rounded-xl md:rounded-2xl bg-gray-300 animate-pulse"></div>
            <div className="h-3 w-16 bg-gray-300 rounded animate-pulse mt-2"></div>
            <div className="h-4 w-32 bg-gray-300 rounded animate-pulse mt-1"></div>
        </div>
    );
}


function EmptyState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <Package className="w-12 h-12 mb-3" />
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}