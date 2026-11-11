// src/components/AuthWrapper.jsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import GoogleIcon from "../../assets/logos/icon-google.svg"
import { useGoogleLogin } from "@react-oauth/google";
import toast from 'react-hot-toast';
import api from "../../api";
import { useState } from "react";
import { useUserAuth } from "../../context/user.authContext";

const fetchGoogleProfile = async (access_token) => {
    try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const profile = await res.json();
        const data = {
            name: profile.name,
            email: profile.email,
            avatar: profile.picture,
            googleId:profile.sub
        }
        return data;
    } catch (err) {
        toast.error("Failed to fetch profile:", err);
    }
};

const AuthWrapper = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const { fetchMe } = useUserAuth();

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true)
            const profile = await fetchGoogleProfile(tokenResponse.access_token);
            if (!profile.email) return toast.error("Something went wrong, Try again.");
            try {
                const res = await api.post("/user/login", {
                    email: profile.email,
                    googleId: profile.googleId,
                    avatar: profile?.avatar,
                    fullName: profile.name
                    
                }, { withCredentials: true });

                if (res.data.success) {
                    await fetchMe();
                    toast.success("Logged in successfully!");
                    navigate("/");
                }

               

            } catch (err) {
                toast.error(err.response?.data?.message || "Login failed");
            } finally {
                setLoading(false);
            }
           

        },
        onError: (error) => {
            toast.error("Login failed!, Something went wrong. Please try again.");
            console.log(error)
            setLoading(false);

        },
        flow: "implicit",
    });


    return (
        <div className="min-h-screen flex flex items-center justify-center bg-gray-100 dark:bg-gray-900  p-4">

            <div className="bg-white dark:bg-gray-900 md:border border-white/10  w-full max-w-md rounded-lg p-8">

                <Outlet />
                {/* Google Button */}
                {location.pathname !== "/auth/forgot-password" && location.pathname !== "/auth/reset-password" &&
                    location.pathname !== "/auth/create-password" && (
                        <>
                            <div className="flex flex-row gap-2 items-center py-8">
                                <div className="w-full h-[1px] dark:bg-white/10 bg-black/10" />
                                <span className="text-gray-500 dark:text-gray-500">OR</span>
                                <div className="w-full h-[1px] dark:bg-white/10 bg-black/10 " />
                            </div>

                        <button disabled={loading} onClick={login} className="w-full text-gray-600 dark:text-white border dark:border-white/10 border-black/10 py-2 rounded-full cursor-pointer hover:text-blue-600 flex items-center justify-center gap-2 disabled:opacity-50">
                               {loading?"Signing with google...":<><img src={GoogleIcon} alt="google" className="w-5" />
                                Continue with Google</>}
                        </button>
                        
                        {
                            loading && <div className="flex items-center justify-center fixed top-0 right-0 w-full h-full bg-black/50 z-50">
                               
                                <div className="bg-white w-fit p-4 max-auto flex gap-2 items-center rounded">
                                    <div className="h-6 w-6 border-4 border-blue-400 bg-white rounded-full border-t-transparent animate-spin" />
                                    <span>Submitting...</span>
                                </div>
                            </div>


                        }
                        </>
                    )
                }

            </div>
        </div>
    );
};

export default AuthWrapper;
