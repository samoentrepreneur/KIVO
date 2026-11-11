import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../context/Products.context";

const slugToCategoryMap = {
    "mobile-games": "MobileGames",
    "gift-card": "GiftCard",
    "cards": "Cards",
    "streaming": "Streaming",
    "mobile-top-up": "MobileTopUp",
};
const ProductSkeleton = () => {
    return (
        <div className="flex items-center gap-4 bg-white  rounded-lg p-4 animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-lg" />

            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>

            <div className="w-24 h-9 bg-gray-200 rounded-md" />
        </div>
    );
};

const DiscoverProductItem = ({ item, onOrder }) => {
    return (
        <div className="flex items-center gap-4 bg-white  md:rounded-lg p-4">

            {/* Left: Image */}
            <img
                src={item.image}
                alt={item.service}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />

            {/* Middle: Details */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-semibold truncate">
                    {item.service}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2">
                    {item.description}
                </p>
            </div>

            {/* Right: Order Button */}
            <div className="flex flex-col items-end gap-2">
                <button
                    onClick={() => onOrder(item)}
                    className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition"
                >
                    Order Now
                </button>
            </div>

        </div>
    );
};


const DiscoverProducts = () => {
    const { cId } = useParams();
    const navigate = useNavigate();
    const { products, loading } = useProducts();

    const categoryId = slugToCategoryMap[cId];
    document.title = categoryId;

   


    const filteredProducts = products.filter(
        (p) => p.category === categoryId
    );

    const handleOrder = (item) => {
        const slug = item.service
            .toLowerCase()
            .replace(/([a-z])([A-Z])/g, "$1-$2")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/\s+/g, "-");

        navigate(`/checkout/${slug}-${item._id}`);
    };

    if (!categoryId) {
        return (
            <div className="min-h-screen text-center mt-10 text-red-500">
                Product not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50  ">
            <div className="max-w-6xl mx-auto  px-4 sm:px-8 py-6">
                {/* Header */}
                {loading ? (
                    <div className="h-8 w-50 bg-gray-200 rounded mb-6 " />
                ) : (
                    <h1 className="text-xl md:text-2xl font-semibold mb-6">
                        {categoryId} Products
                    </h1>
                )
                }

                {/* Content */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 divide-y divide-gray-100 md:divide-none">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <ProductSkeleton key={i} />
                            ))}
                        </div>

                    ) : filteredProducts.length === 0 ? (
                        <p className="text-gray-500">No products found</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 divide-y divide-gray-100 md:divide-none">
                            {filteredProducts.map((item) => (
                                <DiscoverProductItem
                                    key={item._id}
                                    item={item}
                                    onOrder={handleOrder}
                                />
                            ))}
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
};

export default DiscoverProducts;
