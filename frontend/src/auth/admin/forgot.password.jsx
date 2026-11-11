import { useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import siteLogo from "../../assets/logos/kivo-mark.png";

const ForgotAdminPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successStage, setSuccessStage] = useState(false);
    const navigate = useNavigate();

    // -------------------- Validation --------------------
    const validate = () => {
        if (!email.trim()) {
            setErrorMsg("Email is required");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrorMsg("Enter a valid email");
            return false;
        }
        setErrorMsg("");
        return true;
    };

    // -------------------- Submit --------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            await api.post("/admin/forgot-password", { email: email.trim() });

            setSuccessStage(true);
            toast.success("If this email exists, reset instructions were sent.");

            setTimeout(() => navigate("/admin/login"), 2500);

        } catch (error) {
            const message = error.response?.data?.message;

            // Handle cooldown / locked state
            if (error.response?.status === 429) {
                toast.error(message);
                setErrorMsg(message);
            } else {
                // Still pretend success for security
                toast.success("If this email exists, reset instructions were sent.");
                setSuccessStage(true);
                setTimeout(() => navigate("/admin/login"), 2500);
            }
        }

        setLoading(false);
    };

    return (
        <>
            {/* -------- Loading Overlay -------- */}
            {loading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
                    <div className="bg-white rounded-xl flex items-center gap-3 px-6 py-4 shadow">
                        <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-lg font-medium">Sending...</p>
                    </div>
                </div>
            )}

            {/* -------- Success Pop Animation -------- */}
            {successStage && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-10 text-center animate-fadeIn">
                        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <span className="text-green-600 text-4xl">✔</span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Email Sent</h2>
                        <p className="text-gray-600 text-sm mt-2">
                            If the email exists, a secure reset link has been sent.
                        </p>
                    </div>
                </div>
            )}

            {/* -------- Main UI -------- */}
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

                    <div className="flex justify-center mb-4">
                        <img src={siteLogo} className="w-20" alt="logo" />
                    </div>

                    <h1 className="text-2xl font-bold text-center text-gray-800">
                        Forgot Password?
                    </h1>
                    <p className="text-gray-500 text-sm text-center mb-6">
                        Enter your email to receive a reset link.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="admin@example.com"
                                className={`w-full border px-4 py-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition ${errorMsg ? "border-red-500" : "border-gray-300"
                                    }`}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrorMsg("");
                                }}
                            />
                            {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded-full text-white transition cursor-pointer ${loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            Send Reset Link
                        </button>
                    </form>

                    <button
                        onClick={() => navigate("/admin/login")}
                        className="text-blue-600 text-sm mt-5 block text-center hover:underline cursor-pointer"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </>
    );
};

export default ForgotAdminPassword;
