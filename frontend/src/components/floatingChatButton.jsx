import { MessageCircle } from "lucide-react";
import { useState } from "react";
import ChatBox from "./ChatBox";
import { useUserAuth } from "../context/user.authContext";
import { useLocation } from "react-router-dom";

const FloatingChatButton = () => {
    const { user } = useUserAuth();
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();


    if (!user || pathname.startsWith("/admin")) {
        return null;
    }
    return (
        <>
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="
                        fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50
                        bg-blue-600 hover:bg-blue-700 text-white
                        md:w-14 md:h-14 w-10 h-10 rounded-full shadow-lg flex items-center justify-center
                    "
                >
                    <MessageCircle  />
                </button>
            )}

            {open && (
                <ChatBox onClose={() => setOpen(false)} />
            )}
        </>
    );
};

export default FloatingChatButton;
