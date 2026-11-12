import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import toast from "react-hot-toast";
import { useUserAuth } from "../../context/user.authContext";

const Login = () => {
    document.title = "LOGIN";

    const navigate = useNavigate();
    const { fetchMe } = useUserAuth();

    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // OTP Modal State
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputsRef = useRef([]);
    const [otpError, setOtpError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    // Resend timer
    const [timer, setTimer] = useState(120);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (!showOtpModal) return;

        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev === 1) {
                    clearInterval(interval);
                    setCanResend(true);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [showOtpModal]);

    const validateForm = () => {
        let newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Enter a valid email";
        }

        if (!form.password.trim()) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            const res = await api.post("/user/login", form, { withCredentials: true });

            if (res.data.success && res.data.requiresOtp) {
                toast.success("Verify OTP to continue");
                setShowOtpModal(true);
                return;
            }

            await fetchMe();
            toast.success("Logged in successfully!");
            navigate("/");

        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    // OTP logic
    const handleOtpChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleBackKey = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
        if (pasteData.every((char) => /^[0-9]$/.test(char))) {
            setOtp(pasteData);
            inputsRef.current[5].focus();
        }
    };

    const handleVerifyOtp = async () => {
        const code = otp.join("");

        if (code.length !== 6) return setOtpError("Enter full 6-digit OTP");

        setIsVerifying(true);

        try {
            const res = await api.post("/user/verify-login-otp", { email: form.email, otp: code });

            if (res.data.success) {
                // localStorage.setItem("user-auth", "true");
                
                await fetchMe();
                toast.success("Verification successful!");
                navigate("/");
            }

        } catch (err) {
            setOtpError(err.response?.data?.message || "Invalid OTP");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) return;

        setCanResend(false);
        setTimer(120);

        try {
            const res = await api.post('/user/resend-otp',
                { email: form.email }
            );
            if (res.data.success)
                toast.success("OTP resent successfully!");
        } catch {
            toast.error("Failed to resend OTP.");
            setOtpError("Failed to resend OTP");
        }
        finally {
            setOtpError("");
            setOtp["", "", "", "", "", ""];
        }
    };

    const inputClass =
        "w-full border-b border-gray-300 dark:border-white/10 bg-transparent outline-none focus:border-blue-600 text-black dark:text-white py-2";
    const labelBase =
        "absolute left-0 pointer-events-none transition-all  duration-150 ease-in-out text-black dark:text-white";

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <h1 className="text-black dark:text-white text-xl font-semibold">Login</h1>

                <div className="relative">
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={`peer ${inputClass}`}
                    />
                    <label
                        className={`${labelBase} ${form.email ? "-top-3 text-sm" : "top-2"
                            } peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-500`}
                    >
                        Email
                    </label>
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div className="relative">
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className={`peer ${inputClass}`}
                    />
                    <label
                        className={`${labelBase} ${form.password ? "-top-3 text-sm" : "top-2"
                            } peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-500`}
                    >
                        Password
                    </label>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>
                <div className="flex flex-row items-center justify-end text-sm">
                    <span onClick={() => navigate("/auth/forgot-password")} className="text-blue-500 cursor-pointer hover:underline">Forgot password</span>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded-full py-2 cursor-pointer hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Don’t have an account?{" "}
                    <span onClick={() => navigate("/auth/register")} className="text-blue-500 cursor-pointer hover:underline">
                        Register
                    </span>
                </p>
            </form>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-sm">
                        <h2 className="text-lg font-semibold text-start text-gray-800 dark:text-white">Enter OTP</h2>
                        <p className="text-start text-gray-500 dark:text-gray-200 text-sm">
                            Sent to <b>{form.email}</b>
                        </p>

                        {/* OTP Boxes */}
                        <div className="flex justify-between mt-6" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputsRef.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                    onKeyDown={(e) => handleBackKey(e, index)}
                                    className="w-10 h-12 text-center text-xl border dark:border-gray-500 rounded-md text-black dark:text-white dark:bg-gray-800"
                                />
                            ))}
                        </div>
                        {otpError &&
                            <p className="mt-3 text-red-400 text-start text-xs">
                                {otpError}
                            </p>
                        }

                        {/* Resend Section */}
                        <div className="mt-3 text-start">
                            {!canResend ? (
                                <span className="text-gray-400 dark:text-gray-200 text-sm">
                                    Resend OTP in {timer}s
                                </span>
                            ) : (
                                <button
                                    onClick={handleResendOtp}
                                    className="text-blue-600 cursor-pointer hover:underline text-sm"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowOtpModal(false)}
                                className="w-1/2 border cursor-pointer dark:border-gray-500 dark:text-gray-300 hover:text-red-300 rounded-full py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVerifyOtp}
                                disabled={isVerifying}
                                className="w-1/2 bg-blue-600 cursor-pointer text-white rounded-full py-2"
                            >
                                {isVerifying ? "Verifying..." : "Verify OTP"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
