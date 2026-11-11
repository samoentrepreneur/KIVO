import { useEffect } from "react";

import googleIcon from "../assets/logos/icon-google.svg";
import { X } from "lucide-react";

 const LoginModal = ({ isOpen, onClose, onContinue }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    if (!isOpen) return null;
    return (
        <section className="fixed inset-0 z-200 bg-black/50 p-4 flex items-center justify-center ">
            <div className="bg-white rounded-lg shadow-lg lg:p-8 md:p-8 sm:p-8 p-4 lg:max-w-md md:max-w-md sm:max-w-md max-w-sm w-full">
                <div className="flex flex-row items-center justify-start gap-x-2">
                    <img src={googleIcon} alt="Google Icon" className="w-10 h-10 mb-4" />
                    <span className="text-xl sm:text-2xl font-bold mb-4">Continue with Google</span>
                </div>
                <p className="text-sm">
                    Login or register using your Google account  passwordless, fast, and
                    secure.
                </p>
                <div className="flex flex-row items-center justify-start mt-6 gap-x-4 w-full">
                    <button
                        onClick={onClose}
                        className="bg-blue-500/20  rounded-lg px-4 py-2 w-1/2 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                        Cancel
                    </button>
                    <button onClick={onContinue} className="bg-blue-500 text-white py-2 px-4 rounded-lg w-1/2 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300">
                        Continue
                    </button>
                </div>
            </div>
        </section>
    );
};

export default LoginModal