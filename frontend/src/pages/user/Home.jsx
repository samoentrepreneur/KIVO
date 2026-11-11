import HeroSection from '../../components/HeroSection';
import Store from '../../components/GiftCardList';

export default function Home() {
    document.title = "KIVO";

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <HeroSection />
            <Store />

        </div>
    );
}
