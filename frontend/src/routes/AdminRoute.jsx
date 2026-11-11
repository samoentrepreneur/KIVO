// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/admin.authContext";

const AdminProtectedRoute = ({ children }) => {
    const { admin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center justify-center bg-white px-6 py-4 rounded-lg  gap-3 ">
                    <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                </div>
            </div>
        );
    }

    if (!admin) {
         return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;

    }

    return children;
};

export default AdminProtectedRoute;
