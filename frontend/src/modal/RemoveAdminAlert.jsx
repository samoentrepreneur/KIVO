import React from "react";

const RemoveAdminAlert = ({ isOpen, onClose, onConfirm,isDeleting, deleteItemName="admin" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0  bg-black/40 flex items-center justify-center z-50 transition-all">
            <div className="bg-white/90 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-7 w-[90%] max-w-sm animate-scaleIn">

                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-start">
                    Deletion Alert !
                </h2>

                <p className="text-gray-600 dark:text-gray-300 text-start mt-2">
                    Are you sure you want to delete this {deleteItemName}?
                </p>

                <div className="flex justify-end mt-6 gap-4">

                    <button
                        className="px-5 py-1 rounded-full cursor-pointer border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="px-5 py-1 rounded-full cursor-pointer bg-red-400 hover:bg-red-500 text-white shadow-md hover:shadow-lg transition-all"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemoveAdminAlert;
