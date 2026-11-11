const RefundInfoModal = ({ open, onClose, paymentMethod }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-md p-5 mx-4">
                <h2 className="text-lg font-semibold mb-3 text-blue-600">
                    Refund Initiated
                </h2>

                <p className="text-sm text-gray-700">
                    Your refund will be credited within <strong>1–3 working days </strong>
                    to the <strong>same payment method</strong> you used:
                </p>

                <div className="mt-3 p-3 bg-gray-50 rounded text-sm capitalize">
                    {paymentMethod}
                </div>

                <div className="flex justify-end mt-5">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RefundInfoModal;