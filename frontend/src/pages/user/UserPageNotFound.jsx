import React from 'react';
import { Home, Search, ArrowLeft, AlertCircle } from 'lucide-react';

const UserPageNotFound = () => {
    const handleGoHome = () => {
        window.location.href = '/';
    };

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* Animated 404 */}
                <div className="mb-8 relative">
                    <h1 className="text-[150px] sm:text-[200px] md:text-[250px] font-bold text-gray-200 leading-none select-none">
                        404
                    </h1>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto">
                        The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track!
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <button
                        onClick={handleGoHome}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto"
                    >
                        <Home className="w-5 h-5" />
                        Go to Homepage
                    </button>

                    <button
                        onClick={handleGoBack}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-gray-200 w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>

               
                {/* Footer Message */}
                <p className="text-gray-500 text-sm mt-8">
                    Error Code: 404 | Page Not Found
                </p>
            </div>
        </div>
    );
};

export default UserPageNotFound;