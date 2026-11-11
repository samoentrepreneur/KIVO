import { Navigate, Outlet } from "react-router-dom";
import { useUserAuth } from "../context/user.authContext";

export default function AuthRoute({}) {
    const { user, loading } = useUserAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center justify-center bg-white px-6 py-4 rounded-lg  gap-3 ">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                </div>
            </div>
        );
    }

    return user ? <Navigate to="/" replace /> :<Outlet/> ;
}
