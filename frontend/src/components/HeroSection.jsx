import { Search,CircleCheckBig } from 'lucide-react';
import AmazonBanner from "../assets/banners/amazon_banner.jpeg"
import EpayBanner from "../assets/banners/epay_banner.jpeg"
import StreamBanner from "../assets/banners/stream_banner.jpeg"
import Carousel from "./carousel";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {

       const [querry,setQuerry]=useState("")
    const navigate = useNavigate();

    
        const handleKeyDown = (e) => {
            if (e.key === "Enter" && querry.trim()) {
                navigate(`/search?q=${encodeURIComponent(querry.trim())}`);
            }
        };
    

    const CrouselImages = [
        {
            id: "amazonbanner",
            title: "Amazon Gift Cards",
            banner: AmazonBanner,
            desc: "Buy amazon gift cards"
        },
        {
            id: "epaybanner",
            title: "Epay",
            banner: EpayBanner,
            desc: "Epay digital payments mobile app"
        },
        {
            id: "streambanner",
            title: "Stream",
            banner: StreamBanner,
            desc: "Buy subscriptions of Streaming Apps"
        }
    ];

    return (
        <section className="bg-[#3657E8] dark:bg-[#111827] text-white tansition-color duration-300 -mt-1"
        >
            <div className="max-w-6xl mx-auto px-0 sm:px-6 lg:px-8 py-0 md:py-4">
                <div className="grid md:grid-cols-2 md:gap-8 items-center">
                    <div className="text-center sm:text-start py-0 md:py-8 relative hidden md:block">
                        <h1 className="text-2xl md:text-4xl font-bold mb-4">Buy Gift Cards Online & More</h1>
                        <p className="text-xl mb-8">What are you looking for?</p>

                        {/* Search Box */}
                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Search brands, gift cards & games"
                                className="w-full px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder:text-black/40"
                                value={querry}
                                onChange={(e) => setQuerry(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <Search className="absolute right-6 top-4 h-6 w-6 text-gray-400" />
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start  gap-6 text-sm">
                            <div className="flex items-center space-x-2">
                                <CircleCheckBig className="h-5 w-5 text-green-400" />
                                <span>Instant Code</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CircleCheckBig className="h-5 w-5 text-green-400" />
                                <span>Secure payment</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CircleCheckBig className="h-5 w-5 text-green-400" />
                                <span>Trusted reseller</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <Carousel data={CrouselImages} />
                    </div>
                </div>
            </div>
        </section>

    )
}

export default HeroSection;