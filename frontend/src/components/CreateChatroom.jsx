import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./Authentication";
import { useNavigate } from "react-router-dom";

function CreateChatroom() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [channel, setChannel] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [lifespan, setLifespan] = useState("");
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!user?.id || search.trim() === "") {
                setUsers([]);
                return;
            }

            const fetchUsers = async () => {
                try {
                    setSearchLoading(true);
                    const response = await axios.get(
                        `http://localhost:8080/api/chatroom/searchUsers?search=${encodeURIComponent(search)}`
                    );
                    setUsers(response.data.filter((u) => u.id !== user.id));
                } catch (err) {
                    setUsers([]);
                    if (err.response?.status === 401) {
                        setError("Session expired. Please try again later.");
                    } else {
                        setError("Error occurred while searching for users.");
                    }
                } finally {
                    setSearchLoading(false);
                }
            };

            fetchUsers();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, user]);

    const handleSelectUser = (u) => {
        if (!selectedUsers.find((x) => x.id === u.id)) {
            setSelectedUsers([...selectedUsers, u]);
        }
    };

    const handleRemoveUser = (id) => {
        setSelectedUsers(selectedUsers.filter((u) => u.id !== id));
    };

    const resetForm = () => {
        setChannel("");
        setDescription("");
        setDate("");
        setLifespan("");
        setSearch("");
        setUsers([]);
        setSelectedUsers([]);
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.id) return setError("Session expired. Please try again later.");
        if (!channel.trim()) return setError("The title is mandatory.");
        if (!date) return setError("Date and time are mandatory.");
        if (!lifespan || parseInt(lifespan) < 1) return setError("Invalid duration");
        if (selectedUsers.length === 0) return setError("Please add at least one user.");

        const payload = {
            idInvit: user.id,
            channel: channel.trim(),
            description: description.trim(),
            date,
            lifespan: parseInt(lifespan),
            userIds: selectedUsers.map((u) => u.id),
        };

        try {
            setLoading(true);
            await axios.post("http://localhost:8080/api/chatroom/create", payload);
            setSuccess(true);
            resetForm();
            setTimeout(() => navigate("/userMenu"), 300);
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Session expired. Please try again later.");
            } else if (err.response?.status === 400) {
                setError("Invalid data.");
            } else {
                setError("Error while creating.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div
                className="min-h-screen flex justify-center items-center"
                style={{
                    backgroundImage: "url('images/BackgroundRegister.gif')",
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    margin: 0,
                    padding: 0
                }}
            >
                <div className="text-center bg-white bg-opacity-80 p-8 border-4 border-black">
                    <p
                        className="text-xl text-gray-700"
                        style={{ fontFamily: "'Press Start 2P', cursive" }}
                    >
                        Please login to create a Chatroom.
                    </p>
                </div>
            </div>
        );
    }

    const isFormEmpty = channel === '' || date === '' || lifespan === '' || selectedUsers.length === 0;

    return (
        <div
            className="min-h-screen flex justify-center items-center p-4"
            style={{
                backgroundImage: "url('images/BackgroundRegister.gif')",
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                margin: 0,
                padding: 0
            }}
        >
            <div className="relative w-full max-w-4xl">
                <div
                    className={`relative px-8 pt-6 pb-8 mb-4 border-4 border-black transition-all duration-300 ${
                        isFormEmpty ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-80'
                    }`}
                    style={{
                        borderRadius: '0'
                    }}
                >
                    <img
                        src="/images/Shadow.png"
                        alt="OP"
                        className="absolute -top-0 -left-0 w-20 h-20 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    <img
                        src="/images/Bison.png"
                        alt="Luffy"
                        className="absolute -top-0 -right-0 w-28 h-28 transform translate-x-1/2 -translate-y-1/2"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    <img
                        src="/images/Sonic.png"
                        alt="Vegeta"
                        className="absolute -bottom-8 -left-0 w-56 h-56 transform -translate-x-1/2 translate-y-1/2"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    <img
                        src="/images/AceHat.png"
                        alt="Zoro"
                        className="absolute -bottom-0 -right-0 w-36 h-36 transform translate-x-1/2 translate-y-1/2"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    <div className="flex justify-between items-center mb-6">
                        <h2
                            className="text-2xl font-bold"
                            style={{ fontFamily: "'Press Start 2P', cursive" }}
                        >
                            Create a Chatroom
                        </h2>
                        <p
                            className="text-sm text-gray-700"
                            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.7em' }}
                        >
                            Created by: <strong>{user.firstname} {user.lastname}</strong>
                        </p>
                    </div>

                    {success && (
                        <div className="bg-green-100 border-4 border-green-600 text-green-700 p-3 mb-4" style={{ borderRadius: '0' }}>
                            <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}>
                                Chatroom created successfully.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border-4 border-red-600 text-red-700 p-3 mb-4" style={{ borderRadius: '0' }}>
                            <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}>
                                {error}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                className="block text-sm font-bold mb-2 text-gray-700"
                                style={{ fontFamily: "'Press Start 2P', cursive" }}
                            >
                                Chatroom Name*
                            </label>
                            <input
                                className="w-full border-2 border-black px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                style={{
                                    borderRadius: '0',
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '0.8em'
                                }}
                                value={channel}
                                onChange={(e) => setChannel(e.target.value)}
                                placeholder="Chatroom Name"
                                maxLength="100"
                            />
                        </div>

                        <div>
                            <label
                                className="block text-sm font-bold mb-2 text-gray-700"
                                style={{ fontFamily: "'Press Start 2P', cursive" }}
                            >
                                Description
                            </label>
                            <textarea
                                className="w-full border-2 border-black px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                                style={{
                                    borderRadius: '0',
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '0.8em'
                                }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description (optional)"
                                maxLength="500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-sm font-bold mb-2 text-gray-700"
                                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                                >
                                    Date & time *
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full border-2 border-black px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    style={{
                                        borderRadius: '0',
                                        fontFamily: "'Press Start 2P', cursive",
                                        fontSize: '0.8em'
                                    }}
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                            </div>

                            <div>
                                <label
                                    className="block text-sm font-bold mb-2 text-gray-700"
                                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                                >
                                    Life span (days) *
                                </label>
                                <input
                                    type="number"
                                    className="w-full border-2 border-black px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    style={{
                                        borderRadius: '0',
                                        fontFamily: "'Press Start 2P', cursive",
                                        fontSize: '0.8em'
                                    }}
                                    min="1"
                                    max="365"
                                    value={lifespan}
                                    onChange={(e) => setLifespan(e.target.value)}
                                    placeholder="Ex: 7"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                className="block text-sm font-bold mb-2 text-gray-700"
                                style={{ fontFamily: "'Press Start 2P', cursive" }}
                            >
                                Search for a user
                            </label>
                            <input
                                type="text"
                                className="w-full border-2 border-black px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                style={{
                                    borderRadius: '0',
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '0.8em'
                                }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Username"
                            />
                            {searchLoading && (
                                <p
                                    className="text-sm text-gray-400 mt-1"
                                    style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.7em' }}
                                >
                                    Searching...
                                </p>
                            )}
                        </div>

                        {users.length > 0 && (
                            <div className="mt-4">
                                <p
                                    className="text-sm text-gray-600 mb-3 font-bold"
                                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                                >
                                    Click to add:
                                </p>
                                <div className="grid gap-2">
                                    {users.map((u) => (
                                        <div
                                            key={u.id}
                                            className={`p-3 border-2 border-black cursor-pointer hover:bg-gray-100 flex justify-between items-center ${
                                                selectedUsers.some((s) => s.id === u.id) ? "bg-green-100" : "bg-white"
                                            }`}
                                            style={{ borderRadius: '0' }}
                                            onClick={() => handleSelectUser(u)}
                                        >
                                            <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}>
                                                {u.firstname} {u.lastname}
                                            </span>
                                            {selectedUsers.some((s) => s.id === u.id) && (
                                                <span
                                                    className="text-green-600 font-bold"
                                                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                                                >
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedUsers.length > 0 && (
                            <div className="mt-6">
                                <p
                                    className="text-sm text-gray-600 mb-3 font-bold"
                                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                                >
                                    User selected:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedUsers.map((u) => (
                                        <span
                                            key={u.id}
                                            onClick={() => handleRemoveUser(u.id)}
                                            className="bg-blue-100 text-blue-800 px-3 py-2 border-2 border-blue-600 text-sm cursor-pointer hover:bg-blue-200"
                                            style={{
                                                borderRadius: '0',
                                                fontFamily: "'Press Start 2P', cursive",
                                                fontSize: '0.7em'
                                            }}
                                        >
                                            {u.firstname} {u.lastname}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex gap-4 justify-center">
                            <button
                                type="submit"
                                disabled={loading || selectedUsers.length === 0}
                                className={`px-6 py-3 border-2 border-black text-white font-bold ${
                                    loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                                style={{
                                    borderRadius: '0',
                                    fontFamily: "'Press Start 2P', cursive"
                                }}
                            >
                                {loading ? "Creation..." : "Create Chatroom"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-3 border-2 border-black text-gray-700 bg-white hover:bg-gray-100 font-bold"
                                style={{
                                    borderRadius: '0',
                                    fontFamily: "'Press Start 2P', cursive"
                                }}
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateChatroom;