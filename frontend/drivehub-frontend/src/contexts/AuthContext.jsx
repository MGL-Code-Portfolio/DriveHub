import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        try {
            const res = await api.get('/users/me/');
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(username, password) {
        const res = await api.post('/users/login/', { username, password });
        setUser(res.data);
        return res.data;
    }

    async function register(data) {
        const res = await api.post('/users/register/', data);
        return res.data;
    }

    async function logout() {
        await api.post('/users/logout/');
        setUser(null);
    }

    async function updateProfile(data) {
        const config = data instanceof FormData
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : {};

        const res = await api.put('/users/profile/', data, config);
        setUser(res.data);
        return res.data;
    }

    async function deleteAccount() {
        await api.delete('/users/delete/');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, deleteAccount, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
