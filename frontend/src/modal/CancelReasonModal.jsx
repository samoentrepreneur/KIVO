import { useState } from "react";

const CANCEL_REASONS = [
    { id: 'phone', label: 'Wrong phone number' },
    { id: 'game_id', label: 'Wrong Game ID' },
    { id: 'email', label: 'Wrong email address' },
    { id: 'mistake', label: 'Ordered by mistake' },
    { id: 'other', label: 'Other reason' },
];

const CancelReasonModal = ({ open, onClose, onConfirm, onCancellingLoading }) => {
    const [reason, setReason] = useState('');

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-md p-5 mx-4">
                <h2 className="text-lg font-semibold mb-4">Why are you cancelling?</h2>

                {/* Reasons */}
                <div className="space-y-2">
                    {CANCEL_REASONS.map(r => (
                        <label
                            key={r.id}
                            className={`flex items-center gap-3 p-3 border rounded cursor-pointer
                                ${reason === r.label
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200'
                                }
                                ${onCancellingLoading ? 'opacity-60 cursor-not-allowed' : ''}
                            `}
                        >
                            <input
                                type="radio"
                                name="cancelReason"
                                value={r.label}
                                checked={reason === r.label}
                                onChange={() => setReason(r.label)}
                                disabled={onCancellingLoading}
                            />
                            <span className="text-sm">{r.label}</span>
                        </label>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-5">
                    <button
                        disabled={onCancellingLoading}
                        onClick={onClose}
                        className="px-4 py-2 text-sm disabled:text-gray-400"
                    >
                        Back
                    </button>

                    <button
                        disabled={!reason || onCancellingLoading}
                        onClick={() => onConfirm(reason)}
                        className={`px-4 py-2 rounded text-sm font-medium
                            ${!reason || onCancellingLoading
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                    >
                        {onCancellingLoading ? 'Cancelling order...' : 'Cancel & Refund'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelReasonModal;
