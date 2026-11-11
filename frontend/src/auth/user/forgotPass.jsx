// src/components/ForgotPassword.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    document.title = "FORGOT PASSWORD"
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");



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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            await api.post("/user/forgot-password", { email: email.trim() });
            // setSuccessStage(true);
            toast.success("If this email exists, reset instructions were sent.");
           navigate("/auth/login");

        } catch (error) {
            console.error(error)
            const message = error.response?.data?.message;
            toast.error(message)
            setErrorMsg(message);

        }
        finally {
            setLoading(false);


        }

    };

    const inputClass =
        "w-full border-b border-gray-300 dark:border-gray-500 bg-transparent outline-none focus:border-blue-500 text-black dark:text-white";
    const labelBase =
        "absolute left-0 pointer-events-none transition-all duration-150 ease-in-out text-black dark:text-white";

    return (
        <>
            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <h1 className="text-black dark:text-white text-xl font-semibold">
                    Forgot password?
                </h1>
                <p className="text-gray-500 dark:text-gray-300 text-sm">
                    Enter your email to receive a reset link.
                </p>

                {/* EMAIL INPUT */}
                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${inputClass} peer py-2`}
                    />
                    <label
                        className={`${labelBase} ${email ? "-top-3 text-sm" : "top-2"
                            } peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-500`}
                    >
                        Enter your email
                    </label>

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
                    {loading ? "Sending link..." : "Send Reset Link"}
                </button>
            </form>

        </>
    );
};

export default ForgotPassword;
