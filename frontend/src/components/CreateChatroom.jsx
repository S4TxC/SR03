import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./Authentication";

function CreateChatroom() {
    const { user } = useAuth();

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
            <div className="flex items-center justify-center h-screen text-xl text-gray-700">
                Please login to create a Chatroom.
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Create a Chatroom</h2>
                <p className="text-sm text-gray-500">
                    Created by: <strong>{user.firstname} {user.lastname}</strong>
                </p>
            </div>

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4">
                    Chatroom created successfully.
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Chatroom Name*</label>
                    <input
                        className="w-full border rounded px-3 py-2 mt-1"
                        value={channel}
                        onChange={(e) => setChannel(e.target.value)}
                        placeholder="Chatroom Name"
                        maxLength="100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        className="w-full border rounded px-3 py-2 mt-1"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description (optional)"
                        maxLength="500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Date & time *</label>
                        <input
                            type="datetime-local"
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Life span (days) *</label>
                        <input
                            type="number"
                            className="w-full border rounded px-3 py-2 mt-1"
                            min="1"
                            max="365"
                            value={lifespan}
                            onChange={(e) => setLifespan(e.target.value)}
                            placeholder="Ex: 7"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Search for a user</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2 mt-1"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Username"
                    />
                    {searchLoading && <p className="text-sm text-gray-400 mt-1">Searching...</p>}
                </div>

                {users.length > 0 && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">Click to add:</p>
                        <div className="grid gap-2">
                            {users.map((u) => (
                                <div
                                    key={u.id}
                                    className={`p-2 border rounded cursor-pointer hover:bg-gray-100 flex justify-between items-center ${
                                        selectedUsers.some((s) => s.id === u.id) ? "bg-green-50" : ""
                                    }`}
                                    onClick={() => handleSelectUser(u)}
                                >
                                    {u.firstname} {u.lastname}
                                    {selectedUsers.some((s) => s.id === u.id) && <span className="text-green-600">✓</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedUsers.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-1">User selected:</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedUsers.map((u) => (
                                <span
                                    key={u.id}
                                    onClick={() => handleRemoveUser(u.id)}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-200"
                                >
                                    {u.firstname} {u.lastname}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6 flex gap-4">
                    <button
                        type="submit"
                        disabled={loading || selectedUsers.length === 0}
                        className={`px-4 py-2 rounded text-white font-semibold ${
                            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Creation..." : "Create Chatroom"}
                    </button>

                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateChatroom;
