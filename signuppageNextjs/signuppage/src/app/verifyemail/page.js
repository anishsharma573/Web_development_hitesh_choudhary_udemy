"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const verifyUserEmail = async () => {
        try {
            setLoading(true);
            await axios.post("/api/users/verifyemail", { token });
            setVerified(true);
            setError(""); // Clear any previous error
        } catch (error) {
            setVerified(false);
            setError(error.response?.data?.message || "An error occurred");
            console.error("Error verifying email:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get("token");
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (token) {
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen py-2"
            style={{ backgroundColor: verified ? "#E6FFED" : "#FFF5F5" }}
        >
            <h1 className="text-3xl font-bold text-gray-900">Verify Email</h1>

            {loading && <p className="text-blue-500">Verifying...</p>}

            {!loading && (
                <>
                    {verified ? (
                        <div className="p-4 bg-green-500 text-white rounded-lg">
                            <p className="text-lg">Email Verified Successfully!</p>
                            <Link href="/login" className="text-blue-300 underline">
                                Go to Login
                            </Link>
                        </div>
                    ) : (
                        <div className="p-4 bg-red-500 text-white rounded-lg">
                            <p className="text-lg">Email Verification Failed</p>
                            {error && <p className="text-sm">{error}</p>}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
