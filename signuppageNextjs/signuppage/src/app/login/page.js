"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import  axios  from "axios";

export default function LoginPage() {
    const router = useRouter()
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    });
  const [buttonDisabled , setButtonDisabled] = React.useState(false)
  const [loading , setLoading] = React.useState(false)

    const onLogin = async () => {
        try {
            setLoading(true)
            const response = await axios.post("/api/users/login", user);
            router.push('/profile')
        } catch (error) {
            console.log(error);
            
        }finally{
            setLoading(false)
        }
       
    };
useEffect(()=>{
    if(user.email.length>0 && user.password.length>0){
        setButtonDisabled(false)
    }
},[user])
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-500 text-gray-800">
            <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 sm:p-12">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">Welcome Back</h1>
                <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">
                    Log in to continue to your account.
                </p>
                <hr className="mb-6 border-t border-gray-300" />

                <div className="space-y-6">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-2 text-sm font-semibold text-gray-700">Email</label>
                        <input
                            className="p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                            className="p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            id="password"
                            type="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder="Enter your password"
                        />
                    </div>
                </div>

                <button
                    onClick={onLogin}
                    className="w-full mt-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Log In
                </button>

                <p className="text-center mt-6 text-sm text-gray-600">
                    Don’t have an account? <Link href="/signup" className="text-blue-600 hover:underline font-semibold">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
