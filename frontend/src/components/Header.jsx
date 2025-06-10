import { useNavigate } from 'react-router-dom';
import { useAuth } from './Authentication';

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8080/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            logout();
            navigate('/login');
        } catch (err) {
            console.error('Erreur lors de la déconnexion', err);
        }
    };

    return (
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold">Homepage</h1>
            <div className="flex items-center gap-3">
                {user && user.avatarUrl ? (
                    <img
                        src={`http://localhost:8080/api/user/${user.id}/avatar`}
                        alt={`${user.firstname}'s profile`}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-blue-600 font-bold">
                        {user ? user.firstname.charAt(0) : 'G'}
                    </div>
                )}
                <span>Hi {user ? user.firstname : 'Guest'} !</span>
                <button
                    onClick={handleLogout}
                    className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-white font-semibold transition-colors duration-200"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
