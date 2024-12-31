"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function SignUpPage() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [user, setUser] = React.useState({
        username: "",
        email: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(true);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("SignUp Success", response.data);

            toast.success("Sign Up Successful!", {
                duration: 3000,
                position: "top-right",
                style: {
                    background: "linear-gradient(to right, #4caf50, #81c784)",
                    color: "#fff",
                    fontWeight: "bold",
                },
                icon: "🎉",
            });

            router.push("/login");
        } catch (error) {
            console.log("Sign up failed", error.message);
            toast.error(`Error: ${error.response?.data?.message || "Signup failed"}`, {
                position: "top-right",
                style: {
                    background: "#f44336",
                    color: "#fff",
                    fontWeight: "bold",
                },
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isFormValid =
            user.email.trim().length > 0 &&
            user.password.trim().length > 0 &&
            user.username.trim().length > 0;
        setButtonDisabled(!isFormValid);
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-gray-800">
            <Toaster />
            <div className="w-full max-w-lg bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 sm:p-12">
                <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-6">Join Us</h1>
                <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">
                    Create an account to explore the full features.
                </p>
                <p className="text-red-700 text-center">{loading ? "Processing..." : "Sign Up"}</p>
                <hr className="mb-6 border-t border-gray-300" />

                <div className="space-y-6">
                    <div className="flex flex-col">
                        <label htmlFor="username" className="mb-2 text-sm font-semibold text-gray-700">Username</label>
                        <input
                            className="p-4 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-500 transition-all duration-200"
                            id="username"
                            type="text"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-2 text-sm font-semibold text-gray-700">Email</label>
                        <input
                            className="p-4 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-500 transition-all duration-200"
                            id="email"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-2 text-sm font-semibold text-gray-700">Password</label>
                        <input
                            className="p-4 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-500 transition-all duration-200"
                            id="password"
                            type="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder="Enter your password"
                        />
                    </div>
                </div>

                <button
                    onClick={onSignup}
                    disabled={buttonDisabled || loading}
                    className={`w-full mt-8 py-3 ${
                        buttonDisabled || loading
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105"
                    } rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl`}
                >
                    {loading ? "Processing..." : "Sign Up"}
                </button>

                <p className="text-center mt-6 text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-purple-600 hover:underline font-semibold">Login</Link>
                </p>
            </div>
        </div>
    );
}
