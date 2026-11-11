import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";
import siteLogo from "../../assets/logos/kivo-mark.png";

const CreateNewPass = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get("token");

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            try {
                await api.get(`/user/validate-reset-token?token=${token}`);
                setIsValidToken(true);
            } catch {
                setIsValidToken(false);
            }
            setVerifying(false);
        };

        validateToken();
    }, [token]);

    const handleReset = async (e) => {
        e.preventDefault();

        if (!password || !confirm) return toast.error("All fields are required");
        if (password.length < 6) return toast.error("Password must be at least 6 characters");
        if (password !== confirm) return toast.error("Passwords do not match");

        setLoading(true);

        try {
            await api.post("/user/reset-password", { token, password });
            toast.success("Password updated! Redirecting...");
            setTimeout(() => navigate("/auth/login"), 1500);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        }

        setLoading(false);
    };

    if (verifying) {
        return (
            <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-6 py-4 rounded-lg  gap-3 ">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                    <p className="dark:text-white text-gray-600 font-semibold">Verifying...</p>
                </div>
            </div>
        );
    }

    if (!isValidToken) {
        return (
            <div className=" flex items-center justify-center bg-white dark:bg-gray-900 px-4">
                <div
                    className=" w-full max-w-md p-8 rounded-2xl shadow text-center 
        animate-[fadeIn_0.35s_ease-out,slideUp_0.35s_ease-out]"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle size={38} className="text-red-500" />
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        Reset Link Expired
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                        It looks like this reset link has expired or already been used.
                        You can generate a new one below.
                    </p>

                    <button
                        onClick={() => navigate("/auth/forgot-password")}
                        className="w-full bg-blue-600 text-white py-3 rounded-full font-medium
            hover:bg-blue-700 transition cursor-pointer active:scale-[0.97]"
                    >
                        Request New Link
                    </button>

                    <button
                        onClick={() => navigate("/auth/login")}
                        className="mt-4 text-blue-600 text-sm hover:underline cursor-pointer
            active:opacity-80 transition"
                    >
                        Back to Login
                    </button>
                </div>
            </div>

        );
    }
    const inputClass =
        "w-full border-b border-gray-300 dark:border-gray-500 bg-transparent outline-none focus:border-blue-500 text-black dark:text-white";
    const labelBase =
        "absolute left-0 pointer-events-none transition-all duration-150 ease-in-out text-black dark:text-white";

    return (
        <>
            <h2 className="text-black dark:text-white text-xl font-semibold">Reset Password</h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm mb-6">
                Create a strong new password for your account.
            </p>

                <form onSubmit={handleReset} className="space-y-4">
                   
                    <div className="relative">
                        <input
                            type="password"
                            className={`${inputClass} peer py-2`}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label
                            className={`${labelBase} ${password ? "-top-3 text-sm" : "top-2"
                                } peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-500`}
                        >
                            New Password
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            className={`${inputClass} peer py-2`}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                        <label
                            className={`${labelBase} ${confirm ? "-top-3 text-sm" : "top-2"
                                } peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-500`}
                        >
                            Confirm password
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-full text-white  transition cursor-pointer ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </>
    );
};

export default CreateNewPass;
