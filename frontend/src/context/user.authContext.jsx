import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import toast from "react-hot-toast";

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch logged-in user profile
    const fetchMe = async () => {
        try {
            const res = await api.get("/user/me");
            setUser(res.data.user);
            // console.log("user",res.data.user)
        } catch(err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Login
    const login = async (email, password) => {
        await api.post("/user/login", { email, password });
        await fetchMe();
        toast.success("Login successful");
    };

    // Login using OTP verification after second step
    const completeLoginWithOtp = async (email, otp) => {
        await api.post("/user/verify-login-otp", { email, otp });
        await fetchMe();
        toast.success("Login successful");
    };

    // Logout
    const logout = async () => {
        try {
            setLoading(true)
            await api.post("/user/logout");
            setUser(null);
            toast.success("Logged out");
            window.location.href = "/auth/login";
        } catch (err) {
            console.error(err);
            toast.error("Logout failed");
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchMe();
    }, []);

    return (
        <UserAuthContext.Provider
            value={{
                user,
                loading,
                login,
                completeLoginWithOtp,
                logout,
                fetchMe,
            }}
        >
            {children}
        </UserAuthContext.Provider>
    );
};

export const useUserAuth = () => useContext(UserAuthContext);
