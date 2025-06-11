import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./Authentication";

const UserMenu = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {user ? `Welcome back ${user.firstname}!` : "Welcome in Chatroom"}
                    </h1>
                    {user && (
                        <p className="text-gray-600 mt-2">
                            {user.firstname} {user.lastname} — <span className="text-sm">{user.email}</span>
                        </p>
                    )}
                </div>

                <div className="grid gap-3">
                    <Link to="/accueil" className="w-full block bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        Homepage
                    </Link>
                    <Link to="/myChatrooms" className="w-full block bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
                        My Chatrooms
                    </Link>
                    <Link to="/invitedChatrooms" className="w-full block bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition">
                        My Invitations
                    </Link>
                    <Link to="/createChatroom" className="w-full block bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                        Create a Chatroom
                    </Link>
                </div>

                <div className="pt-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserMenu;
