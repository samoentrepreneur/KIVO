import { useState } from "react";
import { useEffect } from "react";
import api from "../api";


const Advertisement = () => {
    const [ad, setAd] = useState("");

    useEffect(() => {
        fetchAdvertisement();
    }, []);

    const fetchAdvertisement = async () => {
        try {
            const res = await api.get("/user/advertisement");
            if (res.data.success) {
                setAd(res.data.advertisement);
            }
        }
        catch (err) {
            console.error(err)
        }
    }
    if (!ad) return null;
    

    return (
        <div className="w-full bg-white, dark:bg-blue-950 -mt-1">
            <div className="max-w-6xl m-auto px-4 md:px-8 py-2">
                <marquee className="text-black dark:text-white">{ad}</marquee>
            </div>
        </div>
        
    )
}
export default Advertisement;