import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requireAdmin = false }) => {
    const userJson = localStorage.getItem('user');
    const user = userJson != null ? JSON.parse(userJson) : null;

    if (user == null) {
        return <Navigate to="/login" />;
    }
    if (requireAdmin && !user.isAdmin) {
        return <Navigate to="/chat" />;
    }
    return children;
};

export default PrivateRoute;
