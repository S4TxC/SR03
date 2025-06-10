import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Authentication';

const PrivateRoute = ({ children, requireAdmin = false }) => {
    const { user, isLoading } = useAuth();

    console.log('🛡️ PrivateRoute - User:', user, 'Loading:', isLoading, 'RequireAdmin:', requireAdmin);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-lg text-gray-600">Vérification de la session...</div>
            </div>
        );
    }

    if (!user) {
        console.log('Pas de session utilisateur, redirection vers /login');
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !user.isAdmin) {
        console.log('Droits admin requis, redirection vers /userMenu');
        return <Navigate to="/userMenu" replace />;
    }

    console.log('Accès autorisé pour:', user.email);
    return children;
};

export default PrivateRoute;