import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateChatroom.css";

function CreateChatroom() {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    const [channel, setChannel] = useState("");
    const [idInvit] = useState(user.id);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [lifespan, setLifespan] = useState("");
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (search.trim() !== "") {
            axios
                .get(`http://localhost:8080/api/chatroom/searchUsers?search=${search}`)
                .then((res) => {
                    const filteredUsers = res.data.filter((u) => u.id !== user.id);
                    setUsers(filteredUsers);
                })
                .catch((err) => console.error(err));
        } else {
            setUsers([]);
        }
    }, [search, user.id]);

    const handleSelectUser = (user) => {
        if (!selectedUsers.find((u) => u.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleRemoveUser = (id) => {
        setSelectedUsers(selectedUsers.filter((u) => u.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedUsers.length === 0) {
            alert("Veuillez ajouter au moins un utilisateur au chatroom.");
            return;
        }

        const requete = {
            idInvit,
            channel,
            description,
            date,
            lifespan,
            userIds: selectedUsers.map((u) => u.id),
        };

        try {
            await axios.post("http://localhost:8080/api/chatroom/create", requete);
            setSuccess(true);
            // Optionnel : reset du formulaire
            setChannel("");
            setDescription("");
            setDate("");
            setLifespan("");
            setSelectedUsers([]);
        } catch (err) {
            console.error("Erreur lors de l'envoi :", err);
        }
    };

    return (
        <div className="chatroom-container">
            <h2>Créer une Chatroom</h2>
            {success && <p className="success-message"> Chatroom créée avec succès !</p>}
            <form onSubmit={handleSubmit}>
                <label>Titre</label>
                <input value={channel} onChange={(e) => setChannel(e.target.value)} required />

                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

                <label>Date et heure</label>
                <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />

                <label>Durée de validité (jours)</label>
                <input type="number" min="1" value={lifespan} onChange={(e) => setLifespan(e.target.value)} required />

                <label>Rechercher un utilisateur</label>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nom d'utilisateur" />

                <div className="user-list">
                    {users.map((user) => (
                        <div key={user.id} className="user-item" onClick={() => handleSelectUser(user)}>
                            {user.firstname + " " + user.lastname}
                        </div>
                    ))}
                </div>

                <div className="selected-users">
                    {selectedUsers.map((u) => (
                        <span key={u.id} className="selected-user" onClick={() => handleRemoveUser(u.id)}>
              {u.firstname + " " + u.lastname} ✖
            </span>
                    ))}
                </div>

                <button type="submit">Créer la Chatroom</button>
            </form>
        </div>
    );
}
export default CreateChatroom;