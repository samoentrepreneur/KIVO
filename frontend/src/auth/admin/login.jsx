import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import siteLogo from "../../assets/logos/kivo-mark.png";
import toast from "react-hot-toast";
import { useAuth } from "../../context/admin.authContext";

const AdminLogin = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const [loadingPopup, setLoadingPopup] = useState({ show: false, text: "" });

    // OTP modal
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef([]);
    const [otpError, setOtpError] = useState("");

    const [timer, setTimer] = useState(120);
    const [canResend, setCanResend] = useState(false);

    const navigate = useNavigate();
    const { fetchMe } = useAuth();
    document.title = "Admin - Login";

    // OTP Countdown
    useEffect(() => {
        if (!showOtpModal || timer <= 0) return;

        const interval = setInterval(() => setTimer(prev => prev - 1), 1000);

        if (timer === 1) setCanResend(true);

        return () => clearInterval(interval);
    }, [timer, showOtpModal]);

    // Validate input
    const validateInputs = () => {
        const err = {};

        if (!form.email.trim()) err.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Invalid email format";

        if (!form.password) err.password = "Password is required";
        else if (form.password.length < 6) err.password = "Password must be at least 6 characters";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    // Backend-aware login submit handling
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        setLoadingPopup({ show: true, text: "Submitting..." });

        try {
            const res = await api.post("/admin/login", form);
            // console.log(res);

            if (res.data?.success && res.data.requiresOtp) {
                setOtp(["", "", "", "", "", ""]);
                setShowOtpModal(true);
                setTimer(120);
                setCanResend(false);
                setForm(prev => ({ ...prev, password: "" }));
                toast.success("OTP Sent to Email");
            } else if (res.data?.success) {
                localStorage.setItem("admin-auth", "true");
                await fetchMe();
                toast.success("Admin login successful");
                navigate("/admin/dashboard");
            }

        } catch (err) {
            const message = err.response?.data?.message || "Something went wrong";
            // console.error(err);
            // Handling specific server responses
            if (err.response?.status === 429) {
                toast.error(message);
                setErrors({ form: message });
            } else if (err.response?.status === 401) {
                setErrors({ form: "Invalid email or password" });
            } else {
                setErrors({ form: message });
            }
        }

        setLoadingPopup({ show: false, text: "" });
    };

    // OTP input logic
    const handleOtpChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);

        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpBackspace = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const paste = e.clipboardData.getData("text");
        if (/^\d{6}$/.test(paste)) {
            setOtp(paste.split(""));
            otpRefs.current[5]?.focus();
        }
    };

    const verifyOtp = async () => {
        const code = otp.join("");

        if (code.length !== 6) return setOtpError("Enter a valid 6-digit OTP");

        setLoadingPopup({ show: true, text: "Verifying OTP..." });

        try {
            const res = await api.post("/admin/verify-otp", { email: form.email, otp: code });
            if (res.data?.success)
            localStorage.setItem("admin-auth", "true");
            await fetchMe();
            toast.success("Login Successful 🎉");
            navigate("/admin/dashboard");
            setShowOtpModal(false);

        } catch (err) {
            console.error(err);
            setOtpError(err.response?.data?.message || "Invalid OTP");
        }

        setLoadingPopup({ show: false, text: "" });
    };

    const resendOtp = async () => {
        setLoadingPopup({ show: true, text: "Resending OTP..." });
        setOtp(["", "", "", "", "", ""]);

        try {
            await api.post("/admin/resend-otp", { email: form.email });

            toast.success("OTP Resent ✔");
            setOtpError("");
            setTimer(120);
            setCanResend(false);

        } catch {
            setOtpError("Failed to resend OTP");
        }

        setLoadingPopup({ show: false, text: "" });
    };

    return (
        <>
            {/* Loading Overlay */}
            {loadingPopup.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
                    <div className="bg-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                        <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                        <p className="text-lg">{loadingPopup.text}</p>
                    </div>
                </div>
            )}

            {/* Login */}
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow">
                    <div className="flex justify-center mb-4">
                        <img src={siteLogo} className="w-20" alt="Logo" />
                    </div>

                    <h2 className="text-2xl font-bold text-center">Admin Login</h2>

                    {/* Error */}
                    {errors.form && (
                        <p className="mt-3 text-red-600 text-center bg-red-100 border border-red-300 px-4 py-2 rounded-lg">
                            {errors.form}
                        </p>
                    )}

                    <form className="space-y-5 mt-5" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2 cursor-pointer"
                            >
                                {showPassword ? "👁️" : "🙈"}
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition cursor-pointer"
                        >
                            Login
                        </button>
                    </form>

                    <p
                        onClick={() => navigate("/admin/forgot-password")}
                        className="text-blue-600 text-center text-sm mt-4 cursor-pointer hover:underline"
                    >
                        Forgot Password?
                    </p>
                </div>
            </div>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-7 rounded-2xl shadow-xl w-80 md:w-96">
                        <h2 className="text-lg font-semibold mb-3">Enter OTP</h2>
                        <p className="text-gray-600 text-sm mb-4">A 6-digit code was sent to <strong>{form.email}</strong></p>

                        <div className="flex justify-center gap-2 mb-3" onPaste={handleOtpPaste}>
                            {otp.map((d, i) => (
                                <input
                                    key={i}
                                    maxLength={1}
                                    value={d}
                                    ref={(el) => (otpRefs.current[i] = el)}
                                    onKeyDown={(e) => handleOtpBackspace(e, i)}
                                    onChange={(e) => handleOtpChange(e.target.value, i)}
                                    className="w-10 h-10 md:w-12 md:h-12 border border-gray-400 rounded-lg text-center text-xl"
                                />
                            ))}
                        </div>

                        {otpError && <p className="text-red-500 text-sm mb-3">{otpError}</p>}

                        <div className="text-sm mb-4">
                            {!canResend ? (
                                <>Resend OTP in <strong>{timer}s</strong></>
                            ) : (
                                <span className="text-blue-600 cursor-pointer hover:underline" onClick={resendOtp}>
                                    Resend OTP
                                </span>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                className="flex-1 bg-gray-300 py-2 rounded-full cursor-pointer hover:bg-gray-400"
                                onClick={() => setShowOtpModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={verifyOtp}
                                className="flex-1 bg-blue-600 text-white py-2 cursor-pointer rounded-full hover:bg-blue-700"
                            >
                                Verify
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminLogin;
