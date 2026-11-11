import { useEffect, useRef } from "react";

const MembershipModal = ({ isOpen, setIsOpen, memberShipModalData }) => {
    const modalRef = useRef(null);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => (document.body.style.overflow = "auto");
    }, [isOpen]);

    // Close on outside click
    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    // Don’t render modal if not open
    if (!isOpen) return null;

    return (
        <div
            onClick={handleOutsideClick}
            className="fixed inset-0 z-200 bg-black/50  flex items-center justify-center p-4 z-[150]"
        >
            {/* Modal */}
            <div
                ref={modalRef}
                className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
                {/* Header Image */}
                <div
                    className={`w-full h-44 md:h-54 flex overflow-hidden items-center justify-center`}
                >
                    <img
                        src={memberShipModalData.icon}
                        alt={memberShipModalData.name}
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Content */}
                <div className="px-4 md:px-8 pt-4 md:pt-6 pb-4 md:pb-8">
                    <div className="flex flex-row items-center justify-start gap-2 text-md">
                        {/* <span className="text-gray-500">Amount:</span> */}
                        <span className="text-blue-500 ">{memberShipModalData.amount}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 text-start mb-4">
                        {memberShipModalData.name}
                    </h2>
                    <p className="text-gray-600 text-justify text-sm leading-relaxed">
                        {memberShipModalData.desc}
                    </p>

                    {/* OK Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className={`bg-blue-500 w-full mt-6 cursor-pointer text-white font-bold py-3 rounded-lg transition-transform hover:scale-[1.02] shadow-md`}
                    >
                        OK
                    </button>
                </div>
            </div>

        </div>
    );
};

export default MembershipModal;
