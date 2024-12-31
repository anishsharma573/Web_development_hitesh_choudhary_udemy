export default function UserProfilePage({ params }) {
    const userId = params.id;

    if (!userId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-teal-500 text-gray-800">
                <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">Profile</h1>
                    <hr className="mb-6 border-gray-300" />
                    <p className="text-center text-gray-600 text-lg">
                        User ID is missing or invalid.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-teal-500 text-gray-800">
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">Profile</h1>
                <hr className="mb-6 border-gray-300" />
                <p className="text-center text-orange-600 text-lg">
                    Welcome to your Profile Page. User ID: {userId}
                
                </p>
            </div>
        </div>
    );
}
