"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";


export default function ProfilePage() {
    const [data ,setData] = useState()
    const router = useRouter();
    const logout = async () => {  
       try {
        const response = await axios.get('/api/users/logout')
        
        router.push("/login")
        

       } catch (error) {
            console.log(error)
       }
    }

    const getUserDetails = async () => {
        try {
            const response = await axios.get('/api/users/me')
            const data = response.data
            setData(data.data._id)
        } catch (error) {
            console.log(error.message);
            
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-teal-500 text-gray-800">
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">Profile</h1>
                <hr className="mb-6 border-gray-300" />
                <p className="text-center text-gray-600 text-lg">
                    Welcome to your Profile Page.
                </p>
                <hr/>

                <div className="flex  justify-center align-middle ">
                <button onClick={logout}  className="bg-blue-800 mt-4  hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"  >Logout</button>
                 
                 </div>
                 <hr/>
                 <div className="flex  justify-center align-middle ">
             
                 <h2 >user Data: {data}</h2>
                 <button onClick={getUserDetails}  className="bg-pink-500 mt-4  hover:bg-pink-200 text-white font-bold py-2 px-4 rounded"  >Get  User data</button>
                 </div>
            </div>
        </div>
    );
}
