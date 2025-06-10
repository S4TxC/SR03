import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const Authentication = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        const checkSession = async () => {
            try {
                console.log('Vérification de la session...');
                const response = await axios.get('http://localhost:8080/api/auth/me');
                console.log('Session valide:', response.data);
                setUser(response.data);
            } catch (error) {
                console.log('Pas de session active:', error.response?.status);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(
                'http://localhost:8080/api/auth/login',
                { email, password }
            );

            console.log('Login réussi:', response.data);
            setUser(response.data);
            return { success: true, data: response.data };
        } catch (error) {
            console.log('Erreur login:', error.response?.data);
            return { success: false, error: error.response?.data || 'Erreur de connexion' };
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:8080/api/auth/logout');
            console.log('Logout réussi');
        } catch (error) {
            console.log('Erreur logout:', error);
        } finally {
            setUser(null);
        }
    };

    return (
        <Authentication.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </Authentication.Provider>
    );
};

export const useAuth = () => useContext(Authentication);