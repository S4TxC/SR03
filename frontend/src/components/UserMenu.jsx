import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./Authentication";

const UserMenu = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                backgroundImage: "url('/images/BackgroundUserMenu.gif')",
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            }}
        >
            <div
                className="bg-white bg-opacity-80 border-4 border-black p-8 max-w-md w-full text-center space-y-6"
                style={{ borderRadius: '0' }}
            >
                <div>
                    <div
                        className="w-16 h-16 bg-blue-600 border-2 border-black flex items-center justify-center mb-4 mx-auto"
                        style={{ borderRadius: '0' }}
                    >
                        <span
                            className="text-white font-bold text-xl"
                            style={{ fontFamily: "'Press Start 2P', cursive" }}
                        >
                            {user ? user.firstname.charAt(0).toUpperCase() : 'U'}
                        </span>
                    </div>

                    <h1
                        className="text-2xl font-bold text-gray-800 mb-4"
                        style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '1.2em' }}
                    >
                        {user ? `Welcome back ${user.firstname}!` : "Welcome in Chatroom"}
                    </h1>

                    {user && (
                        <div
                            className="bg-gray-800 border-2 border-black px-4 py-2 mt-4"
                            style={{ borderRadius: '0' }}
                        >
                            <p
                                className="text-white text-sm"
                                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.7em' }}
                            >
                                {user.firstname} {user.lastname}
                            </p>
                            <p
                                className="text-gray-300 text-xs mt-1"
                                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.6em' }}
                            >
                                {user.email}
                            </p>
                        </div>
                    )}
                </div>

                <div className="grid gap-4">
                    <Link
                        to="/accueil"
                        className="w-full block bg-blue-600 hover:bg-blue-700 text-white py-3 border-2 border-black transition-all duration-200 hover:scale-105"
                        style={{
                            borderRadius: '0',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.8em'
                        }}
                    >
                        Homepage
                    </Link>

                    <Link
                        to="/myChatrooms"
                        className="w-full block bg-indigo-600 hover:bg-indigo-700 text-white py-3 border-2 border-black transition-all duration-200 hover:scale-105"
                        style={{
                            borderRadius: '0',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.8em'
                        }}
                    >
                        My Chatrooms
                    </Link>

                    <Link
                        to="/invitedChatrooms"
                        className="w-full block bg-teal-600 hover:bg-teal-700 text-white py-3 border-2 border-black transition-all duration-200 hover:scale-105"
                        style={{
                            borderRadius: '0',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.8em'
                        }}
                    >
                        My Invitations
                    </Link>

                    <Link
                        to="/createChatroom"
                        className="w-full block bg-green-600 hover:bg-green-700 text-white py-3 border-2 border-black transition-all duration-200 hover:scale-105"
                        style={{
                            borderRadius: '0',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.8em'
                        }}
                    >
                        Create a Chatroom
                    </Link>
                </div>

                <div className="pt-4">
                    <div className="flex justify-center mb-4">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-600" style={{ borderRadius: '0' }}></div>
                            <div className="w-2 h-2 bg-gray-600" style={{ borderRadius: '0' }}></div>
                            <div className="w-2 h-2 bg-gray-600" style={{ borderRadius: '0' }}></div>
                            <div className="w-2 h-2 bg-gray-600" style={{ borderRadius: '0' }}></div>
                            <div className="w-2 h-2 bg-gray-600" style={{ borderRadius: '0' }}></div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 border-2 border-black transition-all duration-200 hover:scale-105"
                        style={{
                            borderRadius: '0',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.8em'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserMenu;