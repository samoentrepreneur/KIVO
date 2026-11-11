import { useEffect } from "react";

const useClickOutside = (ref, callback) => {
    useEffect(() => {
        const handleClick = (event) => {
            // If click is outside the referenced element
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("touchstart", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("touchstart", handleClick);
        };
    }, [ref, callback]);
};

export default useClickOutside;
