import { X } from "lucide-react";
import { useState } from "react";

const AdminOrderCancelReasonModal = ({ open, onClose, onConfirm, loading }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [otherReason, setOtherReason] = useState('');

    const reasons = [
        { value: 'payment_not_received', label: 'Payment Not Received' },
        { value: 'invalid_game_id', label: 'Invalid Game ID' },
        { value: 'invalid_email', label: 'Invalid Recipient Email' },
        { value: 'invalid_phone', label: 'Invalid Phone Number' },
        { value: 'customer_request', label: 'Customer Request' },
        { value: 'invalid_card', label: 'Invalid Card Details' },
        { value: 'out_of_stock', label: 'Out of Stock' },
        { value: 'other', label: 'Other' }
    ];

    const handleConfirm = () => {
        const reason = selectedReason === 'other' ? otherReason :
            reasons.find(r => r.value === selectedReason)?.label;
        if (reason) {
            onConfirm(reason);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select cancellation reason:
                    </label>
                    <div className="space-y-3">
                        {reasons.map((reason) => (
                            <label key={reason.value} className="flex items-center   cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="reason"
                                    value={reason.value}
                                    checked={selectedReason === reason.value}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="mr-3"
                                />
                                <span className="text-xs text-gray-700">{reason.label}</span>
                            </label>
                        ))}
                    </div>

                    {selectedReason === 'other' && (
                        <textarea
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                            placeholder="Please specify the reason..."
                            className="mt-3 w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="3"
                        />
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedReason || (selectedReason === 'other' && !otherReason.trim()) || loading}
                        className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Cancelling...' : 'Confirm Cancellation'}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default AdminOrderCancelReasonModal