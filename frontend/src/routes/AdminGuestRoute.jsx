// src/routes/AdminGuestRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/admin.authContext";

export default function AdminGuestRoute({ children }) {
    const { admin, loading } = useAuth();
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center justify-center bg-white px-6 py-4 rounded-lg  gap-3 ">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                    {/* <p className="text-gray-600">Checking session...</p> */}
                </div>
            </div>
        );
    }
    if (admin) return <Navigate to="/admin/dashboard" replace />;
    return children;
}
