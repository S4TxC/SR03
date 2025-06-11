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
                const response = await axios.get('http://localhost:8080/api/auth/me');
                setUser(response.data);
            } catch {
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
            setUser(response.data);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data || 'Login failed' };
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:8080/api/auth/logout');
        } catch {}
        setUser(null);
    };

    return (
        <Authentication.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </Authentication.Provider>
    );
};

export const useAuth = () => useContext(Authentication);
