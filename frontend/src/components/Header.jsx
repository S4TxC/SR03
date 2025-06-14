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
        } catch {}
    };

    return (
        <>
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center border-b-4 border-black">
                <h1
                    onClick={() => navigate('/myChatrooms')}
                    className="text-xl font-bold text-white cursor-pointer hover:underline"
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                    Homepage
                </h1>
                <div className="flex items-center gap-3">
                    {user && user.avatarUrl ? (
                        <img
                            src={`http://localhost:8080/api/user/${user.id}/avatar`}
                            alt={`${user.firstname}'s profile`}
                            className="w-10 h-10 object-cover border-2 border-black"
                            style={{ borderRadius: '0', imageRendering: 'pixelated' }}
                        />
                    ) : (
                        <div
                            className="w-10 h-10 bg-gray-600 border-2 border-black flex items-center justify-center text-white font-bold"
                            style={{
                                borderRadius: '0',
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '0.8em'
                            }}
                        >
                            {user ? user.firstname.charAt(0).toUpperCase() : 'G'}
                        </div>
                    )}
                    <span
                        className="text-white"
                        style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.8em'
                        }}
                    >
                        Hi {user ? user.firstname : 'Guest'}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-black transition-colors duration-200"
                        style={{
                            borderRadius: '0',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.8em'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </header>
        </>
    );
};

export default Header;