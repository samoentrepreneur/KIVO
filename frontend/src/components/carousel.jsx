import { useEffect, useState } from "react";

const Carousel = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto slide every 3s
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === data.length - 1 ? 0 : prev + 1
            );
        }, 3000);
        return () => clearInterval(timer);
    }, [data.length]);

    return (
        <div className="relative w-full h-[300px] rounded-none md:rounded-xl overflow-hidden shadow-lg">
            {/* Image */}
            <img
                src={data[currentIndex].banner}
                alt={data[currentIndex].title}
                className="w-full h-full object-cover transition-all duration-700"
            />

            {/* Text Overlay */}
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-10">
                <h2 className="text-white text-3xl font-bold">
                    {data[currentIndex].title}
                </h2>
                <p className="text-gray-200 text-lg mt-2">
                    {data[currentIndex].desc}
                </p>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-3 w-full flex justify-center space-x-2">
                {data.map((_, i) => (
                    <div
                        key={i}
                        className={`h-3 w-3 rounded-full cursor-pointer transition-all ${currentIndex === i ? "bg-white" : "bg-white/40"
                            }`}
                        onClick={() => setCurrentIndex(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
