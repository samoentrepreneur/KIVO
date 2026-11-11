import { Star } from 'lucide-react';
import Logo from '../assets/logos/kivo-wordmark-white.png'
import Playstore from '../assets/logos/playstore.png'
import Whatsapp from '../assets/logos/whatsapp.png'
import Facebook from '../assets/logos/facebook.png'
import Insta from '../assets/logos/insta.png'
import TikTok from '../assets/logos/tiktok.png'

const socials = [
    {
        title: "Facebook",
        icon: Facebook,
        link: "https://facebook.com",
    },
    {
        title: "Instagram",
        icon: Insta,
        link: "https://instagram.com",
    },
    {
        title: "WhatsApp",
        icon: Whatsapp,
        link: "https://wa.me/1234567890",
    },
    {
        title: "TikTok",
        icon: TikTok,
        link: "https://tiktok.com",
    },
];

const SocialIcons = () => {
    return (
        <div className="flex items-center justify-center md:justify-start gap-4 mb-4 ">
            {socials.map((social, index) => {
                const Icon = social.icon;
                return (
                    <a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.title}
                        className="
              w-10 h-10 
              flex items-center justify-center
              rounded-full 
              bg-white text-black
              hover:bg-gray-200 
              transition
            "
                    >
                        <img src={Icon} alt={social.title} className="w-6 h-6" />
                    </a>
                );
            })}
        </div>
    );
};


const Footer = () => {
    return (
        <footer className="bg-[#111827] dark:bg-gray-900 text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="h-8 w-32 flex items-center">
                                <img src={Logo} alt="KIVO" className="w-full h-auto object-contain" />
                            </div>
                        </div>
                        <p className="text-sm">Discover and access digital products and services.</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Help Center</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-300">Order History</a></li>
                            <li><a href="#" className="hover:text-blue-300">Refund Policy</a></li>
                            {/* <li><a href="#" className="hover:text-blue-300">Complaint Policy</a></li> */}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Want to know more?</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-300">About KIVO</a></li>
                            {/* <li><a href="https://dilip-kumar-portfolio.web.app" target='_blank' className="hover:text-blue-300">About Developer</a></li> */}
                            {/* <li><a href="#" className="hover:text-blue-300">Earn KIVO Coins</a></li> */}
                        </ul>

                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 ">Get App</h3>
                        <div className="space-y-2">
                            <div className="flex  items-center gap-2 bg-black rounded-lg px-3 py-2  w-fit cursor-pointer">
                                <img src={Playstore} alt='Play store icon' className='w-7 h-7' />
                                <span className='text-white text-sm'>Play Store</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className='flex items-center gap-1 text-sm mb-4'>
                    <span className='text-gray-400'>Developed by</span>
                    <a href="mailto:dilipg44u@gmail.com" className='hover:underline hover:text-blue-400'>Dilip Kumar Teli</a>
                </div> */}

                <div className="border-t border-white/10 pt-8 text-xs text-blue-200">
                    <SocialIcons />

                    <div className="flex flex-col md:flex-row   gap-4 justify-between items-center">
                        <p>Copyright © {new Date().getFullYear()} kivoht.com</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white">Privacy Policy</a>
                            <a href="#" className="hover:text-white">Terms & Conditions</a>
                            {/* <a href="#" className="hover:text-white">Security</a> */}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer;
