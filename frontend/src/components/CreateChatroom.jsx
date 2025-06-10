import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./Authentication";
import "./CreateChatroom.css";

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
        const searchUsers = async () => {
            if (!user?.id) {
                console.log('❌ Pas d\'utilisateur pour la recherche');
                return;
            }

            if (search.trim() === "") {
                setUsers([]);
                return;
            }

            try {
                console.log('🔍 Recherche d\'utilisateurs:', search);
                setSearchLoading(true);
                setError(null);

                const response = await axios.get(
                    `http://localhost:8080/api/chatroom/searchUsers?search=${encodeURIComponent(search)}`
                );

                // Exclure l'utilisateur courant
                const filteredUsers = response.data.filter((u) => u.id !== user.id);
                console.log('✅ Utilisateurs trouvés:', filteredUsers.length);
                setUsers(filteredUsers);
            } catch (err) {
                console.error('❌ Erreur recherche utilisateurs:', err);

                if (err.response?.status === 401) {
                    setError("Session expirée. Veuillez vous reconnecter.");
                } else {
                    setError("Erreur lors de la recherche d'utilisateurs.");
                }
                setUsers([]);
            } finally {
                setSearchLoading(false);
            }
        };

        // Debounce la recherche pour éviter trop de requêtes
        const timeoutId = setTimeout(searchUsers, 300);
        return () => clearTimeout(timeoutId);
    }, [search, user]);

    const handleSelectUser = (userToAdd) => {
        if (!selectedUsers.some((u) => u.id === userToAdd.id)) {
            setSelectedUsers([...selectedUsers, userToAdd]);
            console.log('👤 Utilisateur ajouté:', userToAdd.firstname, userToAdd.lastname);
        }
    };

    const handleRemoveUser = (idToRemove) => {
        const removedUser = selectedUsers.find(u => u.id === idToRemove);
        setSelectedUsers(selectedUsers.filter((u) => u.id !== idToRemove));
        console.log('❌ Utilisateur retiré:', removedUser?.firstname, removedUser?.lastname);
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
        console.log('🔄 Formulaire réinitialisé');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.id) {
            setError("Session expirée. Veuillez vous reconnecter.");
            return;
        }

        if (selectedUsers.length === 0) {
            setError("Veuillez ajouter au moins un utilisateur au chatroom.");
            return;
        }

        // Validation des données
        if (!channel.trim()) {
            setError("Le titre est obligatoire.");
            return;
        }

        if (!date) {
            setError("La date et l'heure sont obligatoires.");
            return;
        }

        if (!lifespan || lifespan < 1) {
            setError("La durée de validité doit être d'au moins 1 jour.");
            return;
        }

        const requete = {
            idInvit: user.id,
            channel: channel.trim(),
            description: description.trim(),
            date,
            lifespan: parseInt(lifespan),
            userIds: selectedUsers.map((u) => u.id),
        };

        try {
            console.log('📤 Création de la chatroom:', requete);
            setLoading(true);
            setError(null);
            setSuccess(false);

            await axios.post("http://localhost:8080/api/chatroom/create", requete);

            console.log('✅ Chatroom créée avec succès');
            setSuccess(true);
            resetForm();
        } catch (err) {
            console.error('❌ Erreur création chatroom:', err);

            if (err.response?.status === 401) {
                setError("Session expirée. Veuillez vous reconnecter.");
            } else if (err.response?.status === 400) {
                setError("Données invalides. Vérifiez vos informations.");
            } else {
                setError("Erreur lors de la création de la chatroom.");
            }
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    // Vérification de l'utilisateur connecté
    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg">Veuillez vous connecter pour créer une chatroom.</p>
            </div>
        );
    }

    return (
        <div className="chatroom-container">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Créer une Chatroom</h2>
                <div className="text-sm text-gray-600">
                    Créée par: <strong>{user.firstname} {user.lastname}</strong>
                </div>
            </div>

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    ✅ Chatroom créée avec succès !
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    ❌ {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label>Titre *</label>
                <input
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    required
                    placeholder="Titre de la chatroom"
                    maxLength="100"
                />

                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description (optionnelle)"
                    maxLength="500"
                />

                <label>Date et heure *</label>
                <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    min={new Date().toISOString().slice(0, 16)}
                />

                <label>Durée de validité (jours) *</label>
                <input
                    type="number"
                    min="1"
                    max="365"
                    value={lifespan}
                    onChange={(e) => setLifespan(e.target.value)}
                    required
                    placeholder="Ex: 7"
                />

                <label>Rechercher un utilisateur</label>
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Nom d'utilisateur"
                    />
                    {searchLoading && (
                        <div className="absolute right-2 top-2">
                            <span className="text-sm text-gray-500">🔍</span>
                        </div>
                    )}
                </div>

                <div className="user-list">
                    {users.length > 0 && (
                        <div className="text-sm text-gray-600 mb-2">
                            {users.length} utilisateur(s) trouvé(s) - Cliquez pour ajouter
                        </div>
                    )}
                    {users.map((searchUser) => (
                        <div
                            key={searchUser.id}
                            className={`user-item ${
                                selectedUsers.some(u => u.id === searchUser.id) ? 'already-selected' : ''
                            }`}
                            onClick={() => handleSelectUser(searchUser)}
                        >
                            {searchUser.firstname} {searchUser.lastname}
                            {selectedUsers.some(u => u.id === searchUser.id) && (
                                <span className="text-green-600 ml-2">✓</span>
                            )}
                        </div>
                    ))}
                </div>

                {selectedUsers.length > 0 && (
                    <div className="selected-users">
                        <div className="text-sm text-gray-600 mb-2">
                            Utilisateurs sélectionnés ({selectedUsers.length}) - Cliquez pour retirer
                        </div>
                        {selectedUsers.map((u) => (
                            <span
                                key={u.id}
                                className="selected-user"
                                onClick={() => handleRemoveUser(u.id)}
                                title="Cliquer pour retirer"
                            >
                                {u.firstname} {u.lastname} ✖
                            </span>
                        ))}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || selectedUsers.length === 0}
                    className={loading ? 'loading' : ''}
                >
                    {loading ? '⏳ Création en cours...' : 'Créer la Chatroom'}
                </button>

                <button
                    type="button"
                    onClick={resetForm}
                    className="secondary-button ml-2"
                >
                    Réinitialiser
                </button>
            </form>
        </div>
    );
}

export default CreateChatroom;