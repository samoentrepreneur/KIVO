import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api";
import { Package } from "lucide-react";


function Card({ item, onClick }) {
    return (
        <div className="min-w-[160px] md:min-w-[230px] w-[160px] md:w-[230px] cursor-pointer group" onClick={onClick}>
            <div className="h-22 md:h-36 w-full overflow-hidden rounded-xl md:rounded-2xl shadow-md bg-gray-200">
                <img
                    src={item.image}
                    alt={item.service}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
            </div>
            <p className="text-xs text-gray-500 mt-2">{item.category}</p>
            <p className="text-sm md:text-md font-semibold text-gray-900 truncate mt-1 group-hover:underline">
                {item.service}
            </p>
        </div>
    );
}
function SkeletonCard() {
    return (
        <div className="min-w-[160px] md:min-w-[230px] w-[160px] md:w-[230px]">
            <div className="h-22 md:h-36 w-full rounded-xl md:rounded-2xl bg-gray-300 animate-pulse"></div>
            <div className="h-3 w-16 bg-gray-300 rounded animate-pulse mt-2"></div>
            <div className="h-4 w-32 bg-gray-300 rounded animate-pulse mt-1"></div>
        </div>
    );
}

function EmptyState({
    title = "No items found",
    message = "We couldn’t find any items that match your search.",
    hint = "Try adjusting your filters or search keywords.",
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-500">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100  mb-4">
                <Package className="w-8 h-8 text-gray-400" />
            </div>

            <h3 className="text-base font-semibold text-gray-700 ">
                {title}
            </h3>

            <p className="mt-2 text-sm max-w-md">
                {message}
            </p>

            <p className="mt-1 text-xs text-gray-400">
                {hint}
            </p>
        </div>
    );
}

const SearchPage = () => {
    const [params] = useSearchParams();
    const query = params.get("q");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    document.title = `Search results for ${query}`;

    useEffect(() => {
        if (!query) return;

        const fetchProducts = async () => {
            try {
                setLoading(true);

                const res = await api.get("/user/products/search", {
                    params: { q: query }
                });

                if (res.data.success) {
                    setProducts(res.data.products);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };


        fetchProducts();
    }, [query]);

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

    if (loading) {
        return (
            <section className="min-h-screen elative max-w-6xl mx-auto p-4 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-6 w-60 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-4  gap-4">
                    {[...Array(8)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </section>
        );
    }
    return (
        <div className="min-h-screen max-w-6xl mx-auto p-4 md:p-8">
            <h1 className="text-xl font-semibold mb-4">
                Results for "{query}"
            </h1>

            {products.length === 0 && (
                <EmptyState/>
               
            )}

            <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-4  gap-4">
                {products.map((product) => (
                    // <Card key={product._id} item={product} onClick={() => checkout(product)} />
                    <Card key={product._id} item={product} onClick={() => checkout(product)} />
                ))}
            </div>
        </div>
    );
};

export default SearchPage;
